const ipAddress = document.getElementsByTagName('p')[1];
const getStarted = document.getElementsByTagName('button')[0];

window.addEventListener('load', () => {
    try {
        getUserIPAddress();
    } catch (error) {
        alert('An error occurred:', error);
    }
})

getStarted.addEventListener('click', () => {

    window.location.href = 'main.html';

})

async function getUserIPAddress() {

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            ipAddress.textContent += data.ip;
            localStorage.setItem('ip', data.ip);
        }
    } catch (error) {
        alert('An error occurred:', error);
    }
}