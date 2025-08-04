// Weather App JavaScript

// OpenWeatherMap API key - you should replace this with your own key
const API_KEY = '4a48e1e1428fd83889074671fbf259d9'; // Demo key - replace with your own
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityElement = document.getElementById('city');
const tempElement = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const pressureElement = document.getElementById('pressure');
const forecastElement = document.getElementById('forecast');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search functionality
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
}

// Get current weather data
async function getWeatherData(city) {
    try {
        // Show loading state
        showLoadingState();
        
        // Get current weather
        const currentResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }
        const currentData = await currentResponse.json();
        
        // Get forecast data
        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available');
        }
        const forecastData = await forecastResponse.json();
        
        // Update UI with data
        updateCurrentWeather(currentData);
        updateForecast(forecastData);
    } catch (error) {
        descriptionElement.textContent = 'City not found. Please try again.';
        hideLoadingState();
        console.error('Error fetching weather data:', error);
    }
}

// Show loading state
function showLoadingState() {
    tempElement.textContent = '--';
    descriptionElement.textContent = 'Loading...';
    weatherIcon.src = '';
    feelsLikeElement.textContent = '--°';
    humidityElement.textContent = '--%';
    windSpeedElement.textContent = '-- km/h';
    pressureElement.textContent = '-- hPa';
    
    // Add loading class for animation
    document.querySelector('.weather-card').classList.add('loading');
}

// Hide loading state
function hideLoadingState() {
    document.querySelector('.weather-card').classList.remove('loading');
}

// Update current weather UI
function updateCurrentWeather(data) {
    cityElement.textContent = `${data.name}, ${data.sys.country}`;
    tempElement.textContent = Math.round(data.main.temp);
    descriptionElement.textContent = data.weather[0].description;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Update details
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    pressureElement.textContent = `${data.main.pressure} hPa`;
    
    // Hide loading state
    hideLoadingState();
}

// Update forecast UI
function updateForecast(data) {
    // Clear previous forecast
    forecastElement.innerHTML = '';
    
    // Group forecast by day (take one forecast per day)
    const dailyForecasts = {};
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Only add if we don't have a forecast for this day yet
        // and it's not today (we're showing future forecasts)
        if (!dailyForecasts[day] && date > new Date()) {
            dailyForecasts[day] = forecast;
        }
    });
    
    // Create forecast items (limit to 5 days)
    let count = 0;
    for (const day in dailyForecasts) {
        if (count >= 5) break;
        
        const forecast = dailyForecasts[day];
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°</div>
        `;
        
        forecastElement.appendChild(forecastItem);
        count++;
    }
}

// Initialize with a default city
window.addEventListener('load', () => {
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            () => {
                // Default to a city if location access is denied
                getWeatherData('London');
            }
        );
    } else {
        // Default to a city if geolocation is not supported
        getWeatherData('London');
    }
});

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
    try {
        // Show loading state
        showLoadingState();
        
        // Get current weather
        const currentResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!currentResponse.ok) {
            throw new Error('Weather data not available');
        }
        const currentData = await currentResponse.json();
        
        // Get forecast data
        const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available');
        }
        const forecastData = await forecastResponse.json();
        
        // Update UI with data
        updateCurrentWeather(currentData);
        updateForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        getWeatherData('London'); // Fallback to default city
    }
}