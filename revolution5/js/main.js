
const container = document.getElementById('container');
const opacitySlider = document.getElementById('opacitySlider');
const colorSlider = document.getElementById('colorSlider');

// 전역 변수로 circles 선언
let circles;

let rotationSpeeds = [];

// 원 생성 코드 이후에 실행될 함수
function initializeSliders() {
  circles = document.querySelectorAll('.circle');
  
  opacitySlider.addEventListener('input', (event) => {
    const opacityValue = event.target.value;
    circles.forEach(circle => {
      circle.style.opacity = opacityValue;
    });
  });

  colorSlider.addEventListener('input', (event) => {
    const value = event.target.value;
    const color1 = '#1a3b80';
    const color2 = '#a7c7e7';
    const interpolatedColor = interpolateColor(color1, color2, value / 100);

    circles.forEach(circle => {
      circle.style.background = interpolatedColor;
    });
  });
}


// ...원 생성 코드...

const a = 150; // 타원의 가로 반지름
const b = 75; // 타원의 세로 반지름
const numEllipses = 8; // 타원의 개수 (2열로 배치)
const numCircles = 1; // 각 타원에 하나의 원이 있음

let angle = 0; // 각도 시작 값

// 타원 8개 생성 및 배치
for (let i = 0; i < numEllipses; i++) {
    const ellipse = document.createElement('div');
    ellipse.classList.add('ellipse');
    
    // 타원의 위치를 2열로 배치
    const col = Math.floor(i / 4); // 각 열
    const row = i % 4; // 각 행
    ellipse.style.left = `${col * 400 + 50}px`;  // 열 간격
    ellipse.style.top = `${row * 200 + 50}px`;  // 행 간격
    
    
    container.appendChild(ellipse);

    // 각 원에 대한 고유한 회전 속도 설정
    rotationSpeeds[i] = 0.05 + (Math.random() * 0.25); // 0.05에서 0.15 사이의 랜덤 값
    let angle = 0; // 각 원마다 개별적인 각도

    // 타원 위에 회전하는 원 추가
    const circle = document.createElement('div');
    circle.classList.add('circle');
    ellipse.appendChild(circle);

    let lastTrailTime = 0; // 마지막으로 잔상을 생성한 시간

    // 원이 타원 궤도를 따라 회전하는 애니메이션
    function updatePosition(timestamp) {
        if (!lastTrailTime) lastTrailTime = timestamp;

        const offsetAngle = angle + (i * 30); // 각 타원이 회전하는 타이밍을 다르게
        const radians = offsetAngle * (Math.PI / 180); // 각도를 라디안으로 변환

        // 타원 궤도에 맞춰 X, Y 계산
        const x = a * Math.cos(radians) + ellipse.offsetWidth / 2 - circle.offsetWidth / 2;
        const y = b * Math.sin(radians) + ellipse.offsetHeight / 2 - circle.offsetHeight / 2;

        // 원의 위치를 계산된 X, Y 좌표로 이동
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;


        // 잔상
        if (timestamp - lastTrailTime > 1000) {
          const trail = circle.cloneNode(true);
          trail.style.opacity = '0.5';
          trail.style.transition = 'opacity 9s';
          trail.style.left = `${x}px`;
          trail.style.top = `${y}px`;
          ellipse.appendChild(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => {
              ellipse.removeChild(trail);
            }, 9000);
        }, 0);

        lastTrailTime = timestamp;
      }

        angle += rotationSpeeds[i]; // 각도를 조금씩 증가시켜 원들이 계속 회전하게 함
        if (angle >= 360) angle = 0; // 360도를 넘으면 다시 0으로 리셋

        requestAnimationFrame(updatePosition);
    }

    requestAnimationFrame(updatePosition); 
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function interpolateColor(color1, color2, factor) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const result = rgb1.map((c1, i) => Math.round(c1 + factor * (rgb2[i] - c1)));
  return rgbToHex(...result);
}

initializeSliders();

document.addEventListener('click', function() {
  for (let i = 0; i < numEllipses; i++) {
      rotationSpeeds[i] = 0.05 + (Math.random() * 0.25);
  }
});

