
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // 랜덤 코드 생성 라이브러리

import "./MultiPayment.css";

const MultiPayment = ({
  userCart,
  submitOrdersheet,
  paymentData,
}) => {
  const { paymentType, channelKey, payMethod, paymentName } = paymentData;
  const { REACT_APP_PortOne_StoreId } = process.env;

  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);

  let payResponse;

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        // jQuery 라이브러리를 비동기적으로 로드합니다.
        await loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
        // Portone의 브라우저 SDK를 비동기적으로 로드합니다.
        await loadScript("https://cdn.portone.io/v2/browser-sdk.js");
        // 스크립트가 성공적으로 로드되면 상태를 업데이트합니다.
        setIsScriptsLoaded(true);
      } catch (error) {
        // 스크립트 로딩 중 에러가 발생하면 콘솔에 에러 메시지를 출력합니다.
        console.error(error.message);
      }
    };
    
    // 컴포넌트가 마운트될 때 스크립트를 로드합니다.
    loadScripts();
    
    // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
    return () => {
      // 로드된 jQuery 스크립트를 찾습니다.
      const jquery = document.querySelector('script[src="https://code.jquery.com/jquery-3.7.1.min.js"]');
      // 로드된 Portone 브라우저 SDK 스크립트를 찾습니다.
      const iamport = document.querySelector('script[src="https://cdn.portone.io/v2/browser-sdk.js"]');
      // jQuery 스크립트가 있으면 head에서 제거합니다.
      if (jquery) document.head.removeChild(jquery);
      // Portone 브라우저 SDK 스크립트가 있으면 head에서 제거합니다.
      if (iamport) document.head.removeChild(iamport);
    };
    }, []); // 빈 배열을 사용하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.
    

  // 총 상품 금액을 구하는 메소드
  const totalProductAmount = () => {
    let sumAmount = 0;
    userCart.forEach((item) => (sumAmount += item.price * item.quantity));
    return sumAmount;
  };

  const onClickPayment = async () => {
    if (!isScriptsLoaded) {
      alert("스크립트가 아직 로드되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    const { PortOne } = window;
    if (!PortOne) {
      alert("결제 SDK가 제대로 로드되지 않았습니다.");
      return;
    }

    try {

      if (paymentType == "카카오 페이") {
        payResponse = await PortOne.requestPayment({
          // Store ID 설정
          storeId: REACT_APP_PortOne_StoreId,
          // 채널 키 설정
          channelKey: channelKey,
          paymentId: `payment-${uuidv4()}`,
          orderName: `${userCart[0].name} 외 ${userCart.length - 1} 건`,
          totalAmount: totalProductAmount(),
          currency: "CURRENCY_KRW",
          payMethod: payMethod,
          productType: "PRODUCT_TYPE_REAL",
          easyPay: { easyPayProvider: "KAKAOPAY" },
        });
      } else {
      payResponse = await PortOne.requestPayment({
        storeId: REACT_APP_PortOne_StoreId,
        channelKey: channelKey,
        paymentId: `payment-${uuidv4()}`,
        orderName: `${userCart[0].name} 외 ${userCart.length - 1} 건`,
        totalAmount: totalProductAmount(),
        currency: "CURRENCY_KRW",
        payMethod: payMethod,
        productType: "PRODUCT_TYPE_REAL",
      });
    }

      if (payResponse.code) {
        alert(payResponse.message);
        return;
      }

      if (payResponse.transactionType === "PAYMENT") {
        submitOrdersheet(paymentType);
      }
    } catch (error) {
      alert("결제 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <>
      {paymentName == "카카오 페이" ? (
        <input
          className="payment_btn_kakaopay"
          type="button"
          onClick={onClickPayment}
          value={paymentName}
        />
      ) : (
        <input
          className="payment_btn_multi"
          type="button"
          onClick={onClickPayment}
          value={paymentName}
        />
      )}
    </>
  );
};

export default MultiPayment;