/**
 * @file datetime.js
 * @description Weather service with geolocation support
 * @copyright 2024
 */

class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.city = 'Milan'; // Default fallback city
        this.coords = null;
        this.initializeLocation();
    }

    async initializeLocation() {
        // try {
        //     // Try to get precise location first
        //     const position = await this.getCurrentPosition();
        //     this.coords = {
        //         lat: position.coords.latitude,
        //         lon: position.coords.longitude
        //     };
        //     const cityData = await this.getCityFromCoords(this.coords.lat, this.coords.lon);
        //     this.city = cityData.name;
        //     console.log(cityData)
        // } catch (error) {
        //     console.log('Falling back to IP-based location...');
            // Fallback to IP-based location
        try {
            const ipLocation = await this.getLocationFromIP();
            console.log(ipLocation)

            this.coords = {
                lat: ipLocation.lat,
                lon: ipLocation.lon
            };
            this.city = ipLocation.city;
        } catch (fallbackError) {
            console.error('Location detection failed:', fallbackError);
            // Keep default city if all location detection fails
        }
        // }
        // Initial weather update after location is set
        this.updateWeatherDisplay();
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }

    async getLocationFromIP() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('IP location fetch failed');
            const data = await response.json();
            return {
                city: data.city,
                lat: data.latitude,
                lon: data.longitude
            };
        } catch (error) {
            throw new Error('IP location service failed');
        }
    }

    async getCityFromCoords(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
            );
            if (!response.ok) throw new Error('Reverse geocoding failed');
            const [cityData] = await response.json();
            return cityData;
        } catch (error) {
            throw new Error('Failed to get city name from coordinates');
        }
    }

    async getWeather() {
        try {
            let url;
            if (this.coords) {
                // Use coordinates if available for more precise weather data
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.coords.lat}&lon=${this.coords.lon}&units=metric&appid=${this.apiKey}`;
            } else {
                // Fall back to city name
                url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Weather data fetch failed');
            }
            
            const data = await response.json();
            const weatherInfo = data.weather[0];
            const isNight = this.isNighttime(data.sys.sunset, data.sys.sunrise);
            
            return {
                temperature: Math.round(data.main.temp),
                description: weatherInfo.main,
                icon: this.getWeatherIcon(weatherInfo.id, isNight),
                city: data.name // Use the city name from weather data
            };
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    }

    isNighttime(sunset, sunrise) {
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime < sunrise || currentTime > sunset;
    }

    getWeatherIcon(weatherId, isNight) {
        // Map weather condition codes to our local SVG icons
        const iconMap = {
            // Thunderstorm
            200: 'thunderstorms', 201: 'thunderstorms', 202: 'thunderstorms',
            210: 'thunderstorms', 211: 'thunderstorms', 212: 'thunderstorms',
            221: 'thunderstorms', 230: 'thunderstorms', 231: 'thunderstorms',
            232: 'thunderstorms',
            
            // Drizzle and Rain
            300: 'rainy', 301: 'rainy', 302: 'rainy', 310: 'rainy', 311: 'rainy',
            312: 'rainy', 313: 'rainy', 314: 'rainy', 321: 'rainy', 500: 'rainy',
            501: 'rainy', 502: 'rainy', 503: 'rainy', 504: 'rainy', 511: 'rainy',
            520: 'rainy', 521: 'rainy', 522: 'rainy', 531: 'rainy',
            
            // Snow
            600: 'snow', 601: 'snow', 602: 'snow', 611: 'snow', 612: 'snow',
            613: 'snow', 615: 'snow', 616: 'snow', 620: 'snow', 621: 'snow',
            622: 'snow',
            
            // Atmosphere
            701: 'mist', 711: 'mist', 721: 'mist', 731: 'mist', 741: 'mist',
            751: 'mist', 761: 'mist', 762: 'mist', 771: 'mist', 781: 'mist',
            
            // Clear and Clouds
            800: isNight ? 'moon' : 'sun',
            801: 'cloudy', 802: 'cloudy', 803: 'cloudy', 804: 'cloudy'
        };

        const baseIcon = iconMap[weatherId] || 'sun';
        const timeOfDay = isNight ? '-night' : '-day';
        
        // Special cases that don't have day/night variants
        const noVariants = ['moon', 'sun'];
        const iconSuffix = noVariants.includes(baseIcon) ? '' : timeOfDay;
        
        return `assets/weathericons/${baseIcon}${iconSuffix}.svg`;
    }

    async updateWeatherDisplay() {
        const weatherData = await this.getWeather();
        if (weatherData) {
            const weatherElement = document.querySelector('.weather');
            if (!weatherElement) return;
            
            weatherElement.innerHTML = `
                <img src="${weatherData.icon}" alt="${weatherData.description}" class="weather-icon">
                <span>${weatherData.temperature}°C • ${weatherData.description} in ${weatherData.city}</span>
            `;
        }
    }

    // Manual location update method
    async setLocation(city) {
        this.city = city;
        this.coords = null; // Reset coordinates when manually setting city
        await this.updateWeatherDisplay();
    }
}

// Initialize weather service
const weatherService = new WeatherService('484654038fd35d098bd0b877f506184b');

// Update weather every 30 minutes
setInterval(() => weatherService.updateWeatherDisplay(), 1800000);