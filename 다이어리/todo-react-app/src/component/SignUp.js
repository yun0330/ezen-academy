
import React from "react";
import { signup } from "./service/ApiService";
import { Link } from "react-router-dom";
import "./SignUp.css"; 

function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const data = new FormData(event.target);
    const username = data.get("username");
    const password = data.get("password");
    signup({ username: username, password: password }).then(
      (response) => {
       
        window.location.href = "/login";
      }
    );

  };

  return (
    <div className="container">
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid">
          <div className="item">
            <h1>계정 생성</h1>
          </div>
          <div className="item">
            <input
              className="input"
              name="username"
              type="text"
              id="username"
              placeholder="아이디"
              required
              autoFocus
            />
          </div>
          <div className="item">
            <input
              className="input"
              name="password"
              type="password"
              id="password"
              placeholder="패스워드"
              required
            />
          </div>
          <div className="item">
            <button className="button" type="submit">
              계정 생성
            </button>
          </div>
          <div className="item">
            <Link to="/login" className="link">
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
