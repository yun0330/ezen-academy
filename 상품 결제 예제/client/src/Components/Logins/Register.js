import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState(""); //이름
  const [email, setEmail] = useState(""); //이메일
  const [password, setPassword] = useState(""); //비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); //비밀번호확인
  const [address, setAddress] = useState(""); //주소
  const [detailedaddress, setdetailedaddress] = useState(""); //상세주소
  const [phonenumber, setphonenumber] = useState(""); //핸드폰번호
  const [emailDuplication, setEmailDuplication] = useState(true); //이메일 유효성

  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  const handleEmailDuplicationCheck = () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }

    axios
      .post(`${Server_URL}/checkEmailDuplication`, { email })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setEmailDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("이메일 중복 확인 중 오류:", error);
        alert("이메일 중복 확인 중 오류가 발생했습니다.");
      });
  };

  const handleRegisterClick = () => {
    if (!username || !email || !password || !confirmPassword || !address) {
      alert("필수 입력 사항들을 모두 입력해주세요!");

      return;
    }
    if (!emailDuplication) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }
    if (!emailDuplication) {
      alert("이미 등록된 이메일입니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 클라이언트에서 서버로 회원가입 요청
    axios
      .post(`${Server_URL}/register`, {
        username,
        password,
        email,
        address,
        detailedaddress,
        phonenumber,
        usertype: "personal",
      })
      .then((response) => {
        console.log("서버 응답:", response.data);
        alert("회원가입이 완료되었습니다.");

        window.location.href = "/"; // 홈 페이지 또는 다른 페이지로 리디렉션
      })
      .catch((error) => {
        if (error.response) {
          // 서버가 응답한 상태 코드가 2xx가 아닌 경우
          console.error(
            "서버 응답 오류:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("서버 응답이 없음:", error.request);
        } else {
          console.error("요청 설정 중 오류:", error.message);
        }
        alert("서버와의 통신 중 오류가 발생했습니다.");
      });
  };

  return (
    <div>
      <div>
        <h1>회 원 가 입</h1>
        <div>
          <span>* 필수 입력 사항</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="사용자명 10글자 미만*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <div>
            <input
              type="password"
              placeholder="비밀번호*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="비밀번호 확인*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="이메일*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleEmailDuplicationCheck}>
              확인
            </button>
          </div>

          <input
            type="text"
            placeholder="핸드폰번호*"
            value={phonenumber}
            onChange={(e) => setphonenumber(e.target.value)}
          />

          <br />
          <div>
            <input
              type="text"
              placeholder="주소*"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="상세주소*"
            value={detailedaddress}
            onChange={(e) => setdetailedaddress(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleRegisterClick}>
            가입완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
