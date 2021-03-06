class CurrentShape extends Shape {

  // Constructor
  constructor(left, top, letter) {
    super(left, top, letter);

    // Constants
    // this.playerControlInterval = 5;
    // this.playerControlInterval = 10;
    this.hMoveInterval = 5;
    this.vMoveInterval = 3;
    this.upKeyPressed = false;
  }

  // Methods

  // Horizontal Collision
  collideH(dir) {
    const blockPositions = this.letter.blockPositions(this.left, this.top, this.angle);
    for (let i = 0 ; i < 4 ; i++ ) {
      if (grid.gridArray[blockPositions[i][1]][(blockPositions[i][0] + dir)] !== null) {
        return true;
      }
    }
    return false;
  }

  // Vertical Collision
  collideV() {
    const blockPositions = this.letter.blockPositions(this.left, this.top, this.angle);
    for (let i = 0 ; i < 4 ; i++ ) {
      if (grid.gridArray[(blockPositions[i][1] + 1)][blockPositions[i][0]] !== null) {
        return true;
      }
    }
    return false;
  }

  rotateCollide() {
    const blockPositions = this.letter.blockPositions(this.left, this.top, ((this.angle + 1) % this.letter.angles));
    for (let i = 0 ; i < 4 ; i++) {
      if (grid.gridArray[blockPositions[i][1]][blockPositions[i][0]] !== null) {
        cannotRotateSound.play();
        return true;
      }
    }
    return false;
  }

  move() {
    if (frameCount % this.hMoveInterval === 0) {
      if (
        keyIsDown(LEFT_ARROW) 
        && !(keyIsDown(RIGHT_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(32))
        && !(this.collideH(-1))
      ) {
        this.left -= 1;
        moveSound.play();
      }
      else if (
        keyIsDown(RIGHT_ARROW)
        && !(keyIsDown(LEFT_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(32))
        && !(this.collideH(1))
      ){
        this.left += 1;
        moveSound.play();
      }
    }

    if (keyIsDown(DOWN_ARROW)
    && (frameCount % this.vMoveInterval === 0)
    && !(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(32))
    ) {
      if (this.collideV()) mode.game = "update grid";
      else {
        this.top += 1;
        moveSound.play();
      }
    } 

    if (
      keyIsDown(UP_ARROW)
      && !(this.upKeyPressed)
      && !(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(DOWN_ARROW))
      && !(this.rotateCollide())
    ) {
      this.upKeyPressed = true;        
      this.angle = (this.angle + 1) % this.letter.angles;
      rotateSound.play();
    }

    if (!keyIsDown(UP_ARROW)) this.upKeyPressed = false;

    if (fallIntervalTimer.fallNow()) {
      if (this.collideV()) mode.game = "update grid";
      else this.top += 1;
    }
  }
}