// login.js

// 학번과 이름을 객체로 저장
const validUsers = {
    "20180746": "최성현",
    "20181494": "이아현",
    "20190629": "조경민",
    "20200138": "이상우",
    "20200660": "권희정",
    "20201155": "이호성",
    "20201538": "권지명",
    "20201539": "김경수",
    "20201540": "김영익",
    "20201541": "김영훈",
    "20201542": "김주영",
    "20201543": "남정청",
    "20201550": "윤진서",
    "20201553": "정민철",
    "20201558": "황상민",
    "20210381": "이다빈",
    "20211395": "안정현",
    "20211409": "민병선",
    "20211411": "손형준",
    "20211419": "이예성",
    "20221383": "박유미",
    "20221384": "서예원",
    "20221385": "여은채",
    "20221388": "이채원",
    "20221389": "최상은",
    "20221390": "최서영",
    "20221392": "최지윤",
    "20221398": "김륜구",
    "20221402": "김현목",
    "20221403": "박진",
    "20221407": "문군",
    "20221414": "정상준",
    "20221418": "조훈희",
    "20221574": "한석범",
    "20221923": "이중현",
    "20231868": "김지혜",
    "20241862": "이기정"
};

function sendLogData(eventId, userId, eventType, comment) {
    const url = "https://script.google.com/macros/s/AKfycbyCrewjcnY3AbPE5vhv5_flwxlQMucC49Nu9GRxH1yQWQS62BIAQJ09JJmQULVIJ9-Bfw/exec"; // Google Apps Script URL

    const logData = {
        eventId: eventId,
        userId: userId,
        eventType: eventType,
        comment: comment
    };

    fetch(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(logData),
        mode: "no-cors" // CORS 요청을 명시적으로 설정
    })
    .then(response => response.text())
    .then(data => console.log("로그 전송 성공:", data))
    .catch(error => console.error("로그 전송 실패:", error));
}

// 로그인 성공 시 sendLogData 호출 예시
function handleLogin(event) {
    event.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const studentName = document.getElementById("studentName").value;

    if (validUsers[studentId] === studentName) {
        alert("으라차차 농산물시장에 오신걸 환영합니다!");

        // 로그인 성공 로그 전송
        const currentDate = new Date();
        const eventId = Date.now(); // 유일한 ID로 현재 시간 밀리초 사용
        sendLogData(eventId, studentId, "로그인", `로그인 성공: ${studentName}`);

        // 페이지 리디렉션
        window.location.href = "title.html"; // 타이틀 화면으로 리디렉션
    } else {
        alert("학번 또는 이름이 올바르지 않습니다. 다시 입력해주세요.");
    }
}