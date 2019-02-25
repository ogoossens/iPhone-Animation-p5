/*
* Github: https://github.com/ogoossens/iPhone-Animation-p5
*/

// Name of the DIV holding the sketch
let divName = "p5-sketch-holder";
let folderName = "phoneAnimation";

// Images
let backPhone, frontPhone, backPhoneShadow, frontPhoneShadow;
let screenNormal, screenNormalBroken, screenOffBroken;
let infoImage1, infoImage2, infoImage3, infoImage4, infoImage5;

// Phone Element
let iPhone;

// Animation Elements
let stage = 2;
let stageSwapStarted;
let stageDelays = [1, 1, 3000, 300, 100, 2000, 800, 600, 3000];
let sketchRatio = [1, 1];
let sizeRatio = 1;
let expectedWidth = 600;

function preload() {
  backPhone = loadImage(folderName + "/images/back.png");
  frontPhone = loadImage(folderName + "/images/front.png");
  backPhoneShadow = loadImage(folderName + "/images/shadow-back.png");
  frontPhoneShadow = loadImage(folderName + "/images/shadow-front.png");
  
  screenNormal = loadImage(folderName + "/images/screen-normal-color.png");
  screenNormalBroken = loadImage(folderName + "/images/screen-broken-color.png");
  screenOffBroken = loadImage(folderName + "/images/screen-broken-black.png");
  
  infoImage1 = loadImage(folderName + "/images/1.png");
  infoImage2 = loadImage(folderName + "/images/2.png");
  infoImage3 = loadImage(folderName + "/images/3.png");
  infoImage4 = loadImage(folderName + "/images/4.png");
  infoImage5 = loadImage(folderName + "/images/5.png");
}

function setup() {
  let canvas = createCanvas();
  canvas.parent(divName);
  iPhone = new Phone();
  imageMode(CENTER);
  stageSwapStarted = millis();
  windowResized();
  angleMode(DEGREES);
}

function draw() {
  clear();
  // background(220);
  
  iPhone.draw();
}

function nextStage() {
  if(stage < 8) {
    setStage(stage + 1);
  } else {
    setStage(3);
    
    // Reset shards data
    for(let i = 0; i < iPhone.shards.length; i++) {
      iPhone.shards[i].reset();
    }
  }
}

function setStage(nr) {
  stage = nr;
  stageSwapStarted = millis();
  
  // Automated stage swapping here
  if(stage == 3 || stage == 4 || stage == 6 || stage == 7) {
    setTimeout(function() {
      nextStage();
    }, stageDelays[stage]);
  }
}

function fromCenterX(currentX) {
  return currentX + (205 - currentX) * 5;
}


function fromCenterY(currentY) {
  return currentY + (333 - currentY) * 2.3;
}


class Shard {
  constructor(image, x, y, targetX, targetY) {
    this.image = image;
    this.def_X = x;
    this.def_Y = y;
    
    this.target_x = targetX;
    this.target_y = targetY;
    
    this.savetargetX = targetX;
    this.savetargetY = targetY;
    
    this.currentX = 0;
    this.currentY = 0;
    
    this.currentPowerVector = createVector(0, 0);
  }
  
  reset() {
    this.target_x = this.savetargetX;
    this.target_y = this.savetargetY;
  }
  
  draw(progression) {
    
    if(progression < 1) {
      if(stage == 5) {
        this.currentX = easeOutExpo(progression, this.def_X, this.target_x - this.def_X, 1);
        this.currentY = easeOutExpo(progression, this.def_Y, this.target_y - this.def_Y, 1);
      } else if(stage == 6) {
        this.currentX = easeInExpo(progression, this.target_x, this.def_X - this.target_x, 1);
        this.currentY = easeInExpo(progression, this.target_y, this.def_Y - this.target_y, 1);
      }
    } else {
      this.recalc();
    }
    
    image(this.image, this.currentX / sizeRatio, this.currentY / sizeRatio, this.image.width / sizeRatio, this.image.height / sizeRatio);
  }
  
  recalc() {
    
    let limit = 75;
    
    let currentPosition = createVector(this.target_x / sizeRatio, this.target_y / sizeRatio);
    let directionVector = createVector(mouseX - currentPosition.x, mouseY - currentPosition.y);
    let distanceToMouse = dist(mouseX, mouseY, currentPosition.x, currentPosition.y);
    let normalDirVector = directionVector.copy();
    normalDirVector.normalize();
    
    // Percentage power
    let powerPercent = constrain(map(distanceToMouse, limit, 0, 0, 100), 0, 100);
    
    let modifier = sizeRatio * powerPercent * -1 / 100;
    
    
    this.currentPowerVector.x = this.currentPowerVector.x / sizeRatio + normalDirVector.x * modifier;
    this.currentPowerVector.y = this.currentPowerVector.y / sizeRatio + normalDirVector.y * modifier;
    
    // console.log(this.currentPowerVector.x);
    
    
    // DEBUG LINES
    /*
    rect(currentPosition.x, currentPosition.y, 5, 5);
    line(currentPosition.x, currentPosition.y, currentPosition.x + directionVector.x, currentPosition.y + directionVector.y);
    line(currentPosition.x, currentPosition.y, currentPosition.x - this.currentPowerVector.x* -1, currentPosition.y - this.currentPowerVector.y* -1);
    */
    
    this.target_x = this.target_x + this.currentPowerVector.x;
    this.target_y = this.target_y + this.currentPowerVector.y;
    
    
    // Use position
    this.currentX = this.target_x;
    this.currentY = this.target_y;
    
    // Decrease
    
    this.currentPowerVector.x = lerp(this.currentPowerVector.x, 0, 0.45);
    this.currentPowerVector.y = lerp(this.currentPowerVector.y, 0, 0.45);
    
  }
}


class Phone {
  constructor() {
    // Fixed Positions
    this.def_frontX = 470;
    this.def_frontY = [1010, 1010, 310, 280, 330, 330, 330, 280, 310];
    this.def_backX = 405;
    this.def_backY = [930, 1830, 230, 230, 230, 230, 230, 230, 230];
    this.def_frontShadowX = 430;
    this.def_frontShadowY = [550, 550, 550, 558, 540, 540, 540, 558, 550];
    this.def_backShadowX = 430;
    this.def_backShadowY = 550;
    
    // System variables
    this.animationProgression = 1;
    this.swapDuration = 0;
    this.sinceSwapStarted = 0;
    this.animationFinished = false;
    
    this.frontX = this.def_frontX;
    this.backX = this.def_backX;
    this.frontShadowX = this.def_frontShadowX;
    this.backShadowX = this.def_backShadowX;
    this.backShadowY = this.def_backShadowY;
    
    // Shards
    this.shards = [];
    this.shards.push(new Shard(loadImage(folderName + "/images/s1.png"), 460, 350, 150, 280));
    this.shards.push(new Shard(loadImage(folderName + "/images/s2.png"), 500, 350, 180, 280));
    this.shards.push(new Shard(loadImage(folderName + "/images/s3.png"), 450, 450, 120, 450));
    this.shards.push(new Shard(loadImage(folderName + "/images/s4.png"), 450, 480, 110, 480));
    this.shards.push(new Shard(loadImage(folderName + "/images/s5.png"), 490, 430, 150, 430));
    this.shards.push(new Shard(loadImage(folderName + "/images/s6.png"), 473, 434, 123, 434));
    this.shards.push(new Shard(loadImage(folderName + "/images/s7.png"), 439, 417, 109, 417));
    this.shards.push(new Shard(loadImage(folderName + "/images/s8.png"), 475, 508, 125, 508));
    this.shards.push(new Shard(loadImage(folderName + "/images/s9.png"), 427, 382, 207, 352));
    this.shards.push(new Shard(loadImage(folderName + "/images/s10.png"), 475, 241, 225, 221));
    this.shards.push(new Shard(loadImage(folderName + "/images/s11.png"), 504, 526, 304, 506));
    this.shards.push(new Shard(loadImage(folderName + "/images/s12.png"), 467, 535, 227, 535));
    this.shards.push(new Shard(loadImage(folderName + "/images/s13.png"), 531, 436, 301, 406));
    this.shards.push(new Shard(loadImage(folderName + "/images/s14.png"), 531, 526, 301, 526));
    this.shards.push(new Shard(loadImage(folderName + "/images/s15.png"), 513, 435, 343, 435));
    this.shards.push(new Shard(loadImage(folderName + "/images/s16.png"), 531, 294, 311, 254));
    this.shards.push(new Shard(loadImage(folderName + "/images/s17.png"), 429, 520, 239, 520));
  }
  
  recalculate() {
    // Variables needed recalculation
    // Check if the current stageSwap is over, if so assign fix values
    this.sinceSwapStarted = millis() - stageSwapStarted;
    this.swapDuration = stageDelays[stage];
    this.animationProgression = map(this.sinceSwapStarted, 0, this.swapDuration, 0, 1);
    this.animationFinished = this.sinceSwapStarted < this.swapDuration;
    
    if(this.animationFinished) {
      this.frontY = easeOutExpo(this.sinceSwapStarted, this.def_frontY[stage - 1], this.def_frontY[stage] - this.def_frontY[stage - 1], this.swapDuration);
      this.backY = easeOutExpo(this.sinceSwapStarted, this.def_backY[stage - 1], this.def_backY[stage] - this.def_backY[stage - 1], this.swapDuration);
      this.frontShadowY = easeOutExpo(this.sinceSwapStarted, this.def_frontShadowY[stage - 1], this.def_frontShadowY[stage] - this.def_frontShadowY[stage - 1], this.swapDuration);
    } else {
      this.frontY = this.def_frontY[stage];
      this.backY = this.def_backY[stage];
      this.frontShadowY = this.def_frontShadowY[stage];
    }
  }
  
  draw() {
    // Recalculate positions
    this.recalculate();
    
    // Shadows
    if(stage > 2) {
      image(frontPhoneShadow, this.frontShadowX / sizeRatio, this.frontShadowY / sizeRatio, frontPhoneShadow.width / sizeRatio, frontPhoneShadow.height / sizeRatio);
      image(backPhoneShadow, this.backShadowX / sizeRatio, this.backShadowY / sizeRatio, backPhoneShadow.width / sizeRatio, backPhoneShadow.height / sizeRatio);
    } else if(stage == 2) {
      if(this.animationProgression > 0.3) {
        image(frontPhoneShadow, this.frontShadowX / sizeRatio, this.frontShadowY / sizeRatio, frontPhoneShadow.width / sizeRatio, frontPhoneShadow.height / sizeRatio);
        image(backPhoneShadow, this.backShadowX / sizeRatio, this.backShadowY / sizeRatio, backPhoneShadow.width / sizeRatio, backPhoneShadow.height / sizeRatio);
      }
    }
    
    // Info images
    switch(stage) {
      case 2:
        if(this.sinceSwapStarted > 4000) {
          nextStage();
        }
        break;
      case 8:
        image(infoImage5, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
        image(infoImage4, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
        
        break;
      case 5:
        if(this.sinceSwapStarted > 0 && this.sinceSwapStarted < 10000) {
          image(infoImage2, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
        }
        
        if(this.sinceSwapStarted > 10000) {
          image(infoImage3, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
        }
        
        break;
    }
    
    // Edit front and back positions X relative to mouseMovement
    // Todo
    this.backY = this.backY + sin(frameCount/2%360)*7*sizeRatio;
  
    if(stage < 5 || stage > 6) {
      this.frontY = this.frontY + sin(frameCount/2%360)*5*sizeRatio;
    }
    
    
    // Phones
    image(backPhone, this.backX / sizeRatio, this.backY / sizeRatio, backPhone.width / sizeRatio, backPhone.height / sizeRatio);
    image(frontPhone, this.frontX / sizeRatio, this.frontY / sizeRatio, frontPhone.width / sizeRatio, frontPhone.height / sizeRatio);
    
    // Screens
    if(stage < 5 || stage > 6) {
      image(screenNormal, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
    } else {
      
      // Screen is broken
      if(stage == 5) {
        
        if(this.animationProgression < 0.3) {
          image(screenNormalBroken, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
        } else {
          image(screenOffBroken, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
        }
      } else {
        image(screenOffBroken, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
      }
    }
    
    // Shards
    if(stage == 5 || stage == 6) {
      for(let i = 0; i < this.shards.length; i++) {
        this.shards[i].draw(this.animationProgression);
      }
    }
  }
}


function windowResized() {
  let tempWidth = document.getElementById(divName).offsetWidth;
  let tempHeight = document.getElementById(divName).offsetHeight;
  if(!(sketchRatio == null)) {
    if(tempWidth * sketchRatio[1] > tempHeight * sketchRatio[0]) {
      tempWidth = tempHeight / sketchRatio[1] * sketchRatio[0];
    } else {
      tempHeight = tempWidth / sketchRatio[0] * sketchRatio[1];
    }
  }
  resizeCanvas(tempWidth, tempHeight);
  sizeRatio = expectedWidth / tempWidth;
}

// VARIABLES FOR EASING:
// t: current time
// b: begInnIng value
// c: change In value
// d: duration
function easeInQuad(t, b, c, d) {
  let temp = (t / d);
  return c * temp * temp + b;
}

function easeOutQuad(t, b, c, d) {
  let temp = (t / d);
  return -c * temp * (temp - 2) + b;
}

function easeOutExpo(t, b, c, d) {
  return c * (-Math.pow(2, -10 * t / d) + 1) + b;
}

function easeInExpo(t, b, c, d) {
  return c * Math.pow(2, 10 * (t / d - 1)) + b;
}

// Dev
function mouseReleased() {
  nextStage();
}

