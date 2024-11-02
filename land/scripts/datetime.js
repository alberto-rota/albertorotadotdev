/**
 * @file datetime.js
 * @description 
 * @author 
 * @copyright 
 */


function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const dateTimeString = now.toLocaleDateString('en-US', options);
    document.querySelector('.datetime').textContent = dateTimeString;
}

// Update every minute
updateDateTime();
setInterval(updateDateTime, 60000);