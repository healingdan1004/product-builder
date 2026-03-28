const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers-container');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');

// Translation Dictionary
const translations = {
    ko: {
        'blog-lotto-habits-title': '행운을 부르는 로또 습관', 'blog-lotto-habits-excerpt': '로또 당첨을 위해 우리가 실천할 수 있는 작은 습관들을 소개합니다.',
        'blog-lotto-habits-title': '??? ??? ?? ??', 'blog-lotto-habits-excerpt': '?? ??? ?? ??? ??? ? ?? ?? ???? ?????.',
        'nav-about': '소개', 'nav-how': '사용법', 'nav-contact': '문의', 'nav-faq': 'FAQ', 'nav-blog': '게시판',
        'hero-title': '로또 번호 생성기', 'hero-subtitle': '가장 진보되고 직관적인 행운의 번호 생성기를 경험해 보세요.',
        'gen-title': '행운의 번호', 'gen-btn': '번호 생성하기',
        'game-title': '로또 2048 퍼즐', 'game-start': '2048 시작하기', 'game-over': '게임 종료!',
        'game-best': '최고 점수', 'game-retry': '다시 시도', 'game-instructions': '<strong>방향키</strong> 또는 <strong>스와이프</strong>로 숫자를 합치세요.',
        'about-title': 'LottoGen 소개', 'about-text': 'LottoGen은 사용자가 무작위적이고 공정한 로또 번호를 생성할 수 있도록 설계된 프리미엄 디지털 도구입니다. 우리의 알고리즘은 모든 번호에 대해 동일한 확률을 보장하여 고객님이 가장 좋아하는 로또 게임에 진정한 무작위 경험을 제공합니다.',
        'about-text-detail': '우리는 단순히 숫자를 뽑는 것을 넘어, 사용자에게 즐거움과 영감을 제공하고자 합니다. 매일 변화하는 날씨 데이터를 분석하여 맞춤형 식단을 추천하고, 간단한 퍼즐 게임을 통해 두뇌를 자극하는 등 전반적인 라이프스타일을 지원하는 엔터테인먼트 플랫폼을 지향합니다.',
        'how-title': '사용 방법', 'how-step1-title': '번호 생성', 'how-step1': '"번호 생성하기" 버튼을 클릭합니다. 시스템은 최신 난수 발생 알고리즘을 사용하여 즉시 번호를 추출합니다.',
        'how-step2-title': '결과 확인', 'how-step2': '알고리즘이 1부터 45 사이의 6개 고유한 번호를 선택하는 것을 확인합니다. 중복은 발생하지 않습니다.',
        'how-step3-title': '저장 및 공유', 'how-step3': '이 행운의 번호를 다음 로또 구매에 사용해 보세요! 친구들과 번호를 공유하거나 게임을 즐기며 즐거운 시간을 보내세요.',
        'faq-title': '자주 묻는 질문 (FAQ)',
        'faq-q1': 'Q: 생성된 번호로 정말 당첨될 수 있나요?', 'faq-a1': 'A: 보장할 수는 없지만, 저희 알고리즘은 실제 로또 추첨기와 유사한 확률적 무작위성을 따릅니다. 행운이 함께하기를 바랍니다!',
        'faq-q2': 'Q: 날씨 정보는 어디서 가져오나요?', 'faq-a2': 'A: 신뢰할 수 있는 글로벌 기상 API를 통하여 실시간 데이터를 분석합니다.',
        'faq-q3': 'Q: 음식 추천 기준이 무엇인가요?', 'faq-a3': 'A: 기상 조건에 따른 심리적 변화를 고려한 전문적인 매칭 알고리즘을 사용합니다.',
        'blog-title': '로또 & 라이프 정보', 'blog-read-more': '상세 내용 보기',
        'blog-post1-title': '로또 당첨 확률을 높이는 전략?', 'blog-post1-excerpt': '모든 번호의 확률은 동일하지만, 조합의 패턴을 이해하면 선택의 즐거움이 배가됩니다.',
        'blog-post2-title': '비 오는 날 파전이 맛있는 이유', 'blog-post2-excerpt': '날씨와 식욕 사이의 숨겨진 과학적 연결 고리를 알아봅니다.',
        'contact-title': '파트너십 및 문의', 'contact-subtitle': '협업에 관심이 있거나 질문이 있으신가요? 아래 폼을 통해 메시지를 보내주세요.',
        'contact-name': '성함', 'contact-email': '이메일', 'contact-msg': '어떤 협업을 원하시나요?', 'contact-btn': '문의 보내기',
        'weather-title-suffix': '날씨예보 & 추천매뉴', 'weather-today': '오늘', 'weather-food-label': '추천 메뉴',
        'weather-loading': '실시간 기상 정보를 분석하여 맞춤 추천 메뉴를 생성하고 있습니다...', 'weather-error': '날씨 정보를 가져올 수 없습니다.'
    },
    en: {
        'blog-lotto-habits-title': 'Lucky Lotto Habits', 'blog-lotto-habits-excerpt': 'Simple habits to bring more luck into your lottery games.',
        'blog-lotto-habits-title': 'Lucky Lotto Habits', 'blog-lotto-habits-excerpt': 'Simple habits to bring more luck into your lottery games.',
        'nav-about': 'About', 'nav-how': 'How it Works', 'nav-contact': 'Contact', 'nav-faq': 'FAQ', 'nav-blog': 'Blog',
        'hero-title': 'Lotto Number Generator', 'hero-subtitle': 'Experience the most advanced and intuitive lucky number generator.',
        'gen-title': 'Lucky Numbers', 'gen-btn': 'Generate My Numbers',
        'game-title': 'Lotto 2048 Puzzle', 'game-start': 'Start 2048', 'game-over': 'Game Over!',
        'game-best': 'Best Score', 'game-retry': 'Try Again', 'game-instructions': 'Use <strong>Arrows</strong> or <strong>Swipe</strong> to merge.',
        'about-title': 'About LottoGen', 'about-text': 'LottoGen is a premium digital tool designed to help users generate random, unbiased lottery numbers. Our algorithm ensures equal probability for every number, providing a truly random experience for your favorite lottery games.',
        'about-text-detail': 'Beyond simple number generation, we aim to inspire and entertain. By analyzing real-time weather data for menu suggestions and providing brain-teasing puzzles, we support your daily lifestyle as an entertainment platform.',
        'how-title': 'How to Use', 'how-step1-title': 'Generate Numbers', 'how-step1': 'Click the "Generate My Numbers" button. Our system uses advanced RNG algorithms to instantly extract your luck.',
        'how-step2-title': 'Check Results', 'how-step2': 'Watch our algorithm select 6 unique numbers between 1 and 45. No duplicates, guaranteed.',
        'how-step3-title': 'Save & Share', 'how-step3': 'Use these lucky numbers for your next ticket! Share with friends or enjoy our built-in puzzles.',
        'faq-title': 'Frequently Asked Questions',
        'faq-q1': 'Q: Can I really win with these numbers?', 'faq-a1': 'A: While we can\'t guarantee a win, our algorithm follows real-world probability distributions. Good luck!',
        'faq-q2': 'Q: Where does weather data come from?', 'faq-a2': 'A: We use trusted global meteorological APIs to analyze real-time atmospheric conditions.',
        'faq-q3': 'Q: Why food recommendations?', 'faq-a3': 'A: We use psychological matching patterns between weather states and food cravings.',
        'blog-title': 'Insights & Tips', 'blog-read-more': 'Read Full Article',
        'blog-post1-title': 'Strategies for Winning Lotto?', 'blog-post1-excerpt': 'All numbers have equal odds, but understanding combinations adds a layer of fun to your choice.',
        'blog-post2-title': 'Science of Cravings & Rain', 'blog-post2-excerpt': 'Discover the fascinating link between sound frequencies and appetite.',
        'contact-title': 'Partnership & Inquiry', 'contact-subtitle': 'Interested in collaborating or have a question? Send us a message below.',
        'contact-name': 'Your Name', 'contact-email': 'Your Email', 'contact-msg': 'How can we collaborate?', 'contact-btn': 'Send Proposal',
        'weather-title-suffix': 'Weather Forecast & Menu', 'weather-today': 'Today', 'weather-food-label': 'Recommended',
        'weather-loading': 'Analyzing real-time weather to curate your perfect menu...', 'weather-error': 'Could not fetch weather forecast.'
    }
};

let currentLang = localStorage.getItem('lang') || 'ko';

function updateUI(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    if (langToggle) {
        langToggle.textContent = lang === 'ko' ? 'KR' : 'EN';
    }
}

// Language Toggle Event
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        localStorage.setItem('lang', currentLang);
        updateUI(currentLang);
        updateWeather(); // Refresh weather view with new titles
    });
}

// Initial Call
updateUI(currentLang);

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

    // Step 1: Get Coordinates
    try {
        if ("geolocation" in navigator) {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
        } else {
            throw new Error('Geolocation not supported');
        }
    } catch (e) {
        console.warn('Geolocation failed, trying IP fallback.');
        try {
            const locRes = await fetch('https://ipapi.co/json/');
            if (locRes.ok) {
                const data = await locRes.json();
                lat = data.latitude;
                lon = data.longitude;
            }
        } catch (ipErr) {
            console.warn('IP fallback failed.');
        }
    }

    // Step 1.5: Reverse Geocode to get specific name (Korean City Name)
    try {
        const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=ko`);
        if (revRes.ok) {
            const data = await revRes.json();
            const addr = data.address;
            
            // User requested "just the city", so prioritize city/town/village
            city = addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || addr.county || '내 주변';
            
            // Final cleanup for better readability
            city = city.replace('시', '').replace('군', '').trim();
        }
    } catch (revErr) {
        console.warn('Reverse geocoding failed:', revErr);
    }

    // Step 2: Fetch 4-Day Forecast from Open-Meteo
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`);
        if (!res.ok) throw new Error('Forecast API failed');
        const data = await res.json();
        displayForecast(data.daily, city);
    } catch (error) {
        console.error('Forecast update failed:', error);
        weatherCard.innerHTML = `<p class="error">${translations[currentLang]['weather-error']}</p>`;
    }
}

function displayForecast(daily, city) {
    const weatherCard = document.querySelector('.weather-card');
    if (!weatherCard) return;

    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
    const days = currentLang === 'ko' ? daysKo : daysEn;

    // Create the header and container first
    const titleSuffix = translations[currentLang]['weather-title-suffix'];
    weatherCard.innerHTML = `
        <h2 class="forecast-title">"${city}" ${titleSuffix}</h2>
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

        const todayLabel = translations[currentLang]['weather-today'];
        const foodLabel = translations[currentLang]['weather-food-label'];
        const daySuffix = currentLang === 'ko' ? '요일' : '';

        forecastHtml += `
            <div class="forecast-item ${isToday ? 'today' : ''}">
                <div class="forecast-date">${isToday ? todayLabel : dayName + daySuffix}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">
                    <span class="max">${maxTemp}°</span> / 
                    <span class="min">${minTemp}°</span>
                </div>
                <div class="forecast-food">
                    <span class="food-label">${foodLabel}</span>
                    <span class="food-name">${randomMenu}</span>
                </div>
            </div>
        `;
    });

    if (forecastList) {
        forecastList.innerHTML = forecastHtml;
    }
}

// Initial call
setTimeout(updateWeather, 500);
