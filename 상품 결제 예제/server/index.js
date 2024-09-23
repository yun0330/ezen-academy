// 필요한 패키지를 불러옵니다.
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
const bcrypt = require("bcrypt");

const session = require("express-session"); 
const MySQLStore = require("express-mysql-session")(session); 
const dotenv = require("dotenv"); 

const path = require("path");

// 환경변수 설정 파일을 불러옵니다.
dotenv.config(); 

// Express 애플리케이션을 생성합니다.
const app = express();

const port = 8000;

// URL 인코딩된 데이터를 해석하는 미들웨어를 설정합니다.
app.use(express.urlencoded({ extended: false })); 
// JSON 데이터를 해석하는 미들웨어를 설정합니다.
app.use(express.json()); 

// CORS 설정을 추가합니다. 클라이언트 측 URL을 허용합니다.
app.use(cors());

// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use(express.static(path.join(__dirname + "/images")));

// 환경변수에서 데이터베이스 연결 정보를 가져옵니다.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// 데이터베이스에 연결합니다. 단일 연결을 생성하고 간단한 작업수행
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

// 프로미스를 지원하는 데이터베이스 연결 풀을 생성합니다. 프로미스 기반 비동기 처리
const PromiseConnection = mysqlPromise.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});


// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error(" MySQL 접속에러: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.get("/", (req, res) => res.send(`안녕~~`));

app.post("/reqOrder", async (req, res, next) => {
  try {
    const { orderSheet } = req.body;

    // order 테이블 추가 쿼리
    const insertQuery =
      "INSERT INTO orders (orderNumber, userId, productCode, orderName, addr, phoneNumber, reqMessage, count, totalCount, totalAmount, payment, imageURL, paymentAmount) VALUES (?)";


    orderSheet.map(async (article) => {
      const data = [
        article.orderNumber,
        article.userId,
        article.id,
        article.name,
        article.addr,
        article.phoneNumber,
        article.reqMessage,
        article.quantity,
        article.totalCount,
        article.totalAmount,
        article.payment,
        article.imageURL,
        article.paymentAmount,
      ];

      await PromiseConnection.query(insertQuery, [data]);
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/ordersheet", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const [userData] = await PromiseConnection.query(
      "SELECT username, phonenumber, address, detailedaddress, userid FROM user WHERE userid = ?",
      [userId]
    );
    return res.send(userData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


app.get("/getOrderList", async (req, res, next) => {
  try {
    const { userId, periodDate } = req.query;

    const startDate = periodDate[0]; // 시작 기간 변수 선언
    const endDate = periodDate[1]; // 끝 기간 변수 선언

    const orderQuery =
      "SELECT * FROM orders WHERE userId = ? AND date BETWEEN ? AND ? ORDER BY date DESC";
    const productQuery = "SELECT prodid, title FROM shopproducts";

    const [orderData] = await PromiseConnection.query(orderQuery, [
      userId,
      startDate,
      endDate,
    ]);
    const [productData] = await PromiseConnection.query(productQuery);

    return res.send({ orderData: orderData, productData: productData });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


app.get("/products/usertype", async (req, res, next) => {
  try {
    const query =
      "SELECT user.userid, user.usertype, orders.productCode FROM user INNER JOIN orders ON user.userid = orders.userId WHERE orders.productCode = ?";
    const { productCode } = req.query;
    const [getUserData] = await PromiseConnection.query(query, [productCode]); // productCode 를 기반으로 쿼리문 실행

    // 유저 수 세기
    const userTypeCountData = {
      buyerPersonal: 0,

    };

    getUserData.forEach((userData) => {
      const { usertype } = userData;

      switch (usertype) {
        case "1": {
          userTypeCountData["buyerPersonal"] =
            userTypeCountData["buyerPersonal"] + 1;
          break;
        }

        default: {
          console.log("정의되지 않은 사용자 유형입니다.");
          break;
        }
      }
    });

    return res.json(userTypeCountData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//-----세션을 통한 로그인 시간관리

// MySQL 세션 스토어를 설정합니다.
const sessionStore = new MySQLStore(
  {
    expiration: 3600000, // 세션의 유효시간을 1시간 (3600000 밀리초)으로 설정합니다.
    createDatabaseTable: true, // true로 설정하면, 세션 테이블을 자동으로 생성합니다.
    schema: {
      tableName: "sessions", // 세션 데이터를 저장할 테이블의 이름을 "sessions"로 설정합니다.
      columnNames: {
        session_id: "session_id", // 세션 ID를 저장할 컬럼의 이름을 "session_id"로 설정합니다.
        expires: "expires", // 세션 만료 시간을 저장할 컬럼의 이름을 "expires"로 설정합니다.
        data: "data", // 세션 데이터를 저장할 컬럼의 이름을 "data"로 설정합니다.
      },
    },
  },
  connection // MySQL 연결 객체를 전달합니다.
);

// Express 앱에 세션 미들웨어를 추가합니다.
app.use(
  session({
    secret: "secretKey", // 세션을 암호화하는 데 사용될 비밀 키입니다. 보안을 위해 랜덤하고 안전한 문자열로 바꿔야 합니다.
    resave: false, // 세션이 수정되지 않은 경우에도 세션을 다시 저장할지 여부를 설정합니다. false로 설정하여 불필요한 저장을 방지합니다.
    saveUninitialized: true, // 초기화되지 않은 세션도 저장할지 여부를 설정합니다. true로 설정하여 모든 세션을 저장합니다.
    store: sessionStore, // 세션을 저장할 스토어로 앞서 정의한 MySQL 세션 스토어를 사용합니다.
    cookie: {
      maxAge: 3600000, // 쿠키의 유효시간을 1시간 (3600000 밀리초)으로 설정합니다.
      httpOnly: true, // 쿠키를 HTTP(S) 전용으로 설정하여 클라이언트 스크립트에서 쿠키에 접근할 수 없게 합니다.
    },
  })
);

//---------login.js 연동 로그인 데이터

app.post("/login", async (req, res) => {
  const { email, password, usertype } = req.body; //usertype 추가 

  try {
    // 이메일을 사용하여 데이터베이스에서 사용자를 찾습니다.
    connection.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error("서버에서 에러 발생:", err);
          res.status(500).send({ success: false, message: "서버 에러 발생" });
        } else {
          if (result.length > 0) {  // 사용자가 존재하면
            const isPasswordMatch = await bcrypt.compare(
              password,
              result[0].password
            );
            if (isPasswordMatch && usertype == result[0].usertype) {
              if (!req.session) {
                req.session = {};
              }
              req.session.usertype = result[0].usertype; 
              req.session.userid = result[0].userid; 

              res.send({ success: true, message: "로그인 성공", data: result });
            } else {
              res.send({
                success: false,
                message: "정보가 일치하지 않습니다.",
              });
            }
          } else {
            res.send({ success: false, message: "유저 정보가 없습니다." });
          }
        }
      }
    );
  } catch (error) {
    console.error("비밀번호 비교 중 오류:", error);
    res.status(500).send({ success: false, message: "서버 에러 발생" });
  }
});
//-------------------------------회원가입----------------------------------------------
//---------------------------------- 회원번호 함수
const usedUserNumbers = new Set(); // 중복 방지를 위한 Set

async function generateUserid(usertype) {
  const prefix = {
    personal: 1,

  }[usertype];

  do {
    randomDigits = Math.floor(10000 + Math.random() * 90000);
    userid = `${prefix}${randomDigits}`;
  } while (usedUserNumbers.has(userid)); // 중복된 userid가 있다면 다시 생성

  usedUserNumbers.add(userid); // Set에 추가
  return userid;
}


//-------------------------------이메일 중복 체크 ---------------------------------
app.post("/checkEmailDuplication", (req, res) => {
  const { email } = req.body;

  // 데이터베이스에서 이메일이 이미 존재하는지 확인합니다.
  const sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) {
      console.error("MySQL에서 이메일 중복 확인 중 오류:", err);
      return res.status(500).json({
        success: false,
        message: "이메일 중복 확인 중 오류가 발생했습니다.",
        error: err.message,
      });
    }

    if (result.length > 0) {
      // 이미 등록된 이메일인 경우
      return res.status(200).json({
        success: false,
        message: "이미 등록된 이메일입니다.",
      });
    } else {
      // 중복되지 않은 이메일인 경우
      return res.status(200).json({
        success: true,
        message: "사용 가능한 이메일입니다.",
      });
    }
  });
});
//---------------------------회원가입 기능구현----------------------------------------------
app.post("/register", async (req, res) => {
  // 클라이언트에서 받은 요청의 body에서 필요한 정보를 추출합니다.
  const {
    username,
    password,
    email,
    address,
    detailedaddress,
    phonenumber,
    usertype: clientUsertype,
  } = req.body;

  try {
    // 비밀번호를 해시화합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원번호를 생성합니다. (6자리)
    const userid = await generateUserid(clientUsertype);

    const usertypeNumber = {
      personal: 1, 

    };

    const serverUsertype = usertypeNumber[clientUsertype];

    const sql =
      "INSERT INTO user (userid, username, email, password, address, detailedaddress, phonenumber, usertype ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [
        userid,
        username,
        email,
        hashedPassword,
        address,
        detailedaddress,
        phonenumber,
        serverUsertype,

      ],
      (err, result) => {
        if (err) {
          // 쿼리 실행 중 에러가 발생한 경우 에러를 처리합니다.
          console.error("MySQL에 데이터 삽입 중 오류:", err);
          return res.status(500).json({
            success: false,
            message: "회원가입 중 오류가 발생했습니다.",
            error: err.message,
          });
        }
        // 회원가입이 성공한 경우 응답을 클라이언트에게 보냅니다.
        console.log("사용자가 성공적으로 등록됨");
        return res.status(200).json({
          success: true,
          message: "사용자가 성공적으로 등록됨",
          usertype: serverUsertype,
        });
      }
    );
  } catch (error) {
    // 회원가입 중 다른 내부적인 오류가 발생한 경우 에러를 처리합니다.
    console.error("회원가입 중 오류:", error);
    return res.status(500).json({
      success: false,
      message: "내부 서버 오류",
      details: error.message,
    });
  }
});

//-------------------------

app.get("/shop", (req, res) => {
  const sqlQuery = "SELECT * FROM proto_1.SHOPPRODUCTS;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});


app.get("/register", (req, res) => {
  const sqlQuery = "SELECT * FROM proto_1.SHOPPRODUCTS;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.get("/ordercount", (req, res) => {
  const sqlQuery =
    "SELECT sp.prodid, sp.title, sp.price, sp.thumbnail, COUNT(*) AS ordered FROM proto_1.orders AS o INNER JOIN proto_1.shopproducts AS sp ON o.productCode = sp.prodid GROUP BY o.productCode";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(port, `포트가 구동되었습니다`);
});
