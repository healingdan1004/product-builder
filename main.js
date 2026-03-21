const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers-container');
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle Logic with Safe LocalStorage Access
let currentTheme = 'light';
try {
    currentTheme = localStorage.getItem('theme') || 'light';
} catch (e) {
    console.warn('LocalStorage access denied, defaulting to light theme');
}

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {}
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

if (generateBtn) {
    generateBtn.addEventListener('click', generateLottoNumbers);
}

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    displayNumbers(sortedNumbers);
}

function displayNumbers(numbers) {
    if (!numbersContainer) return;
    numbersContainer.innerHTML = '';
    numbers.forEach((number, index) => {
        const ball = document.createElement('div');
        ball.classList.add('number-ball', `color-${index + 1}`);
        ball.textContent = number;
        numbersContainer.appendChild(ball);
    });
}

// Initial generation
generateLottoNumbers();

/**
 * Weather & Food Recommendation Logic (7-Day Forecast)
 */
const weatherFoodMap = {
    rain: [
        '파전 & 막걸리 🍶', '따끈한 칼국수 🍜', '얼큰한 짬뽕 🌶️', 
        '바삭한 모듬튀김 🍤', '수제비 🥄', '감자전 🥔', '얼큰한 육개장 🥘'
    ],
    snow: [
        '보글보글 부대찌개 🥘', '따뜻한 우동 🥢', '와플 & 핫초코 ☕', 
        '군고구마 & 동치미 🍠', '어묵 전골 🍢', '사골 떡만두국 🥣'
    ],
    cloudy: [
        '든든한 국밥 🍚', '매콤한 떡볶이 🍡', '김치찌개 🥘', 
        '순대국 🥣', '제육볶음 🐷', '비빔밥 🥗', '잔치국수 🍜'
    ],
    hot: [
        '시원한 냉면 ❄️', '새콤한 비빔국수 🍝', '아이스 아메리카노 🧊', 
        '빙수 🍧', '메밀소바 🥢', '시원한 수박 🍉', '초계국수 🐔'
    ],
    cool: [
        '육즙 가득 삼겹살 🥩', '고소한 파스타 🍝', '바삭한 치킨 🍗', 
        '스테이크 🍽️', '연어 초밥 🍣', '햄버거 🍔', '돈까스 🐷'
    ],
    default: [
        '맛있는 비빔밥 🥗', '달콤한 갈비 🍖', '간단한 샌드위치 🥪', 
        '라멘 🍜', '타코 🌮', '김밥 🍙', '설렁탕 🥣'
    ]
};

// Map WMO Weather Codes to categories
function mapWMOCode(code, temp) {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
    if ([1, 2, 3, 45, 48].includes(code)) return 'cloudy';
    if (code === 0) return temp > 25 ? 'hot' : 'cool';
    return 'default';
}

function getWeatherIcon(code) {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) return '🌧️';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
    if ([1, 2, 3].includes(code)) return '⛅';
    if ([45, 48].includes(code)) return '🌫️';
    if (code === 0) return '☀️';
    return '✨';
}

async function updateWeather() {
    const weatherCard = document.querySelector('.weather-card');
    if (!weatherCard) return;

    let lat = 37.5665, lon = 126.9780, city = 'Seoul'; // Default

    // Step 1: Get Location
    try {
        if ("geolocation" in navigator) {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            city = '내 주변'; // Or use reverse geocoding if needed
        }
    } catch (e) {
        console.warn('Geolocation failed, trying IP fallback.');
        try {
            const locRes = await fetch('https://ipapi.co/json/');
            if (locRes.ok) {
                const data = await locRes.json();
                lat = data.latitude;
                lon = data.longitude;
                city = data.city || 'Seoul';
            }
        } catch (ipErr) {
            console.warn('IP fallback failed.');
        }
    }

    // Step 2: Fetch 4-Day Forecast from Open-Meteo
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`);
        if (!res.ok) throw new Error('Forecast API failed');
        const data = await res.json();
        displayForecast(data.daily, city);
    } catch (error) {
        console.error('Forecast update failed:', error);
        weatherCard.innerHTML = '<p class="error">일주일 날씨 정보를 가져올 수 없습니다.</p>';
    }
}

function displayForecast(daily, city) {
    const weatherCard = document.querySelector('.weather-card');
    if (!weatherCard) return;

    const days = ['일', '월', '화', '수', '목', '금', '토'];

    // Create the header and container first
    weatherCard.innerHTML = `
        <h2 class="forecast-title">"${city}" 날씨예보 & 추천매뉴</h2>
        <div class="forecast-container" id="forecast-list"></div>
    `;

    const forecastList = document.getElementById('forecast-list');
    let forecastHtml = '';

    daily.time.forEach((dateStr, i) => {
        const date = new Date(dateStr);
        const dayName = days[date.getDay()];
        const isToday = i === 0;
        
        const code = daily.weather_code[i];
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const category = mapWMOCode(code, maxTemp);
        const icon = getWeatherIcon(code);

        const recommendations = weatherFoodMap[category] || weatherFoodMap.default;
        const randomMenu = recommendations[Math.floor(Math.random() * recommendations.length)];

        forecastHtml += `
            <div class="forecast-item ${isToday ? 'today' : ''}">
                <div class="forecast-date">${isToday ? '오늘' : dayName + '요일'}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">
                    <span class="max">${maxTemp}°</span> / 
                    <span class="min">${minTemp}°</span>
                </div>
                <div class="forecast-food">
                    <span class="food-label">추천 메뉴</span>
                    <span class="food-name">${randomMenu}</span>
                </div>
            </div>
        `;
    });

    if (forecastList) { // Ensure forecastList exists before setting innerHTML
        forecastList.innerHTML = forecastHtml;
    }
}

// Initial call
setTimeout(updateWeather, 500);
