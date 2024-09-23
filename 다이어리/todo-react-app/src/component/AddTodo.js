
import React, { useState } from "react";
import "./AddTodo.css"; 

const AddTodo = (props) => {
  const [item, setItem] = useState({ title: "" });
  const addItem = props.addItem;

  const onButtonClick = () => {
    addItem(item);
    setItem({ title: "" });
  };

  const onInputChange = (e) => {
    setItem({ title: e.target.value });
  };

  const enterKeyEventHandler = (e) => {
    if (e.key === 'Enter') {
      onButtonClick();
    }
  };

  return (
    <div className="grid-container">
      <div className="grid-item input-container">
        <input
          type="text"
          placeholder="할일을 적으세요"
          className="text-field"
          onChange={onInputChange}
          onKeyPress={enterKeyEventHandler}
          value={item.title}
        />
      </div>
      <div className="grid-item button-container">
        <button
          className="add-button"
          onClick={onButtonClick}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default AddTodo;
