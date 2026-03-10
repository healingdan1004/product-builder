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

// Weather Logic (Robust and Reliable)
async function updateWeather() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;

    try {
        // Set a timeout of 8 seconds to prevent hanging on "Loading..."
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch('https://wttr.in/?format=j1', {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Weather service error: ${response.status}`);
        }

        const data = await response.json();
        
        // Robust extraction with optional chaining and fallbacks
        const current = data?.current_condition?.[0];
        const area = data?.nearest_area?.[0];
        const city = area?.areaName?.[0]?.value || 'Location';
        const temp = current?.temp_C || '--';
        const desc = current?.weatherDesc?.[0]?.value || '';

        weatherInfo.textContent = `${city}: ${temp}°C${desc ? `, ${desc}` : ''}`;
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherInfo.textContent = 'Weather info unavailable';
    }
}

// Call updateWeather after initial DOM setup
updateWeather();
