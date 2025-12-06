// WorldGenerator - World and scenario generation functionality
const WorldGenerator = {
  //genre generator
  genre() {
    let genreA = randomPick(genres);
    let genreB = randomPick(genres);
    let genreC = randomPick(genres);
    let genreNum = Math.floor(Math.random() * 3) + 1;
    let genreArray = [genreA, genreB, genreC];
    let genreText = "";
    for (let i = 0; i < genreNum; i++) {
      genreText += genreArray[i] + " ";
    }
    print(genreText);
  },

  // Event
  event() {
    let event = randomPick(events);
    print(event);
  },

  // Setting
  setting() {
    let settingA = randomPick(settings);
    let settingB = randomPick(settings);
    let settingC = randomPick(settings);
    let settingNum = Math.floor(Math.random() * 3) + 1;
    let settingArray = [settingA, settingB, settingC];
    let settingText = "";
    for (let i = 0; i < settingNum; i++) {
      settingText += settingArray[i] + "... ";
    }
    print(settingText);
  },

  // Item
  item() {
    let item = aan(randomPick(items));
    print(item);
  },

  // Quest
  quest() {
    let questType = randomPick(questTypeList);
    let questText = "";
    let item = aan(randomPick(questItems));
    let loc = randomPick(questSettings);
    let obstacle = randomPick(survive);
    let age = randomPick(ages);
    let sex = randomPick(sexes);
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
        let humanYN = Math.random();
        if (humanYN > 0.75) {
          questText += " of an unusual or monstrous species";
        }
        break;
      case questType == "survive": // obstacle only
        questText = questType + " " + obstacle;
        break;
      case questType == "escape from":
        let escape = randomPick([loc, char]);
        questText = questType + " " + escape;
        break;
      case questType == "investigate" ||
        questType == "discover the fate of" ||
        questType == "expose the secrets of" ||
        questType == "research" ||
        questType == "protect":
        let anything = randomPick([item, loc, char]);
        questText = questType + " " + anything;
        break;
      case questType == "hunt down": // character or item
        let charItem = randomPick([char, item]);
        questText = questType + " " + charItem;
        break;
      // prevent plans, spy on, negotiate with, escape from, hunt down
    }
    print(questText);
  },

  //Color
  color() {
    let R_value = Math.floor(Math.random() * 255);
    let G_value = Math.floor(Math.random() * 255);
    let B_value = Math.floor(Math.random() * 255);
    let rand_color = "rgb(" + R_value + ", " + G_value + ", " + B_value + ")";
    // Print with color type so display card uses this color as background
    print("color: " + rand_color, {
      type: "color",
      backgroundColor: rand_color
    });
  },

  //Animal
  animal() {
    let animal = aan(randomPick(animalList));
    print(animal);
  },

  //Sense
  sense() {
    let senseType = randomPick(senseList);
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
