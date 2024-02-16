class animator {
  constructor() {
    this.currentAnimationName = "";
    this.animations = [];
  }

  addLoop(aName, aImgCount) {
    this.animations[aName] = new animation("resources/animations/" + aName, aImgCount);
  }

  // play the animation.
  play() {
    this.animations[this.currentAnimationName].play();
  }

  loadAnimation(aName) {
    this.currentAnimationName = aName;
  }
}

class animation {
  constructor(aPath, aImgCount) {
    this.path = aPath;
    this.frameCount = aImgCount;
    this.currentFrame = 0;
    this.intervalId = 0;

    this.images = [];
    for (let i = 0; i < aImgCount; i++) {
      let image = new Image(720, 720);
      image.src = aPath + "/" + "frame_0" + i + ".png";
      this.images.push(image);
    }
  }

  play() {
    this.intervalId = setInterval(() => {
        this.nextFrame();
    }, 200);
  }

  stop() {
    clearInterval(this.intervalId);
  }
  
  nextFrame() {
    const canvas = document.getElementById("dancingSun");
    const ctx = canvas.getContext("2d");
    const image = this.images[this.currentFrame];
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height );

    this.currentFrame++;
    this.currentFrame = this.currentFrame % this.frameCount;
  }
}
