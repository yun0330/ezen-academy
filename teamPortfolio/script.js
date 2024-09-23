// 배경 별 생성
let starColor = ["white", "yellow"]; // 별 색상 배열 저장
let duration = ["1.5s", "2s", "2.5s", "3s"]; // 별 깜빡임 속도 배열 저장
for (let i = 0; i < 30; i++) {
  let span = document.createElement("span"); // 별 전체 효과를 담을 span 태그 생성
  span.classList.add("starEffect"); // 생성한 span태그에 starEffect클래스 추가
  span.innerHTML = '<i class="fa-solid fa-star"></i>'; //span태그에 폰트어썸 별아이콘 태그 추가
  let starIcon = span.querySelector("i"); // 별아이콘 stdarIcon변수 할당
  let starX = Math.floor(Math.random() * window.innerWidth); // 별아이콘의 가로위치 화면너비의 랜덤으로 할당
  let starY = Math.floor(Math.random() * window.innerHeight); // 별아이콘의 세로위치 화면너비의 랜덤으로 할당
  span.style.left = starX + "px"; // 랜덤으로 생성한 x좌표 span태그에 입력
  span.style.top = starY + "px"; // 랜덤으로 생성한 y좌표 span태그에 입력
  span.style.color = starColor[Math.floor(Math.random() * 2)]; // 별 색상배열에서 랜덤으로 별 색상 지정
  let starSize = Math.floor(Math.random() * 10) + 3; // 별 크기 3~10 랜덤 지정
  starIcon.style.fontSize = starSize + "px"; // 랜덤으로 지정한 별 크기 적용
  let starSpeed = duration[Math.floor(Math.random() * 3) + 1]; // 별아이콘 애니메이션 속도 starSpeed 변수에 할당
  starIcon.style.animationDuration = starSpeed; //별아이콘 깜빡임 속도
  span.style.animationDuration = starSpeed; //별아이콘 뒤 블러 애니메이션 속도
  document.querySelector(".stage").appendChild(span); // 생성한 태그를 div태그안에 생성
}
//스크롤하면 따라서 별이 움직이는 기능
window.addEventListener('scroll',function(e){ //스크롤 감지
  e.preventDefault();
    let starSpan = document.querySelectorAll(".starEffect"); //화면의 별span태그 starSpan 저장
    let lastPage = starSpan.length;
    let scrollDistance = window.scrollY; // 현재 스크롤한 값
    starSpan.forEach(function(item){
        item.style.transform = 'translateY(' + scrollDistance * 1.01 + 'px)'; // 반복문으로 각 별span태그에 translateY값을 설정 별이 빠르게 움직일려면 1보다 큰 값을 곱하면 됨
    });
    //팀소개
    let secondSectionContent = document.querySelector(`.intro .intro-flex`);
    let secondSection = document.querySelector(`.intro`).offsetTop;
    //console.log(secondSection);
    if (window.scrollY >= secondSection - 800) {
      secondSectionContent.classList.add(`active`);
    } else {
      secondSectionContent.classList.remove(`active`);
    }
    //개인소개
    let firstSectionContent = document.querySelector(
      `.pv-section-1 .fade-wrap`
    );
    let firstSection = document.querySelector(`.pv-section-1`).offsetTop;
    //console.log(firstSection);
    if (window.scrollY >= firstSection - 300) {
      firstSectionContent.classList.add(`active`);
    } else {
      firstSectionContent.classList.remove(`active`);
    }
});

/* 애니메이션 스크롤 이동 */
const animationMove = function(selector){
  // ① selector 매개변로 이동할 대상 요소 노드 가져오기
  const targetEl = document.querySelector(selector);
  // ② 현재 브라우저의 스크롤 정보(y 값)
  const browserScrollY = window.pageYOffset;
  // ③ 이동할 대상의 위치(y 값)
  const targetScorllY = targetEl.getBoundingClientRect().top + browserScrollY;
  // ④ 스크롤 이동
  window.scrollTo({ top: targetScorllY, behavior: 'smooth' });
};
// 스크롤 이벤트 연결하기
const scollMoveEl = document.querySelectorAll("[data-animation-scroll='true']");
for(let i = 0; i < scollMoveEl.length; i++){
  scollMoveEl[i].addEventListener('click', function(e){
    const target = this.dataset.target;
    animationMove(target);
  });
}



let pageNumber = 0; //섹션 페이지 번호 초기값 설정
let lastPage = document.querySelectorAll("section").length;
let starSpan = document.querySelectorAll(".starEffect");
let scrollDistance = window.scrollY;
$(window).on("wheel", function(e){ //휠이벤트 감지
  // 스크롤하면 별에 꼬리 css 작성
  if(e.originalEvent.deltaY < 0){
    $(".starEffect").removeClass("tail") //wheel up
  }else if(e.originalEvent.deltaY > 0){
    $(".starEffect").addClass("tail") //wheel down
  }
  let scrollTimer = setTimeout(() => { //스크롤 멈추면 별 꼬리 없앰
    $(".starEffect").removeClass("tail");
  }, 200);

// 스크롤을 내리면 한 섹션씩 내려가는 이벤트(제이쿼리 작성)
  if ($('html').is(":animated")) return; // 스크롤 중에는 html화면 함수 작동을 멈춤
  //휠이벤트의 deltaY속성을 확인하여 스크롤을 위로 했는지 아래로 했는지 체크(음수=위로 양수=아래로)
  if (e.originalEvent.deltaY > 0 && pageNumber < lastPage - 1){ // 아래로 스크롤한 경우
    if (pageNumber >= lastPage-1) return; // 마지막페이지인 경우 'pageNumber++'를 멈춤
    pageNumber++;
  } else if (e.originalEvent.deltaY < 0 && pageNumber > 0){ // 위로 스크롤한 경우
    if (pageNumber <= 0) return; // 0 이하일 경우 'pageNumber--'를 멈춤
    pageNumber--;
  }
  $('html').stop().animate({
    scrollTop: window.innerHeight * pageNumber // 해당 섹션의 Top 위치로 이동
  });
})

// Team Project Website가 내려오면서 중앙에서 고정 -> 중앙에서 typing이 반복적으로 나타남.
// const homeText = document.querySelector(".text");

// /* const content = "I'M  \u00A0 Web  \u00A0 Front-End"; */
// const content = "Team  \u00A0 Project  \u00A0 WebSite";
// let count = 0;

// function typing() {
//   homeText.innerText += content[count++];
//   if (count > content.length) {
//     homeText.innerText = "";
//     count = 0;
//   }
// }
// setInterval(typing, 200);

// Team Project Website가  중앙에 고정 방식
const homeText = document.querySelector(".text");

/* const content = "I'M  \u00A0 Web  \u00A0 Front-End"; */
const content = "Team  \u00A0 Project  \u00A0 WebSite";

let count = 0;
function typing() {
  homeText.innerText += content[count++];
  if (count >= content.length) {
    clearInterval(typingInterval);
  }
}



// 슬라이드
var slideIndex = 1;
//showSlides(slideIndex);

// 다음, 이전 제어
function plusSlides(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}

// 자동 슬라이스
let currentSlide = 0;
const slides = document.querySelectorAll(".mySlides");
const slideCount = slides.length;
 
function showSlide(n) {
    slides.forEach(slide => slide.style.display = 'none');
    slides[n].style.display = 'block';
}
 
function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
}
 
function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000); // n초마다 자동 슬라이드
});

const typingInterval = setInterval(typing, 200);
