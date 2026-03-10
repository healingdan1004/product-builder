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
 * Weather Logic (Highly Robust Version)
 */
async function updateWeather() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;

    const API_KEY = 'd74348809d216a763a278b03ac5d1554';
    let city = 'Seoul'; // Default fallback

    try {
        // Step 1: Attempt to get location via IP with a short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            const locResponse = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            if (locResponse.ok) {
                const locData = await locResponse.json();
                if (locData.city) city = locData.city;
            }
        } catch (e) {
            console.warn('Location fetch failed or timed out, using default city.');
        } finally {
            clearTimeout(timeoutId);
        }

        // Step 2: Get weather data from OpenWeatherMap
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!weatherResponse.ok) {
            // If the city from IP is invalid, try one more time with default Seoul
            if (city !== 'Seoul') {
                const retryResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric`
                );
                if (retryResponse.ok) {
                    const retryData = await retryResponse.json();
                    displayWeatherData(retryData, weatherInfo);
                    return;
                }
            }
            throw new Error(`Weather service error: ${weatherResponse.status}`);
        }

        const data = await weatherResponse.json();
        displayWeatherData(data, weatherInfo);

    } catch (error) {
        console.error('Weather update failed:', error);
        weatherInfo.textContent = 'Weather info unavailable';
    }
}

function displayWeatherData(data, element) {
    if (!data || !data.main || !data.weather) return;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].main;
    const cityName = data.name;
    element.textContent = `${cityName}: ${temp}°C, ${desc}`;
}

// Initialize weather update after a short delay to ensure DOM stability
setTimeout(updateWeather, 500);
