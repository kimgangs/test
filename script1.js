// 튜토리얼 이미지와 설명 배열
const tutorialData = [
    { img: '튜토리얼1.png', desc: '게임 시작 화면입니다.' },
    { img: '튜토리얼2.png', desc: '다음 날을 클릭하면 농산물의 가격이 변동되며 차트도 가격에 따라 변동됩니다.' },
    { img: '튜토리얼3.png', desc: '농산물은 총 6가지이며 각각 가격이 모두 다르며 일차에 따라 가격이 변동됩니다.' },
    { img: '튜토리얼4.png', desc: '과금하기 버튼을 클릭하면 과금 요소들이 나오게 됩니다.' },
    { img: '튜토리얼5.png', desc: '게임당 한 번 기상청 시스템을 구매하면 내일의 날씨를 알 수 있습니다. 날씨는 농산물의 가격에 영향을 줍니다.' },
    { img: '튜토리얼6.png', desc: '뽑기 가격은 농산물들의 평균값으로 정해지며, 농산물을 랜덤으로 한 가지 얻게 됩니다.' },
    { img: '튜토리얼7.png', desc: '목표 금액 500,000원을 달성하면 클리어하게 됩니다.' },
    { img: '튜토리얼8.png', desc: '30일차가 지나도 목표 금액을 달성하지 못하면 다시 0일차로 초기화 됩니다.' }
];

let currentImageIndex = 0;

// 제작자 정보 팝업 열기
function openCreatorInfo() {
    document.getElementById('creatorInfoPopup').style.display = 'block';
    logButtonClick('제작자정보버튼누름', '제작자 정보 보기');
}

// 튜토리얼 팝업 열기
function openTutorial() {
    document.getElementById('tutorialPopup').style.display = 'block';
    updateTutorial();
    logButtonClick('튜토리얼버튼누름', '튜토리얼 시작');
}

// 팝업 닫기
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// 현재 튜토리얼 업데이트
function updateTutorial() {
    const tutorialImage = document.getElementById('tutorialImage');
    const tutorialDescription = document.getElementById('tutorialDescription');

    // 현재 이미지와 설명 업데이트
    tutorialImage.src = tutorialData[currentImageIndex].img;
    tutorialDescription.textContent = tutorialData[currentImageIndex].desc;

    // 튜토리얼 3번 이미지 크기 조정 (예: 3번 이미지일 경우 크기를 줄임)
    if (currentImageIndex === 2) {
        tutorialImage.style.width = '800px';  // 원하는 크기로 줄이기
        tutorialImage.style.height = 'auto';  // 비율 유지
    }
}

// 다음 튜토리얼 이미지로 변경
function nextTutorial() {
    currentImageIndex++;
    if (currentImageIndex >= tutorialData.length) {
        currentImageIndex = 0;  // 마지막 이미지 후 첫 이미지로 돌아가기
    }
    updateTutorial();
}

// 이전 튜토리얼 이미지로 변경
function prevTutorial() {
    currentImageIndex--;
    if (currentImageIndex < 0) {
        currentImageIndex = tutorialData.length - 1;  // 첫 이미지에서 마지막 이미지로 돌아가기
    }
    updateTutorial();
}

// 로그인 ID를 전역 변수로 설정
let loginId = '20230001'; // 여기에 실제 로그인 ID를 넣습니다.

// 로그를 구글 시트에 기록하는 함수
function logButtonClick(event, comment) {
    const data = {
        loginId: loginId,
        event: event,
        comment: comment,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
    };

    fetch('https://script.google.com/macros/s/AKfycbyCrewjcnY3AbPE5vhv5_flwxlQMucC49Nu9GRxH1yQWQS62BIAQJ09JJmQULVIJ9-Bfw/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log('로그가 기록되었습니다.');
        } else {
            console.error('로그 기록에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('에러:', error);
    });
}
