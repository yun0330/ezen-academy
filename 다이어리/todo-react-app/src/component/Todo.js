
import React, { useState } from "react";
import "./Todo.css"; 

const Todo = (props) => {
  const [item, setItem] = useState(props.item);
  const [readOnly, setReadOnly] = useState(true);
  const deleteItem = props.deleteItem;
  const editItem = props.editItem;

  const editEventHandler = (e) => {
    setItem({ ...item, title: e.target.value });
  };

  const checkboxEventHandler = (e) => {
    item.done = e.target.checked;
    editItem(item);
  };

  const deleteEventHandler = () => {
    deleteItem(item);
  };

  const turnOffReadOnly = () => {
    setReadOnly(false);
  };

  const turnOnReadOnly = (e) => {
    if (e.key === "Enter" && readOnly === false) {
      setReadOnly(true);
      editItem(item);
    }
  };

  return (
    <div className="list-item">
      <input
        type="checkbox"
        checked={item.done}
        onChange={checkboxEventHandler}
      />
      <input
        className="input-base"
        aria-label="naked"
        readOnly={readOnly}
        onClick={turnOffReadOnly}
        onKeyDown={turnOnReadOnly}
        onChange={editEventHandler}
        type="text"
        id={item.id}
        name={item.id}
        value={item.title}
      />
      <button
        className="delete-button"
        aria-label="Delete Todo"
        onClick={deleteEventHandler}
      >
        &#x1F5D1;
      </button>
    </div>
  );
};

export default Todo;
