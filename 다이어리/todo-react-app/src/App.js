
import React from "react";
import "./App.css"; 
import Main from "./component/Main";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Copyright() {
  return (
    <div className="copyright">
      <p className="copyright-text">
        이런 푸터내용도 별도의 컴포넌트로 빼는게 좋긴합니다만, <br></br>
        기능적으로는 이상없이 동작합니다. {new Date().getFullYear()}
      </p>
    </div>
  );
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      <div className="footer">
        <Copyright />
      </div>
    </div>
  );
}

export default App;

