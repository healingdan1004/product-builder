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
 * Weather Logic (Using OpenWeatherMap for high stability)
 * Note: For production, API keys should be handled via backend to prevent exposure.
 */
async function updateWeather() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;

    const API_KEY = 'd74348809d216a763a278b03ac5d1554';
    
    try {
        // Step 1: Get approximate location via IP (Privacy-friendly, no popup)
        const locResponse = await fetch('https://ipapi.co/json/');
        const locData = await locResponse.json();
        const city = locData.city || 'Seoul';

        // Step 2: Get weather data from OpenWeatherMap
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!weatherResponse.ok) {
            throw new Error(`Weather service responded with ${weatherResponse.status}`);
        }

        const data = await weatherResponse.json();
        
        // Data extraction
        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].main; // e.g., 'Clouds', 'Rain', 'Clear'
        const cityName = data.name;

        weatherInfo.textContent = `${cityName}: ${temp}°C, ${desc}`;
    } catch (error) {
        console.error('Weather update failed:', error);
        // Fallback to a simpler service or error message
        weatherInfo.textContent = 'Weather info unavailable';
    }
}

// Initialize weather update
updateWeather();
