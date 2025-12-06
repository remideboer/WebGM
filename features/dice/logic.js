// Dice Rolling Logic
// Note: This file depends on shared utilities (print, randomPick) being available globally

const GameDice = {
  roll() {
    const diceSidesInput = document.getElementById("diceSides");
    const numDiceInput = document.getElementById("numDice");
    
    if (!diceSidesInput || !numDiceInput) {
      print("Error: Dice input fields not found");
      return;
    }
    
    const diceSides = parseInt(diceSidesInput.value) || 20;
    const numDice = parseInt(numDiceInput.value) || 1;
    
    // Validate inputs
    if (numDice <= 0) {
      print("Error - you can't roll " + numDice + " dice.");
      return;
    }
    
    if (diceSides < 2) {
      print("Error - dice can't have " + diceSides + " sides.");
      return;
    }
    
    // Roll dice
    if (numDice === 1) {
      const singleResult = Math.floor(Math.random() * diceSides) + 1;
      print(String(singleResult));
    } else {
      const rollResults = [];
      let diceTotal = 0;
      for (let i = 0; i < numDice; i++) {
        const randomNumber = Math.floor(Math.random() * diceSides) + 1;
        diceTotal += randomNumber;
        rollResults.push(randomNumber);
      }
      const results = rollResults.join(", ");
      print(results + " total: " + diceTotal);
    }
  },

  fudgeFate() {
    const ffValues = ["-", "0", "+"];
    const dieA = randomPick(ffValues);
    const dieB = randomPick(ffValues);
    const dieC = randomPick(ffValues);
    const dieD = randomPick(ffValues);
    const ffDice = [dieA, dieB, dieC, dieD];
    let ffTotal = 0;
    for (let i = 0; i < 4; i++) {
      if (ffDice[i] == "+") {
        ffTotal = ffTotal + 1;
      } else if (ffDice[i] == "-") {
        ffTotal = ffTotal - 1;
      }
    }
    const result = dieA + ", " + dieB + ", " + dieC + ", " + dieD + " total: " + ffTotal;
    print(result);
  }
};

