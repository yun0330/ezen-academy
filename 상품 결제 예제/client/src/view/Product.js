import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import aixos from "axios";
import styles from "./Product.module.css";

const Product = ({ setCartlength }) => {
  const { id } = useParams();

  const [clickedImage, setClickedImage] = useState("");

  const [products, setProducts] = useState([
    {
      id: "",
      name: "",
      description: "",
      price: "",
      thumbnail: "",
    },
  ]);
  const navigate = useNavigate();
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  useEffect(() => {
    async function resData() {
      const responses = await aixos.get(`${Server_URL}/shop`, {});
      const inputData = await responses.data.filter((it) => it.prodid == id);
      const product = await inputData.map((it) => ({
        id: it.prodid,
        name: it.title,
        description: it.description,
        price: it.price,
        thumbnail: it.thumbnail,
      }));
      setProducts(product);
      const [{ thumbnail }] = product;

      setClickedImage(thumbnail);
    }
    resData();
  }, [id]);

  useEffect(() => {
    if (products.length > 0) {
      setTotal(parseInt(products[0].price));
    } else {
      setTotal(0);
    }
  }, [products]);

  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  const handleClickCounter = (num) => {
    setQuantity(quantity + num);
    setTotal(total + parseInt(products[0].price) * num);
  };

  const handleChangeInput = (e) => {
    let newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 1) {
      setQuantity(newValue);
      setTotal(parseInt(products[0].price) * newValue);
    }
  };

  const onClickBasket = (products) => {
    if (localStorage.baskets === undefined) {
      localStorage.setItem("baskets", JSON.stringify([]));
    }

    const baskets = JSON.parse(localStorage.getItem("baskets"));

    let isExist = false;
    baskets.forEach((item) => {
      if (products[0].id === item.id) {
        isExist = true;
      }
    });
    if (isExist) {
      alert("이미 장바구니에 담으셨습니다.");
      return;
    }

    const data = { ...products[0], quantity: quantity, isCheck: false };
    baskets.push(data);
    setCartlength(baskets.length); //  장바구니 수량 업데이트
    localStorage.setItem("baskets", JSON.stringify(baskets));
  };

  const handlePurchase = () => {
    const loginData = JSON.parse(sessionStorage.getItem("loggedIn"));

    if (!loginData) {
      navigate("/Login");
    } else {
      navigate("/ordersheet", {
        state: {
          ...products[0],
          quantity: quantity,
          orderType: "single_order",
        },
      });
      if (localStorage.baskets === undefined) {
        localStorage.setItem("baskets", JSON.stringify([]));
      }

      const baskets = JSON.parse(localStorage.getItem("baskets"));

      let isExist = false;
      baskets.forEach((item) => {
        if (products[0].id === item.id) {
          isExist = true;
        }
      });
      if (isExist) {
        return;
      }

      const data = { ...products[0], quantity: quantity, isCheck: false };
      baskets.push(data);
      localStorage.setItem("baskets", JSON.stringify(baskets));
    }
  };

  return (
    <div className={styles.container}>
      {products &&
        products.map((it) => (
          <div key={it.id}>
            <div className={styles.productinfo}>
              <div className={styles.imagecontainer}>
                <div className={styles.bigimage}>
                  <img
                    src={clickedImage}
                    className={styles.bigimagedetail}
                    alt="이미지"
                  />
                </div>
              </div>
              <div key={it.id} className={styles.productcontainer}>
                <p className={styles.productname}>{it.name}</p>
                <div className={styles.proddetail}></div>
                <div className={styles.counter}>
                  <button
                    type="button"
                    onClick={() => handleClickCounter(-1)}
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    className={styles.inputnumber}
                    onBlur={handleChangeInput}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                  <button type="button" onClick={() => handleClickCounter(+1)}>
                    +
                  </button>
                </div>
                <div className={styles.price}>
                  <div>총 상품금액 :</div>
                  <div >
                    <strong>{total.toLocaleString()} 원</strong>
                  </div>
                </div>
                <div >
                  <div>
                    <button
                      onClick={() => onClickBasket(products)}
                    >
                      장바구니 추가
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handlePurchase(products)}
                    >
                      구매하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
    </div>
  );

 

};

export default Product;

