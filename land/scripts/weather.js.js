/**
 * @file datetime.js
 * @description 
 * @author 
 * @copyright 
 */


class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.city = 'Milan'; // Default city
    }

    async getWeather() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Weather data fetch failed');
            }

            const data = await response.json();
            return {
                temperature: Math.round(data.main.temp),
                description: data.weather[0].main,
                icon: this.getWeatherIcon(data.weather[0].icon)
            };
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    }

    getWeatherIcon(code) {
        // Map OpenWeather icons to local SVG icons
        const iconMap = {
            '01d': 'sun',
            '01n': 'moon',
            '02d': 'partly-cloudy-day',
            '02n': 'partly-cloudy-night',
            '03d': 'cloudy',
            '03n': 'cloudy',
            '04d': 'cloudy',
            '04n': 'cloudy',
            '09d': 'rain',
            '09n': 'rain',
            '10d': 'rain',
            '10n': 'rain',
            '11d': 'thunderstorm',
            '11n': 'thunderstorm',
            '13d': 'snow',
            '13n': 'snow',
            '50d': 'mist',
            '50n': 'mist'
        };
        
        return `weathericons/${iconMap[code] || 'sun'}.svg`;
    }

    async updateWeatherDisplay() {
        const weatherData = await this.getWeather();
        if (weatherData) {
            const weatherElement = document.querySelector('.weather');
            const weatherIcon = weatherElement.querySelector('.weather-icon');
            
            weatherIcon.src = weatherData.icon;
            weatherIcon.alt = weatherData.description;
            
            weatherElement.innerHTML = `
                <img src="${weatherData.icon}" alt="${weatherData.description}" class="weather-icon">
                ${weatherData.temperature}°C • ${weatherData.description} in ${this.city}
            `;
        }
    }
}

// Initialize weather service
const weatherService = new WeatherService('484654038fd35d098bd0b877f506184b');

// Update weather initially and every 30 minutes
weatherService.updateWeatherDisplay();
setInterval(() => weatherService.updateWeatherDisplay(), 1800000);