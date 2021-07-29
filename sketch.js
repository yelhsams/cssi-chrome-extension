// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain


var s = function(sketch) {

  let col = "black";
  let menuObj, gameMode, nightButton, birdImage, dayImage, dayButton, nightImage;
  sketch.preload = function() {
    let filename = "images/flying-bird.png"
    let url = chrome.extension.getURL(filename);
    birdImage = sketch.loadImage(url)
  }
  sketch.setup = function() {
    document.body.style['userSelect'] = 'none';
    let h = document.body.clientHeight;
    let c = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    c.position(0, 0);
    c.style('pointer-events', 'none');
    c.style('z-index', '999')
    sketch.clear();
    gameMode = "day";

    menuObj = new Menu();
    
    nightButton = new Button(1, "night", birdImage)
    
  };

  sketch.draw = function() {
    sketch.stroke(col);
    sketch.strokeWeight(4);
    if (sketch.mouseIsPressed) {
      sketch.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
    }
    menuObj.display()
    sketch.image(birdImage, 0, 0, 100, 100)
    nightButton.display()
  };
  sketch.keyPressed = function(){
    if (sketch.key == 'e')
      sketch.clear();
    else if (sketch.key == 'r')
      col = "Red";
    else if (sketch.key == 'b')
      col = "Blue";
    else if (sketch.key == 'g')
      col = "Green";
    else if (sketch.key == 'z')
      col = "Black";
  };
  class Menu {
    constructor(){
      this.x = sketch.windowWidth - 250;
      this.y = 50;
    }
    display(){
      sketch.fill(60)
      sketch.stroke(60)
      sketch.rect(this.x, this.y, 200, 500)
      console.log("menu is drawn")
    }
  };
  class Button {
    constructor(number, name, image){
      this.x = menuObj.x - number*20;
      this.y = menuObj.y + number*20;
      this.mode = name;
      this.image = image
    }
    display(){
      sketch.fill(100)
      sketch.image(this.image, this.x, this.y, 10, 10)
      sketch.fill(100)
      sketch.text(this.mode, this.x + 10, this.y + 10)
    }
    checkCollide(){
      let collide = collideCircleCircle(this.x, this.y, 10, 10, sketch.mouseX, sketch.mouseY, 3, 3)
      if(collide){
        gameMode = this.mode
      }
    }
  };
};

var myp5 = new p5(s);
