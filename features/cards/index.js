// Cards Feature - Public API
// This file ensures GameCards is available globally and provides wrapper functions for backward compatibility

// Wrapper functions for backward compatibility with HTML onclick handlers
function poker() {
  GameCards.poker();
}

function tarot() {
  GameCards.tarot();
}

function displayImage() {
  GameCards.glyph();
}

