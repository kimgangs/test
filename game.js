let balance = 100000; // 초기 자본 설정
let turnCount = 0; // 현재 턴 카운트 초기화
let showWeather = false; // 내일의 날씨 표시 여부
const weatherCost = 29000; // 기상청 비용
const gachaCost = 9000; // 뽑기 비용 설정

// 농산물 초기 설정
const coins = [
    { name: '당근', price: Math.floor(Math.random() * 10000 + 3000), owned: 0, img: '당근.png' },
    { name: '사과', price: Math.floor(Math.random() * 10000 + 3000), owned: 0, img: '사과.png' },
    { name: '가지', price: Math.floor(Math.random() * 10000 + 6000), owned: 0, img: '가지.png' },
    { name: '딸기', price: Math.floor(Math.random() * 10000 + 6000), owned: 0, img: '딸기.png' },
    { name: '복숭아', price: Math.floor(Math.random() * 10000 + 9000), owned: 0, img: '복숭아.png' },
    { name: '브로콜리', price: Math.floor(Math.random() * 10000 + 9000), owned: 0, img: '브로콜리.png' }
];

const priceHistory = coins.map(() => []); // 가격 기록 배열
const labels = []; // 차트 레이블 배열

const ctx = document.getElementById('priceChart').getContext('2d');
// 차트 생성 시 options 부분에 추가
const priceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: coins.map((coin, index) => ({
            label: coin.name,
            data: priceHistory[index],
            borderColor: `hsl(${index * 60}, 80%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 80%, 50%, 0.2)`,
            fill: false,
            borderWidth: 3,
            pointRadius: 1,
            pointBackgroundColor: `hsl(${index * 60}, 100%, 50%)`,
            pointBorderWidth: 1,
            tension: 0.3
        })),
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                },
                title: {
                    display: true,
                    text: '가격 (₩)',
                    color: '#666',
                    rotation: 270,
                    font: {
                        size: 16, // 글씨 크기 설정
                        weight: 'normal' // 글씨 두께 설정
                    }
                },
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                },
                title: {
                    display: true,
                    text: '일차',
                    color: '#666',
                    font: {
                        size: 16, // 글씨 크기 설정
                        weight: 'normal' // 글씨 두께 설정
                    }
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
                font: {
                    size: 16, // 글씨 크기 설정
                    weight: 'normal' // 글씨 두께 설정
                }
            },
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        weight: 'normal'
                    }
                }
            },
            title: {
                display: true,
                text: `목표: 30일 안에 500,000₩ 만들기! `,
                color: '#333',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        layout: {
            padding: 10,
        }
    },
    plugins: [{
        beforeDraw: function(chart) {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = '#F5F5DC'; // 배경색 설정
            ctx.fillRect(0, 0, chart.width, chart.height); // 캔버스 전체에 흰색 배경 그리기
            ctx.restore();
        }
    }]
});


// 내일의 날씨를 저장할 변수
let nextWeather = ''; 

// 초기 날씨 결정 함수
function determineNextWeather() {
    const weatherChance = Math.random();
    if (weatherChance < 0.4) {
        nextWeather = '맑음'; // 40%
    } else if (weatherChance < 0.65) {
        nextWeather = '흐림'; // 25%
    } else if (weatherChance < 0.85) {
        nextWeather = '눈비'; // 20%
    } else {
        nextWeather = '폭설'; // 15%
    }
}

// 첫 날의 날씨를 결정하고 화면에 표시
determineNextWeather();
document.getElementById('weather').style.display = 'none';

// 게임이 끝나는 조건을 확인하는 함수
function checkEndGame() {
    if (balance >= 500000) {
        alert("축하합니다! 자본이 500,000₩에 도달했습니다. 게임이 초기화됩니다.");
        resetGame();
        return; // 게임이 종료되었으므로 이후 로직을 실행하지 않음
    } 
    if (turnCount >= 31) {
        alert("31일차에 도달했습니다. 게임이 초기화됩니다.");
        resetGame();
    }
}

// 자본을 업데이트하고 게임 종료를 확인하는 함수
function updateBalance(amount) {
    balance += amount;
    updateUI();
    checkEndGame(); // 자본이 변경될 때마다 게임 종료 조건 확인
}

// 게임을 초기화하는 함수
function resetGame() {
    balance = 100000;
    turnCount = 0; // turnCount를 0으로 초기화
    
    // 코인 가격 및 보유량 초기화
    coins.forEach((coin, index) => {
        coin.price = basePrices[index]; // 기준 가격으로 재설정
        coin.owned = 0;
        priceHistory[index] = [coin.price]; // 가격 기록을 초기화하고 0일차 가격만 저장
    });

    labels.length = 0; // 레이블 배열을 비우고
    labels.push('0 일차'); // 0일차로 다시 설정

    // 차트 업데이트
    priceChart.data.labels = labels;
    priceChart.data.datasets.forEach((dataset, index) => {
        dataset.data = priceHistory[index];
    });
    
    // 차트의 타이틀을 오늘이 0일차로 업데이트
    priceChart.options.plugins.title.text = `오늘은 ${turnCount} 일차입니다`;
    priceChart.update(); // 차트를 업데이트하여 초기화된 데이터 적용
    
    // 내일의 날씨 숨김
    showWeather = false;
    document.getElementById('weather').style.display = 'none';

    // 기상청 버튼을 다시 활성화
    const weatherButton = document.getElementById('weather-button');
    weatherButton.disabled = false;
    weatherButton.innerText = `기상청 (-${weatherCost.toLocaleString()}₩)`;

    updateUI(); // UI 업데이트
    determineNextWeather(); // 다음 날의 날씨 결정
    document.getElementById('weather').innerText = `내일의 날씨: ${nextWeather}`;
}


function updateUI() {
    // 현재 자본을 3자리마다 쉼표가 포함된 형식으로 표시
    document.getElementById('balance').innerText = `${balance.toLocaleString()}₩`;

     // 뽑기 버튼 가격 업데이트
     const gachaButton = document.getElementById('gacha-button');
     const gachaCost = calculateGachaPrice();
     gachaButton.innerText = `뽑기 (-${gachaCost.toLocaleString()}₩)`;
    
    const coinContainer = document.getElementById('coins');
    coinContainer.innerHTML = ''; // 매번 새로 갱신하기 위해 초기화

    coins.forEach((coin, index) => {
        if (index % 3 === 0) {
            rowDiv = document.createElement('div');
            rowDiv.className = 'coin-row';
            coinContainer.appendChild(rowDiv);
        }

        const coinWrapper = document.createElement('div');
        coinWrapper.className = 'coin-wrapper';
        coinWrapper.innerHTML = `
            <img src="${coin.img}" alt="${coin.name}">
            <div class="coin">
                <div class="coin-content">
                    <h2>${coin.name}</h2>
                    <p>가격: ${coin.price.toLocaleString()}₩</p>
                    <p>보유량: ${coin.owned}</p>
                    <button onclick="buyCoin(${index})">구매</button>
                    <button onclick="sellCoin(${index})">판매</button>
                    <button onclick="buyAll(${index})">전량구매</button>
                    <button onclick="sellAll(${index})">전량판매</button>
                </div>
            </div>
        `;
        rowDiv.appendChild(coinWrapper);
});
}

// 코인 구매, 판매 및 전량매수/매도 함수
function buyCoin(index) {
    const coin = coins[index];
    if (balance >= coin.price) {
        updateBalance(-coin.price);
        coin.owned += 1;
        updateUI();
    } else {
        alert('자본이 부족합니다.');
    }
}

function sellCoin(index) {
    const coin = coins[index];
    if (coin.owned > 0) {
        updateBalance(coin.price);
        coin.owned -= 1;
        updateUI();
    } else {
        alert('보유한 농산물이 없습니다.');
    }
}

// 전량매수 함수
function buyAll(index) {
    const coin = coins[index];
    const maxAffordableCoins = Math.floor(balance / coin.price);
    if (maxAffordableCoins > 0) {
        updateBalance(-maxAffordableCoins * coin.price);
        coin.owned += maxAffordableCoins;
        updateUI();
    } else {
        alert('자본이 부족합니다.');
    }
}

// 전량매도 함수
function sellAll(index) {
    const coin = coins[index];
    if (coin.owned > 0) {
        updateBalance(coin.owned * coin.price);
        coin.owned = 0;
        updateUI();
    } else {
        alert('보유한 농산물이 없습니다.');
    }
}

// 과금하기 기능도 자동 종료 확인 추가
function addFunds(amount) {
    updateBalance(amount); // 선택한 금액을 추가하고 종료 조건 확인
}

function togglePaymentOptions() {
    const paymentOptions = document.getElementById('payment-options');
    paymentOptions.style.display = paymentOptions.style.display === 'none' ? 'block' : 'none';
}

// 뽑기 가격을 계산하는 함수
function calculateGachaPrice() {
    const totalPrice = coins.reduce((sum, coin) => sum + coin.price, 0); // 모든 농산물 가격의 합
    return Math.round(totalPrice / coins.length); // 가격의 평균을 계산하고 반올림
}

function drawGacha() {
    const gachaCost = calculateGachaPrice(); // 뽑기 가격을 매번 평균값으로 설정

    if (balance >= gachaCost) {
        updateBalance(-gachaCost); // 자본에서 9000₩ 차감

        // 농산물 랜덤 선택 (0~5 범위의 인덱스를 랜덤으로 선택)
        const randomIndex = Math.floor(Math.random() * coins.length);
        const selectedCoin = coins[randomIndex];
        
        // 선택된 농산물 보유량 증가
        selectedCoin.owned += 1;

        // 알림 표시 및 UI 업데이트
        alert(`${selectedCoin.name}을(를) 획득했습니다!`);
        updateUI();
    } else {
        alert('자본이 부족합니다.');
    }
}

function purchaseWeatherInfo() {
    if (balance >= weatherCost) {
        updateBalance(-weatherCost);
        showWeather = true;
        document.getElementById('weather').style.display = 'block'; // 내일의 날씨 표시
        alert("기상청 서비스 구매 완료! 게임이 초기화될 때까지 내일의 날씨가 보입니다.");
        // 기상청 버튼을 비활성화
        const weatherButton = document.getElementById('weather-button');
        weatherButton.disabled = true;
        weatherButton.innerText = '구매완료';
    } else {
        alert('자본이 부족합니다.');
    }
}

// 각 코인의 기준 가격 설정
const basePrices = coins.map(coin => coin.price);

// 초기 가격과 0일차 데이터 설정
function initializePriceHistory() {
    coins.forEach((coin, index) => {
        priceHistory[index].push(coin.price); // 초기 가격을 0일차에 추가
    });
    labels.push('0 일차'); // 0일차 레이블 추가
}

// 초기화 함수 호출 및 UI 업데이트
initializePriceHistory();
updateUI();
priceChart.update(); // 차트를 업데이트하여 0일차 가격을 표시

function nextTurn() {
    turnCount++;
    labels.push(`${turnCount} 일차`); 
    
    // 오늘 일차를 차트 제목에 반영
    priceChart.options.plugins.title.text = `오늘은 ${turnCount} 일차입니다!`;

    // 날씨 및 가격 업데이트 로직 실행
    const weather = nextWeather;
    determineNextWeather();

    if (showWeather) {
        document.getElementById('weather').style.display = 'block';
        document.getElementById('weather').innerText = `내일의 날씨: ${nextWeather}`;
    } else {
        document.getElementById('weather').style.display = 'none';
    }
    
    coins.forEach((coin, index) => {
        let change;
        
        // 각 코인마다 고유한 변동 폭 설정
        switch (index) {
            case 0: change = (Math.random() * 0.8 - 0.35); break;
            case 1: change = (Math.random() * 0.7 - 0.3); break;
            case 2: change = (Math.random() * 0.6 - 0.25); break;
            case 3: change = (Math.random() * 0.5 - 0.2); break;
            case 4: change = (Math.random() * 0.4 - 0.15); break;
            case 5: change = (Math.random() * 0.3 - 0.1); break;
        }
        
        // 평균 회귀 로직 및 날씨 효과 적용
        const meanReversionProbability = 0.4; 
        if (coin.price < basePrices[index] && Math.random() < meanReversionProbability) {
            change += (basePrices[index] - coin.price) / basePrices[index] * 0.2;
        }

        switch (weather) {
            case '맑음': change -= 0.1; break;
            case '흐림': change += (Math.random() * 0.1 - 0.05); break;
            case '눈비': change += (Math.random() * 0.05 + 0.05); break;
            case '폭설': change += (Math.random() * 0.05 + 0.15); break;
        }

        const minPrice = (index <= 2) ? 500 : 9000; 
        coin.price = Math.max(minPrice, Math.round(coin.price * (1 + change)));
        priceHistory[index].push(coin.price);
    });

    priceChart.data.labels = labels;
    priceChart.update(); 
    updateUI();
    checkEndGame(); 
}
