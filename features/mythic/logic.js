// Mythic GM Decision Logic
// Note: This file depends on data.js being loaded first (mythicTable, oddsLabels)
// and shared utilities (print, showMessage) being available globally

const GameMythic = {
  /**
   * Pure function: Gets the table cell value for given odds and chaos factor
   * @param {number} oddsIndex - Index of the odds (0-8)
   * @param {number} chaosFactor - Chaos factor (1-9)
   * @returns {Array|null} The table cell [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] or null if invalid
   */
  getTableValue(oddsIndex, chaosFactor) {
    if (oddsIndex < 0 || oddsIndex >= mythicTable.length) {
      return null;
    }
    const chaosIndex = chaosFactor - 1; // Convert 1-9 to 0-8
    if (chaosIndex < 0 || chaosIndex >= mythicTable[oddsIndex].length) {
      return null;
    }
    return mythicTable[oddsIndex][chaosIndex];
  },

  /**
   * Pure function: Calculates the Mythic GM result based on roll and table values
   * @param {number} roll - The d100 roll result (1-100)
   * @param {number|null} exceptionalYesThreshold - Lower threshold for Exceptional Yes
   * @param {number} yesTarget - The Yes target (roll ≤ this = Yes)
   * @param {number|null} exceptionalNoThreshold - Upper threshold for Exceptional No
   * @returns {Object} Object with {result: string, resultType: string}
   */
  calculateResult(roll, exceptionalYesThreshold, yesTarget, exceptionalNoThreshold) {
    // Validate inputs
    if (roll < 1 || roll > 100) {
      throw new Error("Roll must be between 1 and 100");
    }
    if (yesTarget < 1 || yesTarget > 100) {
      throw new Error("Yes target must be between 1 and 100");
    }
    
    let result = "";
    let resultType = "";
    
    // Mythic GM 2e logic:
    // - bold (yesTarget) is the Yes target: roll ≤ yesTarget = Yes, roll > yesTarget = No
    // - min (exceptionalYesThreshold) is the Exceptional Yes threshold (bottom 20% of Yes range)
    // - max (exceptionalNoThreshold) is the Exceptional No threshold (upper band of No range)
    
    if (exceptionalYesThreshold === null) {
      // Special case: x **1** threshold (Impossible/Very Unlikely with low CF)
      // Yes target = 1, so roll 1 = Yes, roll 2-100 = No
      if (roll <= yesTarget) {
        // Roll 1 = Exceptional Yes (Yes, and...) - this is the only Yes result
        result = "Yes, and...";
        resultType = "yes-and";
      } else {
        // Roll 2-100 = No
        if (exceptionalNoThreshold !== null && roll > exceptionalNoThreshold) {
          result = "No, and...";
          resultType = "no-and";
        } else {
          result = "No";
          resultType = "no";
        }
      }
    } else if (exceptionalNoThreshold === null) {
      // Special case: threshold **99** x (Certain with high CF)
      // Yes target = 99, so roll 1-99 = Yes, roll 100 = No
      if (roll <= yesTarget) {
        // Roll 1-99 = Yes
        if (roll <= exceptionalYesThreshold) {
          result = "Yes, and...";
          resultType = "yes-and";
        } else {
          result = "Yes";
          resultType = "yes";
        }
      } else {
        // Roll 100 = Exceptional No (No, and...)
        result = "No, and...";
        resultType = "no-and";
      }
    } else {
      // Normal case: [exceptionalYesThreshold] **[yesTarget]** [exceptionalNoThreshold]
      // First determine Yes/No based on yesTarget
      if (roll <= yesTarget) {
        // Yes range: 1 to yesTarget
        if (roll <= exceptionalYesThreshold) {
          result = "Yes, and...";
          resultType = "yes-and";
        } else {
          result = "Yes";
          resultType = "yes";
        }
      } else {
        // No range: (yesTarget + 1) to 100
        if (roll > exceptionalNoThreshold) {
          result = "No, and...";
          resultType = "no-and";
        } else {
          result = "No";
          resultType = "no";
        }
      }
    }
    
    return { result, resultType };
  },

  /**
   * Pure function: Formats the output string for display
   * @param {string} result - The result string (YES, NO, YES AND, NO AND)
   * @param {number} oddsIndex - Index of the odds (0-8)
   * @param {number} chaosFactor - Chaos factor (1-9)
   * @param {number} roll - The d100 roll result
   * @param {Array} tableCell - The table cell [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold]
   * @returns {string} Formatted output string
   */
  formatOutput(result, oddsIndex, chaosFactor, roll, tableCell) {
    const [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] = tableCell;
    const oddsLabel = oddsLabels[oddsIndex];
    const rangeStr = exceptionalYesThreshold !== null ? exceptionalYesThreshold : 'x';
    const rangeStr2 = exceptionalNoThreshold !== null ? exceptionalNoThreshold : 'x';
    return `${result} (Odds: ${oddsLabel}, CF: ${chaosFactor}, Roll: ${roll}, Range: ${rangeStr}-${yesTarget}-${rangeStr2})`;
  },

  /**
   * Main function: Handles DOM interaction and calls pure functions
   * This function is not easily testable but delegates to testable pure functions
   */
  decision() {
    const oddsIndex = parseInt(document.getElementById("oddsSelect").value);
    const chaosFactor = parseInt(document.getElementById("chaosFactor").value);
    
    // Get table value
    const tableCell = this.getTableValue(oddsIndex, chaosFactor);
    if (!tableCell) {
      print("Error: Invalid odds or chaos factor");
      return;
    }
    
    const [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] = tableCell;
    
    // Roll d100
    const roll = Math.floor(Math.random() * 100) + 1;
    
    // Calculate result using pure function
    const { result, resultType } = this.calculateResult(roll, exceptionalYesThreshold, yesTarget, exceptionalNoThreshold);
    
    // Determine background color based on result type
    let backgroundColor = null;
    let textColor = "#FFFFFF"; // White text for colored backgrounds
    
    if (resultType === "yes") {
      backgroundColor = "#4CAF50"; // Green for Yes
    } else if (resultType === "yes-and") {
      backgroundColor = "#2E7D32"; // Darker, more saturated green for Yes, and...
    } else if (resultType === "no") {
      backgroundColor = "#FFB74D"; // Warning color for No
    } else if (resultType === "no-and") {
      backgroundColor = "#E57373"; // Error color for No, and...
    }
    
    // Display result with appropriate colors
    print(result, {
      type: "mythic",
      backgroundColor: backgroundColor,
      textColor: textColor
    });
  },

  decisionManual() {
    const oddsIndex = parseInt(document.getElementById("oddsSelect").value);
    const chaosFactor = parseInt(document.getElementById("chaosFactor").value);
    
    // Get manual roll value
    const manualRollInput = document.getElementById("manualRoll");
    const rollValue = parseInt(manualRollInput.value);
    
    // Validate input: must be between 1 and 100
    if (isNaN(rollValue) || rollValue < 1 || rollValue > 100) {
      showMessage("Please enter a number between 1 and 100", "error");
      manualRollInput.focus();
      return;
    }
    
    // Get table value
    const tableCell = this.getTableValue(oddsIndex, chaosFactor);
    if (!tableCell) {
      print("Error: Invalid odds or chaos factor");
      return;
    }
    
    const [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] = tableCell;
    
    // Use manual roll value instead of random
    const roll = rollValue;
    
    // Calculate result using pure function
    const { result, resultType } = this.calculateResult(roll, exceptionalYesThreshold, yesTarget, exceptionalNoThreshold);
    
    // Determine background color based on result type
    let backgroundColor = null;
    let textColor = "#FFFFFF"; // White text for colored backgrounds
    
    if (resultType === "yes") {
      backgroundColor = "#4CAF50"; // Green for Yes
    } else if (resultType === "yes-and") {
      backgroundColor = "#2E7D32"; // Darker, more saturated green for Yes, and...
    } else if (resultType === "no") {
      backgroundColor = "#FFB74D"; // Warning color for No
    } else if (resultType === "no-and") {
      backgroundColor = "#E57373"; // Error color for No, and...
    }
    
    // Display result with appropriate colors
    print(result, {
      type: "mythic",
      backgroundColor: backgroundColor,
      textColor: textColor
    });
    
    // Clear input after successful use
    manualRollInput.value = "";
  },

  showChaosValue(newValue) {
    document.getElementById("chaosValue").textContent = newValue;
  }
};

