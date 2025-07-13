// Test script to reproduce [object Object] issue
console.log('Testing object rendering issues...');

// Simulate problematic data that could cause [object Object]
window.postMessage({
    data: {
        action: 'updateCarhud',
        street: { name: 'Main Street', id: 123 }, // This would cause [object Object]
        speed: { value: 50, unit: 'km/h' },        // This would cause [object Object]
        gear: { current: 3, max: 5 }               // This would cause [object Object]
    }
}, '*');

setTimeout(() => {
    console.log('Testing with proper string values...');
    window.postMessage({
        data: {
            action: 'updateCarhud',
            street: 'Proper Street Name',
            speed: 60,
            gear: 4
        }
    }, '*');
}, 2000);
