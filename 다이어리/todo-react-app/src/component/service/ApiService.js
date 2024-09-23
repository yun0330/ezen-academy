

import { API_BASE_URL } from "../api-config";

// 공통 API 호출 함수
export function call(api, method, request) {
  
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
 
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }
  
  // 요청 옵션 설정

  let options = {
    headers: headers, 
    url: API_BASE_URL + api, 
    method: method, 
  };
  
  
  if (request) {
    options.body = JSON.stringify(request);
  }

  // API 호출
  return fetch(options.url, options)
    .then((response) => {

      if (response.status === 200) {
        return response.json();
      } else if (response.status === 403) {

        window.location.href = "/login";
      } else {

        throw new Error(response);
      }
    })
    .catch((error) => {
      // 오류가 발생하면 콘솔에 로그 출력
      console.log("http error");
      console.log(error);
    });
}

// 로그인 함수
export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO)
    .then((response) => {

      if (response.token) {
        localStorage.setItem("ACCESS_TOKEN", response.token);

        window.location.href = "/";
      }
    });
}

// 로그아웃 함수
export function signout() {

  localStorage.setItem("ACCESS_TOKEN", null);

  window.location.href = "/login";
}

// 회원가입 함수
export function signup(userDTO) {

  return call("/auth/signup", "POST", userDTO);
}
