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

function print(str) {
  // Voeg nieuw item toe aan data structuur
  let newItem = {
    type: "text",
    text: str,
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
