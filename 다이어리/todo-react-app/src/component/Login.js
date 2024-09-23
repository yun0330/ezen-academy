
import React from "react";
import { Link } from "react-router-dom";
import { signin } from "./service/ApiService";
import "./Login.css"; 

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = data.get("username");
    const password = data.get("password");
    // ApiService의 signin 메서드를 사용 해 로그인.
    signin({ username: username, password: password });
  };

  return (
    <div className="container">
      <div className="login-grid">
        <div className="login-item">
          <h1>로그인</h1>
        </div>
      </div>
      <form noValidate onSubmit={handleSubmit}>
        <div className="login-grid">
          <div className="login-item">
            <input
              className="login-input"
              type="text"
              id="username"
              name="username"
              placeholder="아이디"
              required
            />
          </div>
          <div className="login-item">
            <input
              className="login-input"
              type="password"
              id="password"
              name="password"
              placeholder="패스워드"
              required
            />
          </div>
          <div className="login-item">
            <button className="login-button" type="submit">
              로그인
            </button>
          </div>
          <div className="login-item">
            <Link to="/signup" className="login-link">
              계정이 없습니까? 여기서 가입 하세요.
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
