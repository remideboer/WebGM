// General Functions

// Data storage voor display items
let displayItems = [];

function randomPick(array) {
  let randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
}

// Capitalize first letter of each sentence
function capitalizeSentences(text) {
  if (!text || text.length === 0) return text;
  
  // Capitalize first letter of the entire text
  let result = text.charAt(0).toUpperCase() + text.slice(1);
  
  // Capitalize first letter after sentence endings (. ! ?) followed by space
  result = result.replace(/([.!?]\s+)([a-z])/g, function(match, punctuation, letter) {
    return punctuation + letter.toUpperCase();
  });
  
  return result;
}

// Calculate relative luminance for contrast calculation
function getLuminance(r, g, b) {
  // Convert RGB to relative luminance
  let [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(lum1, lum2) {
  // L1 is the lighter color, L2 is the darker color
  let L1 = Math.max(lum1, lum2);
  let L2 = Math.min(lum1, lum2);
  return (L1 + 0.05) / (L2 + 0.05);
}

// Calculate contrast color that meets WCAG AA standards (minimum 4.5:1 ratio)
function getContrastColor(rgbString) {
  // Parse RGB string like "rgb(123, 45, 67)"
  let match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return "#000000"; // Default to black if parsing fails
  
  let r = parseInt(match[1]);
  let g = parseInt(match[2]);
  let b = parseInt(match[3]);
  
  // Calculate background luminance
  let bgLuminance = getLuminance(r, g, b);
  
  // WCAG AA requires minimum 4.5:1 contrast ratio for normal text
  const minContrastRatio = 4.5;
  
  // Determine if we need dark or light text
  let needsDarkText = bgLuminance > 0.5;
  
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
  let currentLum = getLuminance(textR, textG, textB);
  let ratio = requiredTextLum / currentLum;
  
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
  let finalLum = getLuminance(textR, textG, textB);
  let finalRatio = getContrastRatio(bgLuminance, finalLum);
  
  if (finalRatio < minContrastRatio) {
    // Fallback to pure black or white for maximum contrast
    if (needsDarkText) {
      return "rgb(0, 0, 0)"; // Pure black
    } else {
      return "rgb(255, 255, 255)"; // Pure white
    }
  }
  
  return `rgb(${textR}, ${textG}, ${textB})`;
}

function print(str, options = {}) {
  // Voeg nieuw item toe aan data structuur
  let newItem = {
    type: options.type || "text",
    text: str,
    timestamp: Date.now()
  };
  
  // Voeg extra properties toe als die er zijn (bijv. backgroundColor voor color type)
  if (options.backgroundColor) {
    newItem.backgroundColor = options.backgroundColor;
    newItem.textColor = options.textColor || getContrastColor(options.backgroundColor);
  }
  
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

function renderDisplay() {
  let display = document.getElementById("display");
  display.innerHTML = "";

  // Render array in normale volgorde (nieuwste eerst)
  // CSS flex-direction: column-reverse zorgt ervoor dat items onderaan worden gepositioneerd
  displayItems.forEach((item, index) => {
    let card = document.createElement("div");
    card.className = "display-card " + (item.isOld ? "old" : "new");
    
    if (item.type === "glyph") {
      // Render glyph images
      item.images.forEach(imageSrc => {
        let img = document.createElement("img");
        img.src = imageSrc;
        img.className = "display-glyph";
        card.appendChild(img);
      });
    } else if (item.type === "color") {
      // Render color item with custom background and text color
      let textSpan = document.createElement("span");
      textSpan.textContent = capitalizeSentences(item.text);
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
      let textSpan = document.createElement("span");
      // Capitalize sentences en maak tekst dikgedrukt
      textSpan.textContent = capitalizeSentences(item.text);
      textSpan.style.fontWeight = "bold";
      card.appendChild(textSpan);
    }
    
    display.appendChild(card);
  });
}

// Message notification system
function showMessage(message, type = "success") {
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
    hideMessage();
  }, 5000);
  
  // Click to close
  messageDiv.onclick = () => {
    clearTimeout(fadeTimeout);
    hideMessage();
  };
}

function hideMessage() {
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

function inside(needle, haystack) {
  let count = haystack.length;
  for (let i = 0; i < count; i++) {
    if (haystack[i] === needle) {
      return true;
    }
  }
  return false;
}

function aan(string) {
  let firstLetter = string[0];
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

// Multiple-use variables

let characteristics = [
  "abrasive",
  "absent-minded",
  "adaptable",
  "adventurous",
  "agreeable",
  "agressive",
  "aimless",
  "airy",
  "all-loving",
  "aloof",
  "amoral",
  "ambitous",
  "angry",
  "anxious",
  "apathetic",
  "argumentative",
  "arrogant",
  "artistic",
  "articulate",
  "aspiring",
  "assertive",
  "athletic",
  "attractive",
  "barbaric",
  "benevolent",
  "bewildered",
  "bizarre",
  "bland",
  "boisterous",
  "bold",
  "breezy",
  "brilliant",
  "brutal",
  "businesslike",
  "busy",
  "calculating",
  "callous",
  "calm",
  "cantankerous",
  "capable",
  "captivating",
  "careless",
  "caring",
  "casual",
  "cautious",
  "charismatic",
  "charming",
  "cheerful",
  "childish",
  "clumsy",
  "competitive",
  "cold",
  "concilliatory",
  "conceited",
  "confident",
  "conformist",
  "confused",
  "conscientious",
  "considerate",
  "contemplative",
  "cooperative",
  "courageous",
  "courteous",
  "cowardly",
  "clever",
  "crass",
  "creative",
  "crippled",
  "crude",
  "cruel",
  "cultured",
  "cunning",
  "curious",
  "cute",
  "cynical",
  "daring",
  "debonair",
  "decent",
  "deceptive",
  "decisive",
  "dedicated",
  "delicate",
  "desperate",
  "destructive ",
  "determined",
  "devious",
  "dignified",
  "disciplined",
  "disconcerting",
  "discreet",
  "dishonest",
  "disrespectful",
  "distractible",
  "disturbing",
  "dogmatic",
  "domineering",
  "dour",
  "down-to-earth",
  "dramtic",
  "dreamy",
  "driven",
  "droll",
  "dull",
  "dutiful",
  "dynamic",
  "earnest",
  "earthy",
  "educated",
  "egocentric",
  "elegant",
  "emotional",
  "empathetic",
  "energetic",
  "enigmatic",
  "enthusiastic",
  "erratic",
  "faithful",
  "fanatical",
  "far-sighted",
  "fatalistic",
  "fearful",
  "feminine",
  "fickle",
  "flamboyant",
  "flexible",
  "focused",
  "foolish",
  "forceful",
  "forgetful",
  "forgiving",
  "formal",
  "forthright",
  "freethinking",
  "friendly",
  "frightening",
  "frugal",
  "fun-loving",
  "funny",
  "gallant",
  "generous",
  "gentle",
  "genuine",
  "gloomy",
  "good-natured",
  "gracious",
  "greedy",
  "grim",
  "grumpy",
  "guileless",
  "gullible",
  "hardworking",
  "haughty",
  "hearty",
  "helpful",
  "heroic",
  "hesitant",
  "high-minded",
  "high-spirited",
  "honest",
  "honorable",
  "humble",
  "hypnotic",
  "idealistic",
  "ignorant",
  "imaginative",
  "impatient",
  "impersonable",
  "imposing",
  "impressionable",
  "impulsive",
  "incisive",
  "inconsiderate",
  "incorruptable",
  "indecisive",
  "individualistic",
  "innovative",
  "inoffensive",
  "insane",
  "insecure",
  "insightful",
  "insouciant",
  "intelligent",
  "intellectual",
  "intense",
  "intimidating",
  "intuitive",
  "irreverant",
  "irritable",
  "jovial",
  "kind",
  "knowledgeable",
  "lazy",
  "leaderly",
  "logical",
  "lonely",
  "lovable",
  "loyal",
  "lucky",
  "magnanimous",
  "masculine",
  "mature",
  "meddlesome",
  "mellow",
  "messy",
  "methodical",
  "meticulous",
  "miserable",
  "miserly",
  "misguided",
  "modest",
  "modern",
  "moody",
  "morbid",
  "mystical",
  "naive",
  "narcissistic",
  "narrow-minded",
  "neat",
  "neurotic",
  "noncommittal",
  "obnoxious",
  "observant",
  "obsessive",
  "old-fashioned",
  "optimistic",
  "organized",
  "outspoken",
  "paranoid",
  "parental",
  "passionate",
  "patient",
  "patriotic",
  "peaceful",
  "perceptive",
  "perfectionist",
  "personable",
  "persuasive",
  "petulant",
  "placid",
  "playful",
  "pompous",
  "popular",
  "practical",
  "precise",
  "predictable",
  "preoccupied",
  "prescient",
  "pretentious",
  "prim",
  "principled",
  "private",
  "progressive",
  "protective",
  "proud",
  "prudent",
  "purposeful",
  "quiet",
  "rational",
  "reflective",
  "regretful",
  "repentant",
  "relaxed",
  "reliable",
  "religious",
  "reserved",
  "resourceful",
  "respectful",
  "responsible",
  "restrained",
  "retiring",
  "rowdy",
  "sadistic",
  "sarcastic",
  "secretive",
  "self-concious",
  "scrupulous",
  "selfish",
  "selfless",
  "self-critical",
  "self-denying",
  "self-sufficient",
  "sensitive",
  "sensual",
  "simple",
  "skeptical",
  "skilled",
  "sleazy",
  "sociable",
  "solemn",
  "somber",
  "sophisticated",
  "stern",
  "stoic",
  "strict",
  "strong",
  "strong-willed",
  "stubborn",
  "studious",
  "stylish",
  "suave",
  "superstitious",
  "suspicious",
  "sympathetic",
  "tidy",
  "timid",
  "tolerant",
  "tough",
  "tractable",
  "trendy",
  "trusting",
  "twitchy",
  "uncomplaining",
  "unchanging",
  "undemanding",
  "unhurried",
  "uninhibited",
  "understanding",
  "unlucky",
  "vacuous",
  "vindictive",
  "vivacious",
  "vulnerable",
  "weak",
  "well-bred",
  "well-meaning",
  "well-read",
  "well-rounded",
  "whimsical",
  "wise",
  "witty",
];

let animalList = [
  "albatross",
  "alligator",
  "alpaca",
  "ant",
  "anteater",
  "antelope",
  "ape",
  "armadillo",
  "baboon",
  "badger",
  "bat",
  "bear",
  "beaver",
  "beetle",
  "buffalo",
  "butterfly",
  "camel",
  "cat",
  "chameleon",
  "cheetah",
  "chicken",
  "chimp",
  "chinchilla",
  "cobra",
  "cow",
  "crab",
  "crane",
  "crow",
  "deer",
  "dog",
  "dolphin",
  "donkey",
  "dragon",
  "dragonfly",
  "duck",
  "eagle",
  "eel",
  "elephant",
  "emu",
  "falcon",
  "fish",
  "flamingo",
  "fox",
  "frog",
  "giraffe",
  "goat",
  "goose",
  "hamster",
  "hedgehog",
  "heron",
  "hippo",
  "hornet",
  "horse",
  "hummingbird",
  "hyena",
  "jackal",
  "jaguar",
  "jellyfish",
  "kangaroo mouse",
  "kangaroo",
  "koala",
  "lark",
  "lemur",
  "lion",
  "lizard",
  "llama",
  "lobster",
  "magpie",
  "mole",
  "mongoose",
  "monkey",
  "mouse",
  "narwhal",
  "newt",
  "octopus",
  "opossum",
  "otter",
  "owl",
  "panda",
  "parrot",
  "pelican",
  "penguin",
  "pheasant",
  "pig",
  "platypus",
  "porcupine",
  "rabbit",
  "raccoon",
  "raptor",
  "rat",
  "rhino",
  "sardine",
  "scorpion",
  "sea horse",
  "sea lion",
  "seal",
  "shark",
  "sheep",
  "shrew",
  "skink",
  "skunk",
  "sloth",
  "slug",
  "snail",
  "snake",
  "songbird",
  "spider",
  "squid",
  "squirrel",
  "starfish",
  "stingray",
  "swan",
  "tapir",
  "tiger",
  "turtle",
  "weasel",
  "whale",
  "wolf",
  "wombat",
  "worm",
  "zebra",
];
