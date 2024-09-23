import React from "react"; // React 라이브러리 임포트
import "./Main.css"; // CSS 모듈 임포트
import { Link } from "react-router-dom"; // React Router 훅 및 컴포넌트 임포트

function Main() {
  return (
    <div>
      <ul>
        <li>
          <Link to={`/shop/1/1/1`}>
            <h1>상품목록 입니다. 클릭해 주세요</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Main;
