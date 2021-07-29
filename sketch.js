// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain


var s = function(sketch) {

  let col = "black";
  let menuObj, gameMode, nightButton, dayImage, dayButton, nightImage;
  let poopImage;
  let birdImage, flippedBirdImage, bird, birdOnScreen;

  sketch.preload = function() {
    //load bird image facing left
    let filenameBird = "images/flying-bird.png"
    let urlBird = chrome.extension.getURL(filenameBird);
    birdImage = sketch.loadImage(urlBird)

    //load bird image facing right
    let filenameFlippedBird = "images/flying-bird-flipped.png"
    let urlFlippedBird = chrome.extension.getURL(filenameFlippedBird)
    flippedBirdImage = sketch.loadImage(urlFlippedBird)

    //load poop image
    let filenamePoop = "images/poop.png"
    let urlPoop = chrome.extension.getURL(filenamePoop)
    poopImage = sketch.loadImage(urlPoop)

  }
  sketch.setup = function() {

    //do not let user highlight text
    document.body.style['userSelect'] = 'none';

    //height of entire page
    let h = document.body.clientHeight;
    //create canvas only to window size
    let c = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    //absolute position
    c.position(0, 0);
    //place images on top of all other HTML elements
    c.style('pointer-events', 'none');
    c.style('z-index', '999')

    //reset canvas to clear
    sketch.clear();

    //don't show bird
    birdOnScreen = false;

    //gameMode = "day";
    //menuObj = new Menu();
    //nightButton = new Button(1, "night", birdImage)
  };

  sketch.draw = function() {
    //menuObj.display()
    //nightButton.display()
    
    sketch.lineArt()
    if(birdOnScreen){
      bird.moveBird()
      bird.display()
    }
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
    else if (sketch.key == 'p')
      bird = new Bird();
  };
  class Bird {
    constructor(){
      this.xspeed = sketch.round(sketch.random(1, 3))
      let randomNumber = sketch.round(sketch.random(0, 1))
      console.log("random number: " + randomNumber)
      if(randomNumber == 1){
        this.x = sketch.windowWidth - 50
        this.xspeed *=-1
        console.log("xspeed " + this.xspeed)
        console.log("x: " + this.x)
        this.image = birdImage;
      } else {
        this.x = -50
        console.log("xspeed: " + this.xspeed)
        console.log("this.x: " + this.x)
        this.image = flippedBirdImage;
        
      }
      this.y = sketch.random(100, sketch.height - 100)
      this.yspeed = sketch.random(2, 5)
      if(this.y > 250){
        this.yspeed *=-1
      }
      console.log("yspeed: " + this.yspeed)
      console.log("this.y: " + this.y)
      birdOnScreen = true;
    }
    moveBird(){
      this.x +=this.xspeed
      this.y +=this.yspeed 
      console.log("yspeed: " + this.yspeed)
      console.log("this.y: " + this.y)
      console.log("xspeed: " + this.xspeed)
      console.log("this.x: " + this.x)
      let randomNumber = sketch.round(sketch.random(0, 50))
      if(randomNumber == 1){
        this.yspeed *= -1
      }

    }
    display(){
      sketch.clear();
      sketch.image(this.image, this.x, this.y, 100, 75)
      
    }
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
      //console.log("menu is drawn")
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





  //sketch functions
  sketch.lineArt = function(){
    sketch.stroke(col);
    sketch.strokeWeight(4);
    if (sketch.mouseIsPressed) {
      sketch.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
    }
  }
};

var myp5 = new p5(s);
