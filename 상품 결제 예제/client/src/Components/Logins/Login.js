import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setloginStatus] = useState("");

  // 서버 주소
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  const LoginPageJs = () => {
    console.log("LoginPageJs 함수 호출됨"); // 함수가 호출되었을 때 콘솔에 메시지를 출력합니다.

    // 로그인 요청을 구현합니다.
    axios
      .post(`${Server_URL}/login`, { // 로그인 API 엔드포인트에 POST 요청을 보냅니다.
        email: email, // 사용자가 입력한 이메일
        password: password, // 사용자가 입력한 비밀번호
        usertype: "1", // 고정된 사용자 유형 (예를 들어, 일반 사용자)
      })
      .then((response) => { // 서버로부터 응답을 받으면 실행됩니다.
        console.log("서버 응답:", response); // 서버의 응답을 콘솔에 출력합니다.
        if (response.data.success) { // 응답이 성공적이라면 (로그인 성공)
          const { usertype, userid, username } = response.data.data[0]; // 응답 데이터에서 사용자 정보를 추출합니다.
          const userData = {
            userid: userid, // 사용자 ID
            username: username, // 사용자 이름
            usertype: usertype, // 사용자 유형
          };
          sessionStorage.setItem("loggedIn", true); // 세션 스토리지에 로그인 상태를 저장합니다.
          sessionStorage.setItem("userData", JSON.stringify(userData)); // 사용자 정보를 JSON 문자열로 저장합니다.
          sessionStorage.setItem("usertype", usertype); // 사용자 유형을 세션 스토리지에 저장합니다.
          
          // 사용자를 홈 페이지로 이동시킵니다.
          navigate("/");
          window.location.reload(); // 페이지를 리로드하여 변경된 상태를 반영합니다.
        } else {
          // 로그인 실패 시 처리
          console.log("로그인 실패:", response.data); // 실패 메시지를 콘솔에 출력합니다.
          setloginStatus("로그인 실패: " + response.data.message); // 상태 메시지를 업데이트하여 사용자에게 로그인 실패를 알립니다.
        }
      });
  };


  return (
    <div>
      <div>
        <h1>로 그 인</h1>
        <div>
          <form>
            <div>
              가입된 이메일과 비밀번호를 입력해주세요. <br />
              계정을 만드십시오.
            </div>
            <div>
              {/* 로그인 아이디 비밀번호 표시 */}
              <input
                type="text"
                placeholder=" 이메일"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <br />
              <input
                type="password"
                placeholder=" 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginStatus && (
                <div>{loginStatus}</div>
              )}
              <br />
            </div>

            <hr />
            <div>
              {/* 로그인 버튼 표시 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  LoginPageJs();
                }}
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/Register/personal")}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
