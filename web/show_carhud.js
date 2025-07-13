// Show car HUD for testing
const carhud = document.querySelector('[carhud]');
if (carhud) {
    carhud.classList.remove('hidden');
    console.log('Car HUD shown');
    
    // Set test fuel level
    const fuelElement = document.querySelector('.carhud .fuel.element');
    if (fuelElement) {
        fuelElement.style.setProperty('--fill', '75%');
        fuelElement.style.setProperty('--under-fill', '25%');
        console.log('Fuel element found and styled');
    } else {
        console.log('Fuel element not found');
        console.log('Available elements:', document.querySelectorAll('.carhud *'));
    }
} else {
    console.log('Car HUD not found');
}
