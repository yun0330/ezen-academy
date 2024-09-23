(function() {
//span 태그 가져오기
const spanEl = document.querySelector("main h2 span");
// 화면에 표시할 문장 데이터 셋업
const txtArr = [
  "web publisher",
  "front-end developer",
  "ux designer",
  "back-end developer",
];
// 배열의 인덱스 초기값
// 변수선언문 중에 let 선택 이유는 변수의 재선언은 안되지만 값을 바꾸는
// 재할당을 가능하게 하려 합니다
let index = 0;
// txtArr안에 들은 4문장 중에 index로 하나 선택해서 하나씩 글자 쪼개기
let currentTxt = txtArr[index].split("");

// 글자 하나씩 쪼갠거를 하나씩 화면에 출력하면 됨

function writeTxt() {
    // spanEl 지정한 html출력 위치에 currentTxt에 저장된 문장을 한글자씩 보여주고 삭제
    spanEl.textContent += currentTxt.shift();
    // 아직 보여줄 글자가 남아서 currentTxt안의 글자 개수가 0이 아니라면
    // 계속 자기자신 즉, writeTxt를 실행 시켜서 계속 글자 보여주고 삭제합니다
    if(currentTxt.length !== 0) {
        // Math.floor(Math.random()*100)는 글자 표시 속도를 무작위로 선택
        setTimeout(writeTxt,Math.floor(Math.random()*100));
    }
    // 화면에 보여주려고 준비되었던 문장데이터가 화면 표시 후 전부 지워지면
    // spanEl 위치를 통해 화면에 표시된 문장을 currentTxt에 도로 집어넣음
    // 아직 deleteTxt함수를 만들진 않았지만 인제 화면에 표시된 글자 다 지웁니다
    else {
        currentTxt = spanEl.textContent.split("");
        setTimeout(deleteTxt,3000);
    }
}

writeTxt();

function deleteTex() {
    // pop 명령어를 통해서 currentTxt에 저장된 화면에 있는 글씨들을 하나씩 날림
    currentTxt.pop()
    // 글자 하나 날릴 때마다 남은 글자들을 join 명령어로 합쳐 줍니다
    spanEl.textContent = currentTxt.join("");
    // currentTxt 변수안에 글자가 아직 남아 있다면 계속 자기자신을 실행시켜서 
    // 한글자씩 날리고 글자합쳐서 보여줍니다
    if(currentTxt !== 0) {
        setTimeout(deleteTex, Math.floor(Math.random()*100));
    }
    else{
        // 글자 다 날리고 나면 index 값 1 증가 시켜서 다음 문장을
        // 표시할 수 있게 준비함
        // 단, %를 통해 나머지쓴 이유는 무한반복할라고
        index = (index +1) % txtArr.length;
        // index 하나 늘리고 나서 다음 문장 한글자씩 전부 쪼개놓기
        currentTxt = txtArr[index].split("");
        // 그다음에 화면에 한글자 표시하고 데이터에 한글자 지우는 함수 실행
        writeTxt();
    }
}
writeTxt();
})();