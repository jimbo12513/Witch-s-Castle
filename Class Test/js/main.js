
//declares canvas object
let canvas = document.getElementById('canvas');

//resizes canvas based on user's window
canvas.width = 4000;
canvas.height = 2000;

var gameState = 'game';
var otherState = 'death';

//declares canvas 2d context
var c = canvas.getContext('2d');

const blockWidth = 200;
const blockHeight = 200;

const gravityCoefficient = 2;

//loot
const commonRarity = 0.1;
const uncommonRarity = 0.05;
const rareRarity = 0.01;
const legendaryRarity = 0.005;

//UI
const uiX = 100;
const uiY = -100;
const hpuiMultiplier = 4;
const hpBarWidth = 150;

const spellSlotWidth = 300;
const spellSlotHeight = 100;

const amuletRadius = 75;

const criticalStrikeModifier = {
  first: 100,
  firstMultiplier: 0.20,
  second: 200,
  secondMultiplier: 0.5,
  third: 300,
  thirdMultiplier: 0.9
}

const defenseThreshold = {
  first: 100,
  firstReduction: 0.10,
  second: 200,
  secondReduction: 0.20,
  third: 300,
  thirdReduction: 0.30
}

const globalMenuTimerAbsolute = 25;
var globalMenuTimer = globalMenuTimerAbsolute;
//end UI

// DEBUG:
const dbSpawnTurrets = false;
const dbBackground = true;
const dbSquare = 500;

//end DEBUG

// animation

var attackAnimationLeft= [];
var attackAnimationRight= [];
for(var i = 0;i<1;i++){
  attackAnimationLeft.push(new Image());
  attackAnimationLeft[i].src = './localResources/Main Attack/AttackLeft.png';
  attackAnimationLeft[i].onload;
  }

for(var i = 0;i<1;i++){
  attackAnimationRight.push(new Image())
  attackAnimationRight[i].src = './localResources/Main Attack/AttackRight.png'
  attackAnimationLeft[i].onload
}

let input= {
zKey : false,
xKey : false,
aKey : false,
sKey : false,
vKey : false,
tabKey : false,

leftArrowKey : false,
downArrowKey : false,
rightArrowKey : false,
upArrowKey : false
}
let attackArray = [];
let blockArray = [];
let bulletArray = [];
let enemyArray = [];
let textArray = [];
let spellEffectArray = [];
let lootArray = [];
let spellsKnownArray = [];
let spellInformation = {
  'Cure' : 'this spell cures.',
  'Regen' : 'this spell causes the target to regenerate health.',
  'Ice Bolt' : 'this spell causes the caster to create three ice bolts, which hang for a few moments and then fly towards the nearest enemy.',
  'Haste' : "this spell increases the caster's attack speed and movement speed.",
  'Sense Treasure' : 'this spell alerts the caster if there is treasure nearby',
  'Vampirism' : 'this spell causes the caster to regenerate health upon one of its melee attacks dealing damage',
  'Wish' : 'this spell returns 0 hp or full hp.',
  'Reckless Assault' : 'this spell increases damage dealt by the caster while also increasing damage taken by the caster.'
}

window.addEventListener('keydown',function(event){
  if(event.key === "z")input.zKey = true;
  if (event.key === "x")input.xKey = true;
  if (event.key === "a")input.aKey = true;
  if (event.key === "s")input.sKey = true;
  if (event.key === "v")input.vKey = true;
  if (event.key === "f")input.fKey = true;
  if (event.key === "q")input.qKey = true;
  if (event.key === "Tab")input.tabKey = true;
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
  if (event.key === "q")input.qKey = false;
  if (event.key === "Tab")input.tabKey = false;
  if (event.key === "ArrowLeft")input.leftArrowKey = false;
  if (event.key === "ArrowDown")input.downArrowKey = false;
  if (event.key === "ArrowRight")input.rightArrowKey = false;
  if (event.key === "ArrowUp")input.upArrowKey = false;
})

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
    this.menuState = 'mainMenu';
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
      console.log('hi')
      console.log(this.selected)
      switch(this.selected){
        case 0:
          break;
        case 1:
          break;
        case 2:
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
    }
}
}

class Obstacle{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.w = blockWidth;
    this.h = blockHeight;
    this.fillColor = 'Green';
  }

  update(){
    this.draw();
  }

  draw(){
    c.fillStyle = this.fillColor;
    c.fillRect(this.x,this.y,this.w,this.h);
    c.strokeRect(this.x,this.y,this.w,this.h);
  }
}

class Bullet{
  constructor(x,y,dx,dy,radius,color,damage,tracking,team){
    this.x = x;
    this.y = y;
    this.fillColor = color;
    this.dx = dx;
    this.dy = dy;
    this.speed = Math.abs(dx) + Math.abs(dy);
    this.ddx = 0;
    this.ddy = 0;
    this.r = radius;
    this.tracking = tracking;
    this.active = true;
    this.damage = damage;
    this.team = team;
  }

  update(){
    if(this.tracking){
      this.applyTracking();
    }
    applyVelocity(this);
    if(this.x + this.r < 0||this.x - this.r > canvas.width||this.y + this.r<0||this.y - this.r > canvas.height){
      this.active = false;
    }
    if(this.active){
      //check against player
      if(this.team == '2'){
        if(sphereIntersection(p, this) && !p.invulnerabilityTimer){
          var damage = Math.floor(calculateDamage(p.defense, this.damage));
            p.hp -= damage;
            textArray.push(new StatusTextObject(p, damage, 'damage', 'red'))
            p.fillColor=p.invulnerableColor;
            p.invulnerabilityTimer = p.invulnerabilityTimerThreshold;
          }
        }
        else if(this.team == '1'){
          for(var i = 0; i<enemyArray.length; i++){
            if(sphereIntersection(enemyArray[i], this) && !enemyArray[i].underAttack){
              enemyArray[i].hp -= this.damage;
              textArray.push(new StatusTextObject(enemyArray[i], this.damage, 'damage', 'red'))
              enemyArray[i].underAttack = enemyArray[i].underAttackAbsolute;
            }
          }
        }

    this.draw();
    }
  }

  applyTracking(){
    if(this.x != p.x && this.y != p.y){
    var dirX = (p.x + p.w/2) - this.x;
    var dirY = (p.y + p.h/2) - this.y;
    var max = Math.max(Math.abs(dirX), Math.abs(dirY));
    if(max == 0){
      this.ddx = 0;
      this.ddy = 0;
      return;
    }
    dirX = dirX / max;
    dirY = dirY / max;

    this.ddx = dirX * this.speed;
    this.ddy = dirY * this.speed;
  }
  }

  draw(){
    c.fillStyle = this.fillColor;
    c.beginPath();
    c.ellipse(this.x,this.y, this.r, this.r, Math.PI, 0, 2 * Math.PI)
    c.fill();
  }
}

class LagrangeBullet extends Bullet{
  constructor(x,y,dx,dy,radius,color,damage,tracking,team, caster,lagrangePoint,timeToLagrange,hangTime,target){
    super(x,y,dx,dy,radius,color,damage,tracking)
    this.lagrangeX = lagrangePoint.x;
    this.lagrangeY = lagrangePoint.y;
    this.timeToLagrange = timeToLagrange;
    this.hangTimeAbsolute = hangTime;
    this.hangTime = 0;
    this.target = target;
    this.setup = false;
    this.lagrangeDX = 0;
    this.lagrangeDY = 0
    this.vectorVelocity = Math.abs(dx) + Math.abs(dy);
    this.team = team
  }

  moveToLagrange(){
    if(this.x != this.lagrangeX || this.y != this.lagrangeY){
      this.x += this.lagrangeDX;
      this.y += this.lagrangeDY;
      if(this.lagrangeDX>0 && this.x>this.lagrangeX){this.x = this.lagrangeX}
      else if(this.lagrangeDX<0 && this.x<this.lagrangeX){this.x = this.lagrangeX}
      if(this.lagrangeDY>0 && this.y>this.lagrangeY){this.y = this.lagrangeY}
      else if(this.lagrangeDY<0 && this.y<this.lagrangeY){this.y = this.lagrangeY}
    }
    else{
      this.status = 'hang'
    }
  }

  hang(){
    if(this.hangTime < this.hangTimeAbsolute){
      this.hangTime += 1;
    }
    else{
      this.totalDifference = Math.abs(this.target.x-this.x)+Math.abs(this.target.y-this.target.y)
      var xDif = (this.target.x + 0.5 * this.target.w) - this.x;
      var yDif = (this.target.y + 0.5 * this.target.h) - this.y;
      this.dx = (xDif/this.totalDifference) * this.vectorVelocity;
      this.dy = (yDif/this.totalDifference) * this.vectorVelocity;
      this.status = 'fire';
    }
  }

  setupFunc(){
    if(this.lagrangeX - this.x != 0){this.lagrangeDX = (this.lagrangeX - this.x)/this.timeToLagrange}
    else{this.lagrangeDX = 0}
    if(this.lagrangeY - this.y != 0){this.lagrangeDY = (this.lagrangeY - this.y)/this.timeToLagrange}
    else{this.lagrangeDY = 0}
    this.setup = true;
    this.status = 'lagrange';
  }

  fire(){
    if(this.tracking){
      this.applyTracking();
    }
    applyVelocity(this);
  }

  update(){
    if(!this.setup){this.setupFunc()}
    if(this.status == 'lagrange'){this.moveToLagrange()}
    else if(this.status == 'hang'){this.hang()}
    else if(this.status == 'fire'){this.fire()}

    if(this.x + this.r < 0||this.x - this.r > canvas.width||this.y + this.r<0||this.y - this.r > canvas.height){
      this.active = false;
    }
    if(this.active){
      //check against player
      if(this.team == '2'){
        if(sphereIntersection(p, this) && !p.invulnerabilityTimer){
            p.hp -= this.damage;
            textArray.push(new StatusTextObject(p, this.damage, 'damage', 'red'))
            p.fillColor=p.invulnerableColor;
            p.invulnerabilityTimer = p.invulnerabilityTimerThreshold;
          }
        }
        else if(this.team == '1'){
          for(var i = 0; i<enemyArray.length; i++){
            if(sphereIntersection(enemyArray[i], this) && !enemyArray[i].underAttack){
              enemyArray[i].hp -= this.damage;
              textArray.push(new StatusTextObject(enemyArray[i], this.damage, 'damage', 'red'))
              enemyArray[i].underAttack = enemyArray[i].underAttackAbsolute;
            }
          }
        }
    this.draw();
    }

    this.draw();
    }

  applyTracking(){
    if(this.x != p.x && this.y != p.y){
    var dirX = (p.x + p.w/2) - this.x;
    var dirY = (p.y + p.h/2) - this.y;
    var max = Math.max(Math.abs(dirX), Math.abs(dirY));
    if(max == 0){
      this.ddx = 0;
      this.ddy = 0;
      return;
    }
    dirX = dirX / max;
    dirY = dirY / max;

    this.ddx = dirX * this.speed;
    this.ddy = dirY * this.speed;
  }
  }

  draw(){
    c.fillStyle = this.fillColor;
    c.beginPath();
    c.ellipse(this.x,this.y, this.r, this.r, Math.PI, 0, 2 * Math.PI)
    c.fill();
  }
}

class Unit extends Obstacle{
  constructor(x,y){
    super(x,y);
    this.team = '1';
    this.fillColor = 'red';
    this.healthyColor = 'red';
    this.invulnerableColor = 'yellow';
    this.dx = 0;
    this.dy = 0;
    this.ddx = 0;
    this.ddy = 0;
    this.horizontalMax = 20;
    this.verticalMax = 40;
    this.airDashSpeed = 60;
    this.jumpDuration = 0;
    this.maxJumpDuration = 25;
    this.orientation = 'left';
    this.attackCooldown = 0;
    this.absoluteAttackCooldown = 25;
    this.attackRange = 300;
    this.grounded = false;
    this.oldGrounded = false;
    this.airDashCooldown = 0;
    this.absoluteAirDashCooldown = 15;
    this.airDashUsed = false;
    this.damage = 50;
    this.groundedTimer = 0;
    this.groundedTimerThreshold = 5;
    this.invulnerabilityTimer = 0;
    this.invulnerabilityTimerThreshold = 100;
    this.maxHP = 100;
    this.hp = this.maxHP
    this.spellCooldown = 0;
    this.spellCooldownThreshold = 100;
    this.spell1 = cure;
    this.spell2 = regen;
    this.spell3 = iceBolt;
    this.activeSpell = regen;
    this.activeSpellNumber = 2;
    this.maxSpellSlot = 3;
    this.activeSpellMoveDurationThreshold = 25;
    this.activeSpellMoveDuration = 0;
    this.activeSpellArray = [this.spell1, this.spell2, this.spell3];
    this.experience = 0;
    this.inventory = [];
    this.pickupTimerAbsolute = 100;
    this.pickupTimer = 0;
    this.statArray=[];
    this.equipmentArray=[];
    this.defense = 305;
    this.amuletRegenBonus = 0.00;
    this.hpPer5Seconds = 5;
    this.hpPer5Absolute = 60*5;
    this.hpPer5Counter = 0;
    this.criticalStrikeModifier = 310;
    this.criticalStrikeChanceBonus = 0.05;

    if(this.hpPer5Seconds){
      if(this.hpPer5Counter==this.hpPer5Absolute){
        if(this.hp+this.hpPer5Seconds>this.maxHP){
          var text = this.maxHP - this.hp;
          this.hp = this.maxHP;
          textArray.push(new StatusTextObject(this, text, 'healing', 'green'))
          this.hpPer5Counter = 0;
        }
        else{
          var text = this.hpPer5Seconds;
          this.hp += this.hpPer5Seconds;
          textArray.push(new StatusTextObject(this, text, 'healing', 'green'))
          this.hpPer5Counter = 0;
        }
      }
      else{this.hpPer5Counter++}
    }

    //jump

    this.jumpStatus = false;
    this.pastJumpStatus = false;
    this.doubleJump = true;
    this.jumpsUsed = 0;
    this.jumpinput = false
    this.pastJumpInput = false;
    this.jumpDuration = 0;
    this.jumpDurationAbsolute = 0;
    this.primaryJumpAbsolute = 25;
    this.secondaryJumpAbsolute = 10;
  }

setupFunc(){
  this.setup = true;
}
  airDash(){
    if(this.airDashCooldown > 0){
      this.airDashCooldown -= 1
      if(this.airDashCooldown == 0){this.dx = 0};
      }
    if(!this.airDashUsed && this.dy && input.vKey){
      if(this.orientation == "left"){this.dx = -this.airDashSpeed}
      else{this.dx = this.airDashSpeed};
      this.dy = 0;
      this.airDashCooldown = this.absoluteAirDashCooldown;
      this.airDashUsed = true;
    }
  }

  attack(){
    if(this.attackCooldown > 0){
      this.attackCooldown -= 1;
    }
    if(!this.attackCooldown && input.xKey && !this.airDashCooldown){

      var test = calculateCritical(this.criticalStrikeChanceBonus, this.criticalStrikeModifier, this.damage);
      attackArray.push(new Attack(this.x,this.y,this.orientation, Math.trunc(test), this.attackRange));
      this.attackCooldown = this.absoluteAttackCooldown;
    }
  }

  physics(){
    this.pastJumpInput = this.jumpInput;
    this.pastJumpStatus = this.jumpStatus;
    if(!this.pastJumpInput && input.zKey){
      if(this.doubleJump && this.jumpsUsed == 1){
        this.jumpsUsed = 2;
        this.jumpStatus = true;
        this.jumpInput = true;
        this.jumpDuration = 0;
        this.jumpDurationAbsolute = this.secondaryJumpAbsolute;
        this.grounded = false;
        }
      else if(this.jumpsUsed == 0){
        this.jumpsUsed = 1;
        this.jumpStatus = true;
        this.jumpInput = true;
        this.jumpDuration = 0;
        this.jumpDurationAbsolute = this.primaryJumpAbsolute;
        this.grounded = false;
      }
    }

      if(!input.zKey){
        this.jumpStatus = false;
        this.jumpInput = false;
        }
      //physics part
      if(this.jumpStatus == true && this.jumpDuration <= this.jumpDurationAbsolute){
        this.dy = -this.verticalMax;
        this.jumpDuration += 1;
        }
        else if(this.jumpStatus == false && this.pastJumpStatus == true){
        this.dy = 0;
        this.jumpDuration += 1;
        }
        else if(this.jumpDuration == this.jumpDurationAbsolute){
          this.dy = 0;
          this.jumpStatus = false;
          this.jumpDuration += 1;
        }

    // calculate movement, acceleration
    if(!this.airDashCooldown){
      //gravity
      if(!this.grounded){
        applyGravity(this);
      }
      // else if(this.y > this.y - this.h + 10 && !this.oldGrounded){
      //   applyGravity(this);
      // }
      if(input.leftArrowKey){
        this.dx = -this.horizontalMax;
      }
      else if(this.dx >= -this.horizontalMax && this.dx < 0){
        this.dx += 1;
      }
      if(input.rightArrowKey){
        this.dx = this.horizontalMax;
      }
      else if(this.dx <= this.horizontalMax && this.dx > 0){
        this.dx -= 1;
      }
    }
  }

  ground(){
    if(!input.zKey || this.dy >= 0){
    if(!this.oldGrounded){
      this.attackCooldown = 0;
      this.airDashUsed = false;
    }
    this.grounded = true;
    this.groundedTimer = 0;
    this.dy = 0;
    this.jumpsUsed = 0;
  }
}

  cast(){
    if(!this.spellCooldown && input.fKey){
      amulet.consume(this, this.activeSpell);
      this.spellCooldown = this.spellCooldownThreshold;
    }
    else if (this.spellCooldown > 0){
      this.spellCooldown -= 1;
    }
  }

  hp5(){
    if(this.hpPer5Seconds){
      if(this.hpPer5Counter==this.hpPer5Absolute){
        if(this.hp+this.hpPer5Seconds>this.maxHP){
          var text = this.maxHP - this.hp;
          this.hp = this.maxHP;
          textArray.push(new StatusTextObject(this, text, 'healing', 'green'))
          this.hpPer5Counter = 0;
        }
        else{
          var text = this.hpPer5Seconds;
          this.hp += this.hpPer5Seconds;
          textArray.push(new StatusTextObject(this, text, 'healing', 'green'))
          this.hpPer5Counter = 0;
        }
      }
      else{this.hpPer5Counter++}
    }
  }

  update(){
    if(!this.setup){this.setupFunc()}
    if(this.hp <= 0){
      gameState = 'other';
      otherState = 'death';
      }
    if(this.pickupTimer>0){this.pickupTimer-=1};
    if(!this.invulnerabilityTimer){this.fillColor=this.healthyColor;}
    else{this.fillColor=this.invulnerableColor}

    this.oldGrounded = this.grounded;
    this.groundedTimer ++;
    if(this.groundedTimer >= this.groundedTimerThreshold){
      this.grounded = false;
    }
    this.hp5();


    this.physics();
    for(var i = 0; i<blockArray.length;i++){
      collisionCheckX(this, blockArray[i]);
    }
    if(!this.invulnerabilityTimer){
    }
    else{this.invulnerabilityTimer -= 1}

    this.attack();
    this.airDash();

    if(input.aKey && this.activeSpellMoveDuration == 0 && this.activeSpellNumber > 1){
      this.activeSpellNumber -= 1;
      this.activeSpellMoveDuration = this.activeSpellMoveDurationThreshold;}
    if(input.sKey && this.activeSpellMoveDuration == 0 && this.activeSpellNumber < this.maxSpellSlot){
      this.activeSpellNumber += 1;
      this.activeSpellMoveDuration = this.activeSpellMoveDurationThreshold;}
    if(this.activeSpellMoveDuration != 0){
      this.activeSpellMoveDuration -= 1}

    if(this.activeSpellNumber ==  1){this.activeSpell = this.activeSpellArray[0]}
    else if(this.activeSpellNumber == 2){this.activeSpell = this.activeSpellArray[1]}
    else if(this.activeSpellNumber == 3){this.activeSpell = this.activeSpellArray[2]}

    c.globalAlpha = 1;
    this.cast();

    if(this.x + this.dx < 0){
      this.x = 0;
      this.dx = 0;
    }
    else if (this.x >= canvas.width - this.dx - this.w) {
      this.x = canvas.width - this.w;
      this.dx = 0;
    }

//ground at bottom of the screen
    if(this.y >= canvas.height - this.h - this.dy && !this.grounded){
      this.y = canvas.height-this.h;
      this.ground();
    }

    applyVelocity(this);

    if(input.leftArrowKey){this.orientation = 'left'};
    if(input.rightArrowKey){this.orientation = 'right'};

    this.draw();
    }

  drawSpells(){
      //draw all three spell boxes
      for(var i = 0; i<3; i++){
        c.globalAlpha = 1;
        var tarX = uiX+hpBarWidth+50+amuletRadius*2+50;
        var tarY = canvas.height + uiY - 500 + i*(10+spellSlotHeight);
        //need proper code here (color should be rgb(145, 145, 216))
        c.fillStyle = 'pink';
        c.fillRect(tarX,tarY,spellSlotWidth,spellSlotHeight);
        c.strokeRect(tarX,tarY,spellSlotWidth,spellSlotHeight);
        //need proper code and text size here. Also, left align
        var text = this.activeSpellArray[i].uiName
        c.fillStyle = 'black';
        c.font = spellSlotHeight + 'px serif';
        c.globalAlpha = 1;
        c.textAlign = 'left';
        c.fillText(text,tarX,tarY+80);
        c.strokeText(text,tarX,tarY+80);
      }

      //draw all three inactive boxes, adjusting for opacity
      for(var i = 0; i<3; i++){
        var tarX = uiX+hpBarWidth+50+amuletRadius*2+50;
        var tarY = canvas.height + uiY - 500 + i*(10+spellSlotHeight);
        var opac = 0;
        if(this.activeSpellNumber != i+1){opac = 0.45}
        else{opac = 0}
        c.globalAlpha = opac;
        c.fillStyle = 'grey';
        c.fillRect(tarX,tarY,spellSlotWidth,spellSlotHeight);
        c.strokeRect(tarX,tarY,spellSlotWidth,spellSlotHeight);
      }

      c.globalAlpha = 1;

    }
  }

class Enemy extends Obstacle{
  constructor(x,y){
    super(x,y);
    this.fillColor = 'yellow';
    this.hp = 100;
    this.underAttack = 0;
    this.underAttackAbsolute = 50;
    this.fillColorDB1 = 'rgb(240, 248, 205)'
    this.fillColorDB2 = 'rgb(22, 161, 12)'
    this.fillColorDB3 = 'rgb(24, 171, 14)'
    this.dbXOffset = 10;
    this.dbYOffset = 10;
    this.dbXOffset2 = 10;
    this.dbYOffset2 = 10;
  }

  draw(){
    if(!dbBackground){
      c.fillStyle = this.fillColor;
      c.fillRect(this.x,this.y,this.w,this.h);
      c.strokeRect(this.x,this.y,this.w,this.h);
      }
    if(dbBackground){
      c.fillStyle = this.fillColorDB1;
      c.fillRect(this.x,this.y,this.w,this.h);
      c.fillStyle = this.fillColorDB2;
      c.fillRect(this.x+this.dbXOffset,this.y+this.dbYOffset,this.w-(2*this.dbXOffset),this.h-(2*this.dbYOffset));
      c.fillStyle = this.fillColorDB3;
      c.fillRect(this.x+this.dbXOffset+this.dbXOffset2,this.y+this.dbYOffset+this.dbYOffset2,this.w-(2*this.dbXOffset)-(2*this.dbXOffset2),this.h-(2*this.dbYOffset)-(2*this.dbYOffset2));
    }
  }

  update(){
  this.draw();
  }
}

class Duck extends Obstacle{
  constructor(x,y){
    super(x,y);
    this.w = blockWidth * 1.0;
    this.h = blockHeight * 2.0;
    this.dx = 0;
    this.ddx = 0;
    this.dy = 0;
    this.ddy = 0;
    this.horizontalMax = 10;
    this.verticalMax = 20;
    this.grounded = false;
    this.oldGrounded = false;
    this.groundedTimerThreshold = 3;
    this.fillColor = 'orange';
    this.mainFillColor = 'orange';
    this.hp = 200;
    this.underAttack = 0;
    this.underAttackAbsolute = 50;
    this.experienceValue = 10;
    this.collisionDamage = 1;
    this.orientation = 'none';
    this.bulletColor = 'purple';
    this.bulletDamage = 25;
    this.bulletRadius = 50;
    this.bulletSpeed = 40;
    this.currentAction = 'thinking';
    this.actionDuration = 0;
    this.thinkingDuration = 50;
    this.smallJumpDuration = 50;
    this.bigJumpDuration = 100;
    this.fired = 0;
    this.firedMax = 10;
    this.shotCooldownThreshold = 10;
    this.mainAttackDuration = 200;
    this.rand = 0;
    this.status = 'alive';
    //for targeting array
    this.totalDistance = 0;
    this.team = '2';
    //for loot
    this.lootTable = ['Iron Ore','Unidentified Ring', 'Gem', 'Artifact'];
    this.lootChance = [commonRarity,uncommonRarity,rareRarity,legendaryRarity];
}

ground(){
  if(!this.oldGrounded){
    this.jumpDuration = 0;
    this.attackCooldown = 0;
    this.airDashUsed = false;
  }
  this.grounded = true;
  this.groundedTimer = 0;
  this.dy = 0;
}

intelligence(){
  if(this.currentAction == 'thinking'){
    this.actionDuration += 1;
    if(this.actionDuration >= this.thinkingDuration){
      //determines where player is relative to duck
      if(p.x>this.x){this.orientation = 'right';}
      else if(p.x<this.x){this.orientation = 'left';}
      this.currentAction = 'inactive';
      this.actionDuration = 0;
    }
  }
  else if (this.currentAction == 'inactive'){
    this.rand = Math.random();
    //if player's y is within 100 of duck's y
    if(Math.abs(p.y-this.y)<=200){
      if(this.rand>0.6){this.mainAttack()}
      else if(this.rand>0.5){this.bigJump()}
      else{this.smallJump()}
    }
    else{
      if(this.rand>0.75){this.smallJump()}
      else if(this.rand>0.7){this.mainAttack()}
      else{this.bigJump()}
    }
  }
  else if (this.currentAction == 'smallJump'){this.smallJump()}
  else if (this.currentAction == 'bigJump'){this.bigJump()}
  else if (this.currentAction == 'mainAttack'){this.mainAttack()}
}

setThinking(){
  this.currentAction = 'thinking';
  this.actionDuration = 0;
  this.dx = 0;
  this.ddx = 0;
  this.dy = 0;
  this.ddy = 0;
}

//small jump
smallJump(){
  if(this.currentAction == 'inactive'){
    this.currentAction = 'smallJump';
    this.actionDuration = 0;
  }
  this.actionDuration += 1;
  if(this.actionDuration<2){this.dy=-20}
  if(this.orientation == 'left' && this.actionDuration<10 && Math.abs(this.dx) <= this.horizontalMax){this.dx = -3}
  else if (this.orientation == 'right' && this.actionDuration<10 && Math.abs(this.dx) <= this.horizontalMax){this.dx = 3}
  if(this.actionDuration>=40){
    if(this.grounded){this.dx=0;}


    if(this.actionDuration >= this.smallJumpDuration){this.setThinking()}
  }
}
//big jump
bigJump(){
  if(this.currentAction == 'inactive'){
    this.currentAction = 'bigJump';
    this.actionDuration = 0;
    }
  this.actionDuration += 1;
  if(this.actionDuration<2){this.dy = -50}
  if(this.orientation == 'left' && this.actionDuration<10){this.dx = -5}
  else if (this.orientation == 'right' && this.actionDuration<10){this.dx = 5}

  if(this.actionDuration>=25){
    if(this.grounded){this.dx=0;}

    if(this.actionDuration >= this.bigJumpDuration){this.setThinking()}
  }
}

//shoot at player
mainAttack(){
  if(this.currentAction == 'inactive'){
    this.currentAction = 'mainAttack';
    this.actionDuration = 0;
    this.fired = 0
    this.shotCooldown = this.shotCooldownThreshold;
  }
  if(this.fired < this.firedMax && this.shotCooldown >= this.shotCooldownThreshold){
    if(this.orientation == 'left'){
      bulletArray.push(new Bullet(this.x+this.h/2,this.y+this.h/2,-this.bulletSpeed,0,this.bulletRadius,this.bulletColor,this.bulletDamage, false, this.team))
      }
    else if(this.orientation == 'right'){
      bulletArray.push(new Bullet(this.x+this.h/2,this.y+this.h/2,this.bulletSpeed,0,this.bulletRadius,this.bulletColor,this.bulletDamage, false, this.team))
      }
    this.fired += 1;
    this.shotCooldown = 0;
  }
  this.shotCooldown +=1;
  this.actionDuration +=1;
  if(this.actionDuration>=this.mainAttackDuration){this.setThinking()}
}

update(){
  this.oldGrounded = this.grounded;
  this.groundedTimer ++;
  if(this.groundedTimer >= this.groundedTimerThreshold){
    this.grounded = false;
  }

  this.intelligence();
  terrainCollisionCheck(this);
  applyPhysics(this);

  if(!this.underAttack){
    for(var i = 0; i<attackArray.length;i++){
      if(attackArray[i].active == true){
      if(rectIntersection(this, attackArray[i])){
        this.hp -= attackArray[i].damage;
        textArray.push(new StatusTextObject(this, attackArray[i].damage, 'damage', 'red'))
        this.underAttack = this.underAttackAbsolute;
      }
    }
  }
  }
  this.fillColor = this.mainFillColor;
  if(this.underAttack){
    if(this.underAttack % 2 == 0)
    {
      this.fillColor = 'blue'
    }
    else {this.fillColor='white'}
  this.underAttack -= 1;
  }

  if(this.x + this.dx < 0){
    this.x = 0;
    this.dx = 0;
  }
  else if (this.x >= canvas.width - this.dx - this.w) {
    this.x = canvas.width - this.w;
    this.dx = 0;
  }
  if(this.hp<=0 && this.status != 'delete'){
    dropChance(this);
    this.status = 'delete';

  }
  this.draw();
}
}

class Attack extends Obstacle{
  constructor(x,y, orientation, damage, range){
    super(x,y);
    this.active = true;
    this.orientation = orientation
    if(orientation === 'left'){
      this.x = x - (range) + (0.5*blockWidth);
      this.y = y + (0.25 * blockHeight);
    }
    else{
      this.x = x+(blockWidth*0.5);
      this.y = y + (0.25 * blockHeight);
    }
    this.damage = damage;
    this.w = 270;
    this.h = 90;
    this.fillColor = 'Green';
    this.duration = 0;
    this.absoluteDuration = 10;
    this.status = 'alive';
    this.sparkleNumber = 5;
    this.opac = 1;
    this.opacTick = 1/(2*this.absoluteDuration);
    this.sparkleDuration = 75;
  }

draw(){
    c.globalAlpha = this.opac;
    if(this.orientation == 'left'){
      c.drawImage(attackAnimationLeft[0],this.x,this.y,270,90)
    }
    else{
      c.drawImage(attackAnimationRight[0],this.x,this.y,270,90)
    }
    c.globalAlpha = 1;
}

update(){
    if(this.duration>5){
      for(var i = 0; i<this.sparkleNumber;i++){
        lootArray.push(new Sparkle(this, 'rgb(77, 204, 223)', this.sparkleDuration));
      }
      this.opac -= this.opacTick;
    }
    if(this.duration<this.absoluteDuration){
      this.duration += 1;
      this.draw();
    }
    else {this.status = 'delete';}
}
}

class Turret extends Enemy{
  constructor(x,y,bulletSpeed,bulletCooldown,exhaustionMax){
    super(x,y);
    this.fillColor = 'black';
    this.targetX = 0;
    this.targetY = 0;
    this.targetXDif = 0;
    this.targetYDif = 0;
    this.targetSlope = 0;
    this.bulletSpeed = bulletSpeed;
    this.bulletCooldown = bulletCooldown;
    this.bulletRest = 0;
    this.exhaustionMax = exhaustionMax;
    this.exhaustionActual = 0;
    this.state = 'ready';
    this.damage = 10;
  }
  update(){
//checks this against attack array to see if damage has been done
  if(this.state == 'ready'){
  if(this.exhaustionActual < this.exhaustionMax){
    this.exhaustionActual += 1;
    if(!this.bulletRest){
      this.targetPlayer();
    }
    else{this.bulletRest -= 1}
  }
  else if(this.exhaustionActual >= this.exhaustionMax){
    this.state = 'exhausted';
  }
  }
  else if(this.state == 'exhausted'){
    if(this.exhaustionActual > 0){
      this.exhaustionActual -= 1;
    }
    else if(this.exhaustionActual <= 0){
      this.state = 'ready';
    }
  }

  this.draw();
  }

  targetPlayer(){
    var dirX = (p.x)-this.x;
    var dirY = (p.y)-this.y;
    var max = Math.max(Math.abs(dirX), Math.abs(dirY));
    if(max == 0){
      return;
    }
    dirX = dirX / max;
    dirY = dirY / max;

    bulletArray.push(new Bullet(this.x+this.h/2,this.y+this.h/2,this.bulletSpeed*dirX,this.bulletSpeed*dirY,10,'blue',this.damage, false));
    this.bulletRest = this.bulletCooldown;
  }
}

class Amulet {
constructor(){
  this.amuletLevel = 3;
  this.amuletTimeModifier = 1000
  this.amuletEnergy = this.amuletLevel * this.amuletTimeModifier;
  this.amuletCharge = 0;
  this.check = 0;
  this.oldAmuletCharge = 0;
  this.x = uiX+hpBarWidth+50+amuletRadius;
  this.y = canvas.height + uiY - amuletRadius;
  this.r = amuletRadius;
  this.readyColor = 'Pink';
  this.exhaustedColor = 'Black';
  this.yDifference = this.r + 100;
}

chargeCheck(){
  if(this.amuletLevel > 0){
    if(this.amuletEnergy < this.amuletLevel * this.amuletTimeModifier){
      this.amuletEnergy += 1*(1+p.amuletRegenBonus);
    }
  }
  //check for amulet charges
  this.check = Math.floor(this.amuletEnergy / this.amuletTimeModifier);
  this.amuletCharge = this.check;
  if(this.charge > this.oldAmuletCharge){
    //play Ding sound
    this.oldAmuletCharge = this.charge;
  }
  this.oldAmuletCharge = this.amuletCharge;
}

//takes two objects (caster, caster) as a parameter. The spell object must contain a cost and have an effect function within the object.
consume(caster, spell){
  if(spell == cure){
    if(this.amuletCharge >= 1*spell.cost){
      this.amuletEnergy -= this.amuletTimeModifier*spell.cost;
      spell.effect(caster);
    }
  }
  else if(spell == regen){
    if(this.amuletCharge >= 1*spell.cost){
      this.amuletEnergy -= this.amuletTimeModifier*spell.cost;
      spellEffectArray.push(new RegenSpell(caster));
    }
  }
  else if(spell == iceBolt){
    if(this.amuletCharge >= 1*spell.cost){
      this.amuletEnergy -= this.amuletTimeModifier*spell.cost;
      spellEffectArray.push(new IceBoltSpell(caster));
    }
  }
}

draw(){
  //draws circles depending on amulet level
  c.globalAlpha = 0.75;
  for(var i = 0; i<this.amuletLevel;i++){
    c.beginPath();
    c.ellipse(this.x,this.y - this.yDifference * i, this.r, this.r, Math.PI, 0, 2 * Math.PI)
    c.fillStyle = this.exhaustedColor
    c.fill();
  }

for(var i = 0; i<this.amuletLevel;i++){
  var check = this.amuletEnergy - (i * this.amuletTimeModifier);
  if(this.amuletCharge > i){
    c.beginPath();
    c.ellipse(this.x,this.y - this.yDifference * i, this.r, this.r, Math.PI, 0, 2 * Math.PI)
    c.fillStyle = this.readyColor
    c.fill()
  }
  else if(this.amuletTimeModifier > check && check > 0){
    var radians = (check/this.amuletTimeModifier)*2*Math.PI;
    c.fillStyle = this.readyColor
    c.beginPath();
    c.ellipse(this.x,this.y - this.yDifference * i, this.r, this.r, 3/Math.PI, 0, radians, false)
    c.fill();
  }
}
c.globalAlpha = 1;
}

update(){
  this.chargeCheck();
  //potentially check consume against current player inputs.
  //Alternatively, just have the player input call amulet.consume from player object
  this.draw();
}
}

class CureSpell {
constructor(){
  this.cost = 1;
  this.healthRecoveredMax = 20;
  this.text = "I call upon thee, holy spirit... cure!";
  this.textThreshold = 0.80;
  this.uiName = 'Cure';
}

effect(object){
  var rand = Math.floor(Math.random()*this.healthRecoveredMax);
  if(object.hp+rand>object.maxHP){
    var text = object.maxHP - object.hp;
    object.hp=object.maxHP;
    textArray.push(new StatusTextObject(object, text, 'healing', 'green'));
  }
  else{
    var text = rand;
    object.hp += rand;
    textArray.push(new StatusTextObject(object, text, 'healing', 'green'))
  };
  object.invulnerabilityTimer = object.invulnerabilityTimerThreshold;
  //flavor text
  var random = Math.random();
  if(random>this.textThreshold){
    textArray.push(new FlavorTextObject(object, this.text))
  }
}
}

class RegenSpell {
  constructor(target){
  this.uiName = 'Regen';
  this.cost = 1;
  this.healthRecoveredMax = 30;
  this.text = "TBD";
  this.textThreshold = 0.80;
  this.durationThreshold = 0;
  this.duration = 0;
  this.target = target;
  this.tickHeal = 2;
// ticks once every 100ms
  this.tickSpeedTimerThreshold = 50;
  this.tickSpeedTimer = 0;
  this.status = '';
  //sparkle timer
  this.sparkleTimer = 0;
  this.sparkleTimerAbsolute = 1;
}

update(){
  this.effect(this.target);
  this.duration += 1;
  if(this.duration>=this.durationThreshold){this.status = 'delete'};
}

effect(target){
  if(this.duration == 0){
  //add flavor text trigger here if duration = 0 (first second following cast)
  this.durationThreshold = Math.floor(Math.random()*this.healthRecoveredMax*this.tickSpeedTimerThreshold);
  }
  if(target.hp+this.tickHeal>target.maxHP && this.tickSpeedTimer >= this.tickSpeedTimerThreshold){
    var text = target.maxHP - target.hp;
    target.hp = target.maxHP;
    textArray.push(new StatusTextObject(target, text, 'healing', 'green'))
    this.tickSpeedTimer = 0;
  }
  else if(this.tickSpeedTimer >= this.tickSpeedTimerThreshold)
  {
    var text = this.tickHeal;
    target.hp += this.tickHeal;
    textArray.push(new StatusTextObject(target, text, 'healing', 'green'))
    this.tickSpeedTimer = 0;
  }
  else{this.tickSpeedTimer += 1}

// //sparkle
// if(this.sparkleTimer>=this.sparkleTimerAbsolute){
//     lootArray.push(new Sparkle(this.target,'green'));
//     this.sparkleTimer = 0;
//   }
//   else{this.sparkleTimer += 1}
}
}
class Point{
  constructor(x,y){
  this.x = x;
  this.y = y;
}
}

class IceBoltSpell{
  constructor(caster){
  this.uiName = 'I.Bolt';
  this.cost = 1;
  this.boltsCreatedThreshold = 3;
  this.boltsCreated = 0;
  this.damage = 100;
  this.boltSpeed = 40;
  this.text = "TBD";
  this.textThreshold = 0.80;
  this.setup = false;
  this.target = '';
  this.caster = caster;
  this.radius = 50;
  this.timeToLagrange = 25;
  this.hangTime = 100;
  //time between bolts
  this.creationTimerThreshold = 25;
  this.creationTimer = 0;
}

setupFunc(){
  //discerns nearest target
  this.target = getNearestEnemy(this);
  this.setup = true;
}

effect(){
  if(this.boltsCreated<this.boltsCreatedThreshold){
    if(this.creationTimer>=this.creationTimerThreshold){
      if(this.boltsCreated== 0 || this.boltsCreated ==2){
        var point = new Point(this.caster.x - 20 + (this.caster.w + 40)/2 * (this.boltsCreated),this.caster.y - 20);
      }
      else{
        var point = new Point(this.caster.x - 20 + (this.caster.w + 40)/2 * (this.boltsCreated),this.caster.y - 100);
      }
      bulletArray.push(new LagrangeBullet(this.caster.x+this.caster.w*0.5,this.caster.y+this.caster.h*0.5,this.boltSpeed,0,this.radius,'blue',this.damage,false,this.caster.team, this.caster, point, this.timeToLagrange, this.hangTime, this.target,));
      this.boltsCreated += 1;
      this.creationTimer = 0;
    }
    else{this.creationTimer += 1};
  }
  else{this.status = 'delete'}
}

update(){
  if(!this.setup){
    this.setupFunc();
  }
  this.effect();
}
}

class Loot{
  constructor(obj, item, rarity){
    this.obj = obj;
    this.x = obj.x + 0.5 * obj.w;
    this.y = obj.y
    this.dx = 0;
    this.dy = 0;
    this.ddx = 0;
    this.ddy = 0;
    this.w = 50
    this.h = 50
    this.item = item;
    this.status = '';
    this.fillColor='magenta';
    this.grounded = false;
    this.oldGrounded = false;
    this.rarity = rarity;
    this.setup = false;
    this.createSparkles = false;
    this.createGlow = false;
    this.glowRadius = 100;
    this.glowOpacity = 0.1;
    this.sparkleTimer = 0;
    this.sparkleTimerAbsolute = 0;
    this.sparkleDuration = 1000;
    }

  ground(){
      if(!this.oldGrounded){
        this.jumpDuration = 0;
        this.attackCooldown = 0;
        this.airDashUsed = false;
      }
      this.grounded = true;
      this.groundedTimer = 0;
      this.dy = 0;
    }

  draw(){
    c.fillStyle = this.fillColor;
    c.fillRect(this.x,this.y,this.w,this.h);
    c.strokeRect(this.x,this.y,this.w,this.h);
    if(this.createGlow){this.createGlowFunc()}
    }

  setupFunc(){
    switch (this.rarity) {
      case 'common':
        this.createSparkles = false;
        this.createGlow = false;
        this.fillColor = 'magenta';
        break;
      case 'uncommon':
        this.createSparkles = true;
        this.sparkleTimerAbsolute = 50;
        this.createGlow = false;
        this.fillColor = 'rgb(105, 240, 90)';
        break;
      case 'rare':
        this.createSparkles = true;
        this.sparkleTimerAbsolute = 25;
        this.createGlow = false;
        this.fillColor = 'rgb(28, 159, 246)';
        break;
      case 'legendary':
        this.createSparkles = true;
        this.sparkleTimerAbsolute = 10;
        this.createGlow = true;
        this.fillColor = 'gold';
        break;
    }
    this.setup = true;
  }

  createGlowFunc(){
    c.fillStyle = this.fillColor;
    c.globalAlpha = this.glowOpacity;
      c.beginPath();
      c.ellipse(this.x + this.w * 0.5,this.y + this.h * 0.5, this.glowRadius, this.glowRadius, Math.PI, 0, 2 * Math.PI)
      c.fill();
    c.globalAlpha = 1;
}

  update(){
    this.oldGrounded = this.grounded;
    if(!this.setup){
      this.setupFunc();
    }
    //gravity
    if(!this.grounded){
      applyPhysics(this);
      terrainCollisionCheck(this);
      if(this.x + this.dx < 0){
        this.x = 0;
        this.dx = 0;
        }
      else if (this.x >= canvas.width - this.dx - this.w) {
        this.x = canvas.width - this.w;
        this.dx = 0;
      }
      }
    //creates sparkles
    if(this.createSparkles == true){
      if(this.sparkleTimer>=this.sparkleTimerAbsolute){
        lootArray.push(new Sparkle(this,this.fillColor,this.sparkleDuration));
        this.sparkleTimer = 0;
      }
      else{this.sparkleTimer += 1}
    }
    //checks if loot is intersecting player
    if(rectIntersection(p, this) && p.pickupTimer ==0){
      p.inventory.push(this.item);
      textArray.push(new StatusTextObject(p, this.item, 'item', 'black'));
      this.status = 'delete';
      p.pickupTimer = p.pickupTimerAbsolute;
      }
    else{this.draw()}
    }
  }

class Sparkle{
  constructor(obj, color, duration){
    this.fillColor = color;
    this.setup = false;
    this.x = obj.x;
    this.w = obj.w;
    this.y = obj.y;
    this.h = obj.h;
    this.status = 'alive';
    this.duration = 0;
    this.durationAbsolute = duration;
    this.opac = 1;
    this.opacTick =0;
    this.rand
    }

  setupFunc(){
    var rand = getRandomInt(this.w);
    this.x += rand;
    rand = getRandomInt(this.h);
    this.y+= rand;
    rand = getRandomInt(this.durationAbsolute);
    this.durationAbsolute = rand;
    this.opacTick = this.opac/this.durationAbsolute;
    this.setup = true;
    this.rand = getRandomInt(8);
    }

  draw(){
    c.fillStyle = this.fillColor;
    c.globalAlpha = this.opac;
      c.beginPath();
      c.ellipse(this.x,this.y, this.rand, this.rand, Math.PI, 0, 2 * Math.PI)
      c.fill();
    c.globalAlpha = 1;
  }


  update(){
    if(!this.setup){this.setupFunc()}
    this.draw();
    this.opac -= this.opacTick;
    this.duration += 1;
    this.y -= 1;
    if(this.duration>=this.durationAbsolute){this.status='delete'}
    }
}

class FlavorTextObject{
  constructor(object, message){
    this.target = object;
    this.duration = 0;
    this.durationThreshold = 200;
    this.textColor = 'black';
    this.objectOffsetX = 0;
    this.objectOffsetY = -20;
    this.text = message;
  }

  update(){
    this.duration += 1;
    this.draw();
  }

  draw(){
    c.fillStyle = this.textColor;
    c.font = '60px serif';
    var opac = 1-(this.duration/this.durationThreshold);
    c.globalAlpha = opac;
    c.textAlign = 'center';
    c.fillText(this.text, this.target.x+(this.target.w/2), this.target.y+this.objectOffsetY);
    c.globalAlpha = 1;
  }
}

class StatusTextObject{
  constructor(object, message, messageType, color){
    this.target = object;
    this.duration = 0;
    this.durationThreshold = 200;
    this.textColor = color;
    this.objectOffsetX = this.target.w;
    this.objectOffsetY = -25;
    this.text = message;
    this.textSize = 150;
    this.messageType = messageType;
    //height adjustment
    this.hAdjustmentTotal = 0;
    this.hAdjustment = 1;
  }
  update(){
    this.duration += 1;
    this.hAdjustmentTotal -= this.hAdjustment;
    this.draw();
  }

  draw(){
    c.fillStyle = this.textColor;
    c.font = this.textSize + 'px serif';
    c.textAlign = 'center';
    var opac = 1-(this.duration/this.durationThreshold);
    c.globalAlpha = opac;
    if(this.messageType == 'damage'){c.fillText('-'+this.text, this.target.x+this.objectOffsetX, this.target.y+this.objectOffsetY+this.hAdjustmentTotal)}
    else if(this.messageType == 'healing'){c.fillText('+'+this.text, this.target.x+this.objectOffsetX, this.target.y+this.objectOffsetY+this.hAdjustmentTotal)}
    else if(this.messageType == 'item'){c.fillText(this.text + ' GET', this.target.x+this.objectOffsetX, this.target.y+this.objectOffsetY+this.hAdjustmentTotal)}
    c.globalAlpha = 1;
  }
}

class HPBar{
  constructor(){
    this.totalHP = p.maxHP;
    this.fillColor = 'green'
    this.hp = p.hp
  }

update(){
  if(this.totalHP != p.maxHP){this.totalHP = p.maxHP}
  if(this.hp != p.hp){this.hp = p.hp}
  this.draw();
  }

  draw(){
    //draw black rectangle
    c.fillStyle = 'black'
    c.fillRect(uiX,canvas.height+uiY-(this.totalHP*hpuiMultiplier),hpBarWidth,this.totalHP*hpuiMultiplier);
    c.strokeRect(uiX,canvas.height+uiY-(this.totalHP*hpuiMultiplier),hpBarWidth,this.totalHP*hpuiMultiplier);

    //draw actual hp bar
    c.fillStyle = this.fillColor;
    c.fillRect(uiX,canvas.height+uiY-(this.hp*hpuiMultiplier),hpBarWidth,this.hp*hpuiMultiplier);
    c.strokeRect(uiX,canvas.height+uiY-(this.hp*hpuiMultiplier),hpBarWidth,this.hp*hpuiMultiplier);

    //draw HP number
    c.textAlign = 'left';
    c.fillStyle = 'black';
    c.font = '200px serif';
    c.fillText(this.hp, uiX+hpBarWidth+50+amuletRadius*2+50, canvas.height + uiY);
    c.strokeText(this.hp, uiX+hpBarWidth+50+amuletRadius*2+50, canvas.height + uiY);
  }
}

class Weather{
  constructor(){
    this.rainFrequencyAbsolute = 1;
    this.rainFrequencyCounter = this.rainFrequencyAbsolute;
    this.rainLength = 100;
    this.rainAlpha = 0.5;
    this.thickness = 5;
    this.raindropArray = [];
    this.randomX = 0;
    this.rainVelocity = 15;
    this.fogOpacity = 0.5;
    this.drawFogCon = true;
    this.fogColor = 'grey';
  }

  rainFrequencyCheck(){
    if(this.rainFrequencyAbsolute == this.rainFrequencyCounter){return true}
    return false;
  }

  drawFog(){
    c.globalAlpha = this.fogOpacity
    c.fillStyle = this.fogColor;
    c.fillRect(0,0,canvas.width,canvas.height);
    c.globalAlpha = 1;
  }

  update(){
    if(this.rainFrequencyCheck()){
      this.randomX = getRandomIntMinMax(this.thickness, canvas.width);
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
    c.strokeStyle = 'black';
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


let amulet = new Amulet();
let cure = new CureSpell();
let regen = new RegenSpell();
let iceBolt = new IceBoltSpell();

let weather = new Weather();

let p = new Unit(200,10);
let hpBar = new HPBar();
blockArray.push(new Enemy(150,500));
blockArray.push(new Enemy((blockWidth+2),(canvas.height - blockHeight*4)));
enemyArray.push(new Duck(1000,1000));
for(var i = 0; i<(canvas.width/blockWidth);i++){
  blockArray.push(new Enemy((i*blockWidth)+2,(canvas.height - blockHeight)));
}
if(dbSpawnTurrets){
  for(var i =0;i<4;i++){
    blockArray.push(new Turret(800+(i*700),200+(i*100),30,10,100));
    }
}
var mainMenu = new MainMenu();
gameInitialization();
animate();

function globalMenuTimerCheck(){
  if(globalMenuTimer == globalMenuTimerAbsolute){return true}
  return false;
}

function terrainCollisionCheck(object){
  for(var i = 0; i<blockArray.length;i++){
    collisionCheckX(object, blockArray[i]);
  }
}

function animate(){
  c.clearRect(0, 0, canvas.width, canvas.height);
  if(!globalMenuTimerCheck()){globalMenuTimer += 1;}
  switch(gameState){
    case 'game':
      if(input.qKey && globalMenuTimerCheck()){
        gameState = 'mainMenu';
        globalMenuTimer = 0;
        break;
      }
      game();
      break;
    case 'other':
      gameInitialization();
      break;
    case 'mainMenu':
      if(input.qKey && globalMenuTimerCheck()){
        gameState = 'game';
        globalMenuTimer = 0;
        break;
      }
      mainMenu.update();
      break;
    }
  setTimeout(animate, 1000/60);
  var t = 0;
  t = t+1;
}

function game(){
  //debug
  //background
  if(dbBackground){
  c.fillStyle = 'rgb(4, 28, 66)';
  c.fillRect(0,0,canvas.width,canvas.height);

  //horizontal lines
  //vertical lines
  c.fillStyle = 'gray';
  c.strokeStyle = 'gray';
  //vertical lines
  for(var i = 1; i<(canvas.width/dbSquare); i++){
    c.fillRect(i*dbSquare,0,10,canvas.height);
    c.strokeRect(i*dbSquare,0,10,canvas.height);
    c.stroke();
    }

  //horizontal lines
  for(var i = 1; i<(canvas.height/dbSquare); i++){
    c.fillRect(0,i*dbSquare,canvas.width,10);
    c.strokeRect(0,i*dbSquare,canvas.width,10);
    c.stroke();
    }
  c.strokeStyle = 'black';
}
  //game
  p.update();
  for(var i = 0; i<attackArray.length;i++){
    attackArray[i].update();
    if(attackArray[i].status == 'delete'){
      attackArray.splice(i,1);
      i -= 1;
    }
  }
  for(var i = 0; i<blockArray.length;i++){
    blockArray[i].update();
  }
  for(var i = 0; i<spellEffectArray.length;i++){
    spellEffectArray[i].update();
    if(spellEffectArray[i].status == 'delete'){
      spellEffectArray.splice(i,1);
      i -= 1;
    }
  }
  for(var i = 0; i<enemyArray.length; i++){
    enemyArray[i].update();
    if(enemyArray[i].status == 'delete'){
      p.experience += enemyArray[i].experienceValue;
      enemyArray.splice(i,1);
      i -= 1;
    }
  }
  for(var i = 0; i<bulletArray.length; i++){
    bulletArray[i].update();
    if(bulletArray[i].active == false){
      bulletArray.splice(i,1);
      i -= 1;
    }
  }
  //loot
  for(var i = 0; i<lootArray.length; i++){
    lootArray[i].update();
    if(lootArray[i].status == 'delete'){
      lootArray.splice(i,1);
      i -= 1;
      }
  }

  weather.update();

  //spawns enemies
  if(enemyArray.length < 10){
    enemyArray.push(new Duck(500,1000));
  }
  uiCheck();
  p.drawSpells();

  //clears attack array if the latest value is false
  if(attackArray[0]){
  if(attackArray[attackArray.length-1].active == false){attackArray = [];}
  }

}

function uiCheck(){
//hpBar
  hpBar.update();

//text
  for(var i = 0; i<textArray.length;i++){
    textArray[i].update();
    if(textArray[i].duration>=textArray[i].durationThreshold){
      textArray.splice(i,1);
      i -= 1;
    }
  }
//amulet
  amulet.update();
}

function dropChance(obj){
  for(var i = 0;i<obj.lootTable.length;i++){
    var rand = Math.random();
    var rarity = 0;
    if(rand<obj.lootChance[i]){
      if(obj.lootChance[i]<=legendaryRarity){rarity = 'legendary'}
      else if(obj.lootChance[i]<=rareRarity){rarity = 'rare'}
      else if(obj.lootChance[i]<=uncommonRarity){rarity = 'uncommon'}
      else if(obj.lootChance[i]<=commonRarity){rarity = 'common'}
      lootArray.push(new Loot(obj, obj.lootTable[i],rarity));
    }
  }
}

function statArraySetup(obj, type){
  obj[0]='health';
  obj[1]='damage';

  switch (type) {
  case 'player':
    //health
    obj[0][0] = 100;
    obj[0][1] = 0;
    obj[0][2] = 0
    obj[0][3] = obj[0][0];

    //damage
    obj[1][0] = 50;
    obj[1][1] = 0;
    obj[1][2] = 0;
    obj[1][3] = obj[1][0];
    break;

  case 'duck':
    //fill in for duck, might not be needed though?
  break;
}
}

function calculateStats(obj){
  for(var i = 0;i<obj.length;i++){
    obj[i][3] = obj[i][2]*(obj[i][0]+obj[i][1])
  }
}

function equipmentArraySetup(obj){
  obj[0] = 'ring one';
  obj[1] = 'ring two';
  obj[0][0] = false;
  obj[1][0]= false
}

function removeEquipment(item,obj){
  for(var i = 0;i<obj.length; i++){
    if(item[i]){
      obj[i][1] -= item[i][1];
      obj[i][2] -= item[i][2];
    }
  }
}

function addEquipment(item, obj){
  for(var i = 0;i<obj.length; i++){
    if(item[i]){
      obj[i][1] += item[i][1];
      obj[i][2] += item[i][2];
    }
  }
}

function equipmentChange(action, slot, inventoryArrayLocation){
  switch(action){
    case 'exchange':
      var temp = p.equipmentArray[slot][0];
      removeEquipment(temp, p.statsArray)
      p.equimentArray[slot][0] = inventoryArray[inventoryArrayLocation];
      addEquipment(p.equimentArray[slot][0], p.statsArray)
      inventoryArray.splice(inventoryArrayLocation,1);
      inventoryArray.push(temp);
      calculateStats(p.statsArray);
      break;
    case 'unequip':
      inventoryArray.push(p.equipmentArray[slot][0]);
      removeEquipment(p.equipmentArray[slot][0], p.statsArray)
      equipmentArray[slot][0] = 0;
      calculateStats(p.statsArray);
      break;
    case 'equip to empty slot':
      equipmentArray[slot][0] = inventoryArray[inventoryArrayLocation];
      inventoryArray.splice(inventoryArrayLocation,1);
      addEquipment(p.equipmentArray[slot][0], p.statsArray);
      calculateStats(p.statsArray);
      break;
  }
}

function rectIntersection(obj1,obj2){
  var x1 = obj1.x;
  var x2 = x1 + obj1.w;
  var x3 = obj2.x;
  var x4 = x3 + obj2.w;
  var y1 = obj1.y;
  var y2 = y1 + obj1.h;
  var y3 = obj2.y;
  var y4 = y3 + obj2.h;

  return(x4>x1 && x3<x2 && y3<y2 && y4>y1)
}

function collisionCheckX(obj1,obj2){
  if(rectIntersection(obj1,obj2)){
    var yDif = 0;
    var xDif = 0;

    //calculates yDif, xDif, slope, intercept, and velocity proportions
    if (obj1.y<obj2.y){
      yDif = Math.abs(obj1.y+obj1.h-obj2.y);
      }
    else{
      yDif = Math.abs(obj2.y+obj2.h-obj1.y);
      }

    if (obj1.x<obj2.x){
      xDif = Math.abs(obj1.x+obj1.w-obj2.x);
      }
    else{
      xDif = Math.abs(obj2.x+obj2.w-obj1.x);
      }
    var velocityProportionY = 0;
    var velocityProportionX = 0;

    //checks if velocity values are zero
    if(obj1.dy == 0){
      velocityProportionY = 0;
      }
    else{
      velocityProportionY = Math.abs(yDif/obj1.dy);
      }
    if(obj1.dx == 0){
      velocityProportionX = 0;
      }
    else{
      velocityProportionX = Math.abs(xDif/obj1.dx);
      }

    var slope = 0;
    //checks if velocity values are zero
    if(obj1.dy == 0){
      slope = Math.abs(0.0001/obj1.dx);
      }
    else if(obj1.dx == 0){
      slope = Math.abs(obj1.dy/0.0001);
      }
    else{
      var slope = Math.abs(obj1.dy/obj1.dx);
      }
    var intercept = yDif/xDif;

    if(slope>intercept){
      collisionCorrection(obj1, 'y', velocityProportionX, velocityProportionY);
      }
    else{
      collisionCorrection(obj1, 'x', velocityProportionX, velocityProportionY);
      }
      return
  }
  // var testArray = [];
  // testArray[0] = new Unit(obj1.x,obj1.y+1)
  // if(rectIntersection(testArray[0],obj2)){
  //   obj1.ground();
  // }
  // testArray[0] = 0;


}

function applyGravity(obj1){
  if(obj1.y > obj1.y - obj1.h + 10 && !obj1.oldGrounded){
    obj1.dy += gravityCoefficient;
  }
}
function applyVelocity(obj1){

  obj1.dx += obj1.ddx;
  obj1.dy += obj1.ddy;

  obj1.x += obj1.dx;
  obj1.y += obj1.dy;
  return;
}

function applyPhysics(obj1){
  applyGravity(obj1);
  applyVelocity(obj1);
}

function collisionCorrection(obj1, primary, velocityProportionX, velocityProportionY){
  if(primary == 'x'){
    obj1.x -= obj1.dx * (velocityProportionX*1.01);
    obj1.y -= obj1.dy * (velocityProportionX*1.01);
    obj1.dx = 0;
    return
    }
  else {
    obj1.y -= obj1.dy * (velocityProportionY*1.00);
    obj1.x -= obj1.dx * (velocityProportionY*1.00);
    if(obj1.dy>0){
      obj1.ground();
    }
    }
}

function sphereIntersection(obj1,obj2){
//obj1 is rectangle, obj2 is sphere
  return((obj1.x-obj2.r)<obj2.x && (obj2.x-obj2.r)<(obj1.x+obj1.w) && obj1.y-obj2.r<obj2.y && (obj1.y+obj1.h)>(obj2.y-obj2.r))
}

function getNearestEnemy(obj1){
  var enemyDistanceArray = [];
  var xDif = 0;
  var yDif = 0;
  for(var i = 0; i<enemyArray.length; i++){
    xDif = Math.abs(enemyArray[i].x - obj1.x);
    yDif = Math.abs(enemyArray[i].y - obj1.y);
    enemyArray[i].totalDistance = xDif+yDif
    enemyDistanceArray.push(enemyArray[i]);
  }
  //sory by total distance
  for(var i = 0;i<enemyDistanceArray.length;i++){
    for(var j = 0;j<enemyDistanceArray.legnth;j++){
      if(j + 1 <= enemyDistanceArray.length){
        if(enemyDistanceArray[j].totalDistance > enemyDistanceArray[j+1].totalDistance){
          var temp = enemyDistanceArray[j+1];
          enemyDistanceArray[j+1] = enemyDistanceArray[j];
          enemyDistanceArray[j] = temp;
        }
      }
    }
  }
  return enemyDistanceArray[0];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntMinMax(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function gameInitialization(){
  attackArray = [];
  blockArray = [];
  bulletArray = [];
  enemyArray = [];
  textArray = [];
  spellEffectArray = [];
  lootArray = [];

  amulet = new Amulet();
  cure = new CureSpell();
  regen = new RegenSpell();
  iceBolt = new IceBoltSpell();

  weather = new Weather();
  p = 0;
  p = new Unit(200,10);
  hpBar = new HPBar();
  blockArray.push(new Enemy(150,500));
  blockArray.push(new Enemy((blockWidth+2),(canvas.height - blockHeight*4)));
  enemyArray.push(new Duck(1000,1000));
  for(var i = 0; i<(canvas.width/blockWidth);i++){
    blockArray.push(new Enemy((i*blockWidth)+2,(canvas.height - blockHeight)));
  }
  if(dbSpawnTurrets){
    for(var i =0;i<4;i++){
      blockArray.push(new Turret(800+(i*700),200+(i*100),30,10,100));
      }
  }
  gameState = 'game';
}

function calculateDamage(defense, damage){
  if(defense>defenseThreshold.third){
    damage *= 1-defenseThreshold.thirdReduction;
  }
  else if(defense>defenseThreshold.second){
    damage *= 1-defenseThreshold.secondReduction;
  }
  else if(defense>defenseThreshold.first){
    damage *= 1-defenseThreshold.firstReduction;
  }
  return damage;
}

function calculateCritical(percent, modifier, damage){
var randCrit = Math.random();
  if(randCrit<percent){
    if(modifier>criticalStrikeModifier.third){
      console.log(criticalStrikeModifier.third)
      Math.trunc(damage *= (1+criticalStrikeModifier.thirdMultiplier))
    }
    else if(modifier>criticalStrikeModifier.second){
      Math.trunc(damage *= (1+criticalStrikeModifier.secondMultiplier))
      console.log(2)
    }
    else if(modifier>criticalStrikeModifier.first){
      Math.trunc(damage *= (1+criticalStrikeModifier.firstMultiplier))
      console.log(3)
    }
  }
  return damage;
}
// var cure = new Spell{
//   this.cost = 1;
//   this.cureAmount = 200;
//
//   spell.effect(user){
//     if(user.maxHP+this.cureAmount > user.maxHP){user.hp = user.maxHP}
//     else{user.hp += 200}
//   };
// }

//Spells
//Haste - Move speed and attack speed up
//Fireball - 3 homing fireballs
//Sense Treasure - notifies of surrounding treasure for x duration
//Vampirism - restores health on attack
//Cure - instant heal, low hp regained
//Regen - very slow hp recovery over x seconds, but more total hp recovered than cure
//Flame Shield - temporary fire orb effect over x seconds
//Wish - reduce hp to 1 or full heal (50/50)
//Mana Shield  - Shield which consumes one bullet, shorter than average invulnerability
//Slow Time - slows all time in the room other than the player
//Lightning Storm - summons storm cloud for X seconds, randomly striking enemies
//Intense Focus - amulet regen is increased, move speed is decreased, damage taken is increased
//Divine Prayer - reserves an amulet slot, increases invulnerability frames by x%.
//Enchant Weapon (fire/ice/lightning) - enchants weapon with an elemental component, causing it to inflict status effects for x seconds
//Reckless Assault - damage dealt increased by 20%, damage taken increased by 50% for X seconds.
//Lady Luck - increased critical strike chance for attacks over X seconds.

//Spell Ideas
//create buildings with a duration that spawn random items like Faust in GG?
//create an auto turret
