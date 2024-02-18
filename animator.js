class animator {
  constructor() {
    this.currentAnimationName = "";
    this.animations = [];
  }

  addLoop(aName, aImgCount, aExt) {
    aExt = aExt ? aExt : ".png";
    this.animations[aName] = new animation("resources/animations/" + aName, aImgCount, aExt);
  }

  // play the animation.
  play() {
    this.animations[this.currentAnimationName].play();
  }

  loadAnimation(aName) {
    if (this.currentAnimationName.length) {
      this.animations[this.currentAnimationName].stop();
    }
    this.currentAnimationName = aName;
    this.animations[this.currentAnimationName].play();
    return this;
  }

  then(aName) {
    const that = this;
    this.animations[this.currentAnimationName].addAnimationEndCallback(function () {
      that.loadAnimation(aName);
    })
  }
}

class animation {
  constructor(aPath, aImgCount, aExt) {
    this.path = aPath;
    this.frameCount = aImgCount;
    this.currentFrame = 0;
    this.intervalId = 0;
    this.animationEndCallback = null;

    this.images = [];
    for (let i = 0; i < aImgCount; i++) {
      let image = new Image(720, 720);
      image.src = aPath + "/" + "frame_0" + i + aExt;
      this.images.push(image);
    }
  }

  play() {
    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
        this.nextFrame();
    }, 200);
  }

  stop() {
    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }
  }
  
  nextFrame() {
    const canvas = document.getElementById("dancingSun");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    let foundImage = false;
    const lInitFrame = this.currentFrame;
    while (!foundImage) {
      const image = this.images[this.currentFrame];
      if (image.naturalWidth != 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.width);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        foundImage = true;
      }
      else {
        this.currentFrame++;
        this.currentFrame = this.currentFrame % this.frameCount;
        if (this.currentFrame == lInitFrame) {
          break;
        }
      }

    }

    this.currentFrame++;
    if (this.currentFrame >= this.frameCount) {
      if (this.animationEndCallback) {
        this.animationEndCallback();  
        this.animationEndCallback = null;
      }
      
      this.currentFrame = 0;
    }
  }

  addAnimationEndCallback(aCallback) {
    this.animationEndCallback = aCallback;
  }
}
