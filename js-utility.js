// Utility and Display Objects

// Data storage voor display items
const displayItems = [];

// Utility - General utility functions
const Utility = {
  randomPick(array) {
    const randomNumber = Math.floor(Math.random() * array.length);
    return array[randomNumber];
  },

  /**
   * Kiest een index uit een array met een bell curve distributie
   * @param {number} mean - Het gemiddelde (center) van de curve (0 tot arrayLength-1)
   * @param {number} stdDev - Standaard deviatie (hoe breed de curve is)
   * @param {number} arrayLength - Lengte van de array
   * @returns {number} Index tussen 0 en arrayLength-1
   */
  bellCurvePick(mean, stdDev, arrayLength) {
    // Genereer een normale distributie met Box-Muller transformatie
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Pas mean en stdDev toe
    let value = mean + z0 * stdDev;
    
    // Clamp naar geldig bereik
    value = Math.round(value);
    if (value < 0) value = 0;
    if (value >= arrayLength) value = arrayLength - 1;
    
    return value;
  },

  // Capitalize first letter of each sentence
  capitalizeSentences(text) {
    if (!text || text.length === 0) return text;
    
    // Capitalize first letter of the entire text
    let result = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Capitalize first letter after sentence endings (. ! ?) followed by space
    result = result.replace(/([.!?]\s+)([a-z])/g, function(match, punctuation, letter) {
      return punctuation + letter.toUpperCase();
    });
    
    return result;
  },

  // Calculate relative luminance for contrast calculation
  getLuminance(r, g, b) {
    // Convert RGB to relative luminance
    const [rs, gs, bs] = [r, g, b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio between two colors
  getContrastRatio(lum1, lum2) {
    // L1 is the lighter color, L2 is the darker color
    const L1 = Math.max(lum1, lum2);
    const L2 = Math.min(lum1, lum2);
    return (L1 + 0.05) / (L2 + 0.05);
  },

  // Calculate contrast color that meets WCAG AA standards (minimum 4.5:1 ratio)
  getContrastColor(rgbString) {
    // Parse RGB string like "rgb(123, 45, 67)"
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return "#000000"; // Default to black if parsing fails
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    // Calculate background luminance
    const bgLuminance = this.getLuminance(r, g, b);
    
    // WCAG AA requires minimum 4.5:1 contrast ratio for normal text
    const minContrastRatio = 4.5;
    
    // Determine if we need dark or light text
    const needsDarkText = bgLuminance > 0.5;
    
    // Start with complementary color
    let textR = 255 - r;
    let textG = 255 - g;
    let textB = 255 - b;
    
    // Calculate required luminance for text
    let requiredTextLum;
    if (needsDarkText) {
      // For dark text on light background: (bgLum + 0.05) / (textLum + 0.05) >= 4.5
      // So: textLum <= ((bgLum + 0.05) / 4.5) - 0.05
      requiredTextLum = ((bgLuminance + 0.05) / minContrastRatio) - 0.05;
    } else {
      // For light text on dark background: (textLum + 0.05) / (bgLum + 0.05) >= 4.5
      // So: textLum >= (bgLum + 0.05) * 4.5 - 0.05
      requiredTextLum = (bgLuminance + 0.05) * minContrastRatio - 0.05;
    }
    
    // Adjust RGB values to achieve required luminance while maintaining hue
    const currentLum = this.getLuminance(textR, textG, textB);
    const ratio = requiredTextLum / currentLum;
    
    if (needsDarkText) {
      // Darken the color (move towards black)
      textR = Math.max(0, Math.min(255, Math.round(textR * ratio)));
      textG = Math.max(0, Math.min(255, Math.round(textG * ratio)));
      textB = Math.max(0, Math.min(255, Math.round(textB * ratio)));
    } else {
      // Lighten the color (move towards white)
      textR = Math.max(0, Math.min(255, Math.round(255 - (255 - textR) * (1 / ratio))));
      textG = Math.max(0, Math.min(255, Math.round(255 - (255 - textG) * (1 / ratio))));
      textB = Math.max(0, Math.min(255, Math.round(255 - (255 - textB) * (1 / ratio))));
    }
    
    // Verify contrast ratio meets requirements, if not use pure black or white
    const finalLum = this.getLuminance(textR, textG, textB);
    const finalRatio = this.getContrastRatio(bgLuminance, finalLum);
    
    if (finalRatio < minContrastRatio) {
      // Fallback to pure black or white for maximum contrast
      if (needsDarkText) {
        return "rgb(0, 0, 0)"; // Pure black
      } else {
        return "rgb(255, 255, 255)"; // Pure white
      }
    }
    
    return `rgb(${textR}, ${textG}, ${textB})`;
  },

  inside(needle, haystack) {
    const count = haystack.length;
    for (let i = 0; i < count; i++) {
      if (haystack[i] === needle) {
        return true;
      }
    }
    return false;
  },

  aan(string) {
    const firstLetter = string[0];
    if (
      firstLetter == "a" ||
      firstLetter == "e" ||
      firstLetter == "i" ||
      firstLetter == "o" ||
      firstLetter == "u"
    ) {
      string = "an " + string;
    } else {
      string = "a " + string;
    }
    return string;
  }
};

// Display - Display management functionality
const Display = {
  print(str, options = {}) {
    // Voeg nieuw item toe aan data structuur
    const newItem = {
      type: options.type || "text",
      text: str,
      timestamp: Date.now()
    };
    
    // Voeg extra properties toe als die er zijn (bijv. backgroundColor voor color type)
    if (options.backgroundColor) {
      newItem.backgroundColor = options.backgroundColor;
      newItem.textColor = options.textColor || Utility.getContrastColor(options.backgroundColor);
    }
    
    // Markeer alle bestaande items als 'old'
    displayItems.forEach(item => {
      item.isOld = true;
    });
    
    // Voeg nieuw item toe aan begin van array (nieuwste eerst voor copy functionaliteit)
    displayItems.unshift(newItem);
    
    // Render alle items
    this.render();
    
    // Scroll naar beneden voor nieuwe content
    const display = document.getElementById("display");
    display.scrollTop = display.scrollHeight;
  },

  render() {
    const display = document.getElementById("display");
    display.innerHTML = "";

    // Render array in normale volgorde (nieuwste eerst)
    // CSS flex-direction: column-reverse zorgt ervoor dat items onderaan worden gepositioneerd
    displayItems.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "display-card " + (item.isOld ? "old" : "new");
      
      if (item.type === "glyph") {
        // Render glyph images
        item.images.forEach(imageSrc => {
          const img = document.createElement("img");
          img.src = imageSrc;
          img.className = "display-glyph";
          card.appendChild(img);
        });
      } else if (item.type === "color") {
        // Render color item with custom background and text color
        const textSpan = document.createElement("span");
        textSpan.textContent = Utility.capitalizeSentences(item.text);
        textSpan.style.fontWeight = "bold";
        if (item.backgroundColor) {
          card.style.backgroundColor = item.backgroundColor;
        }
        if (item.textColor) {
          textSpan.style.color = item.textColor;
        }
        card.appendChild(textSpan);
      } else {
        // Render text - gebruik span voor consistente flex layout
        const textSpan = document.createElement("span");
        // Capitalize sentences en maak tekst dikgedrukt
        textSpan.textContent = Utility.capitalizeSentences(item.text);
        textSpan.style.fontWeight = "bold";
        
        // Apply background and text colors if provided (for mythic decisions, etc.)
        if (item.backgroundColor) {
          card.style.backgroundColor = item.backgroundColor;
        }
        if (item.textColor) {
          textSpan.style.color = item.textColor;
        }
        
        card.appendChild(textSpan);
      }
      
      display.appendChild(card);
    });
  },

  copyToClipboard() {
    // Verzamel alle tekst uit de data structuur (nieuwste eerst)
    const textToCopy = displayItems
      .map(item => {
        if (item.type === "glyph") {
          // Voor glyphs: bestandsnamen zonder .png, gescheiden met komma
          return item.glyphs.join(", ");
        } else {
          // Voor tekst items: gewoon de tekst
          return item.text;
        }
      })
      .join("\n");
    
    // Gebruik moderne Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        Message.show("Copied all notes", "success");
      }).catch(err => {
        console.error("Failed to copy: ", err);
        // Fallback naar oude methode
        this._fallbackCopyText(textToCopy);
      });
    } else {
      // Fallback voor oudere browsers
      this._fallbackCopyText(textToCopy);
    }
  },

  _fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      Message.show("Copied all notes", "success");
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      Message.show("Failed to copy text", "error");
    }
    document.body.removeChild(textArea);
  }
};

// Message - Message notification system
const Message = {
  show(message, type = "success") {
    let messageDiv = document.getElementById("message-notification");
    
    // Reset classes
    messageDiv.className = "message-notification";
    
    // Add type class
    messageDiv.classList.add(type);
    
    // Set message text
    messageDiv.textContent = message;
    
    // Show message - eerst display block, dan fade in
    messageDiv.style.display = "block";
    setTimeout(() => {
      messageDiv.classList.add("show");
    }, 10);
    
    // Auto fade out after 5 seconds
    let fadeTimeout = setTimeout(() => {
      this.hide();
    }, 5000);
    
    // Click to close
    messageDiv.onclick = () => {
      clearTimeout(fadeTimeout);
      this.hide();
    };
  },

  hide() {
    let messageDiv = document.getElementById("message-notification");
    messageDiv.classList.remove("show");
    messageDiv.classList.add("fade-out");
    
    // Remove fade-out class and hide after animation
    setTimeout(() => {
      messageDiv.classList.remove("fade-out");
      messageDiv.className = "message-notification";
      messageDiv.style.display = "none";
    }, 300);
  }
};

// UI - UI control functionality
const UI = {
  toggleSubgroup(subgroupId) {
    const subgroup = document.querySelector(`[data-subgroup="${subgroupId}"]`);
    if (!subgroup) return;
    
    const isCollapsed = subgroup.classList.contains("collapsed");
    const toggleButton = subgroup.querySelector(".toggle-button");
    
    if (isCollapsed) {
      // Expand: remove collapsed class, show "-"
      subgroup.classList.remove("collapsed");
      toggleButton.textContent = "-";
    } else {
      // Collapse: add collapsed class, show "+"
      subgroup.classList.add("collapsed");
      toggleButton.textContent = "+";
    }
    
    // Update layout after toggle
    this.updateControlsLayout();
  },

  updateControlsLayout() {
    const controlsGroup = document.querySelector(".controls-group");
    if (!controlsGroup) return;
    
    const subgroups = Array.from(controlsGroup.querySelectorAll(".control-subgroup"));
    
    // Remove all layout styles first
    subgroups.forEach(card => {
      card.classList.remove("expanded-solo", "collapsed-below");
      card.style.gridColumn = "";
      card.style.gridRow = "";
      card.style.justifySelf = "";
      card.style.maxWidth = "";
    });
    
    // Group subgroups by row (2 per row in grid)
    const rows = [];
    for (let i = 0; i < subgroups.length; i += 2) {
      rows.push(subgroups.slice(i, i + 2));
    }
    
    // Calculate total rows needed (including extra rows for collapsed items)
    let currentGridRow = 1;
    
    // Process each logical row
    rows.forEach((row, rowIndex) => {
      const expanded = row.filter(card => !card.classList.contains("collapsed"));
      const collapsed = row.filter(card => card.classList.contains("collapsed"));
      
      if (expanded.length === 2) {
        // Both expanded: normal grid layout, side by side
        expanded.forEach((card, index) => {
          card.style.gridColumn = index + 1;
          card.style.gridRow = currentGridRow;
          card.style.justifySelf = "";
          card.style.maxWidth = "";
        });
        currentGridRow++;
      } else if (expanded.length === 1 && collapsed.length === 1) {
        // One expanded, one collapsed: expanded centered on full width, collapsed below in same logical row
        const expandedCard = expanded[0];
        const collapsedCard = collapsed[0];
        
        // Expanded card: full width, centered, on current row
        expandedCard.style.gridColumn = "1 / -1";
        expandedCard.style.gridRow = currentGridRow;
        expandedCard.style.justifySelf = "center";
        expandedCard.style.maxWidth = "50%";
        currentGridRow++;
        
        // Collapsed card: full width, centered, on next row (still part of same logical row)
        collapsedCard.style.gridColumn = "1 / -1";
        collapsedCard.style.gridRow = currentGridRow;
        collapsedCard.style.justifySelf = "center";
        collapsedCard.style.maxWidth = "50%";
        currentGridRow++;
      } else if (collapsed.length === 2) {
        // Both collapsed: side by side, normal grid layout
        collapsed.forEach((card, index) => {
          card.style.gridColumn = index + 1;
          card.style.gridRow = currentGridRow;
          card.style.justifySelf = "";
          card.style.maxWidth = "";
        });
        currentGridRow++;
      }
    });
  }
};

// Initialize layout on page load
document.addEventListener("DOMContentLoaded", function() {
  UI.updateControlsLayout();
});

// Legacy function wrappers for backward compatibility
function randomPick(array) {
  return Utility.randomPick(array);
}

function bellCurvePick(mean, stdDev, arrayLength) {
  return Utility.bellCurvePick(mean, stdDev, arrayLength);
}

function capitalizeSentences(text) {
  return Utility.capitalizeSentences(text);
}

function getLuminance(r, g, b) {
  return Utility.getLuminance(r, g, b);
}

function getContrastRatio(lum1, lum2) {
  return Utility.getContrastRatio(lum1, lum2);
}

function getContrastColor(rgbString) {
  return Utility.getContrastColor(rgbString);
}

function print(str, options) {
  Display.print(str, options);
}

function renderDisplay() {
  Display.render();
}

function showMessage(message, type) {
  Message.show(message, type);
}

function hideMessage() {
  Message.hide();
}

function inside(needle, haystack) {
  return Utility.inside(needle, haystack);
}

function aan(string) {
  return Utility.aan(string);
}

function toggleSubgroup(subgroupId) {
  UI.toggleSubgroup(subgroupId);
}

function updateControlsLayout() {
  UI.updateControlsLayout();
}

function toClipboard() {
  Display.copyToClipboard();
}
