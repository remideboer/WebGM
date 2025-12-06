// Game Objects - Grouped related functions

// GameMythic has been migrated to features/mythic/
// See features/mythic/ for the mythic decision making functionality

// GameDice has been migrated to features/dice/
// See features/dice/ for the dice rolling functionality

// GameCards has been migrated to features/cards/
// See features/cards/ for the card and glyph generation functionality

// GameDamage - Damage calculation
const GameDamage = {
  showValue(newValue) {
    document.getElementById("danger").innerHTML = "danger level " + newValue;
  },

  calculate() {
    const hit = randomPick(area);
    
    // Get danger level from slider (0-10)
    const dangerLevel = parseInt(document.getElementById("damageSlider").value) || 1;
    
    // Calculate mean for bell curve based on danger level
    // severity array has 21 items (0-20), where lower index = more severe
    // danger 0 → mean ~18 (minor/negligible), danger 10 → mean ~1 (life-threatening/critical)
    // Map danger level 0-10 to severity index 18-1 (inverted)
    const mean = 18 - (dangerLevel * 1.7); // Maps 0-10 to ~18-1
    
    // Use bell curve distribution for more realistic results
    // stdDev of 3 gives a nice spread around the mean
    const severityIndex = bellCurvePick(mean, 3, severity.length);
    
    const mod = severity[severityIndex];
    print(mod + " hit to the " + hit);
  }
};

// Legacy function wrappers for backward compatibility with HTML onclick handlers
// Wrapper functions for mythic have been migrated to features/mythic/index.js
// Wrapper functions for dice have been migrated to features/dice/index.js
// Wrapper functions for cards have been migrated to features/cards/index.js

function damageShowValue(newValue) {
  GameDamage.showValue(newValue);
}

function damage() {
  GameDamage.calculate();
}
