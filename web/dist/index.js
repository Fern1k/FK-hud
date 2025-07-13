"use strict";

console.log('FK-HUD: Main script loaded and executing');

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
const gearElements = document.querySelectorAll('[gear]');
const tunroverBarElement = document.querySelector('[turnoverBar]');
const fuelElement = document.querySelector('[fuel]');

// Log DOM element availability
console.log('FK-HUD: DOM Elements found:', {
    thirstElement: !!thirstElement,
    hungerElement: !!hungerElement,
    healthElement: !!healthElement,
    armorElement: !!armorElement,
    voiceElement: !!voiceElement,
    carhud: !!carhud,
    carhudClassic: !!carhudClassic,
    fuelElement: !!fuelElement,
    streetElements: streetElements.length,
    speedElements: speedElements.length,
    gearElements: gearElements.length,
    directionElements: directionElements.length
});

// Functions
const setHudElement = (element, fill) => {
    if (!element) {
        console.log('FK-HUD: Warning - setHudElement called with null element');
        return; // Zabezpieczenie przed null
    }
    const underFill = 60 - fill;
    element.style.setProperty('--fill', `${fill}%`);
    element.style.setProperty('--under-fill', `${underFill}%`);
    console.log(`FK-HUD: Updated element with fill: ${fill}%`);
};

const onUpdate = ({ data }) => {
    console.log('FK-HUD: Received HUD update:', data);
    
    if (data.action !== 'updateHud')
        return;
        
    if (data.health) {
        setHudElement(healthElement, data.health);
        console.log(`FK-HUD: Health updated to ${data.health}`);
    }
    
    // Armor visibility logic - show only when value > 0
    if (data.armor !== undefined && data.armor !== null) {
        setHudElement(armorElement, data.armor);
        if (data.armor > 0) {
            armorElement.classList.remove('hidden-armor');
            console.log(`FK-HUD: Armor shown with value ${data.armor}`);
        } else {
            armorElement.classList.add('hidden-armor');
            console.log('FK-HUD: Armor hidden (value is 0)');
        }
    }
    
    if (data.voice) {
        setHudElement(voiceElement, data.voice);
        console.log(`FK-HUD: Voice updated to ${data.voice}`);
    }
    
    // NOWE:
    if (data.thirst !== undefined && data.thirst !== null) {
        setHudElement(thirstElement, data.thirst);
        console.log(`FK-HUD: Thirst updated to ${data.thirst}`);
    }
    if (data.hunger !== undefined && data.hunger !== null) {
        setHudElement(hungerElement, data.hunger);
        console.log(`FK-HUD: Hunger updated to ${data.hunger}`);
    }
};

const setValueForAll = (value, elements) => elements.forEach((e) => e.innerText = value);
const onVoiceActive = ({ data }) => {
    console.log('FK-HUD: Voice activity update:', data);
    
    if (data.action !== 'updateIsTalking')
        return;
        
    if (data.isTalking) {
        voiceElement.classList.add('active');
        console.log('FK-HUD: Voice set to active (talking)');
    }
    else {
        voiceElement.classList.remove('active');
        console.log('FK-HUD: Voice set to inactive (not talking)');
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
const onCarHudUpdate = ({ data }) => {
    console.log('FK-HUD: Car HUD update received:', data);
    
    var _a;
    if (data.action !== 'updateCarhud')
        return;
        
    if (data.isInVehicle != undefined && data.isInVehicle != null) {
        if (data.isInVehicle == true) {
            carhud.classList.remove('hidden');
            carhudClassic.classList.add('hidden'); // Only show the new modern car HUD
            console.log('FK-HUD: Car HUD shown (entered vehicle)');
        }
        else {
            carhud.classList.add('hidden');
            carhudClassic.classList.add('hidden');
            console.log('FK-HUD: Car HUD hidden (exited vehicle)');
        }
    }
    
    if (data.direction) {
        setValueForAll(directions[data.direction], directionElements);
        console.log(`FK-HUD: Direction updated to ${directions[data.direction]}`);
    }
    
    if (data.heading) {
        if (headingElement) {
            headingElement.style.transform = `rotate(${-45 + data.heading}deg)`;
            console.log(`FK-HUD: Heading updated to ${data.heading} degrees`);
        }
    }
    
    if (data.street) {
        // Only update street in the new carhud (not classic) to avoid duplicates
        const newCarhudStreet = document.querySelector('.carhud [street]');
        if (newCarhudStreet) {
            newCarhudStreet.innerText = data.street;
            console.log(`FK-HUD: Street name updated to "${data.street}"`);
        } else {
            console.log('FK-HUD: Warning - Street element not found in new carhud');
        }
    }
    
    if (data.speed) {
        setValueForAll(`${data.speed}`, speedElements);
        console.log(`FK-HUD: Speed updated to ${data.speed} km/h`);
    }
    
    if (data.gear) {
        setValueForAll(data.gear, gearElements);
        cache.gear = data.gear;
        console.log(`FK-HUD: Gear updated to "${data.gear}"`);
    }
    
    if (data.tunrover) {
        let mappedEl = (data.tunrover / 100) * 75;
        tunroverBarElement.setAttribute('stroke-dasharray', `${mappedEl}, 100`);
        console.log(`FK-HUD: RPM bar updated to ${data.tunrover}% (mapped: ${mappedEl})`);
    }
    
    if (data.district) {
        districtElement.innerHTML = `
            ${data.district.district} <span style="color: #aa18ff">/ ${data.district.zone}</span>
        `;
        console.log(`FK-HUD: District updated to "${data.district.district} / ${data.district.zone}"`);
    }
    
    if (data.rpm) {
        rpmElement.innerHTML = data.rpm + ` rpm/<span class="stroked-text yellow">${cache.gear}</span>`;
        console.log(`FK-HUD: RPM updated to ${data.rpm}`);
    }
    
    if (data.fuel !== undefined && data.fuel !== null) {
        if (fuelElement) {
            setHudElement(fuelElement, data.fuel);
            console.log(`FK-HUD: Fuel updated to ${data.fuel}%`);
        } else {
            console.log('FK-HUD: Warning - Fuel element not found');
        }
    }
};
// Event listeners
console.log('FK-HUD: Setting up event listeners...');
window.addEventListener('message', onUpdate);
window.addEventListener('message', onVoiceActive);
window.addEventListener('message', onCarHudUpdate);
console.log('FK-HUD: Event listeners registered successfully');