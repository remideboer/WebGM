// Cards and Glyphs Logic
// Note: This file depends on data.js being loaded first (pokerValues, pokerSuites, etc.)
// and shared utilities (print, randomPick, displayItems, renderDisplay) being available globally

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
      console.error("glyphs is not defined. Make sure features/cards/data.js is loaded.");
      return;
    }
    if (typeof prefix === 'undefined') {
      console.error("prefix is not defined. Make sure features/cards/data.js is loaded.");
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

