(function () {
  // document= 문서 전체에서
  // querySelector = 특정 html 태그를 선택해 주세요

  // "main h2 span"구조로 내려와서 span태그를 문서에서 선택해 주세요~
  const spanEl = document.querySelector("main h2 span");

  // 화면에 표시할 4문장 데이터 (홈페이지에 번갈아 나오는 모든 문장 데이터)
  const txtArr = [
    "web publisher",
    "front-end devloper",
    "UX designer",
    "back-end developer",
  ];

  // 4문장 중에 뭐 선택할지 고르는 인덱스 입니다
  // 초기값으로 맨 첫문장을 선택하게 설정했습니다
  // 변수선언문 중에 let 선택 이유는 변수의 재선언은 안되지만 값을 바꾸는
  // 재할당을 가능하게 하려 합니다
  let index = 0;
  // txtArr안에 들은 4문장 중에 index로 하나 선택해서 하나씩 글자 쪼개기
  let currentTxt = txtArr[index].split("");

  // 글자 하나씩 쪼갠거를 하나씩 화면에 출력하면 됨

  function writeTxt() {
    // spanEl에 지정한 html출력 위치에
    // currentTxt에 저장된 문장을 한글자씩 맨앞부터 보여주고 삭제합니다
    spanEl.textContent += currentTxt.shift();
    // 아직 보여줄 글자가 남아서 currentTxt안의 글자 개수가 0이 아니라면
    // 계속 자기자신 즉, writeTxt를 실행 시켜서 계속 글자 보여주고 삭제합니다
    if (currentTxt.length !== 0) {
      // Math.floor(Math.random()*100)는 글자 표시 속도를 무작위로 선택
      setTimeout(writeTxt, Math.floor(Math.random() * 100));
    }
    // 화면에 보여주려고 준비되었던 문장데이터가 화면 표시 후 전부 지워지면
    // spanEl 위치를 통해 화면에 표시된 문장을 currentTxt에 도로 집어넣음
    // 아직 deleteTxt함수를 만들진 않았지만 인제 화면에 표시된 글자 다 지웁니다
    else {
      currentTxt = spanEl.textContent.split("");
      setTimeout(deleteTxt, 3000);
    }
  }

  function deleteTxt() {
    // pop 명령어 통해서 currentTxt에 저장된 화면에 있는 글씨들을 하나씩 날립니다
    currentTxt.pop();
    // 글자 하나 날릴 때마다 남은 글자들을 join 명령어로 합쳐 줍니다
    spanEl.textContent = currentTxt.join("");
    // currentTxt 변수안에 글자가 아직 남아 있다면 계속 자기자신을 실행시켜서
    // 한글자씩 날리고 글자합쳐서 보여줍니다
    if (currentTxt.length !== 0) {
      setTimeout(deleteTxt, Math.floor(Math.random() * 100));
    } else {
      // 글자 다 날리고 나면 index 값 1 증가 시켜서 다음 문장을
      // 표시할 수 있게 준비함
      // 단, %를 통해 나머지 쓴 이유는 무한반복할라고
      index = (index + 1) % txtArr.length;
      // index 하나 늘리고 나서 다음 문장 한글자씩 전부 쪼개놓기
      currentTxt = txtArr[index].split("");
      console.log(currentTxt);
      // 그다음에 화면에 한글자 표시하고 데이터에 한글자 지우는 함수 실행
      writeTxt();
    }
  }
  writeTxt();
})();

//화면 스크롤이 되면 네비게이션 바를 검게 칠하는 css를 적용되게 하는 코드

// // html문서에서 헤더 태그를 선택해서 headerEl에 저장합니다
// const headerEl = document.querySelector("header");
// // 화면에서 스크롤이 발생되면 아래의 함수를 실행합니다
// window.addEventListener('scroll', function(){
//     // 스크롤이 발생되면 함수안의 코드를 통해 태그에 class를 추가할 준비합니다
//     // y좌표기준 즉, 세로로 1픽셀이라도 스크롤 화면이 움직였는지 조사해서 움직인
//     // 값을 browserScrollY 변수에 저장합니다
// const browserScrollY = window.pageYOffset;
// // 세로로 스크롤이 1픽셀이라도 움직여 지면 class="active" 추가되어서
// // 아까 만든 css (네비게이션 바 검게 칠하는 효과) 가 적용되게 합니다
// if (browserScrollY) {
//     headerEl.classList.add("active");
// }
// });

//화면 스크롤이 되면 네비게이션 바를 검게 칠하는 css + 맨 위로 돌아오면 원복시킴

// html문서에서 헤더 태그를 선택해서 headerEl에 저장합니다
const headerEl = document.querySelector("header");
// 화면에서 스크롤이 발생되면 아래의 함수를 실행합니다
window.addEventListener("scroll", function () {
  // 화면 스크롤이 얼마나 움직였는지 확인 (scrollCheck 함수 정의해서 사용)
  this.requestAnimationFrame(scrollCheck);
});

function scrollCheck() {
  // 스크롤 움직였니? 움직였으면 움직인 값 기록하고 아니면 offset 상태두자
  let browserScrollY = window.scrollY ? window.scrollY : window.pageYOffset;
  // 스크롤이 1픽셀이라도 움직였으면 class="active" 적용시켜서 css 먹도록
  if (browserScrollY > 0) {
    headerEl.classList.add("active");
  }
  //스크롤 상태를 계속 확인해서 스크롤이 움직인 상태가 아니면 (맨 위로 돌아오면)
  // class="active" 도로 빼서 css 안먹도록
  else {
    headerEl.classList.remove("active");
  }
}

// 부드러운 이동 애니메이션 효과 구현하기
// 인풋값이 들어가는 함수 정의
const animationMove = function (selector) {
  // selector 변수에 속하는 태그 선택해서 targetEl에 저장
  const targetEl = document.querySelector(selector);
  //  웹사이트 스크롤값 정보
  const browserScrollY = window.pageYOffset;
  // 선택된 태그로 이동할 세로위치 값 targetScrollY에 저장
  const targetScrollY = targetEl.getBoundingClientRect().top + browserScrollY;
  // targetScrollY에 저장된 값을 객체데이터인 {}에서 불러내서
  // window.scrollTo 명령어를 통해 원하는 위치로 이동
  window.scrollTo({ top: targetScrollY, behavior: "smooth" });
};

// 이동 시 애니메이션 효과를 data-animation-scroll='true' 구문이 들은 모든 태그선택
const scrollMoveEl = document.querySelectorAll(
  "[data-animation-scroll='true']"
);
for (let i = 0; i < scrollMoveEl.length; i++) {
  // 애니메이션 효과를 줄 모든 요소를 확인해서 (아까 5개 태그)
  // 마우스 클릭 효과가 발생하면 해당 태그에 해당하는 친구로 좌표이동하는 함수실행
  scrollMoveEl[i].addEventListener("click", function (e) {
    const target = this.dataset.target;
    animationMove(target);
  });
}
