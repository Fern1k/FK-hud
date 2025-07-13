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
        
        // Set initial test direction
        const directionElement = document.querySelector('.carhud [direction]');
        if (directionElement) {
            directionElement.innerText = 'North-East';
            console.log('FK-HUD: Test direction set to "North-East"');
        }
        
        console.log('FK-HUD: Enhanced testing with multiple data scenarios started...');
        
        // Simulate data updates every 2 seconds for testing
        let testCycle = 0;
        setInterval(() => {
            console.log(`FK-HUD: Simulating data update cycle ${testCycle}...`);
            
            // Test different data scenarios to ensure compatibility
            switch(testCycle % 4) {
                case 0:
                    // Normal string/number data
                    const randomSpeed = Math.floor(Math.random() * 120) + 20;
                    const gears = ['P', 'R', 'N', '1', '2', '3', '4', '5'];
                    const randomGear = gears[Math.floor(Math.random() * gears.length)];
                    const randomFuel = Math.floor(Math.random() * 100);
                    
                    window.postMessage({
                        data: {
                            action: 'updateCarhud',
                            isInVehicle: true,
                            speed: randomSpeed,
                            gear: randomGear,
                            fuel: randomFuel,
                            street: 'Test Street ' + Math.floor(Math.random() * 10),
                            direction: 'N'
                        }
                    }, '*');
                    
                    console.log(`FK-HUD: Test cycle ${testCycle} - Normal data: speed=${randomSpeed}, gear=${randomGear}, fuel=${randomFuel}`);
                    break;
                    
                case 1:
                    // Test with object data (should extract properly now)
                    window.postMessage({
                        data: {
                            action: 'updateCarhud',
                            speed: { value: 75, unit: 'km/h' },
                            gear: { current: 4, max: 5 },
                            fuel: { level: 60, capacity: 100 },
                            street: { name: 'Object Street', id: 123 }
                        }
                    }, '*');
                    
                    console.log(`FK-HUD: Test cycle ${testCycle} - Object data test`);
                    break;
                    
                case 2:
                    // Test with mixed data types
                    window.postMessage({
                        data: {
                            action: 'updateCarhud',
                            speed: '90',  // String number
                            gear: 3,      // Number
                            fuel: 45.5,   // Float
                            street: 'Mixed Type Street',
                            rpm: 2500,
                            tunrover: 65
                        }
                    }, '*');
                    
                    console.log(`FK-HUD: Test cycle ${testCycle} - Mixed data types test`);
                    break;
                    
                case 3:
                    // Test edge cases
                    window.postMessage({
                        data: {
                            action: 'updateCarhud',
                            speed: 0,
                            gear: 'P',
                            fuel: 0,
                            street: '',
                            direction: 'NE'
                        }
                    }, '*');
                    
                    console.log(`FK-HUD: Test cycle ${testCycle} - Edge cases test`);
                    break;
            }
            
            testCycle++;
        }, 3000);
        
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
