// Creature Generator

function creature() {
  let nsize = randomPick(size);
  let nlike = randomPick(like);
  let nbut = randomPick(but);
  let nhead = randomPick(head);
  let nextras = randomPick(extras);
  let nfight = randomPick(fight);
  let ncover = randomPick(cover);
  let ndesign = randomPick(design);
  let ncolorA = randomPick(color);
  let ncolorB = randomPick(color);
  let text =
    "This creature is the size of " +
    nsize +
    " and resembles " +
    nlike +
    ", but " +
    nbut +
    ". It has " +
    nhead +
    ", " +
    nextras +
    ", and " +
    nfight +
    ". It is " +
    ncover +
    " and is ";
  let blanket = Math.random();
  while (ncolorA == ncolorB) {
    ncolorB = randomPic(color);
  }
  if (blanket > 0.49) {
    text += ncolorA + ".";
  } else {
    text += ncolorA + " " + ndesign + " " + ncolorB + ".";
  }
  print(text);
}

//Magical Effects

// Initialize wildDurations and extended lists after animalList is loaded
let wildDurations = goodWildDurations.concat(badWildDurations);
summonList = summonList.concat(animalList);
summonCreatureList = summonCreatureList.concat(animalList);
attractList = attractList.concat(animalList);
thinkAreList = thinkAreList.concat(animalList);

function magicFX() {
  let magCat = randomPick(magCatList);

  let magic = "";
  let append = "";
  let effect = "effect";
  let targetType = "null";
  let pluralSwitch = false;

  let duration = randomPick(durationList);
  let directTarget = randomPick(directTargetList);
  let areaTarget = randomPick(areaTargetList);
  let genTarget = randomPick(genTargetList);
  if (directTarget == "you") {
    directTargetType = true;
  } else {
    directTargetType = false;
  }
  switch (true) {
    case areaTarget == "you":
      areaTargetType = "you";
      break;
    case areaTarget == "your chosen target" ||
      areaTarget == "everyone in sight":
      areaTargetType = "they";
      break;
    case areaTarget == "whatever is most important nearby":
      areaTargetType = "it";
      break;
  }
  switch (true) {
    case genTarget == "you":
      genTargetType = "you";
      break;
    case genTarget == "your chosen target":
      genTargetType = "target";
      break;
    case genTarget == "everyone in sight":
      genTargetType = "every";
      break;
  }

  //Takes care of durations except wildcards
  switch (true) {
    case duration == "forever":
      duration = "permanently";
      break;
    default:
      duration = "for " + duration;
  }

  switch (
    true //Magic FX types switch
  ) {
    //Direct target FX
    //abilities
    case magCat == "abilityTo":
      effect = randomPick(abilityToList);
      targetType = "direct";
      magic += directTarget + " gainSHere the ability to ";
      if (inside(effect, abilityAbsoluteList) == false) {
        let notWell = Math.random();
        if (notWell <= 0.3) {
          append = ", but not very well, ";
        } else {
          effect += " ";
        }
      } else {
        effect += " ";
      }
      if (duration == "for wildcard") {
        duration = "until " + randomPick(goodWildDurations);
      }
      break;

    //control
    case magCat == "control":
      effect = randomPick(controlList);
      targetType = "direct";
      magic += directTarget + " can now control ";
      let notWell = Math.random();
      if (notWell <= 0.3) {
        append = ", but not very well, ";
      } else {
        effect += " ";
      }
      if (duration == "for wildcard") {
        duration = "until " + randomPick(goodWildDurations);
      }
      break;

    //immunity
    case magCat == "immunity":
      effect = randomPick(immunityList) + " ";
      targetType = "direct";
      magic += directTarget + " areIs now immune to ";
      if (duration == "for wildcard") {
        duration = "until " + randomPick(goodWildDurations);
      }
      break;

    //body changes
    case magCat == "bodyChange":
      effect = randomPick(bodyChangeList) + " ";
      targetType = "direct";
      if (directTargetType == true) {
        magic += "your ";
      } else {
        magic += "your chosen target's ";
      }
      if (duration == "for wildcard") {
        duration = "until " + randomPick(wildDurations);
      }
      break;

    //status effects
    case magCat == "statusEffect":
      effect = randomPick(statusEffectList);
      targetType = "direct";
      magic += directTarget + " areIs now ";
      if (inside(effect, statusInstantList) == false) {
        duration = " for " + randomPick(statusDurationList);
      } else {
        duration = "";
      }
      break;

    //Area target FX
    //transformations
    case magCat == "transform":
      effect = randomPick(transformList) + " ";
      targetType = "area";
      magic += areaTarget + " transformSHere into ";
      if (duration == "for wildcard") {
        duration = "until " + randomPick(wildDurations);
      }
      break;

    //sensorium
    case magCat == "sensorium":
      effect = randomPick(sensoriumList);
      targetType = "gen";
      if (effect != "illusion") {
        duration = "";
      } else {
        duration = " " + duration;
      }
      list = eval(effect + "List");
      if (effect == "illusion") {
        effect = "appear";
        list = illusionList;
      }
      magic += genTarget + " ";
      effect += "SHere " + randomPick(list);
      break;

    //General target FX
    //summons
    case magCat == "summon":
      effect = randomPick(summonList);
      targetType = "gen";
      append = " suddenly appears";
      duration = "";
      if (inside(effect, summonCreatureList) == true) {
        let prefix = Math.random();
        if (prefix <= 0.75 && effect.search("elemental") == -1) {
          effect = randomPick(summonPrefixList) + " " + effect;
        }
        let pluralSummon = Math.random();
        if (pluralSummon <= 0.5 && inside(effect, summonSingleList) == false) {
          pluralSwitch = true;
          effect = "group of " + effect;
        }
        let suffix = Math.random();
        if (suffix <= 0.5) {
          append = " " + randomPick(summonSuffixList);
        }
      } else {
        let pluralSummon = Math.random();
        if (pluralSummon <= 50 && inside(effect, summonSingleList) == false) {
          pluralSwitch = true;
          effect = "pile of " + effect;
        }
      }
      effect = aan(effect) + "PluralTarget";

      break;

    //misc
    case magCat == "misc":
      effect = randomPick(miscList);
      targetType = "gen";
      switch (true) {
        case effect == "all corpses within a 3-meter radius come back to life":
          effect += " as " + randomPick(undeadList);
          break;
        case effect == "find startTarget irresistible" ||
          effect == "find startTarget repugnant":
          effect =
            "all " + randomPick(attractList) + "s " + effect + " " + duration;
          break;
        case effect == "attacked by":
          effect =
            "startTarget areIs suddenly " +
            effect +
            " " +
            randomPick(attackList);
          break;
        case effect == "thinkSHere justTarget are a":
          effect = "startTarget " + effect + " " + randomPick(thinkAreList);
          break;
      }
      duration = "";
      break;
  } //close entire magCat switch

  // final put-together of sentence
  magic += effect + append + duration;

  // replaces placeholders with target-specific words
  switch (true) {
    case targetType == "direct":
      if (directTargetType == true) {
        magic = magic.replace(/justTarget/g, "you");
        magic = magic.replace(/possesiveTarget/g, "your");
        magic = magic.replace(/SHere/g, "");
        magic = magic.replace(/areIs/g, "are");
      } else {
        magic = magic.replace(/justTarget/g, "they");
        magic = magic.replace(/possesiveTarget/g, "their");
        magic = magic.replace(/SHere/g, "s");
        magic = magic.replace(/areIs/g, "is");
      }
      break;
    case targetType == "area":
      switch (true) {
        case areaTargetType == "you":
          magic = magic.replace(/justTarget/g, "you");
          magic = magic.replace(/themTarget/g, "your");
          magic = magic.replace(/possesiveTarget/g, "your");
          magic = magic.replace(/SHere/g, "");
          magic = magic.replace(/areIs/g, "are");
          break;
        case areaTargetType == "they":
          magic = magic.replace(/justTarget/g, "they");
          magic = magic.replace(/themTarget/g, "them");
          magic = magic.replace(/possesiveTarget/g, "their");
          magic = magic.replace(/SHere/g, "s");
          magic = magic.replace(/areIs/g, "is");
          break;
        case areaTargetType == "it":
          magic = magic.replace(/justTarget/g, "it");
          magic = magic.replace(/themTarget/g, "it");
          magic = magic.replace(/possesiveTarget/g, "its");
          magic = magic.replace(/SHere/g, "s");
          magic = magic.replace(/areIs/g, "is");
          break;
      }
      break;
    case targetType == "gen":
      switch (true) {
        case genTargetType == "you":
          magic = magic.replace(/startTarget/g, "you");
          magic = magic.replace(/justTarget/g, "you");
          magic = magic.replace(/themTarget/g, "your");
          magic = magic.replace(/possesiveTarget/g, "your");
          magic = magic.replace(/SHere/g, "");
          magic = magic.replace(/areIs/g, "are");
          break;
        case genTargetType == "target":
          magic = magic.replace(/startTarget/g, "your chosen target");
          magic = magic.replace(/justTarget/g, "they");
          magic = magic.replace(/themTarget/g, "them");
          magic = magic.replace(/possesiveTarget/g, "their");
          magic = magic.replace(/SHere/g, "s");
          magic = magic.replace(/areIs/g, "is");
          break;
        case genTargetType == "every":
          magic = magic.replace(/startTarget/g, "every person in sight");
          magic = magic.replace(/justTarget/g, "they");
          magic = magic.replace(/themTarget/g, "them");
          magic = magic.replace(/possesiveTarget/g, "their");
          magic = magic.replace(/SHere/g, "s");
          magic = magic.replace(/areIs/g, "is");
          break;
      }
      break;
  } // close replacement switch
  if (pluralSwitch == true) {
    magic = magic.replace(/PluralTarget/g, "s");
  } else {
    magic = magic.replace(/PluralTarget/g, "");
  }

  magic = magic.charAt(0).toUpperCase() + magic.slice(1) + ".";
  print(magic);
} //close entire function
