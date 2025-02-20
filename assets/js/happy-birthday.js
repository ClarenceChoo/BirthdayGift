// Select the canvas element and set its dimensions
const c = document.getElementById("c");
let w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext("2d"),
    hw = w / 2,
    hh = h / 2;

// Animation options – updated for larger, bolder text
let opts = {
  strings: ["Happy 21st", "Birthday", "Rebecca!"],
  charSize: 60,
  lineHeight: 70,
  cx: w / 2,
  cy: h / 2,
  fireworkPrevPoints: 10,
  fireworkBaseLineWidth: 5,
  fireworkAddedLineWidth: 8,
  fireworkSpawnTime: 200,
  fireworkBaseReachTime: 30,
  fireworkAddedReachTime: 30,
  fireworkCircleBaseSize: 20,
  fireworkCircleAddedSize: 10,
  fireworkCircleBaseTime: 30,
  fireworkCircleAddedTime: 30,
  fireworkCircleFadeBaseTime: 10,
  fireworkCircleFadeAddedTime: 5,
  fireworkBaseShards: 5,
  fireworkAddedShards: 5,
  fireworkShardPrevPoints: 3,
  fireworkShardBaseVel: 4,
  fireworkShardAddedVel: 2,
  fireworkShardBaseSize: 3,
  fireworkShardAddedSize: 3,
  gravity: 0.1,
  upFlow: -0.1,
  letterContemplatingWaitTime: 360,
  balloonSpawnTime: 20,
  balloonBaseInflateTime: 10,
  balloonAddedInflateTime: 10,
  balloonBaseSize: 20,
  balloonAddedSize: 20,
  balloonBaseVel: 0.4,
  balloonAddedVel: 0.4,
  balloonBaseRadian: -(Math.PI / 2 - 0.5),
  balloonAddedRadian: -1,
};

const Tau = Math.PI * 2;
const TauQuarter = Tau / 4;
let letters = [];

// Set the font (using bold for fatter text)
ctx.font = "bold " + opts.charSize + "px Verdana";

/* ──────────────────────────────── */
/*       Letter "class"           */
/* ──────────────────────────────── */
function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;
  // Offset so that drawing is centered on the letter
  this.dx = -ctx.measureText(char).width / 2;
  this.dy = opts.charSize / 2;
  this.fireworkDy = this.y - hh;

  let hue = (x / 1000) * 360; // Hue calculation remains unchanged.
  this.color = "hsl(" + hue + ",80%,50%)";
  this.lightAlphaColor = "hsla(" + hue + ",80%,50%,alp)";
  this.lightColor = "hsl(" + hue + ",80%,50%)";
  this.alphaColor = "hsla(" + hue + ",80%,50%,alp)";
  this.reset();
}

Letter.prototype.reset = function () {
  this.phase = "firework";
  this.tick = 0;
  this.spawned = false;
  this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
  this.reachTime = (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) | 0;
  this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
  this.prevPoints = [[0, hh, 0]];
};

Letter.prototype.step = function () {
  if (this.phase === "firework") {
    if (!this.spawned) {
      this.tick++;
      if (this.tick >= this.spawningTime) {
        this.tick = 0;
        this.spawned = true;
      }
    } else {
      this.tick++;
      let linearProportion = this.tick / this.reachTime,
          armonicProportion = Math.sin(linearProportion * TauQuarter),
          x = linearProportion * this.x,
          y = hh + armonicProportion * this.fireworkDy;

      if (this.prevPoints.length > opts.fireworkPrevPoints) this.prevPoints.shift();
      this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

      let lineWidthProportion = 1 / (this.prevPoints.length - 1);
      for (let i = 1; i < this.prevPoints.length; i++) {
        let point = this.prevPoints[i],
            point2 = this.prevPoints[i - 1];
        ctx.strokeStyle = this.alphaColor.replace("alp", i / this.prevPoints.length);
        ctx.lineWidth = point[2] * lineWidthProportion * i;
        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
      }

      if (this.tick >= this.reachTime) {
        this.phase = "contemplate";
        this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
        this.circleCompleteTime = (opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random()) | 0;
        this.circleCreating = true;
        this.circleFading = false;
        this.circleFadeTime = (opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random()) | 0;
        this.tick = 0;
        this.tick2 = 0;
        this.shards = [];
        let shardCount = (opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random()) | 0,
            angle = Tau / shardCount,
            cos = Math.cos(angle),
            sin = Math.sin(angle),
            x1 = 1,
            y1 = 0;
        for (let i = 0; i < shardCount; i++) {
          let vx = x1,
              vy = y1;
          let newX = x1 * cos - y1 * sin;
          let newY = y1 * cos + x1 * sin;
          x1 = newX;
          y1 = newY;
          this.shards.push(new Shard(this.x, this.y, vx, vy, this.alphaColor));
        }
      }
    }
  } else if (this.phase === "contemplate") {
    this.tick++;
    if (this.circleCreating) {
      this.tick2++;
      let proportion = this.tick2 / this.circleCompleteTime,
          armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor.replace("alp", proportion);
      ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
      ctx.fill();
      if (this.tick2 > this.circleCompleteTime) {
        this.tick2 = 0;
        this.circleCreating = false;
        this.circleFading = true;
      }
    } else if (this.circleFading) {
      ctx.fillStyle = this.lightColor;
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      this.tick2++;
      let proportion = this.tick2 / this.circleFadeTime,
          armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor.replace("alp", 1 - armonic);
      ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
      ctx.fill();
      if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
    } else {
      ctx.fillStyle = this.lightColor;
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
    }
    for (let i = 0; i < this.shards.length; i++) {
      this.shards[i].step();
      if (!this.shards[i].alive) {
        this.shards.splice(i, 1);
        i--;
      }
    }
    if (this.tick > opts.letterContemplatingWaitTime) {
      this.phase = "balloon";
      this.tick = 0;
      this.spawning = true;
      this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
      this.inflating = false;
      this.inflateTime = (opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random()) | 0;
      this.size = (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;
      let rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
          vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
      this.vx = Math.cos(rad) * vel;
      this.vy = Math.sin(rad) * vel;
    }
  } else if (this.phase === "balloon") {
    ctx.strokeStyle = this.lightColor;
    if (this.spawning) {
      this.tick++;
      ctx.fillStyle = this.lightColor;
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      if (this.tick >= this.spawnTime) {
        this.tick = 0;
        this.spawning = false;
        this.inflating = true;
      }
    } else if (this.inflating) {
      this.tick++;
      let proportion = this.tick / this.inflateTime,
          x = this.cx = this.x,
          y = this.cy = this.y - this.size * proportion;
      ctx.fillStyle = this.alphaColor.replace("alp", proportion);
      ctx.beginPath();
      generateBalloonPath(x, y, this.size * proportion);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, this.y);
      ctx.stroke();
      ctx.fillStyle = this.lightColor;
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      if (this.tick >= this.inflateTime) {
        this.tick = 0;
        this.inflating = false;
      }
    } else {
      this.cx += this.vx;
      this.cy += (this.vy += opts.upFlow);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      generateBalloonPath(this.cx, this.cy, this.size);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.lineTo(this.cx, this.cy + this.size);
      ctx.stroke();
      ctx.fillStyle = this.lightColor;
      ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);
      if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw) {
        this.phase = "done";
      }
    }
  }
};

/* ──────────────────────────────── */
/*       Shard "class"            */
/* ──────────────────────────────── */
function Shard(x, y, vx, vy, color) {
  let vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
  this.vx = vx * vel;
  this.vy = vy * vel;
  this.x = x;
  this.y = y;
  this.prevPoints = [[x, y]];
  this.color = color;
  this.alive = true;
  this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}

Shard.prototype.step = function () {
  this.x += this.vx;
  this.y += (this.vy += opts.gravity);
  if (this.prevPoints.length > opts.fireworkShardPrevPoints) this.prevPoints.shift();
  this.prevPoints.push([this.x, this.y]);
  let lineWidthProportion = this.size / this.prevPoints.length;
  for (let k = 0; k < this.prevPoints.length - 1; k++) {
    let point = this.prevPoints[k],
        point2 = this.prevPoints[k + 1];
    ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
    ctx.lineWidth = k * lineWidthProportion;
    ctx.beginPath();
    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(point2[0], point2[1]);
    ctx.stroke();
  }
  if (this.prevPoints[0][1] > hh) this.alive = false;
};

/* ──────────────────────────────── */
/* Utility: Draw the Balloon Path   */
/* ──────────────────────────────── */
function generateBalloonPath(x, y, size) {
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x - size / 2, y - size / 2,
    x - size / 4, y - size,
    x, y - size
  );
  ctx.bezierCurveTo(
    x + size / 4, y - size,
    x + size / 2, y - size / 2,
    x, y
  );
}

/* ──────────────────────────────── */
/* Transition Function            */
/* ──────────────────────────────── */
function triggerTransition() {
  // Add a fade-out to the canvas (if not already handled by its CSS)
  c.classList.add("fade-out"); // (Ensure your CSS defines .fade-out with transition on opacity)

  // Get the child elements.
  const slideshow = document.getElementById("slideshow");
  const funFact = document.getElementById("funFact");
  
  // Remove any inline styles that might hide them (if needed)
  // and then add a class or directly set their opacity.
  slideshow.style.opacity = 1;  // With CSS transition, this will fade in
  funFact.style.opacity = 1;

  // Hide the canvas after the fade-in has had time to complete
  setTimeout(() => {
    c.style.display = "none";
  }, 1050);
}

function showFunFactPrompt() {
  // Stop the fireworks animation loop if necessary
  // (Assuming the loop is controlled by your anim() function and "done" condition.)
  
  // Get the fun fact prompt overlay element.
  const funFactPrompt = document.getElementById("funFactPrompt");
  
  // Remove the "hidden" class and force the element to be visible.
  funFactPrompt.classList.remove("hidden");
  funFactPrompt.classList.add("visible");
  
  // Attach a click listener to the button inside the prompt.
  const funFactBtn = document.getElementById("funFactBtn");
  funFactBtn.addEventListener("click", function() {
    // When the button is clicked, trigger the transition.
    triggerTransition();
    
    // Optionally hide the prompt overlay (or let the transition hide it automatically).
    funFactPrompt.style.display = "none";
  });
}


/* ──────────────────────────────── */
/*  Main Animation Loop           */
/* ──────────────────────────────── */
function anim() {
  window.requestAnimationFrame(anim);
  
  // Create a vertical gradient background
  let grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#1a0033"); // Deep purple
  grad.addColorStop(1, "#000000"); // Black
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(hw, hh);

  let done = true;
  for (let l = 0; l < letters.length; l++) {
    letters[l].step();
    if (letters[l].phase !== "done") done = false;
  }
  ctx.restore();

  if (done) {
    setTimeout(showFunFactPrompt, 1500);
    return;
  }
}

/* ──────────────────────────────── */
/* Create Letters for the Message   */
/* ──────────────────────────────── */
// Create letters using actual text measurements:
letters = [];
for (let i = 0; i < opts.strings.length; i++) {
  let line = opts.strings[i];
  let lineWidth = ctx.measureText(line).width;
  let startX = -lineWidth / 2;
  let runningOffset = 0;
  let letterY = i * opts.lineHeight + opts.lineHeight / 2 - (opts.strings.length * opts.lineHeight) / 2;
  for (let j = 0; j < line.length; j++) {
    let letter = line[j];
    let letterWidth = ctx.measureText(letter).width;
    let letterX = startX + runningOffset + letterWidth / 2;
    runningOffset += letterWidth;
    if (letter !== " ") {  // Only animate non-space characters
      letters.push(new Letter(letter, letterX, letterY));
    }
  }
}

/* ──────────────────────────────── */
/* Function to start the fireworks */
/* ──────────────────────────────── */
function startFireworks() {
  // Start the animation loop
  anim();
}

// Adjust canvas size on window resize
window.addEventListener("resize", function () {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  hw = w / 2;
  hh = h / 2;
  ctx.font = "bold " + opts.charSize + "px Verdana";
});
