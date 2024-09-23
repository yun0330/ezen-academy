import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./MyOrderList.css";

const MyOrderList = () => {
  const [orderData, setOrderData] = useState([]); // 주문 데이터 저장소
  const [orderDateArray, setOrderDateArray] = useState([]); // date 데이터만 들어간 저장소
  const [orderPeriod, setOrderPeriod] = useState([]); // date 간격 쿼리값 저장소
  const [productInfoData, setProductInfoData] = useState([]); // 썸네일, 상품 고유 코드가 들어있는 저장소

  const navigate = useNavigate();

  // 서버 경로
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  // 카테고리별 기간
  const periodCategory = {
    periodToday: "today",
    periodMonth: "month",
    periodYear: "year",
  };

  // 버튼에 내재될 값
  const orderPeriodButtons = [
    {
      btnName: "오늘",
      addData: {
        queryString: "today",
      },
    },
    {
      btnName: "3개월",
      addData: {
        queryString: "month",
        intervalPeriod: 3,
      },
    },
  ];

  // 기간을 도출하기 위한 메소드
  function getPeriodData(data) {
    const { queryString, intervalPeriod } = data;
    const now = new Date(); // 날짜 객체 생성
    const periodData = new Array(); // 날짜를 저장할 배열 변수 생성

    const checkMonth = now.getMonth() + 1; // 월을 표현한 정수 데이터가 6이하인지 검증하기 위한 데이터

    // 연월일 시분초 문자열 데이터화
    let year = String(now.getFullYear());
    let month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // 현재 날짜 및 시각
    periodData.push(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);

    // 만약 오늘자 데이터를 원한다면,
    // 기본값은 오늘자 데이터를 제공하도록 되어있다.
    if (queryString == periodCategory.periodToday || queryString == "") {
      // 오늘 날찌의 시작 설정, 0시 0분 0초
      periodData.push(`${year}-${month}-${day} 00:00:00`);
      periodData.reverse(); // 배열을 역순으로 변환한다.
      return periodData;
    }
    // 6개월 간의 주문내역을 원할 경우,
    if (queryString == periodCategory.periodMonth) {
      // 6개월 전부터의 데이터를 조회해야 하므로 6(intervalPeriod)만큼 월 데이터 감소
      now.setMonth(now.getMonth() - intervalPeriod);
      month = String(now.getMonth() + 1).padStart(2, "0");
      // 만약 1~6월이라면 연도 또한 작년도로 변환한다.
      if (checkMonth <= 6) {
        now.setFullYear(now.getFullYear());
        year = String(now.getFullYear());
      }
    }

    // 1년 간의 데이터를 원할 경우,
    if (queryString == periodCategory.periodYear) {
      now.setFullYear(now.getFullYear() - intervalPeriod);
      year = String(now.getFullYear());
    }

    // 과거 날짜 및 시각 저장
    periodData.push(`${year}-${month}-${day} 00:00:00`);
    periodData.reverse();
    return periodData;
  }

  // "오늘" 주문내역 문자열 날짜 처리(기본값)
  const getValidTodayString = () => {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return [
      `${year}-${month}-${day} 00:00:00`,
      `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    ];
  };

  // 문자열 날짜 데이터에서 "T"를 기준으로 날짜 연-월-일 데이터만을 추출하는 메소드
  function getDateBeforeT(stringDate) {
    const searchCharT = "T";
    const indexOFcharT = stringDate.indexOf(searchCharT);
    return stringDate.substring(0, indexOFcharT);
  }

  // 주문 데이터에 품목의 title 추가 메소드
  function mergeProductTitleForOrder(targetOrderData) {
    // targetOrderData :: 품목별 주문 데이터
    let targetMergeData;
    // forEach() 품목을 순회하면서,
    productInfoData.forEach((product) => {
      // 고유 품목 코드가 같다면,
      if (product.prodid == targetOrderData.productCode) {
        // 배열안에 title 속성을 추가한다.
        targetMergeData = { ...targetOrderData, title: product.title };
        return;
      }
    });
    return targetMergeData;
  }
  // 주문 내역 표시
  const spreadOrderData = (loadOrderDateArray, loadOrderData) => {
    // 문서에 삽일할 배열 생성
    const innerHtmlOrderData = new Array();

    loadOrderDateArray.forEach((orderDate) => {
      // orderDate :: 주문 날짜
      innerHtmlOrderData.push(
        <div key={orderDate} className="order_title">
          <h1>{orderDate} 주문</h1>
        </div>
      );
      loadOrderData.forEach((data) => {
        const getMergeData = mergeProductTitleForOrder(data);
        if (orderDate == getMergeData.date) {
          innerHtmlOrderData.push(
            <div className="order_detail_container">
              <div className="orderlist_container">
                <div className="my_order_list_box1">
                  <div className="orderlist_image">
                    <img src={getMergeData.imageURL} width={150} height={150} />
                  </div>
                  <div className="orderlist_detail">
                    주문 상태:{" "}
                    <b style={{ color: "blue" }}>{getMergeData.status}</b>
                    <p></p>
                    {getMergeData.title}
                    <p></p>
                    {getMergeData.paymentAmount.toLocaleString()} 원,{" "}
                    {getMergeData.count} 개
                  </div>
                </div>
              </div>
            </div>
          );
        }
      });
    });
    return innerHtmlOrderData;
  };

  useEffect(() => {
    // 비로그인 예외처리
    if (sessionStorage.loggedIn === undefined) return;

    // 로컬스토리지에 저장된 사용자 로그인 데이터 가져오기
    const getUserId = JSON.parse(sessionStorage.getItem("userData"));
    const { userid } = { ...getUserId };

    const uniqueDatesSet = new Set(); // 주문 일자 데이터를 넣을 SET 저장소

    // orderPeriod 변수에 데이터 유무를 검사
    function checkOrderPeriod(isOrderPeriod) {
      if (isOrderPeriod.length) {
        return isOrderPeriod;
      } else {
        // 아무것도 없다면 오늘자 데이터를 보여주도록 한다.
        return getValidTodayString();
      }
    }

    axios
      .get(`${Server_URL}/getOrderList`, {
        params: {
          userId: userid, // user 고유 식별번호
          periodDate: checkOrderPeriod(orderPeriod), // 쿼리문에 쓰일 date 데이터
        },
      })
      .then((resOrderData) => {
        const { orderData, productData } = resOrderData.data;

        orderData.forEach((data) => {
          data.date = getDateBeforeT(data.date); // 데이터 정제
          // 정제한 데이터를 uniqueDatesSet 배열에 추가
          // 중복된 데이터는 자동으로 삭제됨.
          uniqueDatesSet.add(data.date);
        });
        setOrderData(orderData); // 주문 품목에 대한 데이터를 저장
        setOrderDateArray([...uniqueDatesSet]); // 유효한 주문 일자 데이터를 저장
        setProductInfoData(productData); // 상품의 고유코드, 썸네일 상태 저장
      });
  }, [orderPeriod]);
  // orderPeriod 값이 바뀔 때마다, 즉 버튼을 누를때마다 useEffect 재실행

  const handleButtonClick = (queryDateData, btnName) => {
    const periodBtns = document.querySelectorAll(".period_button");

    periodBtns.forEach((btn) => {
      if (btn.value == btnName) {
        btn.disabled = true;
      } else btn.disabled = false;
    });
    // 버튼에 따라 날짜 데이터 삽입
    // useEffect 재실행 유도
    setOrderPeriod(getPeriodData(queryDateData));
  };

  // 쇼핑몰 홈 이동 핸들러
  const onClickGoShop = () => {
    navigate("/");
  };

  if (sessionStorage.loggedIn === undefined) {
    return (
      <div>
        <h1>페이지 접근이 거부되었습니다.</h1>
        <h3>비로그인 상태거나 페이지에 접근할 수 있는 권한이 없습니다.</h3>
        <input
          type="button"
          value={"쇼핑몰 홈으로 돌아가기"}
          onClick={onClickGoShop}
        />
      </div>
    );
  } else {
    return (
      <div>
        <center>
          <div>
            <h1>구매내역</h1>
            <hr></hr>
            {orderPeriodButtons.map((period) => (
              <input
                type="button"
                className="period_button"
                key={period.btnName}
                value={period.btnName}
                onClick={() =>
                  handleButtonClick(period.addData, period.btnName)
                }
              />
            ))}
            <div>
              {orderData.length ? (
                spreadOrderData(orderDateArray, orderData)
              ) : (
                <div>
                  <h1>주문 내역이 존재하지 않습니다.</h1>

                  <input
                    type="button"
                    value={"쇼핑몰 홈으로 돌아가기"}
                    onClick={onClickGoShop}
                  />
                </div>
              )}
            </div>
          </div>
        </center>
      </div>
    );
  }
};

export default MyOrderList;
