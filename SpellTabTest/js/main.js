
//declares canvas object
let canvas = document.getElementById('canvas');

//resizes canvas based on user's window
canvas.width = 1900;
canvas.height = 1000;

//declares canvas 2d context
var c = canvas.getContext('2d');

const gravityCoefficient = 2;

let input= {
zKey : false,
xKey : false,
aKey : false,
sKey : false,
vKey : false,

leftArrowKey : false,
downArrowKey : false,
rightArrowKey : false,
upArrowKey : false
}

window.addEventListener('keydown',function(event){
  if(event.key === "z")input.zKey = true;
  if (event.key === "x")input.xKey = true;
  if (event.key === "a")input.aKey = true;
  if (event.key === "s")input.sKey = true;
  if (event.key === "v")input.vKey = true;
  if (event.key === "f")input.fKey = true;
  if (event.key === "ArrowLeft")input.leftArrowKey = true;
  if (event.key === "ArrowDown")input.downArrowKey = true;
  if (event.key === "ArrowRight")input.rightArrowKey = true;
  if (event.key === "ArrowUp")input.upArrowKey = true;
})

window.addEventListener('keyup',function(event){
  if (event.key === "z")input.zKey = false;
  if (event.key === "x")input.xKey = false;
  if (event.key === "a")input.aKey = false;
  if (event.key === "s")input.sKey = false;
  if (event.key === "v")input.vKey = false;
  if (event.key === "f")input.fKey = false;
  if (event.key === "ArrowLeft")input.leftArrowKey = false;
  if (event.key === "ArrowDown")input.downArrowKey = false;
  if (event.key === "ArrowRight")input.rightArrowKey = false;
  if (event.key === "ArrowUp")input.upArrowKey = false;
})

const tabW = 300;
const mainWindowXStart = tabW + 25;
const mainWindowYStart = 50;
const mainWindowTextOffset = 500;
const mainWindowGemOffset = 75;
const mainWindowGemRadius = 25;
const mainWindowYOffset = 100;
const selectedH = 75;
const normalH = 50;
var spellsKnownArray = [];
var gameState = 'mainMenu';

function animate(){
c.clearRect(0, 0, innerWidth, innerHeight);
switch(gameState){
  case 'spellPage':
    spellPage.update();
    break;
  case 'mainMenu':
    mainMenu.update();
    break;
}
weather.update();

setTimeout(animate, 1000/60);
var t = 0;
t = t+1;
}

class Weather{
  constructor(){
    this.rainFrequencyAbsolute = 1;
    this.rainFrequencyCounter = this.rainFrequencyAbsolute;
    this.rainLength = 50;
    this.rainAlpha = 0.5;
    this.thickness = 3;
    this.raindropArray = [];
    this.randomX = 0;
    this.rainVelocity = 10;
    this.fogOpacity = 0.7;
    this.drawFogCon = true;
    this.rain = false;
  }

  rainFrequencyCheck(){
    if(this.rainFrequencyAbsolute == this.rainFrequencyCounter){return true}
    return false;
  }

  drawFog(){
    c.globalAlpha = this.fogOpacity
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
  }

  update(){
    if(this.rain){
    if(this.rainFrequencyCheck()){
      this.randomX = getRandomInt(this.thickness, canvas.width);
      this.raindropArray.push(new RainDrop(this.rainAlpha,this.rainLength,this.randomX, this.thickness, this.rainVelocity))
      this.rainFrequencyCounter=0;
    }
    else{this.rainFrequencyCounter+=1;}

    //check raindropArray and delete anything with status 'delete,' otherwise update
    for(var i = 0; i<this.raindropArray.length; i++){
      if(this.raindropArray[i].status == 'delete'){
        this.raindropArray.splice(i,1);
        i -= 1;
      }
      else{this.raindropArray[i].update();}
    }
    if(this.drawFogCon){this.drawFog()}
  }
  }
}

class RainDrop{
  constructor(alpha, length, ranx, thickness, speed){
    this.x = ranx;
    this.y = 0;
    this.h = length;
    this.alpha = alpha;
    this.rainVelocity = speed;
    this.w = thickness;
    this.status = 'run';
    this.dy = 0;
    this.ddy=0;
    this.oldGrounded = false;
    this.ddx = 0;
    this.dx = 0;
  }
  draw(){
    c.globalAlpha = this.alpha;
    c.strokeStyle = 'blue';
    c.lineWidth = this.w;


    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.x,this.y-this.h);
    c.stroke();

    c.lineWidth = 1;
    c.globalAlpha = 1;
  }
  update(){
    if(this.y-this.h>= canvas.height){
      this.status = 'delete'}
    this.draw();
    this.y += this.rainVelocity;
  }
}

function applyGravity(obj1){
  if(!obj1.oldGrounded){
    obj1.ddy += gravityCoefficient;
  }
}

function applyVelocity(obj1){

  obj1.dx += obj1.ddx;
  obj1.dy += obj1.ddy;

  obj1.x += obj1.dx;
  obj1.y += obj1.dy;
  return;
}

class Upgrade{
  constructor(parent, name){
    this.parent = parent
    this.name = name;
    this.upgrade = [false, false, false];
    this.bonus = ['none', 'none', 'none'];
    this.cost = [0,0,0];
    this.active = false;
    this.setup = false;
    if(this.name == 'angelic' && (this.parent == 'Cure' || this.parent == 'Reckless Assault')){this.upgrade = [true,true,true]}
  }
}

class Loyalty{
  constructor(){
    this.setup = false;
    this.loyalty = [];
    this.loyalty.push(new Upgrade('demonic'));
    this.loyalty.push(new Upgrade('arcanist'));
    this.loyalty.push(new Upgrade('angelic'));
  }
}

class Spell{
  constructor(name){
    this.actualName = name;
    this.setup = false;
    this.xSelect = 0;
    this.ySelect = 0;
    this.activeColor = 'pink';
    this.inactiveColor = 'black';
    this.loyalty = [];
    this.loyalty.push(new Upgrade(this.actualName, 'demonic'));
    this.loyalty.push(new Upgrade(this.actualName, 'arcanist'));
    this.loyalty.push(new Upgrade(this.actualName, 'angelic'));
    this.uiText = spellInformation[this.actualName];
    }

setupFunc(){
  this.setup = true;
}

draw(){
  //will only be called when "selected,"
  c.globalAlpha = 1;
  for(var i = 0; i<3;i++){
    var thisX = mainWindowXStart+mainWindowTextOffset;
    var thisY = mainWindowYStart+(mainWindowYOffset*i)
    //activation orb
    if(this.loyalty[i].active){
      c.fillStyle = this.activeColor;
      c.beginPath();
      c.ellipse(thisX,thisY,mainWindowGemRadius,mainWindowGemRadius, Math.PI, 0, 2 * Math.PI)
      c.fill();
    }
    else{
      c.fillStyle = this.inactiveColor;
      c.beginPath();
      c.ellipse(thisX,thisY,mainWindowGemRadius,mainWindowGemRadius, Math.PI, 0, 2 * Math.PI)
      c.fill();
    }
    //ability orbs
    for(var j = 0;j<3;j++){
      var thisX = mainWindowXStart+mainWindowTextOffset+(mainWindowGemOffset*(j+1));
      var thisY = mainWindowYStart+(mainWindowYOffset*i)
      if(this.loyalty[i].upgrade[j]){
        c.fillStyle = this.activeColor;
        c.beginPath();
        c.ellipse(thisX,thisY,mainWindowGemRadius,mainWindowGemRadius, Math.PI, 0, 2 * Math.PI)
        c.fill();
      }
      else{
        c.fillStyle = this.inactiveColor;
        c.beginPath();
        c.ellipse(thisX,thisY,mainWindowGemRadius,mainWindowGemRadius, Math.PI, 0, 2 * Math.PI)
        c.fill();
      }
    }
  }
  thisX = mainWindowXStart+mainWindowTextOffset;
  thisY += mainWindowYOffset;
  c.fillStyle = 'black';
  c.font = 25 + 'px serif';
  c.fillText(this.uiText, thisX, thisY);

}

update(){
  if(!this.setup){
    this.setupFunc();
  }
  this.draw();
}
}

class SpellPage{
constructor(){
this.tabChangeCooldown = 10;
this.tabChangeCooldownAbsolute = 10;
this.spellSlotSelected = 0;
this.yDraw = 0;
this.xDraw = 0;
this.setup = false;
this.fillColor = 'red';
this.textColor = 'black';
this.textOffsetNormal = (0.1*normalH);
this.textOffsetSelected = (0.2*selectedH);
this.textSizeNormal = normalH - (2*this.textOffsetNormal);
this.textSizeSelected = selectedH - (2*this.textOffsetSelected);
//to do
}

setupFunc(){
//????
this.setup = true;
}

checkTabCooldown(){
if(this.tabChangeCooldown == this.tabChangeCooldownAbsolute){return true}
return false;
}

draw(x,y,w,h,text,selected){
//draws at the given x y w h with text in the right place
c.globalAlpha = 1;
c.fillStyle = this.fillColor;
c.fillRect(x,y,w,h);
c.strokeRect(x,y,w,h);
c.fillStyle = this.textColor;
c.textAlign = 'center';
if(selected){
  c.font = this.textSizeSelected + 'px serif';
  c.fillText(text, x+(0.5*tabW), y+selectedH-this.textOffsetSelected*2);

}
else{
  c.font = this.textSizeNormal + 'px serif';
  c.fillText(text, x=(0.5*tabW), y+normalH-this.textOffsetNormal*2);
}
}

update(){
  if(!this.setup){this.setupFunc()}
  if(!this.checkTabCooldown()){this.tabChangeCooldown += 1}
  if(this.spellSlotSelected != 0 && input.upArrowKey && this.checkTabCooldown()){
    this.spellSlotSelected -= 1;
    this.tabChangeCooldown = 0;
    }
  else if(this.spellSlotSelected != spellsKnownArray.length-1 && input.downArrowKey && this.checkTabCooldown()){
    this.spellSlotSelected += 1;
    this.tabChangeCooldown = 0;
    }
  if(input.xKey && this.checkTabCooldown()){mainMenu.menuState = 'mainMenu';}
  for (var i = 0;i<spellsKnownArray.length;i++){
    if(i == this.spellSlotSelected){
      this.draw(this.xDraw,this.yDraw,tabW,selectedH, spellsKnownArray[i].actualName,true);
      this.yDraw += selectedH;
      spellsKnownArray[i].update();
      }
    else{
      this.draw(this.xDraw,this.yDraw,tabW, normalH, spellsKnownArray[i].actualName,false);
      this.yDraw += normalH;
      }
  }
  this.yDraw=0;
  }
}

var spellsKnownArray = [];
var spellInformation = {
  'Cure' : 'this spell cures.',
  'Regen' : 'this spell causes the target to regenerate health.',
  'Ice Bolt' : 'this spell causes the caster to create three ice bolts, which hang for a few moments and then fly towards the nearest enemy.',
  'Haste' : "this spell increases the caster's attack speed and movement speed.",
  'Sense Treasure' : 'this spell alerts the caster if there is treasure nearby',
  'Vampirism' : 'this spell causes the caster to regenerate health upon one of its melee attacks dealing damage',
  'Wish' : 'this spell returns 0 hp or full hp.',
  'Reckless Assault' : 'this spell increases damage dealt by the caster while also increasing damage taken by the caster.'
}

var testAffix = ['HP + 5', 'Damage + 10', 'Ammu regen + 10%']

class EquipmentWindow{
  constructor(startingX, startingY, item, selected, equipped){
    this.item = item;
    this.normalFillColor = 'grey';
    this.displayXOffset = startingX;
    this.displayYOffset = startingY;
    this.displayWidth = 600;
    this.iconXOffset = this.displayXOffset + 25;
    this.iconYOffset = this.displayYOffset + 25;
    this.iconWidth = 100
    this.iconHeight = 100
    this.iconColor = 'yellow'
    this.titleTextSize = 50;
    this.titleTextXOffset = this.iconXOffset + this.iconWidth + 25;
    this.titleTextYOffset = this.iconYOffset + this.iconHeight/2;
    this.affixTextSize = 40
    this.affixXOffset = this.iconXOffset
    this.affixInitialYOffset = this.iconYOffset + this.iconHeight + 75;
    this.affixMarginalYOffset =this.affixTextSize + 10;
    this.displayHeight = (this.item.affix.length-2)*this.affixMarginalYOffset+this.affixInitialYOffset;
    this.selected = selected;
    this.equipped = equipped;
    this.equipmentSelected = false;
    if(this.equipped){
      if(inventoryMenu.equipmentBoxArray[0] == this.item || !inventoryMenu.equipmentBoxArray[0]){
        this.displayYOffset = inventoryMenu.displayYOffset;
      }
      else{
        this.displayYOffset = inventoryMenu.equipmentBoxArray[0].displayHeight + 50 + inventoryMenu.equipmentBoxArray[0].displayYOffset;
        this.iconYOffset = this.displayYOffset + 25;
        this.titleTextYOffset = this.iconYOffset + this.iconHeight/2;
        this.affixInitialYOffset = this.iconYOffset + this.iconHeight + 75;
      }
    }
    if(this.selected){
      this.compareTextSize = 35;
      this.compareMarginalYOffset = this.compareTextSize + 5;
      this.compareArray = compare(inventoryMenu.equipmentBoxArray[inventoryMenu.equipmentSelected].item.affix, this.item.affix)
      if(this.compareArray[0]){
      this.displayHeight = (this.item.affix.length-2)*this.affixMarginalYOffset+this.affixInitialYOffset+(this.compareArray.length)*this.compareMarginalYOffset;
      }
    }
  }

  selected(){
    this.selected = true;
    this.equipmentSelected = false;
    this.compareTextSize = 35;
    this.compareMarginalYOffset = this.compareTextSize + 5;
    this.compareArray = compare(inventoryMenu.equipmentBoxArray[inventoryMenu.equipmentSelected].item.affix, this.item.affix)
    if(this.compareArray[0]){
    this.displayHeight = (this.item.affix.length-2)*this.affixMarginalYOffset+this.affixInitialYOffset+(this.compareArray.length)*this.compareMarginalYOffset;
  }
}

  newCompare(target){
    this.compareArray = compare(target, this.item.affix)
    if(this.compareArray[0]){
    this.displayHeight = (this.item.affix.length-2)*this.affixMarginalYOffset+this.affixInitialYOffset+(this.compareArray.length)*this.compareMarginalYOffset;
    }
    else{this.displayHeight = (this.item.affix.length-2)*this.affixMarginalYOffset+this.affixInitialYOffset}
  }

  calculateYOffset(){
    if(inventoryMenu.equipmentBoxArray[0].item == this.item || !inventoryMenu.equipmentBoxArray[0]){
      this.displayYOffset = inventoryMenu.displayYOffset;
      this.iconYOffset = this.displayYOffset + 25;
      this.titleTextYOffset = this.iconYOffset + this.iconHeight/2;
      this.affixInitialYOffset = this.iconYOffset + this.iconHeight + 75;
      this.displayHeight = (this.item.affix.length-2)*this.affixMarginalYOffset+this.affixInitialYOffset;

    }
    else{
      this.displayYOffset = inventoryMenu.equipmentBoxArray[0].displayHeight + 50 + inventoryMenu.equipmentBoxArray[0].displayYOffset;
      this.iconYOffset = this.displayYOffset + 25;
      this.titleTextYOffset = this.iconYOffset + this.iconHeight/2;
      this.affixInitialYOffset = this.iconYOffset + this.iconHeight + 75;
    }
    // this.selected = false;
  }

  draw(){
    c.fillStyle = this.normalFillColor
    c.fillRect(this.displayXOffset,this.displayYOffset,this.displayWidth,this.displayHeight);
    c.strokeRect(this.displayXOffset,this.displayYOffset,this.displayWidth,this.displayHeight);

    if(this.equipmentSelected){
      c.lineWidth = 5
      c.strokeStyle = 'red';
      c.strokeRect(this.displayXOffset+4,4+this.displayYOffset,this.displayWidth-8,this.displayHeight-8)
      c.strokeStyle = 'black';
      c.lineWidth = 1;
    }

    c.fillStyle = this.iconColor;
    c.fillRect(this.iconXOffset,this.iconYOffset,this.iconWidth,this.iconHeight);
    c.strokeRect(this.iconXOffset,this.iconYOffset,this.iconWidth,this.iconHeight);

    c.textAlign = 'left';
    c.fillStyle = 'black';
    c.font = this.titleTextSize + 'px serif';

    c.fillText(this.item.displayName, this.titleTextXOffset, this.titleTextYOffset);
    for(var i=0;i<this.item.affix.length;i++){
      c.textAlign = 'left';
      c.fillStyle = 'black';
      c.font = this.affixTextSize + 'px serif';
      if(this.item.affix[i][1] == 'Numeric'){
        var txtString = this.item.affix[i][0] + ' +' + this.item.affix[i][2];
      }
      else{
        var txtString = this.item.affix[i][0] + ' +' + this.item.affix[i][2] +'%';
      }
      c.fillText(txtString, this.affixXOffset, this.affixInitialYOffset + this.affixMarginalYOffset * i);
    }
    if(this.selected){
      for(var i=0;i<this.compareArray.length;i++){
        if(this.compareArray[i][2]<0){
          c.fillStyle = 'red'
          this.sign = ' ';
        }
        else{
          c.fillStyle = 'green';
          this.sign = ' +';
        }
        c.textAlign = 'left';
        c.font = this.compareTextSize + 'px serif';
        if(this.compareArray[i][1] == 'Numeric'){
          var txtString = this.compareArray[i][0] + this.sign + this.compareArray[i][2];
        }
        else{
          var txtString = this.compareArray[i][0] + this.sign + this.compareArray[i][2] +'%';
        }
        c.fillText(txtString, this.affixXOffset, this.affixInitialYOffset + this.affixMarginalYOffset * (this.item.affix.length)+i*this.compareMarginalYOffset);
        c.strokeStyle = 'black';
        c.strokeText(txtString, this.affixXOffset, this.affixInitialYOffset + this.affixMarginalYOffset * (this.item.affix.length)+i*this.compareMarginalYOffset)
      }
  }
}
}

var lootArray = [{"iLvl":40,"affix":[["hpPer5Seconds","Numeric",1],["Damage","Numeric",8],["Damage","Percentage",4],["Defense","Percentage",3]],"affixCount":4,"tempArray":[],"tempAffix":[7,3,4,6],"displayName":"hpPer5Seconds ring"},{"iLvl":38,"affix":[["Damage","Numeric",8],["HP","Percentage",4],["HP","Numeric",115],["hpPer5Seconds","Numeric",2]],"affixCount":4,"tempArray":[],"tempAffix":[3,0,1,7],"displayName":"Damage ring"},{"iLvl":7,"affix":[["HP","Percentage",1],["Defense","Numeric",3]],"affixCount":2,"tempArray":[],"tempAffix":[0,3],"displayName":"HP ring"},{"iLvl":34,"affix":[["HP","Numeric",119],["Defense","Percentage",3],["Damage","Percentage",2],["Defense","Numeric",6]],"affixCount":4,"tempArray":[],"tempAffix":[1,6,4,5],"displayName":"HP ring"},{"iLvl":31,"affix":[["HP","Percentage",5],["HP","Numeric",48],["hpPer5Seconds","Numeric",2],["Defense","Percentage",4]],"affixCount":4,"tempArray":[],"tempAffix":[0,1,7,6],"displayName":"HP ring"},{"iLvl":28,"affix":[["AmuletRegen","Percentage",2],["HP","Numeric",94],["Defense","Numeric",4],["HP","Percentage",2]],"affixCount":4,"tempArray":[],"tempAffix":[2,1,5,0],"displayName":"AmuletRegen ring"},{"iLvl":23,"affix":[["AmuletRegen","Percentage",1],["HP","Numeric",70]],"affixCount":2,"tempArray":[],"tempAffix":[2,1],"displayName":"AmuletRegen ring"},{"iLvl":37,"affix":[["HP","Numeric",57],["hpPer5Seconds","Numeric",2],["Damage","Percentage",4],["Defense","Numeric",6]],"affixCount":4,"tempArray":[],"tempAffix":[1,7,4,5],"displayName":"HP ring"},{"iLvl":11,"affix":[["Defense","Numeric",15],["Damage","Numeric",10]],"affixCount":2,"tempArray":[],"tempAffix":[3,2],"displayName":"Defense ring"},{"iLvl":33,"affix":[["AmuletRegen","Percentage",1],["hpPer5Seconds","Numeric",2],["Defense","Numeric",3],["Damage","Percentage",5]],"affixCount":4,"tempArray":[],"tempAffix":[2,7,5,4],"displayName":"AmuletRegen ring"},{"iLvl":21,"affix":[["Defense","Numeric",12],["hpPer5Seconds","Numeric",2]],"affixCount":2,"tempArray":[],"tempAffix":[5,7],"displayName":"Defense ring"},{"iLvl":31,"affix":[["Damage","Numeric",10],["hpPer5Seconds","Numeric",1],["HP","Numeric",61],["AmuletRegen","Percentage",1]],"affixCount":4,"tempArray":[],"tempAffix":[3,7,1,2],"displayName":"Damage ring"},{"iLvl":6,"affix":[["HP","Percentage",2],["HP","Numeric",38]],"affixCount":2,"tempArray":[],"tempAffix":[0,1],"displayName":"HP ring"},{"iLvl":22,"affix":[["Damage","Numeric",7],["AmuletRegen","Percentage",2]],"affixCount":2,"tempArray":[],"tempAffix":[3,2],"displayName":"Damage ring"},{"iLvl":17,"affix":[["HP","Numeric",39],["Damage","Numeric",6]],"affixCount":2,"tempArray":[],"tempAffix":[1,2],"displayName":"HP ring"},{"iLvl":1,"affix":[["Damage","Numeric",9],["HP","Percentage",2]],"affixCount":2,"tempArray":[],"tempAffix":[2,0],"displayName":"Damage ring"},{"iLvl":35,"affix":[["AmuletRegen","Percentage",1],["Defense","Numeric",13],["Damage","Numeric",6],["hpPer5Seconds","Numeric",2]],"affixCount":4,"tempArray":[],"tempAffix":[2,5,3,7],"displayName":"AmuletRegen ring"},{"iLvl":10,"affix":[["HP","Numeric",47],["Damage","Numeric",8]],"affixCount":2,"tempArray":[],"tempAffix":[1,2],"displayName":"HP ring"},{"iLvl":18,"affix":[["Damage","Numeric",10],["HP","Percentage",1]],"affixCount":2,"tempArray":[],"tempAffix":[2,0],"displayName":"Damage ring"},{"iLvl":29,"affix":[["HP","Numeric",100],["hpPer5Seconds","Numeric",1],["Defense","Numeric",8],["AmuletRegen","Percentage",2]],"affixCount":4,"tempArray":[],"tempAffix":[1,7,5,2],"displayName":"HP ring"}];

class InventoryMenu{
  constructor(){
    this.blockWidth = 300;
    this.blockHeight = 50;
    this.xOffset = canvas.width/2-this.blockWidth/2;
    this.initialYOffset = 100;
    this.marginalYOffset = this.blockHeight;
    this.normalFillColor = 'grey';
    this.boxesDrawn = 10;
    this.selected = 0;
    this.selectedBlockWidth = this.blockWidth - 8;
    this.selectedBlockHeight = this.blockHeight - 8;
    this.tabChangeCooldownAbsolute = 10;
    this.tabChangeCooldown = 0;
    this.displayXOffset = 100;
    this.displayYOffset = this.initialYOffset;
    this.displayWidth = 500;
    this.displayHeight = 700;
    this.iconWidth = 100;
    this.iconHeight = 100;
    this.iconColor = 'yellow';
    this.iconXOffset = this.displayXOffset + 25;
    this.iconYOffset = this.displayYOffset + 25;
    this.titleTextXOffset = this.iconXOffset + this.iconWidth + 25;
    this.titleTextYOffset = this.iconYOffset + this.iconHeight/2;
    this.titleText = 'Ring of Power';
    this.titleTextSize = 50;
    this.status = "menu";
    this.equipmentSelected = 0;

    this.testAffix = testAffix;
    this.affixInitialYOffset = this.iconYOffset + this.iconHeight + 75;
    this.affixXOffset = this.iconXOffset;
    this.affixTextSize = 40;
    this.affixMarginalYOffset = this.affixTextSize + 10;
    this.selectedBoxArray = [];
    this.equipmentBoxArray = [];
    this.inventory = lootArray;
    this.maxBoxesDrawn = 20
    if(this.inventory.length>this.maxBoxesDrawn){this.boxesDrawn = this.maxBoxesDrawn}
    else{this.boxesDrawn = this.inventory.length}
    }


  checkTabCooldown(){
    if(this.tabChangeCooldown == this.tabChangeCooldownAbsolute){return true}
    return false;
    }

  draw(){
    if(!this.equipmentBoxArray[0]){
      for(var i=0;i<2;i++){
      this.equipmentBoxArray.push(new EquipmentWindow(this.displayXOffset, this.displayYOffset, this.inventory[0],false, true))
      p.pushStats(compare(0,this.inventory[0].affix))
      this.inventory.splice(0,1);
    }
      this.equipmentBoxArray[0].equipmentSelected = true;
    }
    if(!this.selectedBoxArray[0]){
      this.selectedBoxArray.push(new EquipmentWindow(this.xOffset + this.blockWidth + 25, this.displayYOffset, this.inventory[this.selected],true, false))
    }
    for(var i = 0;i<this.equipmentBoxArray.length;i++){
      this.equipmentBoxArray[i].draw()
    }
    for(var i = 0;i<this.selectedBoxArray.length;i++){
      this.selectedBoxArray[i].draw()
    }
    if(this.inventory.length>this.maxBoxesDrawn){this.boxesDrawn = this.maxBoxesDrawn}
    else{this.boxesDrawn = this.inventory.length}
    for(var i = 0; i<this.boxesDrawn; i++){
      var centerX = this.xOffset + (0.5*this.blockWidth);
      var centerY = this.initialYOffset + this.marginalYOffset*i + (0.60*this.blockHeight);
      c.fillStyle = this.normalFillColor
      c.fillRect(this.xOffset,this.initialYOffset + this.marginalYOffset*i,this.blockWidth,this.blockHeight);
      c.strokeRect(this.xOffset,this.initialYOffset + this.marginalYOffset*i,this.blockWidth,this.blockHeight);
      if(i == this.selected){
        c.lineWidth = 5
        c.strokeStyle = 'red';
        c.strokeRect(this.xOffset+4,4+this.initialYOffset + this.marginalYOffset*i,this.selectedBlockWidth,this.selectedBlockHeight)
        c.strokeStyle = 'black';
        c.lineWidth = 1;
        }
      c.textAlign = 'center';
      c.fillStyle = 'black';
      c.font = 25 + 'px serif';
      if(this.inventory[i].displayName){c.fillText(this.inventory[i].displayName, centerX, centerY)}
    }
}

  pushNewItem(){
    this.selectedBoxArray =[];
    this.selectedBoxArray.push(new EquipmentWindow(this.xOffset + this.blockWidth + 25, this.displayYOffset, this.inventory[this.selected],true, false));
  }

update(){
  if(!this.checkTabCooldown()){this.tabChangeCooldown += 1}
  switch(this.status){
    case "menu":
      if(input.xKey && this.checkTabCooldown()){
        mainMenu.menuState = 'mainMenu';
      }
      if(input.zKey && this.checkTabCooldown()){
        this.status = "equipment";
        this.tabChangeCooldown = 0;
      }
      if(input.downArrowKey && this.checkTabCooldown() && this.selected<this.boxesDrawn-1){
        this.selected += 1
        this.pushNewItem();
        this.tabChangeCooldown = 0;
        }
      if(input.upArrowKey && this.checkTabCooldown() && this.selected>0){
        this.selected -= 1
        this.pushNewItem();
        this.tabChangeCooldown = 0;
        }
      break;
    case "equipment":
      if(input.xKey && this.checkTabCooldown()){
        this.status = "menu";
        this.tabChangeCooldown = 0;
      }
      if(input.downArrowKey && this.checkTabCooldown() && this.equipmentSelected<1){
        this.equipmentBoxArray[0].equipmentSelected = false;
        this.equipmentBoxArray[1].equipmentSelected = true;
        this.selectedBoxArray[0].newCompare(this.equipmentBoxArray[1].item.affix)
        this.equipmentSelected += 1;
        this.tabChangeCooldown = 0;
        //change compared array
        }
      if(input.upArrowKey && this.checkTabCooldown() && this.equipmentSelected>0){
        this.equipmentBoxArray[0].equipmentSelected = true;
        this.equipmentBoxArray[1].equipmentSelected = false;
        this.selectedBoxArray[0].newCompare(this.equipmentBoxArray[0].item.affix)
        this.equipmentSelected -= 1
        this.tabChangeCooldown = 0;
        //change compared array
        }
      if(input.zKey && this.checkTabCooldown()){
        exchangeGear(this.selected,this.equipmentSelected)
        this.tabChangeCooldown = 0;
        //exchange selected inventory item and selected equipped item
      }
      break;
    }
  this.draw();
}
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

class Unit{
  constructor(){
  this.startingStats = [['HP', 100], ['AmuletRegen', 100], ['Damage', 50],['Defense', 0],['hpPer5Seconds',0]];
  this.statArray = []
  for(var i = 0;i<this.startingStats.length;i++){
    this.statArray.push(new Stat(this.startingStats[i][0],this.startingStats[i][1]))
  }
}

pushStats(array){
  //adds stats to target
  for(var i = 0;i<array.length;i++){
    //switch is the stat portion of the affix array
    switch(array[i][0]){
      case "HP":
        this.affectStat(this.statArray[0],array[i]);
        break;
      case "AmuletRegen":
        this.affectStat(this.statArray[1],array[i]);
        break;
      case "Damage":
        this.affectStat(this.statArray[2],array[i]);
        break;
      case "Defense":
        this.affectStat(this.statArray[3],array[i]);
        break;
      case "hpPer5Seconds":
        this.affectStat(this.statArray[4],array[i]);
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
  for(var i = 0; i<this.statArray.length;i++){
    this.statArray[i].actual = Math.round((this.statArray[i].base + this.statArray[i].numeric)*(this.statArray[i].percentage/100+1));
  }
  console.log(this.statArray)
}

affectStat(stat,affix){
  switch(affix[1]){
    case "Numeric":
      stat.numeric += affix[2];
      return;
    case "Percentage":
      stat.percentage += affix[2];
      return;
  }
}
}

class MainMenu{
  constructor(){
    this.titles = ['Status', 'Map', 'Inventory', 'Equipment', 'Spell Book', 'System'];
    this.blockWidth = 300;
    this.blockHeight = 100;
    this.xOffset = canvas.width/2-this.blockWidth/2;
    this.initialYOffset = 150;
    this.marginalYOffset = 25 + this.blockHeight;
    this.normalFillColor = 'grey';
    this.selectedFillColor = 'rgb(161, 170, 170)'
    this.selected = 0;
    this.tabChangeCooldown = 10;
    this.tabChangeCooldownAbsolute = 10;
    this.menuState = 'inventory';
  }

  checkTabCooldown(){
    if(this.tabChangeCooldown == this.tabChangeCooldownAbsolute){return true}
    return false;
    }


draw(){
  for(var i = 0; i<this.titles.length; i++){
    var centerX = this.xOffset + (0.5*this.blockWidth);
    var centerY = this.initialYOffset + this.marginalYOffset*i + (0.60*this.blockHeight);
    if(i == this.selected){c.fillStyle = this.selectedFillColor}
    else{c.fillStyle = this.normalFillColor}
    c.fillRect(this.xOffset,this.initialYOffset + this.marginalYOffset*i,this.blockWidth,this.blockHeight);
    c.strokeRect(this.xOffset,this.initialYOffset + this.marginalYOffset*i,this.blockWidth,this.blockHeight);
    c.textAlign = 'center';
    c.fillStyle = 'black';
    c.font = 50 + 'px serif';
    c.fillText(this.titles[i], centerX, centerY);
  }
}

update(){
  switch(this.menuState){
    case 'mainMenu' :
      if(!this.checkTabCooldown()){this.tabChangeCooldown += 1}
      if(this.selected != 0 && input.upArrowKey && this.checkTabCooldown()){
        this.selected -= 1;
        this.tabChangeCooldown = 0;
        }
      else if(this.selected != this.titles.length-1 && input.downArrowKey && this.checkTabCooldown()){
        this.selected += 1;
        this.tabChangeCooldown = 0;
        }
      this.draw();
      if(input.zKey && this.checkTabCooldown()){
      switch(this.selected){
        case 0:
          break;
        case 1:
          break;
        case 2:
          this.menuState = 'inventory';
          inventoryMenu.tabChangeCooldown = 0;
          break;
        case 3:
          break;
        case 4:
          this.menuState = 'spellTab';
          break;
        case 5:
          break
      }
    }
    break;
    case 'spellTab' :
      spellPage.update();
      break;
    case 'inventory' :
      inventoryMenu.update();
      inventoryMenu.
      break;
    }
}
}

spellsKnownArray.push(new Spell('Cure'));
spellsKnownArray.push(new Spell('Regen'));
spellsKnownArray.push(new Spell('Ice Bolt'));
spellsKnownArray.push(new Spell('Haste'));
spellsKnownArray.push(new Spell('Sense Treasure'));
spellsKnownArray.push(new Spell('Vampirism'));
spellsKnownArray.push(new Spell('Wish'));
spellsKnownArray.push(new Spell('Reckless Assault'));

var inventoryMenu = new InventoryMenu();
var spellPage = new SpellPage();
var mainMenu = new MainMenu();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
let weather = new Weather();
let testItem1 = [["HP","Percentage",5],["Defense","Percentage",4],["Damage","Numeric",10],["AmuletRegen","Percentage",2]]
let testItem2 = [["Defense","Percentage",4],["HP","Numeric",43],["Defense","Numeric",12],["hpPer5Seconds","Numeric",2]]
let sumArray =[];
let p = new Unit();
animate();

//fills sumArray with test items
//outGoing makes the values negative for the sumArray
function outGoing(array, obj){
  var test = JSON.parse(JSON.stringify(obj));
  for(var i = 0;i<test.length;i++){
    array.push(test[i]);
    array[i][2] *= -1;
  }
}
//incoming keeps the values positive for the sumArray
function incoming(array, obj){
  var test = JSON.parse(JSON.stringify(obj));

  for(var i = 0;i<test.length;i++){
    array.push(test[i]);
  }
}

//accepts affix arrays as parameters
function compare(equippedItem, selectedItem){
  sumArray = [];

  if(equippedItem && selectedItem){
    outGoing(sumArray, equippedItem);
    incoming(sumArray, selectedItem);
  }
  else if(equippedItem){
    outGoing(sumArray, equippedItem)
  }
  else if(selectedItem){
    incoming(sumArray, selectedItem)
  }
  //adds up identical affixes and cleans the array
  for(var i = 0; i<sumArray.length;i++){
    for(var j = i+1; j<sumArray.length;j++){
      if(sumArray[i][0] == sumArray[j][0] && sumArray[i][1] == sumArray[j][1]){
        sumArray[i][2] += sumArray[j][2];
        sumArray.splice(j,1);
        j -= 1;
      }
    }
  }
  var posArray =[];
  var negArray = [];

  for(var i =0; i<sumArray.length;i++){
    if(sumArray[i][2]>0){posArray.push(sumArray[i])}
    else if(sumArray[i][2]<0){negArray.push(sumArray[i])}
    else if (sumArray[i][2] == 0){
      sumArray.splice(i,1);
      i -= 1;
    }
  }

  for(var i = 0;i<posArray.length;i++){
    for(var j = 0; j<posArray.length-1;j++){
      if(posArray[j][2]<posArray[j+1][2]){
        var temp = posArray[j];
        posArray[j] = posArray[j+1];
        posArray[j+1] = temp;
      }
    }
  }
  for(var i = 0;i<negArray.length;i++){
    for(var j = 0; j<negArray.length-1;j++){
      if(negArray[j][2]>negArray[j+1][2]){
        var temp = negArray[j];
        negArray[j] = negArray[j+1];
        negArray[j+1] = temp;
      }
    }
  }
  sumArray =[];
  for(var i = 0;i<posArray.length;i++){
    sumArray.push(posArray[i]);
  }
  for(var i = 0;i<negArray.length;i++){
    sumArray.push(negArray[i]);
  }
  return sumArray;
}

function exchangeGear(selected,equipmentSelected){
  //this is an item
  var exch1 = inventoryMenu.inventory[selected];
  //this is also an item
  var exch2 = inventoryMenu.equipmentBoxArray[equipmentSelected].item

  p.pushStats(inventoryMenu.selectedBoxArray[0].compareArray);
  //creates a new equipment window with the selected item
  inventoryMenu.equipmentBoxArray.splice(equipmentSelected,1,new EquipmentWindow(inventoryMenu.displayXOffset, inventoryMenu.displayYOffset, exch1,false, true));
  //inserts the previously equipped item to the inventoryArray, which will be automatically selected
  inventoryMenu.inventory.splice(selected,1,exch2);

  //push sumArray to p.statArray
  //pushStatChange(sumArray)
  //write this
  for(var i = 0; i<inventoryMenu.equipmentBoxArray.length;i++){
    inventoryMenu.equipmentBoxArray[i].calculateYOffset();
  }
  inventoryMenu.equipmentBoxArray[equipmentSelected].equipmentSelected = true;
  inventoryMenu.pushNewItem();
}
