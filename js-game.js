//Copy text to Clipboard

function toClipboard() {
  // Verzamel alle tekst uit de data structuur (nieuwste eerst)
  let textToCopy = displayItems
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
      showMessage("Copied all notes", "success");
    }).catch(err => {
      console.error("Failed to copy: ", err);
      // Fallback naar oude methode
      fallbackCopyText(textToCopy);
    });
  } else {
    // Fallback voor oudere browsers
    fallbackCopyText(textToCopy);
  }
}

function fallbackCopyText(text) {
  let textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showMessage("Copied all notes", "success");
  } catch (err) {
    console.error("Fallback copy failed: ", err);
    showMessage("Failed to copy text", "error");
  }
  document.body.removeChild(textArea);
}

// Mythic GM 2e Decision Table
// Tabel structuur: [min, bold, max] per cel
// ODDS: 0=Certain, 1=Nearly Certain, 2=Very Likely, 3=Likely, 4=50/50, 5=Unlikely, 6=Very Unlikely, 7=Nearly Impossible, 8=Impossible
// CHAOS FACTOR: 1-9
const mythicTable = [
  // Certain (0)
  [[10, 50, 91], [13, 65, 94], [15, 75, 96], [17, 85, 98], [18, 90, 99], [19, 95, 100], [20, 99, null], [20, 99, null], [20, 99, null]],
  // Nearly Certain (1)
  [[7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96], [17, 85, 98], [18, 90, 99], [19, 95, 100], [20, 99, null], [20, 99, null]],
  // Very Likely (2)
  [[5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96], [17, 85, 98], [18, 90, 99], [19, 95, 100], [20, 99, null]],
  // Likely (3)
  [[3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96], [17, 85, 98], [18, 90, 99], [19, 95, 100]],
  // 50/50 (4)
  [[2, 10, 83], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96], [17, 85, 98], [18, 90, 99]],
  // Unlikely (5)
  [[1, 5, 82], [2, 10, 83], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96], [17, 85, 98]],
  // Very Unlikely (6)
  [[null, 1, 81], [1, 5, 82], [2, 10, 83], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96]],
  // Nearly Impossible (7)
  [[null, 1, 81], [null, 1, 81], [1, 5, 82], [2, 10, 83], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94]],
  // Impossible (8)
  [[null, 1, 81], [null, 1, 81], [null, 1, 81], [1, 5, 82], [2, 10, 83], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91]]
];

const oddsLabels = [
  "Certain",
  "Nearly Certain",
  "Very Likely",
  "Likely",
  "50/50",
  "Unlikely",
  "Very Unlikely",
  "Nearly Impossible",
  "Impossible"
];

/**
 * Pure function: Gets the table cell value for given odds and chaos factor
 * @param {number} oddsIndex - Index of the odds (0-8)
 * @param {number} chaosFactor - Chaos factor (1-9)
 * @returns {Array|null} The table cell [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] or null if invalid
 */
function getMythicTableValue(oddsIndex, chaosFactor) {
  if (oddsIndex < 0 || oddsIndex >= mythicTable.length) {
    return null;
  }
  const chaosIndex = chaosFactor - 1; // Convert 1-9 to 0-8
  if (chaosIndex < 0 || chaosIndex >= mythicTable[oddsIndex].length) {
    return null;
  }
  return mythicTable[oddsIndex][chaosIndex];
}

/**
 * Pure function: Calculates the Mythic GM result based on roll and table values
 * @param {number} roll - The d100 roll result (1-100)
 * @param {number|null} exceptionalYesThreshold - Lower threshold for Exceptional Yes
 * @param {number} yesTarget - The Yes target (roll ≤ this = Yes)
 * @param {number|null} exceptionalNoThreshold - Upper threshold for Exceptional No
 * @returns {Object} Object with {result: string, resultType: string}
 */
function calculateMythicResult(roll, exceptionalYesThreshold, yesTarget, exceptionalNoThreshold) {
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
      // Roll 1 = Exceptional Yes (YES AND) - this is the only Yes result
      result = "YES AND";
      resultType = "yes-and";
    } else {
      // Roll 2-100 = No
      if (exceptionalNoThreshold !== null && roll > exceptionalNoThreshold) {
        result = "NO AND";
        resultType = "no-and";
      } else {
        result = "NO";
        resultType = "no";
      }
    }
  } else if (exceptionalNoThreshold === null) {
    // Special case: threshold **99** x (Certain with high CF)
    // Yes target = 99, so roll 1-99 = Yes, roll 100 = No
    if (roll <= yesTarget) {
      // Roll 1-99 = Yes
      if (roll <= exceptionalYesThreshold) {
        result = "YES AND";
        resultType = "yes-and";
      } else {
        result = "YES";
        resultType = "yes";
      }
    } else {
      // Roll 100 = Exceptional No (NO AND)
      result = "NO AND";
      resultType = "no-and";
    }
  } else {
    // Normal case: [exceptionalYesThreshold] **[yesTarget]** [exceptionalNoThreshold]
    // First determine Yes/No based on yesTarget
    if (roll <= yesTarget) {
      // Yes range: 1 to yesTarget
      if (roll <= exceptionalYesThreshold) {
        result = "YES AND";
        resultType = "yes-and";
      } else {
        result = "YES";
        resultType = "yes";
      }
    } else {
      // No range: (yesTarget + 1) to 100
      if (roll > exceptionalNoThreshold) {
        result = "NO AND";
        resultType = "no-and";
      } else {
        result = "NO";
        resultType = "no";
      }
    }
  }
  
  return { result, resultType };
}

/**
 * Pure function: Formats the output string for display
 * @param {string} result - The result string (YES, NO, YES AND, NO AND)
 * @param {number} oddsIndex - Index of the odds (0-8)
 * @param {number} chaosFactor - Chaos factor (1-9)
 * @param {number} roll - The d100 roll result
 * @param {Array} tableCell - The table cell [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold]
 * @returns {string} Formatted output string
 */
function formatMythicOutput(result, oddsIndex, chaosFactor, roll, tableCell) {
  const [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] = tableCell;
  const oddsLabel = oddsLabels[oddsIndex];
  const rangeStr = exceptionalYesThreshold !== null ? exceptionalYesThreshold : 'x';
  const rangeStr2 = exceptionalNoThreshold !== null ? exceptionalNoThreshold : 'x';
  return `${result} (Odds: ${oddsLabel}, CF: ${chaosFactor}, Roll: ${roll}, Range: ${rangeStr}-${yesTarget}-${rangeStr2})`;
}

/**
 * Main function: Handles DOM interaction and calls pure functions
 * This function is not easily testable but delegates to testable pure functions
 */
function mythicDecision() {
  const oddsIndex = parseInt(document.getElementById("oddsSelect").value);
  const chaosFactor = parseInt(document.getElementById("chaosFactor").value);
  
  // Get table value
  const tableCell = getMythicTableValue(oddsIndex, chaosFactor);
  if (!tableCell) {
    print("Error: Invalid odds or chaos factor");
    return;
  }
  
  const [exceptionalYesThreshold, yesTarget, exceptionalNoThreshold] = tableCell;
  
  // Roll d100
  const roll = Math.floor(Math.random() * 100) + 1;
  
  // Calculate result using pure function
  const { result } = calculateMythicResult(roll, exceptionalYesThreshold, yesTarget, exceptionalNoThreshold);
  
  // Display only the result
  print(result);
}

function chaosShowValue(newValue) {
  document.getElementById("chaosValue").textContent = newValue;
}

// Draw a card - Poker

let pokerValues = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "jack",
  "queen",
  "king",
];
let pokerSuites = ["spades", "diamonds", "clubs", "hearts"];
let pokerJokers = ["red joker", "black joker"];

function poker() {
  let joker = Math.floor(Math.random() * 54);
  let pokerCard = randomPick(pokerValues) + " of " + randomPick(pokerSuites);
  if (joker > 52) {
    pokerCard = randomPick(pokerJokers);
  }
  print(pokerCard);
}

// Draw a card - tarot

let majorArcana = [
  "the fool",
  "the magician",
  "the high priestess",
  "the empress",
  "the emperor",
  "the hierophant",
  "the lovers",
  "the chariot",
  "strength",
  "the hermit",
  "wheel of fortune",
  "justice",
  "the hanged man",
  "death",
  "temperance",
  "the devil",
  "the tower",
  "the star",
  "the moon",
  "the sun",
  "judgement",
  "the world",
];
let minorValues = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "page",
  "knight",
  "queen",
  "king",
];
let minorSuites = ["wands", "cups", "swords", "pentacles"];

function tarot() {
  let arcana = Math.floor(Math.random() * 78);
  let tarotCard = randomPick(minorValues) + " of " + randomPick(minorSuites);
  if (arcana < 23) {
    tarotCard = randomPick(majorArcana);
  }
  print(tarotCard);
}

// Glyph

let prefix = "glyphs/";
let glyphs = [
  "acid",
  "ages",
  "alien-bug",
  "alien-stare",
  "all-seeing-eye",
  "amphora",
  "android-mask",
  "angel-wings",
  "aquarium",
  "architect-mask",
  "awareness",
  "barbed-coil",
  "battery-pack-alt",
  "beard",
  "beech",
  "bestial-fangs",
  "big-wave",
  "bindle",
  "bird-mask",
  "black-cat",
  "black-hole-bolas",
  "blindfold",
  "body-swapping",
  "boiling-bubbles",
  "bolt-eye",
  "bowen-knot",
  "branch-arrow",
  "breaking-chain",
  "bubbling-bowl",
  "bubbling-flask",
  "burning-book",
  "burning-meteor",
  "burning-passion",
  "calavera",
  "card-joker",
  "carnyx",
  "cauldron",
  "chained-heart",
  "chalice-drops",
  "chameleon-glyph",
  "clover",
  "cobweb",
  "coma",
  "concrete-bag",
  "convince",
  "coronation",
  "crown-coin",
  "crowned-heart",
  "crowned-skull",
  "crystalize",
  "cultist",
  "cursed-star",
  "cyber-eye",
  "cyborg-face",
  "cycle",
  "dagger-rose",
  "dark-squad",
  "deathcap",
  "defibrilate",
  "delighted",
  "desert-skull",
  "despair",
  "direwolf",
  "disintegrate",
  "distraction",
  "double-face-mask",
  "dove",
  "dozen",
  "drakkar",
  "dread",
  "drink-me",
  "dripping-star",
  "ecology",
  "egg-clutch",
  "egyptian-pyramids",
  "energy-shield",
  "enlightenment",
  "entangled-typhoon",
  "evil-bat",
  "evil-moon",
  "evil-wings",
  "eye-of-horus",
  "eye-target",
  "fangs-circle",
  "fire-ace",
  "fire-bottle",
  "fire-dash",
  "fire-silhouette",
  "fishing-hook",
  "fleshy-mass",
  "forest",
  "fox-head",
  "freedom-dove",
  "frontal-lobe",
  "frostfire",
  "fruiting",
  "fuji",
  "gas-mask",
  "gem-chain",
  "ghost-ally",
  "gift-of-knowledge",
  "gluttonous-smile",
  "gooey-sword",
  "gorilla",
  "guarded-tower",
  "hair-strands",
  "halt",
  "harpy",
  "heart-bottle",
  "heart-drop",
  "heptagram",
  "hole-ladder",
  "holy-grail",
  "holy-oak",
  "ice-bolt",
  "iceberg",
  "id-card",
  "ink-swirl",
  "inner-self",
  "invisible",
  "ivory-tusks",
  "juggler",
  "keyring",
  "knot",
  "lamprey-mouth",
  "life-in-the-balance",
  "love-mystery",
  "mad-scientist",
  "magic-gate",
  "marrow-drain",
  "medieval-pavilion",
  "minerals",
  "moebius-star",
  "mute",
  "nothing-to-say",
  "octoman",
  "oily-spiral",
  "one-eyed",
  "ouroboros",
  "overmind",
  "paw-heart",
  "pegasus",
  "pierced-heart",
  "piercing-sword",
  "pirate-flag",
  "pirate-grave",
  "plague-doctor-profile",
  "plants-and-animals",
  "plesiosaurus",
  "poison",
  "poker-hand",
  "prayer",
  "processor",
  "pyromaniac",
  "radial-balance",
  "rainbow-star",
  "raise-skeleton",
  "revolt",
  "ringing-bell",
  "river",
  "roman-shield",
  "rupee",
  "scythe",
  "secret-door",
  "serrated-slash",
  "shaking-hands",
  "shark-fin",
  "shield-echoes",
  "shiny-purse",
  "shouting",
  "shuriken",
  "sickle",
  "sinking-ship",
  "sinking-trap",
  "skeleton-key",
  "slalom",
  "slashed-shield",
  "sleepy",
  "sly",
  "smoke-bomb",
  "sound-waves",
  "spatter",
  "spiked-armor",
  "spiky-eclipse",
  "spiral-arrow",
  "spiral-tentacle",
  "sprout",
  "spy",
  "star-sattelites",
  "stars-stack",
  "stigmata",
  "stork-delivery",
  "striped-sun",
  "stump-regrowth",
  "suits",
  "sun-radiations",
  "sun",
  "surprised-skull",
  "surrounded-eye",
  "swamp",
  "swan-breeze",
  "swiss-army-knife",
  "sword-break",
  "tear-tracks",
  "telepathy",
  "temptation",
  "tesla-coil",
  "thor-fist",
  "totem-head",
  "totem",
  "trojan-horse",
  "two-shadows",
  "vine-flower",
  "volcano",
  "voodoo-doll",
  "wave-strike",
  "winged-emblem",
  "wingfoot",
  "yin-yang",
];

function displayImage() {
  let glyphNameA = randomPick(glyphs);
  let glyphNameB = randomPick(glyphs);
  let glyphNameC = randomPick(glyphs);
  
  let glyphA = prefix + glyphNameA + ".png";
  let glyphB = prefix + glyphNameB + ".png";
  let glyphC = prefix + glyphNameC + ".png";
  
  // Voeg glyphs toe aan display
  let newItem = {
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
  let display = document.getElementById("display");
  display.scrollTop = display.scrollHeight;
}

// Roll custom dice

function customDice() {
  let diceSides = document.getElementById("diceSides").value;
  let numDice = document.getElementById("numDice").value;
  let results = [];
  let diceTotal = 0;
  switch (true) {
    case numDice <= 0:
      print("Error - you can't roll " + numDice + " dice.");
      break;
    case diceSides < 2:
      print("Error - dice can't have " + diceSides + " sides.");
      break;
    case numDice == 1:
      results = Math.floor(Math.random() * diceSides) + 1;
      print(results);
      break;
    default:
      for (i = 0; i < numDice; i++) {
        let randomNumber = Math.floor(Math.random() * diceSides) + 1;
        diceTotal += randomNumber;
        results += randomNumber + ", ";
      }
      print(results + "total: " + diceTotal);
      break;
  }
}

// Fudge/Fate dice

function fudgefate() {
  ffValues = ["-", "0", "+"];
  dieA = randomPick(ffValues);
  dieB = randomPick(ffValues);
  dieC = randomPick(ffValues);
  dieD = randomPick(ffValues);
  ffDice = [dieA, dieB, dieC, dieD];
  ffTotal = 0;
  for (i = 0; i < 4; i++) {
    if (ffDice[i] == "+") {
      ffTotal = ffTotal + 1;
    } else if (ffDice[i] == "-") {
      ffTotal = ffTotal - 1;
    }
  }
  print(dieA + ", " + dieB + ", " + dieC + ", " + dieD + " total: " + ffTotal);
}

// Damage

let severity = [
  "life-threatening",
  "life-threatening",
  "critical",
  "critical",
  "critical",
  "severe",
  "severe",
  "severe",
  "moderate",
  "moderate",
  "moderate",
  "moderate",
  "moderate",
  "moderate",
  "minor",
  "minor",
  "minor",
  "minor",
  "minor",
  "minor",
  "negligible",
  "negligible",
  "negligible",
];

let area = ["head", "torso", "left arm", "right arm", "left leg", "right leg"];

function damageShowValue(newValue) {
  newValue = newValue;
  document.getElementById("danger").innerHTML = "danger level " + newValue;
}

function damage() {
  let hit = randomPick(area);
  let damageNumber = Math.floor(Math.random() * severity.length);
  let danger = document.getElementById("damageSlider").value - 4;
  let change = damageNumber - danger;
  if (change < 0) {
    change = 0;
  } else if (change > 20) {
    change = 20;
  }
  let mod = severity[change];
  print(mod + " hit to the " + hit);
}
