/**
 * @file datetime.js
 * @description 
 * @author 
 * @copyright 
 */


class TimeGreeting {
    constructor() {
        this.greetingElement = document.querySelector('.greeting');
        this.dateElement = document.querySelector('.date');
        this.timeElement = document.querySelector('.time');
        this.userName = 'Francesca'; // Could be made configurable
    }

    getGreeting(hour) {
        if (hour >= 5 && hour < 12) return 'Good morning';
        if (hour >= 12 && hour < 17) return 'Good afternoon';
        if (hour >= 17 && hour < 24) return 'Good evening';
        return 'Good night';
    }

    formatDate(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour12: false
        };
        
        return date.toLocaleDateString('en-US', options);
    }
    
    formatTime(date) {
        const options = {
            weekday: false,
            year: false,
            month: false,
            day: false,
            hour: '2-digit',
            minute: '2-digit',  
            hour12: false
        };
        
        return date.toLocaleDateString('en-US', options);
    }

    update() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Update greeting
        const greeting = this.getGreeting(currentHour);
        this.greetingElement.textContent = `${greeting}, ${this.userName}`;

        // Update date and time
        this.dateElement.textContent = this.formatDate(now);
        this.timeElement.textContent = currentHour + ':' + (currentMinute < 10 ? '0' : '') + currentMinute;
    }

    startUpdates() {
        // Update immediately
        this.update();

        // Update every minute
        setInterval(() => this.update(), 60000);
    }
}

// Initialize and start the updates
const timeGreeting = new TimeGreeting();
timeGreeting.startUpdates();