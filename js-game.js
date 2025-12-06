// Game Objects - Grouped related functions

// GameMythic has been migrated to features/mythic/
// See features/mythic/ for the mythic decision making functionality

// GameDice has been migrated to features/dice/
// See features/dice/ for the dice rolling functionality

// GameCards - Card and glyph generation
const GameCards = {
  poker() {
    const joker = Math.floor(Math.random() * 54);
    let pokerCard = randomPick(pokerValues) + " of " + randomPick(pokerSuites);
    if (joker > 52) {
      pokerCard = randomPick(pokerJokers);
    }
    print(pokerCard);
  },

  tarot() {
    const arcana = Math.floor(Math.random() * 78);
    let tarotCard = randomPick(minorValues) + " of " + randomPick(minorSuites);
    if (arcana < 23) {
      tarotCard = randomPick(majorArcana);
    }
    print(tarotCard);
  },

  glyph() {
    // Check if glyphs and prefix are available
    if (typeof glyphs === 'undefined') {
      console.error("glyphs is not defined. Make sure data/game.js is loaded.");
      return;
    }
    if (typeof prefix === 'undefined') {
      console.error("prefix is not defined. Make sure data/game.js is loaded.");
      return;
    }
    if (typeof displayItems === 'undefined') {
      console.error("displayItems is not defined. Make sure js-utility.js is loaded.");
      return;
    }
    if (typeof renderDisplay === 'undefined') {
      console.error("renderDisplay is not defined. Make sure js-utility.js is loaded.");
      return;
    }
    
    const glyphNameA = randomPick(glyphs);
    const glyphNameB = randomPick(glyphs);
    const glyphNameC = randomPick(glyphs);
    
    const glyphA = prefix + glyphNameA + ".png";
    const glyphB = prefix + glyphNameB + ".png";
    const glyphC = prefix + glyphNameC + ".png";
    
    // Voeg glyphs toe aan display
    const newItem = {
      type: "glyph",
      glyphs: [glyphNameA, glyphNameB, glyphNameC],
      images: [glyphA, glyphB, glyphC],
      timestamp: Date.now()
    };
    
    // Markeer alle bestaande items als 'old'
    displayItems.forEach(item => {
      item.isOld = true;
    });
    
    // Voeg nieuw item toe aan begin van array (nieuwste eerst voor copy functionaliteit)
    displayItems.unshift(newItem);
    
    // Render alle items
    renderDisplay();
    
    // Scroll naar beneden voor nieuwe content
    const display = document.getElementById("display");
    if (display) {
      display.scrollTop = display.scrollHeight;
    }
  }
};

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

function poker() {
  GameCards.poker();
}

function tarot() {
  GameCards.tarot();
}

function displayImage() {
  GameCards.glyph();
}

function damageShowValue(newValue) {
  GameDamage.showValue(newValue);
}

function damage() {
  GameDamage.calculate();
}
