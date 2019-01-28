/*
* Github: https://github.com/ogoossens/iPhone-Animation-p5
*/

// Name of the DIV holding the sketch
let divName = "p5-sketch-holder";
let folderName = "phoneAnimation";

// Images
let backPhone, frontPhone, backPhoneShadow, frontPhoneShadow;
let screenNormal, screenNormalBroken, screenOffBroken;
let shards = [];

// Phone Element
let iPhone;

// Animation Elements
let stage = 5;
let stageSwapStarted;
let stageDelays = [1, 1, 3000, 300, 100, 8000, 500, 600, 3000];
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
  
  for(let i = 1; i < 18; i++) {
    shards.push(loadImage(folderName + "/images/s" + i + ".png"));
  }
  
}

function setup() {
  let canvas = createCanvas();
  canvas.parent(divName);
  iPhone = new Phone();
  imageMode(CENTER);
  stageSwapStarted = millis();
  windowResized();
}

function draw() {
  clear();
  //background(220);
  
  iPhone.draw();
}

function nextStage() {
  if(stage < 8) {
    setStage(stage + 1);
  } else {
    setStage(3);
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

class Shard {
  constructor(image, x, y) {
    this.image = image;
    this.def_X = x;
    this.def_y = y;
  }
  
  draw() {
    image(this.image, this.def_X, this.def_y);
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
    this.shards.push(new Shard(loadImage(folderName + "/images/s1.png"), 200, 200));
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
    
    /*
    // Shards
    // Stage 5 shards OUT
    if(stage == 5) {
      if(this.animationFinished) {
        this.shardsPositionX = easeOutExpo(this.sinceSwapStarted, this.frontX, this.def_shardsAdjustment - this.frontX, this.swapDuration);
        
        // Shards Randomness
        this.shardsRandomness = map(this.sinceSwapStarted, 0, this.swapDuration, 0, 1);
      } else {
        this.shardsRandomness = 1;
        this.shardsPositionX = this.def_shardsAdjustment;
      }
    }
    
    // Stage 5 shards IN
    if(stage == 6) {
      if(this.animationFinished) {
        this.shardsPositionX = easeInQuad(this.sinceSwapStarted, this.def_shardsAdjustment, this.frontX - this.def_shardsAdjustment, this.swapDuration);
        
        // Shards Randomness
        this.shardsRandomness = map(this.sinceSwapStarted, 0, this.swapDuration, 1, 0);
      } else {
        this.shardsRandomness = 0;
        this.shardsPositionX = this.frontX;
      }
    }
    */
  }
  
  draw() {
    // Recalculate positions
    this.recalculate();
    
    // Shadows
    if(stage > 2) {
      image(frontPhoneShadow, this.frontShadowX, this.frontShadowY, frontPhoneShadow.width / sizeRatio, frontPhoneShadow.height / sketchRatio);
      image(backPhoneShadow, this.backShadowX, this.backShadowY, backPhoneShadow.width / sizeRatio, backPhoneShadow.height / sketchRatio);
    } else if(stage == 2) {
      if(this.animationProgression > 0.3) {
        image(frontPhoneShadow, this.frontShadowX, this.frontShadowY, frontPhoneShadow.width / sizeRatio, frontPhoneShadow.height / sketchRatio);
        image(backPhoneShadow, this.backShadowX, this.backShadowY, backPhoneShadow.width / sizeRatio, backPhoneShadow.height / sketchRatio);
      }
    }
    
    // Phones
    image(backPhone, this.backX, this.backY, backPhone.width / sizeRatio, backPhone.height / sketchRatio);
    image(frontPhone, this.frontX, this.frontY, frontPhone.width / sizeRatio, frontPhone.height / sketchRatio);
    
    // Screens
    if(stage < 5 || stage > 6) {
      image(screenNormal, this.frontX - 7, this.frontY, screenNormal.width / sizeRatio, screenNormal.height / sketchRatio);
    } else {
      image(screenNormalBroken, this.frontX - 7, this.frontY, screenNormal.width / sizeRatio, screenNormal.height / sketchRatio);
      //image(screenOffBroken, this.frontX - 7, this.frontY, screenNormal.width / sizeRatio, screenNormal.height / sketchRatio);
    }
    
    // Shards
    if(stage == 5 || stage == 6) {
      
      for(let i = 0; i < this.shards.length; i++) {
        this.shards[i].draw();
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