"use strict";

console.log('FK-HUD: Watermark script loaded and executing');

// Elements
const cashElement = document.querySelector('[cash]');
const timeElement = document.querySelector('[time]');
const playerServerIdElement = document.querySelector('[playerServerId]');

console.log('FK-HUD: Watermark DOM elements found:', {
    cashElement: !!cashElement,
    timeElement: !!timeElement,
    playerServerIdElement: !!playerServerIdElement
});
// Constants
const minute = 1000 * 60;
// Functions
const formatNumber = (number) => {
    const units = ["", "tyś", "mln", "mld", "bln", "bld"];
    const numberOfZeros = Math.floor(Math.log10(number) / 3);
    const unit = units[numberOfZeros];
    const formattedNumber = number / Math.pow(1000, numberOfZeros);
    const roundedNumber = Math.round(formattedNumber * 100) / 100;
    return (unit || unit === '') ? roundedNumber.toString().replace('.', ',') + " " + unit : number;
};
const onWatermarkUpdate = ({ data }) => {
    console.log('FK-HUD: Watermark update received:', data);
    
    if (data.action !== 'updateWatermark')
        return;
        
    if (data.cash && cashElement) {
        const formattedCash = formatNumber(data.cash);
        cashElement.innerText = `${formattedCash}`;
        console.log(`FK-HUD: Cash updated to ${formattedCash}`);
    }
    
    if (data.id && playerServerIdElement) {
        playerServerIdElement.innerText = data.id.toString();
        console.log(`FK-HUD: Player Server ID updated to ${data.id}`);
    }
};
const getTime = () => {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
};
const updateTime = () => {
    const time = getTime();
    if (timeElement) {
        timeElement.innerText = time;
        console.log(`FK-HUD: Time updated to ${time}`);
    } else {
        console.log('FK-HUD: Warning - Time element not found');
    }
};

// Functions Call & Intervals
console.log('FK-HUD: Initializing time updates...');
updateTime();
setInterval(updateTime, minute);
console.log('FK-HUD: Time update interval set to 1 minute');

// Event Listeners
console.log('FK-HUD: Setting up watermark event listeners...');
window.addEventListener('message', onWatermarkUpdate);
console.log('FK-HUD: Watermark event listeners registered successfully');
