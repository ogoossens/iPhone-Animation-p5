/*
* Github: TODO
* New p5.js project example that binds the sketch to a DIV and adjusts
* the canvas size to fit into it respecting the predefined aspect ratio
* if the ratio is defined
*
* Should the ratio NOT be defined the canvas will fit the whole parent DIV
*
* I'll be using this as my template for future new projects ...
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
let stage = 2;
let stageSwapStarted;
let stageDelays = [1, 1, 3000, 300, 100, 8000, 500, 600, 3000];

/*
* RATIO between the width and height
* [WIDTH , HEIGHT] or 'null'
*
* If the RATIO is defined as 'null' it would always fill the whole DIV
*
* Examples:
* RATIO 16:9 is [16, 9]
* RATIO 1:1 (square) is [1, 1]
* RATIO 'null' - always fill the whole parent DIV
*/
let sketchRatio = [1, 1];
let sizeRatio = 1;
let expectedWidth = 600;

//let sketchRatio = null;

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
  // Create canvas
  let canvas = createCanvas();
  
  // Place the canvas into this DIV
  canvas.parent(divName);
  
  // Create Phone Element
  iPhone = new Phone();
  
  // Settings
  imageMode(CENTER);
  
  // Timing reset
  stageSwapStarted = millis();
  
  // Call the windowResized() function the first time to get the initial values for the canvas
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
    
    this.def_shardsAdjustment = 300;
    
    // System variables
    this.animationProgression = 1;
    this.shardsRandomness = 0;
    this.swapDuration = 0;
    this.sinceSwapStarted = 0;
    this.animationFinished = false;
    
    this.frontX = this.def_frontX;
    this.backX = this.def_backX;
    this.frontShadowX = this.def_frontShadowX;
    this.backShadowX = this.def_backShadowX;
    this.backShadowY = this.def_backShadowY;
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
    
    // Shadows
    
    
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
      image(screenOffBroken, this.frontX - 7, this.frontY, screenNormal.width / sizeRatio, screenNormal.height / sketchRatio);
    }
    // image(screenOffBroken, this.frontX - 7, this.frontY, screenNormal.width / sizeRatio, screenNormal.height / sketchRatio);
    
    // Shards
    if(stage == 5 || stage == 6) {
      for(let i = 0; i < shards.length; i++) {
        image(shards[i], this.shardsPositionX - (i * 10) * this.shardsRandomness, this.frontY - (i * 2) * this.shardsRandomness, shards[i].width / sizeRatio, shards[i].height / sketchRatio);
      }
    }
  }
}


// Resized window. function that is ran every time a size of the windows changes
function windowResized() {
  
  // Read the DIV current (new) size and adjust them to fit proportionally
  let tempWidth = document.getElementById(divName).offsetWidth;
  let tempHeight = document.getElementById(divName).offsetHeight;
  
  // Check if the ratio is defined, if not just use the new DIV dimensions
  if(!(sketchRatio == null)) {
    
    // Find out which one is smaller - we have to make that one FIT
    // For this calculation we need to take the RATIO into consideration
    if(tempWidth * sketchRatio[1] > tempHeight * sketchRatio[0]) {
      
      // The WIDTH is bigger than 'allowed' and so we need to adjust that
      // To do this we take the HEIGHT value and use that to calculate new WIDTH value
      // We let the HEIGHT untouched
      tempWidth = tempHeight / sketchRatio[1] * sketchRatio[0];
      
    } else {
      
      // The HEIGHT is bigger than 'allowed' and so we need to adjust that
      // To do this we take the WIDTH value and use that to calculate new HEIGHT value
      // This also runs if the ratios are "same" (1:1)
      // We let the WIDTH untouched
      tempHeight = tempWidth / sketchRatio[0] * sketchRatio[1];
    }
  }
  
  // The calculation is done, the values are adjusted lets apply them
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

function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
}

function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
}

function mouseReleased() {
  nextStage();
}