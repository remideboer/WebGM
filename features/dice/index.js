// Dice Feature - Public API
// This file ensures GameDice is available globally and provides wrapper functions for backward compatibility

// Wrapper functions for backward compatibility with HTML onclick handlers
function customDice() {
  GameDice.roll();
}

function fudgefate() {
  GameDice.fudgeFate();
}

