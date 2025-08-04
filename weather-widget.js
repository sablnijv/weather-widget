/**
 * Weather Widget - A self-contained weather component
 * Can be easily integrated into any webpage
 */

class WeatherWidget {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            apiKey: '4a48e1e1428fd83889074671fbf259d9', // Demo key - replace with your own
            defaultCity: 'London',
            units: 'metric',
            enableGeolocation: true,
            theme: 'light', // 'light' or 'dark'
            ...options
        };
        
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error(`WeatherWidget: Container with id "${this.containerId}" not found`);
            return;
        }
        
        this.render();
        this.applyTheme();
        this.setupEventListeners();
        this.loadInitialWeather();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="weather-widget">
                <div class="weather-header">
                    <h2>Weather Forecast</h2>
                    <div class="search-container">
                        <input type="text" class="city-input" placeholder="Enter city name...">
                        <button class="search-btn">Search</button>
                    </div>
                </div>
                
                <div class="weather-display">
                    <div class="current-weather">
                        <div class="city-name">
                            <h3 class="city">City Name</h3>
                        </div>
                        
                        <div class="weather-main">
                            <div class="temperature">
                                <span class="temp">--</span>
                                <span class="temp-unit">°${this.options.units === 'metric' ? 'C' : 'F'}</span>
                            </div>
                            <div class="weather-icon">
                                <img class="weather-icon-img" src="" alt="Weather icon">
                            </div>
                        </div>
                        
                        <div class="weather-description">
                            <div class="description">--</div>
                        </div>
                        
                        <div class="weather-details">
                            <div class="detail">
                                <span class="label">Feels like</span>
                                <span class="feels-like value">--°</span>
                            </div>
                            <div class="detail">
                                <span class="label">Humidity</span>
                                <span class="humidity value">--%</span>
                            </div>
                            <div class="detail">
                                <span class="label">Wind</span>
                                <span class="wind-speed value">-- ${this.options.units === 'metric' ? 'km/h' : 'mph'}</span>
                            </div>
                            <div class="detail">
                                <span class="label">Pressure</span>
                                <span class="pressure value">-- hPa</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="forecast-container">
                        <h4>5-Day Forecast</h4>
                        <div class="forecast" id="forecast-${this.containerId}">
                            <!-- Forecast items will be added here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    applyTheme() {
        const widgetElement = this.container.querySelector('.weather-widget');
        if (this.options.theme === 'dark') {
            widgetElement.classList.add('dark-theme');
        } else {
            widgetElement.classList.remove('dark-theme');
        }
    }
    
    setupEventListeners() {
        const searchBtn = this.container.querySelector('.search-btn');
        const cityInput = this.container.querySelector('.city-input');
        
        searchBtn.addEventListener('click', () => this.handleSearch());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }
    
    handleSearch() {
        const cityInput = this.container.querySelector('.city-input');
        const city = cityInput.value.trim();
        if (city) {
            this.getWeatherData(city);
        }
    }
    
    async getWeatherData(city) {
        try {
            this.showLoadingState();
            
            // Get current weather
            const currentResponse = await fetch(
                `${this.baseUrl}/weather?q=${city}&appid=${this.options.apiKey}&units=${this.options.units}`
            );
            
            if (!currentResponse.ok) {
                throw new Error('City not found');
            }
            
            const currentData = await currentResponse.json();
            
            // Get forecast data
            const forecastResponse = await fetch(
                `${this.baseUrl}/forecast?q=${city}&appid=${this.options.apiKey}&units=${this.options.units}`
            );
            
            if (!forecastResponse.ok) {
                throw new Error('Forecast data not available');
            }
            
            const forecastData = await forecastResponse.json();
            
            // Update UI with data
            this.updateCurrentWeather(currentData);
            this.updateForecast(forecastData);
        } catch (error) {
            this.showError('City not found. Please try again.');
            console.error('Error fetching weather data:', error);
        }
    }
    
    showLoadingState() {
        const tempElement = this.container.querySelector('.temp');
        const descriptionElement = this.container.querySelector('.description');
        const weatherIcon = this.container.querySelector('.weather-icon-img');
        
        tempElement.textContent = '--';
        descriptionElement.textContent = 'Loading...';
        weatherIcon.src = '';
        
        // Add loading class for animation
        const weatherDisplay = this.container.querySelector('.weather-display');
        weatherDisplay.classList.add('loading');
    }
    
    hideLoadingState() {
        const weatherDisplay = this.container.querySelector('.weather-display');
        weatherDisplay.classList.remove('loading');
    }
    
    updateCurrentWeather(data) {
        const cityElement = this.container.querySelector('.city');
        const tempElement = this.container.querySelector('.temp');
        const descriptionElement = this.container.querySelector('.description');
        const weatherIcon = this.container.querySelector('.weather-icon-img');
        const feelsLikeElement = this.container.querySelector('.feels-like');
        const humidityElement = this.container.querySelector('.humidity');
        const windSpeedElement = this.container.querySelector('.wind-speed');
        const pressureElement = this.container.querySelector('.pressure');
        
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
        
        // Convert wind speed to km/h if metric, mph if imperial
        const windSpeed = this.options.units === 'metric' 
            ? (data.wind.speed * 3.6).toFixed(1) 
            : (data.wind.speed * 2.237).toFixed(1);
        windSpeedElement.textContent = `${windSpeed} ${this.options.units === 'metric' ? 'km/h' : 'mph'}`;
        
        pressureElement.textContent = `${data.main.pressure} hPa`;
        
        this.hideLoadingState();
    }
    
    updateForecast(data) {
        const forecastElement = this.container.querySelector(`#forecast-${this.containerId}`);
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
    
    showError(message) {
        const descriptionElement = this.container.querySelector('.description');
        descriptionElement.textContent = message;
        this.hideLoadingState();
    }
    
    async loadInitialWeather() {
        if (this.options.enableGeolocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.getWeatherByCoords(latitude, longitude);
                },
                () => {
                    // Default to a city if location access is denied
                    this.getWeatherData(this.options.defaultCity);
                }
            );
        } else {
            // Default to a city if geolocation is not supported
            this.getWeatherData(this.options.defaultCity);
        }
    }
    
    async getWeatherByCoords(lat, lon) {
        try {
            this.showLoadingState();
            
            // Get current weather
            const currentResponse = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.options.apiKey}&units=${this.options.units}`
            );
            
            if (!currentResponse.ok) {
                throw new Error('Weather data not available');
            }
            
            const currentData = await currentResponse.json();
            
            // Get forecast data
            const forecastResponse = await fetch(
                `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.options.apiKey}&units=${this.options.units}`
            );
            
            if (!forecastResponse.ok) {
                throw new Error('Forecast data not available');
            }
            
            const forecastData = await forecastResponse.json();
            
            // Update UI with data
            this.updateCurrentWeather(currentData);
            this.updateForecast(forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.getWeatherData(this.options.defaultCity); // Fallback to default city
        }
    }
    
    // Method to change theme after initialization
    setTheme(theme) {
        this.options.theme = theme;
        this.applyTheme();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherWidget;
}