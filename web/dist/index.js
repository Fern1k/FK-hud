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
    
    // Ensure fill is a valid number
    const fillValue = typeof fill === 'number' ? fill : parseFloat(fill) || 0;
    const underFill = 60 - fillValue;
    
    element.style.setProperty('--fill', `${fillValue}%`);
    element.style.setProperty('--under-fill', `${underFill}%`);
    console.log(`FK-HUD: Updated element with fill: ${fillValue}% (original: ${fill})`);
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

const setValueForAll = (value, elements) => {
    // Extract proper string value from objects if needed
    let displayValue;
    if (typeof value === 'object' && value !== null) {
        // Handle common object structures for better display
        if (value.name) {
            displayValue = value.name;
            console.log(`FK-HUD: Extracted value.name: "${displayValue}" from object:`, value);
        } else if (value.current !== undefined) {
            displayValue = value.current;
            console.log(`FK-HUD: Extracted value.current: "${displayValue}" from object:`, value);
        } else if (value.value !== undefined) {
            displayValue = value.value;
            console.log(`FK-HUD: Extracted value.value: "${displayValue}" from object:`, value);
        } else {
            displayValue = JSON.stringify(value);
            console.log(`FK-HUD: Warning - Object passed without known structure, using JSON:`, value);
        }
    } else {
        displayValue = value;
        console.log(`FK-HUD: Using direct value: "${displayValue}" (type: ${typeof value})`);
    }
    
    elements.forEach((e) => {
        if (e) {
            e.innerText = displayValue;
        } else {
            console.log('FK-HUD: Warning - Null element in setValueForAll');
        }
    });
};
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
        // Extract proper direction value if it's an object
        let directionValue;
        if (typeof data.direction === 'object' && data.direction !== null) {
            directionValue = data.direction.direction || data.direction.value || data.direction.name || JSON.stringify(data.direction);
            console.log(`FK-HUD: Extracted direction value "${directionValue}" from object:`, data.direction);
        } else {
            directionValue = String(data.direction);
            console.log(`FK-HUD: Using direct direction value: "${directionValue}"`);
        }
        
        const directionText = directions[directionValue] || directionValue;
        setValueForAll(directionText, directionElements);
        console.log(`FK-HUD: Direction updated to ${directionText} (from: ${directionValue})`);
    }
    
    if (data.heading) {
        if (headingElement) {
            headingElement.style.transform = `rotate(${-45 + data.heading}deg)`;
            console.log(`FK-HUD: Heading updated to ${data.heading} degrees`);
        }
    }
    
    if (data.street) {
        // Extract proper street name if it's an object
        let streetName;
        if (typeof data.street === 'object' && data.street !== null) {
            streetName = data.street.name || data.street.street || JSON.stringify(data.street);
            console.log(`FK-HUD: Extracted street name "${streetName}" from object:`, data.street);
        } else {
            streetName = String(data.street);
            console.log(`FK-HUD: Using direct street value: "${streetName}"`);
        }
        
        // Only update street in the new carhud (not classic) to avoid duplicates
        const newCarhudStreet = document.querySelector('.carhud [street]');
        if (newCarhudStreet) {
            newCarhudStreet.innerText = streetName;
            console.log(`FK-HUD: Street name updated to "${streetName}"`);
        } else {
            console.log('FK-HUD: Warning - Street element not found in new carhud');
        }
    }
    
    if (data.speed !== undefined && data.speed !== null) {
        // Extract proper speed value if it's an object
        let speedValue;
        if (typeof data.speed === 'object' && data.speed !== null) {
            speedValue = data.speed.value || data.speed.speed || JSON.stringify(data.speed);
            console.log(`FK-HUD: Extracted speed value "${speedValue}" from object:`, data.speed);
        } else {
            speedValue = String(data.speed);
            console.log(`FK-HUD: Using direct speed value: "${speedValue}"`);
        }
        
        setValueForAll(speedValue, speedElements);
        console.log(`FK-HUD: Speed updated to ${speedValue} km/h`);
    }
    
    if (data.gear !== undefined && data.gear !== null) {
        // Extract proper gear value if it's an object
        let gearValue;
        if (typeof data.gear === 'object' && data.gear !== null) {
            gearValue = data.gear.current || data.gear.gear || data.gear.value || JSON.stringify(data.gear);
            console.log(`FK-HUD: Extracted gear value "${gearValue}" from object:`, data.gear);
        } else {
            gearValue = String(data.gear);
            console.log(`FK-HUD: Using direct gear value: "${gearValue}"`);
        }
        
        setValueForAll(gearValue, gearElements);
        cache.gear = gearValue;
        console.log(`FK-HUD: Gear updated to "${gearValue}"`);
    }
    
    if (data.tunrover !== undefined && data.tunrover !== null) {
        // Extract proper RPM value if it's an object
        let rpmValue;
        if (typeof data.tunrover === 'object' && data.tunrover !== null) {
            rpmValue = data.tunrover.value || data.tunrover.rpm || parseFloat(JSON.stringify(data.tunrover)) || 0;
            console.log(`FK-HUD: Extracted RPM value "${rpmValue}" from object:`, data.tunrover);
        } else {
            rpmValue = parseFloat(data.tunrover) || 0;
            console.log(`FK-HUD: Using direct RPM value: "${rpmValue}"`);
        }
        
        let mappedEl = (rpmValue / 100) * 75;
        if (tunroverBarElement) {
            tunroverBarElement.setAttribute('stroke-dasharray', `${mappedEl}, 100`);
            console.log(`FK-HUD: RPM bar updated to ${rpmValue}% (mapped: ${mappedEl})`);
        } else {
            console.log('FK-HUD: Warning - RPM bar element not found');
        }
    }
    
    if (data.district) {
        // Extract proper district information
        let districtInfo;
        if (typeof data.district === 'object' && data.district !== null) {
            const districtName = data.district.district || data.district.name || 'Unknown District';
            const zoneName = data.district.zone || data.district.area || 'Unknown Zone';
            districtInfo = { district: districtName, zone: zoneName };
            console.log(`FK-HUD: Extracted district info:`, districtInfo);
        } else {
            districtInfo = { district: String(data.district), zone: 'Unknown Zone' };
            console.log(`FK-HUD: Using direct district value: "${data.district}"`);
        }
        
        if (districtElement) {
            districtElement.innerHTML = `
                ${districtInfo.district} <span style="color: #aa18ff">/ ${districtInfo.zone}</span>
            `;
            console.log(`FK-HUD: District updated to "${districtInfo.district} / ${districtInfo.zone}"`);
        } else {
            console.log('FK-HUD: Warning - District element not found');
        }
    }
    
    if (data.rpm !== undefined && data.rpm !== null) {
        // Extract proper RPM value if it's an object
        let rpmValue;
        if (typeof data.rpm === 'object' && data.rpm !== null) {
            rpmValue = data.rpm.value || data.rpm.rpm || parseFloat(JSON.stringify(data.rpm)) || 0;
            console.log(`FK-HUD: Extracted RPM display value "${rpmValue}" from object:`, data.rpm);
        } else {
            rpmValue = data.rpm;
            console.log(`FK-HUD: Using direct RPM display value: "${rpmValue}"`);
        }
        
        if (rpmElement) {
            rpmElement.innerHTML = rpmValue + ` rpm/<span class="stroked-text yellow">${cache.gear}</span>`;
            console.log(`FK-HUD: RPM display updated to ${rpmValue}`);
        } else {
            console.log('FK-HUD: Warning - RPM element not found');
        }
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