// CharacterGenerator - Character generation functionality
const CharacterGenerator = {
  // Name generator
  name() {
    const syllable = [];
    const sLength = randomPick(numS);
    const vOrC = Math.random();

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
        const final = Math.random();
        if (final > 0.75) {
          syllable.push(randomPick(vowels) + randomPick(finals));
        } else {
          syllable.push(randomPick(vowels));
        }
      }
    }

    //Last final for single syllables
    if (sLength == 1 && inside(syllable[1], vowels) == true) {
      const fFinal = Math.random();
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
    const age = randomPick(ages);
    const sex = randomPick(sexes);
    const char = randomPick(characteristics);
    print(age + ", " + sex + ", " + char);
  },

  // Just Characteristic
  characteristic() {
    const char = randomPick(characteristics);
    print(char);
  },

  // Role
  role() {
    const role = randomPick(roles);
    print(role);
  },

  //Motivation
  motivation() {
    const mot = randomPick(motVerb) + " " + randomPick(motNoun);
    print(mot);
  },

  // Quirk
  quirk() {
    const quirk = randomPick(quirks);
    print("they " + quirk);
  },

  // Friendliness
  friendliness() {
    // Haal slider waarde op (-4 tot +4)
    const sliderValue = parseInt(document.getElementById("friendlinessSlider").value) || 0;
    
    // Bereken mean: index 4 is neutraal, verschuif op basis van slider
    // slider -4 = mean 0 (zeer hostile), slider 0 = mean 4 (neutraal), slider +4 = mean 8 (zeer friendly)
    const mean = 4 + sliderValue;
    
    // Gebruik bell curve distributie met stdDev 1.5 voor een mooie curve
    const index = bellCurvePick(mean, 1.5, fof.length);
    
    const friendly = fof[index];
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
