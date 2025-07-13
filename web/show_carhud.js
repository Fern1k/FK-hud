// FK-HUD Test Implementation - Show car HUD for testing
console.log('FK-HUD: Test script (show_carhud.js) started');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('FK-HUD: DOM fully loaded, starting test implementation');
    
    const carhud = document.querySelector('[carhud]');
    if (carhud) {
        carhud.classList.remove('hidden');
        console.log('FK-HUD: Car HUD shown for testing');
        
        // Set test fuel level
        const fuelElement = document.querySelector('.carhud .fuel.element');
        if (fuelElement) {
            fuelElement.style.setProperty('--fill', '75%');
            fuelElement.style.setProperty('--under-fill', '25%');
            console.log('FK-HUD: Test fuel level set to 75%');
        } else {
            console.log('FK-HUD: Warning - Fuel element not found');
            console.log('FK-HUD: Available elements:', document.querySelectorAll('.carhud *'));
        }
        
        // Set test speed
        const speedElement = document.querySelector('[speed]');
        if (speedElement) {
            speedElement.innerText = '85';
            console.log('FK-HUD: Test speed set to 85 km/h');
        }
        
        // Set test gear
        const gearElement = document.querySelector('[gear]');
        if (gearElement) {
            gearElement.innerText = '3';
            console.log('FK-HUD: Test gear set to 3');
        }
        
        // Set test street name
        const streetElement = document.querySelector('.carhud [street]');
        if (streetElement) {
            streetElement.innerText = 'Test Street';
            console.log('FK-HUD: Test street name set to "Test Street"');
        }
        
        // Set test direction
        const directionElement = document.querySelector('.carhud [direction]');
        if (directionElement) {
            directionElement.innerText = 'North-East';
            console.log('FK-HUD: Test direction set to "North-East"');
        }
        
        // Simulate data updates every 2 seconds for testing
        setInterval(() => {
            console.log('FK-HUD: Simulating data update...');
            
            // Simulate speed change
            const randomSpeed = Math.floor(Math.random() * 120) + 20;
            if (speedElement) {
                speedElement.innerText = randomSpeed.toString();
                console.log(`FK-HUD: Simulated speed: ${randomSpeed} km/h`);
            }
            
            // Simulate gear change
            const gears = ['P', 'R', 'N', '1', '2', '3', '4', '5'];
            const randomGear = gears[Math.floor(Math.random() * gears.length)];
            if (gearElement) {
                gearElement.innerText = randomGear;
                console.log(`FK-HUD: Simulated gear: ${randomGear}`);
            }
            
            // Simulate fuel level change
            const randomFuel = Math.floor(Math.random() * 100);
            if (fuelElement) {
                fuelElement.style.setProperty('--fill', `${randomFuel}%`);
                fuelElement.style.setProperty('--under-fill', `${100 - randomFuel}%`);
                console.log(`FK-HUD: Simulated fuel: ${randomFuel}%`);
            }
            
        }, 2000);
        
    } else {
        console.log('FK-HUD: Error - Car HUD element not found');
    }
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('FK-HUD: DOM still loading, waiting for DOMContentLoaded');
} else {
    console.log('FK-HUD: DOM already loaded, running test immediately');
    // Run the same logic
    const carhud = document.querySelector('[carhud]');
    if (carhud && !carhud.classList.contains('test-initialized')) {
        carhud.classList.add('test-initialized');
        carhud.classList.remove('hidden');
        console.log('FK-HUD: Car HUD shown for testing (immediate)');
    }
}
