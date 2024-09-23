import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Header 컴포넌트 정의. 이 컴포넌트는 prop으로 cartlength를 받습니다.
function Header({ cartlength }) {
  const [loggedIn, setLoggedIn] = useState(false); // 로그인 상태를 관리하는 state
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const Server_URL = process.env.REACT_APP_Server_Side_Address; // 환경변수에서 서버 URL을 가져옴

  // 페이지가 로드될 때 로그인 상태를 확인하고 상태를 업데이트
  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem("loggedIn");
    if (storedLoggedIn) {
      setLoggedIn(true); // 로그인 상태라면 loggedIn을 true로 설정
    }
  }, [setLoggedIn]);

  // 로그아웃 시 세션 스토리지에서 로그인 상태 제거
  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("usertype"); // usertype 항목 제거
    sessionStorage.removeItem("userData"); // userData 항목 제거
    setLoggedIn(false); // 로그인 상태를 false로 설정
    navigate("/"); //로그아웃 후 메인 페이지로 이동
    window.location.reload(); // 페이지를 새로 고침
  };

  return (
    <div>
      <div>
        <div>
          <Link to="/">
            <img src={`${Server_URL}/logo.jpg`} />
          </Link>
        </div>
        {loggedIn ? ( 
          <ul>
            <li onClick={handleLogout}>
              로그아웃
            </li>
            <li>
              {/* 장바구니 링크 */}
              <Link to="/cart">
                장바구니{" "}
                {cartlength > 0 ? ( 
                  <b>{cartlength}</b>
                ) : (
                  <b></b>
                )}
              </Link>
            </li>
            <li>
              <Link to="/myOrderList">주문내역</Link>
            </li>
          </ul>
        ) : (
          // 로그아웃 상태일 때 로그인과 회원가입 버튼 표시
          <ul>
            <li>
              <Link to="/Login">로그인</Link>
            </li>
            <li>
              <Link to="/Register/personal">회원가입</Link>
            </li>
            <li>

              <Link to="/Login">
                장바구니{" "}
                {cartlength > 0 ? ( 
                  <b>{cartlength}</b>
                ) : (
                  <b></b>
                )}
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Header;
