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
 * Weather & Food Recommendation Logic
 */
async function updateWeather() {
    const weatherInfo = document.getElementById('weather-info');
    const foodInfo = document.getElementById('food-recommendation');
    if (!weatherInfo) return;

    const API_KEY = 'd74348809d216a763a278b03ac5d1554';
    let city = 'Seoul';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            const locResponse = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            if (locResponse.ok) {
                const locData = await locResponse.json();
                if (locData.city) city = locData.city;
            }
        } catch (e) {
            console.warn('Location fetch failed, using default.');
        } finally {
            clearTimeout(timeoutId);
        }

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!weatherResponse.ok) {
            throw new Error(`Weather error: ${weatherResponse.status}`);
        }

        const data = await weatherResponse.json();
        displayWeatherAndFood(data, weatherInfo, foodInfo);

    } catch (error) {
        console.error('Weather update failed:', error);
        weatherInfo.textContent = 'Weather info unavailable';
    }
}

function displayWeatherAndFood(data, weatherEl, foodEl) {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main; // Clear, Clouds, Rain, Snow, etc.
    const cityName = data.name;
    
    weatherEl.textContent = `${cityName}: ${temp}°C, ${condition}`;

    // Food Recommendation Logic
    let recommendations = [];
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        recommendations = ['파전 & 막걸리 🍶', '따끈한 칼국수 🍜', '얼큰한 짬뽕 🌶️'];
    } else if (lowerCondition.includes('snow')) {
        recommendations = ['보글보글 부대찌개 🥘', '따뜻한 우동 🥢', '와플 & 핫초코 ☕'];
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
        recommendations = ['든든한 국밥 🍚', '매콤한 떡볶이 🍡', '김치찌개 🥘'];
    } else if (lowerCondition.includes('clear')) {
        if (temp > 25) {
            recommendations = ['시원한 냉면 ❄️', '새콤한 비빔국수 🍝', '아이스 아메리카노 🧊'];
        } else {
            recommendations = ['육즙 가득 삼겹살 🥩', '고소한 파스타 🍝', '바삭한 치킨 🍗'];
        }
    } else {
        recommendations = ['맛있는 비빔밥 🥗', '달콤한 갈비 🍖', '간단한 샌드위치 🥪'];
    }

    const randomMenu = recommendations[Math.floor(Math.random() * recommendations.length)];
    if (foodEl) {
        foodEl.textContent = `오늘 저녁은? ${randomMenu}`;
    }
}

setTimeout(updateWeather, 500);
