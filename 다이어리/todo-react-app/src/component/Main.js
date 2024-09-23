import "./Main.css";
import Todo from "./Todo"; 
import React, { useState, useEffect } from "react"; 
import AddTodo from "./AddTodo"; 
import { call, signout } from "./service/ApiService"; 

function Main() {
  // state 선언: items는 할 일 목록, loading은 로딩 상태
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트될 때 한 번만 실행되는 useEffect 훅
  useEffect(() => {
    // GET 요청을 통해 할 일 목록을 가져옴
    call("/todo", "GET", null).then((response) => {
      setItems(response.data); // 응답 데이터로 items 상태 업데이트
      setLoading(false); // 로딩 상태를 false로 설정
    });
  }, []);

  // 새로운 할 일을 추가하는 함수
  const addItem = (item) => {
    call("/todo", "POST", item).then((response) => setItems(response.data));
  };

  // 할 일을 수정하는 함수
  const editItem = (item) => {
    call("/todo", "PUT", item).then((response) => setItems(response.data));
  };

  // 할 일을 삭제하는 함수
  const deleteItem = (item) => {
    call("/todo", "DELETE", item).then((response) => setItems(response.data));
  };

  // 할 일 목록을 렌더링하는 JSX
  let todoItems = items.length > 0 && (
    <div className="todo-container">
      <ul className="todo-list">
        {items.map((item) => (
          <Todo
            item={item}
            key={item.id}
            editItem={editItem}
            deleteItem={deleteItem}
          />
        ))}
      </ul>
    </div>
  );

  // 네비게이션 바 JSX
  let navigationBar = (
    <div className="navbar">
      <div className="navbar-left">
        <h6>오늘의 할일</h6>
      </div>
      <div className="navbar-right">
        <button className="logout-button" onClick={signout}>
          로그아웃
        </button>
      </div>
    </div>
  );

  // 로딩이 끝났을 때의 컨텐츠 JSX
  let todoListPage = (
    <div>
      {navigationBar}
      <div className="container">
        <AddTodo addItem={addItem} />
        <div className="todo-list-container">{todoItems}</div>
      </div>
    </div>
  );

  // 로딩 중일 때의 컨텐츠 JSX
  let loadingPage = <h1>로딩중..</h1>;
  let content = loadingPage;

  // 로딩 상태에 따라 표시할 컨텐츠 결정
  if (!loading) {
    content = todoListPage;
  }

  // 최종 렌더링
  return <div className="Main">{content}</div>;
}

export default Main;
