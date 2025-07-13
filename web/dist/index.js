"use strict";
// Elements
const thirstElement = document.querySelector('[thirst]');
const hungerElement = document.querySelector('[hunger]');
const healthElement = document.querySelector('[health]');
const armorElement = document.querySelector('[armor]');
const voiceElement = document.querySelector('[voice]');
const carhud = document.querySelector('[carhud]');
const carhudClassic = document.querySelector('[carhudClassic]');
const districtElement = document.querySelector('[district]');
const rpmElement = document.querySelector('[rpm]');
const zoneElement = document.querySelector('[zone]');
const directionElements = document.querySelectorAll('[direction]');
const headingElement = document.querySelector('[heading]');
const streetElements = document.querySelectorAll('[street]');
const speedElements = document.querySelectorAll('[speed]');
const gearElement = document.querySelector('[gear]');
const tunroverBarElement = document.querySelector('[turnoverBar]');
const voiceRangeIndicator = document.querySelector('#voiceRangeIndicator');
const voiceRangeValue = document.querySelector('.range-value');
const fuelFillElement = document.querySelector('[fuel]');
const fuelPercentageElement = document.querySelector('[fuel-percentage]');

// Voice range indicator timer
let voiceRangeTimer = null;

// Functions
const setHudElement = (element, fill) => {
    if (!element) return; // Zabezpieczenie przed null
    const underFill = 60 - fill;
    element.style.setProperty('--fill', `${fill}%`);
    element.style.setProperty('--under-fill', `${underFill}%`);
};

const onUpdate = ({ data }) => {
    if (data.action !== 'updateHud')
        return;
    if (data.health) setHudElement(healthElement, data.health);
    
    // Armor visibility logic - show only when value > 0
    if (data.armor !== undefined && data.armor !== null) {
        setHudElement(armorElement, data.armor);
        if (data.armor > 0) {
            armorElement.classList.remove('hidden-armor');
        } else {
            armorElement.classList.add('hidden-armor');
        }
    }
    
    if (data.voice) setHudElement(voiceElement, data.voice);
    // NOWE:
    if (data.thirst !== undefined && data.thirst !== null) setHudElement(thirstElement, data.thirst);
    if (data.hunger !== undefined && data.hunger !== null) setHudElement(hungerElement, data.hunger);
};

const setValueForAll = (value, elements) => elements.forEach((e) => e.innerText = value);
const onVoiceActive = ({ data }) => {
    if (data.action !== 'updateIsTalking')
        return;
    if (data.isTalking) {
        voiceElement.classList.add('active');
    }
    else {
        voiceElement.classList.remove('active');
    }
};
const directions = {
    N: 'North',
    NW: 'North-West',
    W: 'West',
    SW: 'South-West',
    S: 'South',
    SE: 'South-East',
    E: 'East',
    NE: 'North-East',
};
const cache = {
    gear: 0
};

// Voice range indicator functions
const showVoiceRangeIndicator = (range) => {
    if (!voiceRangeIndicator || !voiceRangeValue) return;
    
    // Clear any existing timer
    if (voiceRangeTimer) {
        clearTimeout(voiceRangeTimer);
    }
    
    // Update the range value
    voiceRangeValue.textContent = `${range}m`;
    
    // Show the indicator
    voiceRangeIndicator.classList.remove('hidden');
    voiceRangeIndicator.classList.add('visible');
    
    // Hide after 1.5 seconds for more dynamic feel
    voiceRangeTimer = setTimeout(() => {
        voiceRangeIndicator.classList.remove('visible');
        voiceRangeIndicator.classList.add('hidden');
    }, 1500);
};

const onVoiceRange = ({ data }) => {
    if (data.action !== 'showVoiceRange') return;
    
    if (data.range) {
        showVoiceRangeIndicator(data.range);
    }
};
const onCarHudUpdate = ({ data }) => {
    var _a;
    if (data.action !== 'updateCarhud')
        return;
    if (data.isInVehicle != undefined && data.isInVehicle != null) {
        if (data.isInVehicle == true) {
            carhud.classList.remove('hidden');
            carhudClassic.classList.add('hidden'); // Only show the new modern car HUD
        }
        else {
            carhud.classList.add('hidden');
            carhudClassic.classList.add('hidden');
        }
    }
    if (data.direction) {
        setValueForAll(directions[data.direction], directionElements);
    }
    if (data.heading) {
        headingElement.style.transform = `rotate(${-45 + data.heading}deg)`;
    }
    if (data.street) {
        setValueForAll(data.street, streetElements);
    }
    if (data.speed) {
        setValueForAll(`${data.speed}`, speedElements);
    }
    if (data.gear) {
        gearElement.innerText = data.gear;
        cache.gear = data.gear;
    }
    if (data.tunrover) {
        let mappedEl = (data.tunrover / 100) * 75;
        tunroverBarElement.setAttribute('stroke-dasharray', `${mappedEl}, 100`);
    }
    if (data.district) {
        districtElement.innerHTML = `
            ${data.district.district} <span style="color: #aa18ff">/ ${data.district.zone}</span>
        `;
    }
    if (data.rpm) {
        rpmElement.innerHTML = data.rpm + ` rpm/<span class="stroked-text yellow">${cache.gear}</span>`;
    }
    if (data.fuel !== undefined && data.fuel !== null) {
        if (fuelFillElement && fuelPercentageElement) {
            fuelFillElement.style.height = `${data.fuel}%`;
            fuelPercentageElement.textContent = `${Math.round(data.fuel)}%`;
        }
    }
};
// Event listeners
window.addEventListener('message', onUpdate);
window.addEventListener('message', onVoiceActive);
window.addEventListener('message', onCarHudUpdate);
window.addEventListener('message', onVoiceRange);