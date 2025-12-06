// Mythic Feature - Public API
// This file ensures GameMythic is available globally and provides wrapper functions for backward compatibility

// Wrapper functions for backward compatibility with HTML onclick handlers
function mythicDecision() {
  GameMythic.decision();
}

function mythicDecisionManual() {
  GameMythic.decisionManual();
}

function chaosShowValue(newValue) {
  GameMythic.showChaosValue(newValue);
}

