// WorldGenerator - World and scenario generation functionality
const WorldGenerator = {
  //genre generator
  genre() {
    const genreA = randomPick(genres);
    const genreB = randomPick(genres);
    const genreC = randomPick(genres);
    const genreNum = Math.floor(Math.random() * 3) + 1;
    const genreArray = [genreA, genreB, genreC];
    let genreText = "";
    for (let i = 0; i < genreNum; i++) {
      genreText += genreArray[i] + " ";
    }
    print(genreText);
  },

  // Event
  event() {
    const event = randomPick(events);
    print(event);
  },

  // Setting
  setting() {
    const settingA = randomPick(settings);
    const settingB = randomPick(settings);
    const settingC = randomPick(settings);
    const settingNum = Math.floor(Math.random() * 3) + 1;
    const settingArray = [settingA, settingB, settingC];
    let settingText = "";
    for (let i = 0; i < settingNum; i++) {
      settingText += settingArray[i] + "... ";
    }
    print(settingText);
  },

  // Item
  item() {
    const item = aan(randomPick(items));
    print(item);
  },

  // Quest
  quest() {
    const questType = randomPick(questTypeList);
    let questText = "";
    const item = aan(randomPick(questItems));
    const loc = randomPick(questSettings);
    const obstacle = randomPick(survive);
    const age = randomPick(ages);
    const sex = randomPick(sexes);
    let char = "";
    if (
      age == "small child" ||
      age == "child" ||
      (age == "teenager" && sex != "person of unusual gender")
    ) {
      char = aan(randomPick(characteristics)) + " " + sex + " " + age;
    } else {
      char = aan(randomPick(characteristics)) + " " + age + " " + sex;
    }

    switch (true) {
      case questType == "return" ||
        questType == "retrieve" ||
        questType == "destroy" ||
        questType == "steal": // item only quests
        questText = questType + " " + item;
        break;
      case questType == "find and explore" ||
        questType == "explore" ||
        questType == "clear out": // item only
        questText = questType + " " + loc;
        break;
      case questType == "rescue" ||
        questType == "escort" ||
        questType == "prevent the plans of" ||
        questType == "spy on" ||
        questType == "negotiate with": // char only
        questText = questType + " " + char;
        const humanYN = Math.random();
        if (humanYN > 0.75) {
          questText += " of an unusual or monstrous species";
        }
        break;
      case questType == "survive": // obstacle only
        questText = questType + " " + obstacle;
        break;
      case questType == "escape from":
        const escape = randomPick([loc, char]);
        questText = questType + " " + escape;
        break;
      case questType == "investigate" ||
        questType == "discover the fate of" ||
        questType == "expose the secrets of" ||
        questType == "research" ||
        questType == "protect":
        const anything = randomPick([item, loc, char]);
        questText = questType + " " + anything;
        break;
      case questType == "hunt down": // character or item
        const charItem = randomPick([char, item]);
        questText = questType + " " + charItem;
        break;
      // prevent plans, spy on, negotiate with, escape from, hunt down
    }
    print(questText);
  },

  //Color
  color() {
    const R_value = Math.floor(Math.random() * 255);
    const G_value = Math.floor(Math.random() * 255);
    const B_value = Math.floor(Math.random() * 255);
    const rand_color = "rgb(" + R_value + ", " + G_value + ", " + B_value + ")";
    // Print with color type so display card uses this color as background
    print("color: " + rand_color, {
      type: "color",
      backgroundColor: rand_color
    });
  },

  //Animal
  animal() {
    const animal = aan(randomPick(animalList));
    print(animal);
  },

  //Sense
  sense() {
    const senseType = randomPick(senseList);
    let senseSnippet = "";
    if (senseType == "sound") {
      senseSnippet = randomPick(soundList) + " " + randomPick(soundModList);
    } else if (senseType == "feeling") {
      senseSnippet = randomPick(feelListSense);
    } else if (senseType == "smell") {
      senseSnippet = randomPick(smellListSense);
    }
    print("the " + senseType + " of " + senseSnippet);
  }
};

// Legacy function wrappers for backward compatibility with HTML onclick handlers
function genre() {
  WorldGenerator.genre();
}

function eventGen() {
  WorldGenerator.event();
}

function setting() {
  WorldGenerator.setting();
}

function genItem() {
  WorldGenerator.item();
}

function quest() {
  WorldGenerator.quest();
}

function colorGet() {
  WorldGenerator.color();
}

function animal() {
  WorldGenerator.animal();
}

function sense() {
  WorldGenerator.sense();
}
