
const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers-container');
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle Logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

generateBtn.addEventListener('click', generateLottoNumbers);

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

// Weather Logic (API key-less)
async function updateWeather() {
    const weatherInfo = document.getElementById('weather-info');
    try {
        // wttr.in with j1 format returns location and weather in JSON
        const response = await fetch('https://wttr.in/?format=j1');
        const data = await response.json();
        
        const current = data.current_condition[0];
        const city = data.nearest_area[0].areaName[0].value;
        const temp = current.temp_C;
        const desc = current.weatherDesc[0].value;

        weatherInfo.textContent = `${city}: ${temp}°C, ${desc}`;
    } catch (error) {
        weatherInfo.textContent = 'Weather info unavailable';
        console.error('Weather fetch error:', error);
    }
}

updateWeather();
