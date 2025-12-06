// CharacterGenerator - Character generation functionality
const CharacterGenerator = {
  // Name generator
  name() {
    let syllable = [];
    let sLength = randomPick(numS);
    let vOrC = Math.random();

    //First letter
    if (vOrC > 0.66) {
      // i.e. 33% chance of vowel
      syllable.push(randomPick(vowels));
    } else {
      syllable.push(randomPick(consonants));
    }

    //additional syllables
    for (let i = 0; i < sLength; i++) {
      if (inside(syllable[syllable.length - 1], vowels) == true) {
        // when the last letter was a vowel
        syllable.push(randomPick(consonants));
      } else {
        // when the last letter was not a vowel
        let final = Math.random();
        if (final > 0.75) {
          syllable.push(randomPick(vowels) + randomPick(finals));
        } else {
          syllable.push(randomPick(vowels));
        }
      }
    }

    //Last final for single syllables
    if (sLength == 1 && inside(syllable[1], vowels) == true) {
      let fFinal = Math.random();
      if (fFinal > 0.25) {
        syllable.push(randomPick(finals));
      }
    }

    //Turning result into string
    let result = "";
    for (let n = 0; n < syllable.length; n++) {
      result += syllable[n];
    }
    result = result.replace(result.charAt(0), result.charAt(0).toUpperCase());
    print(result);
  },

  // Character Generator - age, sex, characteristic
  character() {
    let age = randomPick(ages);
    let sex = randomPick(sexes);
    let char = randomPick(characteristics);
    print(age + ", " + sex + ", " + char);
  },

  // Just Characteristic
  characteristic() {
    let char = randomPick(characteristics);
    print(char);
  },

  // Role
  role() {
    let role = randomPick(roles);
    print(role);
  },

  //Motivation
  motivation() {
    let mot = randomPick(motVerb) + " " + randomPick(motNoun);
    print(mot);
  },

  // Quirk
  quirk() {
    let quirk = randomPick(quirks);
    print("they " + quirk);
  },

  // Friendliness
  friendliness() {
    // Haal slider waarde op (-4 tot +4)
    let sliderValue = parseInt(document.getElementById("friendlinessSlider").value) || 0;
    
    // Bereken mean: index 4 is neutraal, verschuif op basis van slider
    // slider -4 = mean 0 (zeer hostile), slider 0 = mean 4 (neutraal), slider +4 = mean 8 (zeer friendly)
    let mean = 4 + sliderValue;
    
    // Gebruik bell curve distributie met stdDev 1.5 voor een mooie curve
    let index = bellCurvePick(mean, 1.5, fof.length);
    
    let friendly = fof[index];
    print(friendly + " the person");
  }
};

// Legacy function wrappers for backward compatibility with HTML onclick handlers
function nameGen() {
  CharacterGenerator.name();
}

function character() {
  CharacterGenerator.character();
}

function characteristic() {
  CharacterGenerator.characteristic();
}

function getRole() {
  CharacterGenerator.role();
}

function motivation() {
  CharacterGenerator.motivation();
}

function quirk() {
  CharacterGenerator.quirk();
}

function friend() {
  CharacterGenerator.friendliness();
}
