
//declares canvas object
let canvas = document.getElementById('canvas');

//resizes canvas based on user's window
canvas.width = 800;
canvas.height = 800;

//declares canvas 2d context
var c = canvas.getContext('2d');

const blockWidth = 100;
const blockHeight = 100;
let testData = 0;

var lootArray =[];

//items

var itemGenerationArray = [];

class StatusEffect{
  constructor(obj){
    this.stat = obj.stat
    this.ranges = obj.ranges
    this.rangesEffects = obj.rangesEffects
    this.rangesEffectsType = obj.rangesEffectsType
    this.minILvl = obj.minILvl;
  }



  returnRangeValue(ilvl){
  for(var i = 0; i<this.ranges.length;i++){
    if(ilvl>= this.ranges[i][0] && ilvl <= this.ranges[i][1]){
      var statAmount = getRandomIntMinMax(this.rangesEffects[i][0],this.rangesEffects[i][1]);
    }
  }
  var lll = [this.stat,this.rangesEffectsType,statAmount];
  return lll;
  }
}

class ChangeStatusEffect{
  constructor(obj){
    this.stat = obj.stat
    this.ranges = obj.ranges
    this.rangesEffects = obj.rangesEffects
    this.rangesEffectsType = obj.rangesEffectsType
  }
}

var hpUpPercentage = {
  stat : 'HP',
  ranges:[[1,20],[21,40]],
  rangesEffects:[[1,2],[2,5]],
  rangesEffectsType : 'Percentage',
  minILvl : 1
}

var hpUpNumeric = {
  stat : 'HP',
  ranges : [[1,20],[21,40]],
  rangesEffects : [[10,50],[40,120]],
  rangesEffectsType : 'Numeric',
  minILvl : 1
}

var amuletRegeneration = {
  stat: 'AmuletRegen',
  ranges:[[20,40],[41,70]],
  rangesEffects:[[1,2],[2,5]],
  rangesEffectsType : 'Percentage',
  minILvl : 20
}

var damageNumeric = {
  stat: 'Damage',
  ranges:[[1,40],[41,70]],
  rangesEffects:[[5,10],[7,18]],
  rangesEffectsType : 'Numeric',
  minILvl : 1
}

var damagePercentage = {
  stat: 'Damage',
  ranges:[[20,40],[41,70]],
  rangesEffects:[[1,5],[2,10]],
  rangesEffectsType : 'Percentage',
  minILvl : 20
}

var defenseNumeric = {
  stat: 'Defense',
  ranges:[[1,40],[41,70]],
  rangesEffects:[[1,15],[5,20]],
  rangesEffectsType : 'Numeric',
  minILvl : 1
}

var defensePercentage = {
  stat: 'Defense',
  ranges:[[20,40],[41,70]],
  rangesEffects:[[1,5],[2,8]],
  rangesEffectsType : 'Percentage',
  minILvl : 20
}

var hpPerSecond = {
  stat: 'hpPer5Seconds',
  ranges:[[20,40],[41,70]],
  rangesEffects:[[1,2],[1,4]],
  rangesEffectsType : 'Numeric',
  minILvl : 20
}
var tempArray = [];
itemGenerationArray.push(new StatusEffect(hpUpPercentage));
itemGenerationArray.push(new StatusEffect(hpUpNumeric));
itemGenerationArray.push(new StatusEffect(amuletRegeneration));
itemGenerationArray.push(new StatusEffect(damageNumeric));
itemGenerationArray.push(new StatusEffect(damagePercentage));
itemGenerationArray.push(new StatusEffect(defenseNumeric));
itemGenerationArray.push(new StatusEffect(defensePercentage));
itemGenerationArray.push(new StatusEffect(hpPerSecond));

var stats = [['HP', 100], ['AmuletRegen', 100], ['Damage', 50],['Defense', 0],['hpPer5Seconds',0]];
var statsArray = [];

function animate(){
  for(var i = 0; i<20; i++){
    lootArray.push(new Loot);
  }
  for(var i = 0;i<lootArray.length;i++){
    lootArray[i].identify();
  }
  var pol = JSON.stringify(lootArray)
  console.log(pol);

  pushStats(statsArray, lootArray[0])
}

class Stat{
  constructor(name, base){
    this.name = name;
    this.base = base;
    this.numeric = 0;
    this.percentage = 0;
    this.actual = this.base;
  }
}

for(var i = 0;i<stats.length;i++){
  statsArray.push(new Stat(stats[i][0],stats[i][1]))
}

var hpUp = {
  stat:"HP",
  minLevel:1,
  range1MinLevel:1,
  range1MaxLevel:20,
  range2MinLevel:21,
  range2MaxLevel:40,
  range1MinNumeric:10,
  range1MaxNumeric:50,
  range2MinNumeric:40,
  range2MaxNumeric:120,
  range1MinNumeric:0.01,
  range1MaxNumeric:0.02,
  range2MinNumeric:0.02,
  range2MaxNumeric:0.05
}

//when items are dropped, an item level is assigned depending on the monster's item level range.
//i.e. Duck - ilvl range of min 15 to max 25

var duck = {
  minILvl:15,
  maxILvl:25
}

//ringILvl = getRandomIntMinMax(duck.minILvl,duck.maxILvl);
//loot = new UnidentifiedRing(ringILvl);
class Loot{
  constructor(){
    this.iLvl =  getRandomIntMinMax(1,40)
    this.affix = [];
    this.affixCount = 0;
    this.tempArray = [];
    this.tempAffix =[];
    this.displayName = '';
  }

  identify(){
    //determines how many affixes this item will have
    if(this.iLvl>25){this.affixCount = 4}
    else{this.affixCount = 2}
    //determines which affixes this item can have
    for(var i=0; i<itemGenerationArray.length;i++){
      if(itemGenerationArray[i].minILvl<=this.iLvl){
        this.tempArray.push(itemGenerationArray[i])
      }
    }
    //determines which affixes this item will have
    for(var i = 0;i<this.affixCount;i++){
      var x = false;
      while(!x){
        var rand = getRandomIntMinMax(0,this.tempArray.length-1);
        x=true;
        for(var j = 0; j<this.tempAffix.length;j++){
          if(this.tempAffix[j] == rand){x = false}
        }
      }
      this.tempAffix.push(rand)
    }
    //determines stat rolls depending on ilvl
    for(var i = 0; i<this.tempAffix.length;i++){
      this.affix.push(this.tempArray[this.tempAffix[i]].returnRangeValue(this.iLvl));
    }
    this.tempArray = [];
    this.displayName = this.affix[0][0] + ' ring';
  }
}


animate();

function affectStat(stat,affix){
  switch(affix[1]){
    case "Numeric":
      stat.numeric += affix[2];
      return;
    case "Percentage":
      stat.percentage += affix[2];
      return;
  }
}

//target will be statArray
//item will be the loot
function pushStats(target, item){
  //adds stats to target
  for(var i = 0;i<item.affix.length;i++){
    //switch is the stat portion of the affix array
    switch(item.affix[i][0]){
      case "HP":
        affectStat(statsArray[0],item.affix[i]);
        break;
      case "AmuletRegen":
        affectStat(statsArray[1],item.affix[i]);
        break;
      case "Damage":
        affectStat(statsArray[2],item.affix[i]);
        break;
      case "Defense":
        affectStat(statsArray[3],item.affix[i]);
        break;
      case "hpPer5Seconds":
        affectStat(statsArray[4],item.affix[i]);
        break;
    }
  }
  //recalculates stats called by game
  //imagines that statArray was pushed to include stat objects such as the following:
  //stat{
  //name:"hp"
  //base:100
  //numeric:0,
  //percentage:100,
  //actual:100
  //}
  //game should be referring directly to statArray.actual for calls.
  for(var i = 0; i<statsArray.length;i++){
    statsArray[i].actual = (statsArray[i].base + statsArray[i].numeric)*(statsArray[i].percentage/100);
  }
}




function getRandomIntMinMax(min, max) {
  max += 1
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntMinMaxDecimal(min, max,decimal) {
  max += 1
  min = Math.ceil(min);
  max = Math.floor(max);
  switch(decimal){
    case 0:
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      break;
    case 1:
      return (Math.floor(Math.random() * (max - min) + min))/10
      break;
    case 2:
      return (Math.floor(Math.random() * (max - min) + min))/10
      break;
  }
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
