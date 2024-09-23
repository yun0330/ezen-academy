import { Link, useLocation, useNavigate } from "react-router-dom";
import "./CompleteOrder.css";

const CompleteOrder = () => {
  const location = useLocation(); // useNavigate 훅스를 통해 가져온 데이터를 다루기 위한 기능
  const navigate = useNavigate();

  // 메인 || 샵 이동 핸들러
  const onClickShopNavigateHandler = () => {
    navigate("/");
  };

  // 구매내역 페이지 이동 핸들러
  const onClickMyOrderListNavigateHandler = () => {
    navigate("/myOrderList");
  };

  if (!location.state) {
    // 올바른 접근 방법이 아닐 경우
    return (
      <div>
        <h1>요청한 페이지를 찾을 수 없습니다.</h1>
        <h3>올바른 접근이 아니거나 요청 데이터를 찾을 수 없습니다.</h3>
        <h3>
          메인으로 돌아가려면 <Link to={"/"}>이곳</Link>을 클릭해주세요.
        </h3>
      </div>
    );
  } else {
    // 정상적으로 이 경로에 접근한 경우
    const { orderData } = location.state;

    const {
      orderNumber,
      deliveryDestName,
      deliveryDestPhone,
      deliveryDestAddress,
      deliveryDestMessage,
      paymentType,
      payTotalAmount,
      orderProduct,
    } = orderData;

    console.log(orderProduct);


    return (
      <div>
        <h1 style={{ textAlign: "center" }}>
          <b style={{ color: "green" }}>주문이 정상적으로 완료</b>되었습니다.
        </h1>
        <div>
          <div>
            <div>
              <h1>주문 번호</h1>
              <h2>{orderNumber}</h2>
    
              <h1>배송지 정보</h1>
              <hr />
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>주소</td>
                    <td>{deliveryDestAddress}</td>
                  </tr>
                  <tr>
                    <td>수령인 성명</td>
                    <td>{deliveryDestName}</td>
                  </tr>
                  <tr>
                    <td>수령인 연락처</td>
                    <td>{deliveryDestPhone}</td>
                  </tr>
                  <tr>
                    <td>배송 메시지</td>
                    <td>{deliveryDestMessage}</td>
                  </tr>
                </tbody>
              </table>
              <hr />
              <h1>결제 상세</h1>
              <hr />
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>
                      <b>{paymentType}</b>
                    </td>
                    <td>{`${payTotalAmount.toLocaleString()} 원`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <center>
                <input
                  type="button"
                  onClick={onClickShopNavigateHandler}
                  value={"쇼핑 홈 가기"}
                />
                <input
                  type="button"
                  onClick={onClickMyOrderListNavigateHandler}
                  value={"구매내역 보기"}
                />
              </center>
            </div>
          </div>
    
          <div>
            <h1>결제 상품</h1>
            <hr />
            {orderProduct.map((product) => (
              <div key={product.id}>
                <div>
                  <div>
                    <img src={product.thumbnail} width={150} height={150} />
                  </div>
                  <div>
                    <p>
                      <b>{product.name}</b>
                    </p>
                    <p>주문 수량 : {product.quantity} 개</p>
                    <p>
                      <span style={{ color: "blue" }}>
                        {(product.price * product.quantity).toLocaleString()}
                      </span>{" "}
                      원
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    

  }
};

export default CompleteOrder;
