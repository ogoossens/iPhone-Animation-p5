/*
* Github: https://github.com/ogoossens/iPhone-Animation-p5
*/


function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
* Github: https://github.com/ogoossens/iPhone-Animation-p5
*/
// Name of the DIV holding the sketch
var divName = "p5-sketch-holder";
var folderName = "phoneAnimation"; // Images

var backPhone, frontPhone, backPhoneShadow, frontPhoneShadow;
var screenNormal, screenNormalBroken, screenOffBroken;
var infoImage1, infoImage2, infoImage3, infoImage4, infoImage5; // Phone Element

var iPhone; // Animation Elements

var stage = 2;
var stageSwapStarted;
var stageDelays = [1, 1, 3000, 300, 100, 2000, 800, 600, 3000];
var sketchRatio = [1, 1];
var sizeRatio = 1;
var expectedWidth = 600;
var playTime = 6000;

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
  var canvas = createCanvas();
  canvas.parent(divName);
  iPhone = new Phone();
  imageMode(CENTER);
  stageSwapStarted = millis();
  windowResized();
  angleMode(DEGREES);
}

function draw() {
  clear(); // background(220);
  
  iPhone.draw(); // Button
  // rect(140 / sizeRatio - infoImage1.width / sizeRatio / 2, 250 / sizeRatio - infoImage1.height / sizeRatio / 2, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
}

function nextStage() {
  if (stage < 8) {
    setStage(stage + 1);
  } else {
    setStage(3); // Reset shards data
    
    for (var i = 0; i < iPhone.shards.length; i++) {
      iPhone.shards[i].reset();
    }
  }
}

function setStage(nr) {
  stage = nr;
  stageSwapStarted = millis(); // Automated stage swapping here
  
  if (stage == 3 || stage == 4 || stage == 6 || stage == 7) {
    setTimeout(function () {
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

var Shard =
  /*#__PURE__*/
  function () {
    function Shard(image, x, y, targetX, targetY) {
      _classCallCheck(this, Shard);
      
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
    
    _createClass(Shard, [{
      key: "reset",
      value: function reset() {
        this.target_x = this.savetargetX;
        this.target_y = this.savetargetY;
      }
    }, {
      key: "draw",
      value: function draw(progression) {
        if (progression < 1) {
          if (stage == 5) {
            this.currentX = easeOutExpo(progression, this.def_X, this.target_x - this.def_X, 1);
            this.currentY = easeOutExpo(progression, this.def_Y, this.target_y - this.def_Y, 1);
          } else if (stage == 6) {
            this.currentX = easeInExpo(progression, this.target_x, this.def_X - this.target_x, 1);
            this.currentY = easeInExpo(progression, this.target_y, this.def_Y - this.target_y, 1);
          }
        } else {
          this.recalc();
        }
        
        image(this.image, this.currentX / sizeRatio, this.currentY / sizeRatio, this.image.width / sizeRatio, this.image.height / sizeRatio);
      }
    }, {
      key: "recalc",
      value: function recalc() {
        var limit = 100 / sizeRatio;
        var currentPosition = createVector(this.target_x / sizeRatio, this.target_y / sizeRatio);
        var directionVector = createVector(mouseX - currentPosition.x, mouseY - currentPosition.y);
        var distanceToMouse = dist(mouseX, mouseY, currentPosition.x, currentPosition.y);
        var normalDirVector = directionVector.copy();
        normalDirVector.normalize(); // Percentage power
        
        var powerPercent = constrain(map(distanceToMouse, limit, 0, 0, 100), 0, 100);
        var modifier = sizeRatio * powerPercent * -1 / 30;
        this.currentPowerVector.x = this.currentPowerVector.x / sizeRatio + normalDirVector.x * modifier;
        this.currentPowerVector.y = this.currentPowerVector.y / sizeRatio + normalDirVector.y * modifier; // console.log(this.currentPowerVector.x);
        // DEBUG LINES
        
        /*
        rect(currentPosition.x, currentPosition.y, 5, 5);
        line(currentPosition.x, currentPosition.y, currentPosition.x + directionVector.x, currentPosition.y + directionVector.y);
        line(currentPosition.x, currentPosition.y, currentPosition.x - this.currentPowerVector.x* -1, currentPosition.y - this.currentPowerVector.y* -1);
        */
        
        this.target_x = this.target_x + this.currentPowerVector.x;
        this.target_y = this.target_y + this.currentPowerVector.y; // Use position
        
        this.currentX = this.target_x;
        this.currentY = this.target_y; // Decrease
        
        this.currentPowerVector.x = lerp(this.currentPowerVector.x, 0, 0.25);
        this.currentPowerVector.y = lerp(this.currentPowerVector.y, 0, 0.25);
      }
    }]);
    
    return Shard;
  }();

var Phone =
  /*#__PURE__*/
  function () {
    function Phone() {
      _classCallCheck(this, Phone);
      
      // Fixed Positions
      this.def_frontX = 470;
      this.def_frontY = [1010, 1010, 290, 260, 310, 310, 310, 260, 290];
      this.def_backX = 405;
      this.def_backY = [930, 1830, 220, 220, 220, 220, 220, 220, 220];
      this.def_frontShadowX = 430;
      this.def_frontShadowY = [530, 530, 530, 530, 520, 520, 520, 530, 530];
      this.def_backShadowX = 430;
      this.def_backShadowY = 530;
      this.frontYlerp = 0;
      this.backYlerp = 0; // System variables
      
      this.animationProgression = 1;
      this.swapDuration = 0;
      this.sinceSwapStarted = 0;
      this.animationFinished = false;
      this.frontX = this.def_frontX;
      this.backX = this.def_backX;
      this.frontShadowX = this.def_frontShadowX;
      this.backShadowX = this.def_backShadowX;
      this.backShadowY = this.def_backShadowY; // Shards
      
      this.shards = [];
      this.shards.push(new Shard(loadImage(folderName + "/images/s1.png"), 460, 340, 150, 270));
      this.shards.push(new Shard(loadImage(folderName + "/images/s2.png"), 500, 340, 180, 270));
      this.shards.push(new Shard(loadImage(folderName + "/images/s3.png"), 450, 440, 120, 440));
      this.shards.push(new Shard(loadImage(folderName + "/images/s4.png"), 450, 470, 110, 470));
      this.shards.push(new Shard(loadImage(folderName + "/images/s5.png"), 490, 420, 150, 420));
      this.shards.push(new Shard(loadImage(folderName + "/images/s6.png"), 473, 424, 123, 424));
      this.shards.push(new Shard(loadImage(folderName + "/images/s7.png"), 439, 407, 109, 407));
      this.shards.push(new Shard(loadImage(folderName + "/images/s8.png"), 475, 498, 125, 498));
      this.shards.push(new Shard(loadImage(folderName + "/images/s9.png"), 427, 372, 207, 342));
      this.shards.push(new Shard(loadImage(folderName + "/images/s10.png"), 475, 231, 225, 211));
      this.shards.push(new Shard(loadImage(folderName + "/images/s11.png"), 504, 516, 304, 496));
      this.shards.push(new Shard(loadImage(folderName + "/images/s12.png"), 467, 525, 227, 525));
      this.shards.push(new Shard(loadImage(folderName + "/images/s13.png"), 531, 426, 301, 396));
      this.shards.push(new Shard(loadImage(folderName + "/images/s14.png"), 531, 516, 301, 516));
      this.shards.push(new Shard(loadImage(folderName + "/images/s15.png"), 513, 425, 343, 425));
      this.shards.push(new Shard(loadImage(folderName + "/images/s16.png"), 531, 284, 311, 214));
      this.shards.push(new Shard(loadImage(folderName + "/images/s17.png"), 429, 510, 239, 510));
    }
    
    _createClass(Phone, [{
      key: "recalculate",
      value: function recalculate() {
        // Variables needed recalculation
        // Check if the current stageSwap is over, if so assign fix values
        this.sinceSwapStarted = millis() - stageSwapStarted;
        this.swapDuration = stageDelays[stage];
        this.animationProgression = map(this.sinceSwapStarted, 0, this.swapDuration, 0, 1);
        this.animationFinished = this.sinceSwapStarted < this.swapDuration; // Have lerp on always
        
        if (this.animationFinished || true) {
          this.frontYlerp = lerp(this.frontYlerp, easeOutExpo(this.sinceSwapStarted, this.def_frontY[stage - 1], this.def_frontY[stage] - this.def_frontY[stage - 1], this.swapDuration), 0.5);
          this.backYlerp = lerp(this.backYlerp, easeOutExpo(this.sinceSwapStarted, this.def_backY[stage - 1], this.def_backY[stage] - this.def_backY[stage - 1], this.swapDuration), 0.5);
          this.frontY = this.frontYlerp;
          this.backY = this.backYlerp;
          this.frontShadowY = easeOutExpo(this.sinceSwapStarted, this.def_frontShadowY[stage - 1], this.def_frontShadowY[stage] - this.def_frontShadowY[stage - 1], this.swapDuration);
        } else {
          this.frontY = this.def_frontY[stage];
          this.backY = this.def_backY[stage];
          this.frontShadowY = this.def_frontShadowY[stage];
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        // Recalculate positions
        this.recalculate(); // Shadows
        
        if (stage > 2) {
          image(frontPhoneShadow, this.frontShadowX / sizeRatio, this.frontShadowY / sizeRatio, frontPhoneShadow.width / sizeRatio, frontPhoneShadow.height / sizeRatio);
          image(backPhoneShadow, this.backShadowX / sizeRatio, this.backShadowY / sizeRatio, backPhoneShadow.width / sizeRatio, backPhoneShadow.height / sizeRatio);
        } else if (stage == 2) {
          if (this.animationProgression > 0.3) {
            image(frontPhoneShadow, this.frontShadowX / sizeRatio, this.frontShadowY / sizeRatio, frontPhoneShadow.width / sizeRatio, frontPhoneShadow.height / sizeRatio);
            image(backPhoneShadow, this.backShadowX / sizeRatio, this.backShadowY / sizeRatio, backPhoneShadow.width / sizeRatio, backPhoneShadow.height / sizeRatio);
          }
        } // Info images
        
        
        switch (stage) {
          case 2:
            if (this.sinceSwapStarted > 4000) {
              nextStage();
            }
            
            break;
          
          case 8:
            image(infoImage5, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
            image(infoImage4, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
            break;
          
          case 5:
            if (this.sinceSwapStarted < playTime) {
              image(infoImage2, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
            }
            
            if (this.sinceSwapStarted > playTime) {
              image(infoImage3, 140 / sizeRatio, 250 / sizeRatio, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio);
            }
            
            break;
        } // Edit front and back positions X relative to mouseMovement
        
        
        this.backY = this.backY + sin(frameCount / 2 % 360) * 4 * sizeRatio;
        
        if (stage < 5 || stage > 6) {
          this.frontY = this.frontY + sin(frameCount / 2 % 360) * 3 * sizeRatio;
        } // Phones
        
        
        image(backPhone, this.backX / sizeRatio, this.backY / sizeRatio, backPhone.width / sizeRatio, backPhone.height / sizeRatio);
        image(frontPhone, this.frontX / sizeRatio, this.frontY / sizeRatio, frontPhone.width / sizeRatio, frontPhone.height / sizeRatio); // Screens
        
        if (stage < 5 || stage > 6) {
          image(screenNormal, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
        } else {
          // Screen is broken
          if (stage == 5) {
            if (this.animationProgression < 0.3) {
              image(screenNormalBroken, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
            } else {
              image(screenOffBroken, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
            }
          } else {
            image(screenOffBroken, (this.frontX - 7) / sizeRatio, this.frontY / sizeRatio, screenNormal.width / sizeRatio, screenNormal.height / sizeRatio);
          }
        } // Shards
        
        
        if (stage == 5 || stage == 6) {
          for (var i = 0; i < this.shards.length; i++) {
            this.shards[i].draw(this.animationProgression);
          }
        }
      }
    }]);
    
    return Phone;
  }();

function windowResized() {
  var tempWidth = document.getElementById(divName).offsetWidth;
  var tempHeight = document.getElementById(divName).offsetHeight;
  
  if (!(sketchRatio == null)) {
    if (tempWidth * sketchRatio[1] > tempHeight * sketchRatio[0]) {
      tempWidth = tempHeight / sketchRatio[1] * sketchRatio[0];
    } else {
      tempHeight = tempWidth / sketchRatio[0] * sketchRatio[1];
    }
  }
  
  resizeCanvas(tempWidth, tempHeight);
  sizeRatio = expectedWidth / tempWidth;
} // VARIABLES FOR EASING:
// t: current time
// b: begInnIng value
// c: change In value
// d: duration


function easeInQuad(t, b, c, d) {
  var temp = t / d;
  return c * temp * temp + b;
}

function easeOutQuad(t, b, c, d) {
  var temp = t / d;
  return -c * temp * (temp - 2) + b;
}

function easeOutExpo(t, b, c, d) {
  return c * (-Math.pow(2, -10 * t / d) + 1) + b;
}

function easeInExpo(t, b, c, d) {
  return c * Math.pow(2, 10 * (t / d - 1)) + b;
}

function pointInRect(pX, pY, rX, rY, rW, rH) {
  return pX >= rX && pX <= rX + rW && pY >= rY && pY <= rY + rH;
} // Dev


function mouseReleased() {
  if (stage == 5 && iPhone.sinceSwapStarted > playTime) {
    if (pointInRect(mouseX, mouseY, 140 / sizeRatio - infoImage1.width / sizeRatio / 2, 250 / sizeRatio - infoImage1.height / sizeRatio / 2, infoImage1.width / sizeRatio, infoImage1.height / sizeRatio)) {
      nextStage();
    }
  }
  
  if (stage == 8) {
    nextStage();
  }
}