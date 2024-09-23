import "./App.css"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 라우팅을 위한 react-router-dom import
import { useEffect, useState } from "react"; 

import Main from "./Components/Main"; 
import Header from "./Components/Header"; 
import Footer from "./Components/Footer"; 

import LoginPage from "./Components/Logins/Login";
import Register from "./Components/Logins/Register";
import CompleteOrder from "./Components/Shop/CompleteOrder"; 
import MyOrderList from "./Components/Shop/MyOrderList"; 

// 장바구니와 오더시트 컴포넌트 import
import Cart from "./view/Cart"; // 장바구니 컴포넌트
import Ordersheet from "./view/Ordersheet"; // 오더시트 컴포넌트

// 리스트, 상품게시판 컴포넌트 import
import Latestlist from "./view/Latestlist";
import Product from "./view/Product";

function App() {
  const [cartlength, setCartlength] = useState(0); // 장바구니에 담은 아이템 수를 관리하는 state

  // 페이지 로드 시 로컬 스토리지에서 장바구니 아이템 수를 가져옴
  useEffect(() => {
    if (localStorage.baskets !== undefined) { // 로컬 스토리지에 "baskets" 키가 존재하는지 확인
      const baskets = JSON.parse(localStorage.getItem("baskets")); // 로컬 스토리지에서 "baskets" 데이터를 파싱하여 배열로 저장
      setCartlength(baskets.length); // 장바구니 아이템 수를 상태에 저장
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header cartlength={cartlength} /> {/* Header 컴포넌트에 장바구니 아이템 개수 전달 */}
        <div className="App_main_height">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/completeOrder" element={<CompleteOrder />} /> 
            <Route path="/myOrderList" element={<MyOrderList />} /> 
            <Route path="/Login" element={<LoginPage />}></Route> 
            <Route path="/Register/personal" element={<Register />}/>    
            <Route path="/cart" element={<Cart setCartlength={setCartlength} />} />
            <Route path="/ordersheet" element={<Ordersheet setCartlength={setCartlength} />} />        
            <Route path="/shop/:categoryid/1/:page" element={<Latestlist />} />     
            <Route path="/product/:id" element={<Product setCartlength={setCartlength} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

// Router: 애플리케이션의 최상위 컴포넌트로, URL 변경에 따라 라우팅을 관리합니다.
// Routes: 여러 Route 컴포넌트를 그룹화하여, URL 경로에 맞는 컴포넌트를 렌더링합니다.
// Route: 특정 경로와 그 경로에 매핑되는 컴포넌트를 정의하여, URL 경로에 따라 적절한 컴포넌트를 렌더링합니다.



