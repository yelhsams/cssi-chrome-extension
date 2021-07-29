// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain


var s = function(sketch) {
  let bronze, silver, gold;
  let thirdMedal, secondMedal, firstMedal;
  let menuObj;

  let poopImage, poopList;
  let birdImage, flippedBirdImage, bird, birdOnScreen;
  let points;
  
  
  let col = "black";
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

    //load medal images
    firstMedal = sketch.loadImage(chrome.extension.getURL("images/gold-medal.png"))
    secondMedal = sketch.loadImage(chrome.extension.getURL("images/silver-medal.png"))
    thirdMedal = sketch.loadImage(chrome.extension.getURL("images/bronze-medal.png"))

    //font is Roboto Bold
    fontRegular = sketch.loadFont(chrome.extension.getURL('assets/Roboto-Bold.ttf'));
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

    //create menu page
    menuObj = new Menu();

    //collectible items list
    poopList = [];
    medalList = [];

    //starting number of points
    points = 0;
    
    //set medals in relative position to Menu
    bronze = new Medal(menuObj.x, menuObj.y + 135, thirdMedal, "Novice Pooper",  "You've collected 5 Poops!")
    silver = new Medal(menuObj.x, menuObj.y + 235, secondMedal, "Intermediate Pooper", "You've collected 15 Poops!")
    gold = new Medal(menuObj.x, menuObj.y + 335, firstMedal,  "Expert Pooper", "You've collected 20 Poops!")
    
    //font for all text
    sketch.textFont(fontRegular);
  };

  sketch.draw = function() {
    
    //sketch feature
    sketch.lineArt()
    //if bird is "activated", it will appear and fly across the screen!
    if(birdOnScreen){
      bird.moveBird()
      bird.display()

      //every 2 seconds or every 120th frame, a poop will be dropped
      if(sketch.frameCount % 120 == 0){
        bird.addPoop()
      }

      //because poops may be removed, it is important that the display is a separate function than .addpoop
      for(let poop of poopList){
        poop.display()
        //check if user has collected poop
        poop.checkCollect()
      }
    }

    //display menu
    menuObj.display()
    //display medals according to poops collected
    sketch.medalRewarder()

  };
  //mostly pertaining to sketch project, "p" allows bird to appear
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
  
  class Poop {
    constructor(xPos, yPos, image){
      this.x = xPos
      this.y = yPos
      this.image = image
    }
    display(){
      sketch.image(this.image, this.x, this.y, 30, 30)
    }
    checkCollect(){
      //if the poop is hovered over, it will add to points and remove the poop from the list and keep the rest in place
      let collide = myp5.collideCircleCircle(this.x, this.y, 30, sketch.mouseX, sketch.mouseY, 10)
      if(collide){
        points+=1
        let index = poopList.indexOf(this)
        poopList.splice(index, 1)
      }
    }
  };
  class Bird {
    constructor(){
      
      
      //xspeed will be between 1 and 3
      this.xspeed = sketch.round(sketch.random(1, 3))

      //1/2 chance bird comes from left / right
      let randomNumber = sketch.round(sketch.random(0, 1))

      if(randomNumber == 1){
        this.x = sketch.windowWidth - 50
        this.xspeed *=-1
        this.image = birdImage;
      } else {
        this.x = -50
        this.image = flippedBirdImage;
      }

      //starting y position
      this.y = sketch.random(100, sketch.height - 100)

      //yspeed is between 2 and 5
      this.yspeed = sketch.random(2, 5)

      //if it starts on the bottom half of window, fly upward!
      if(this.y > 250){
        this.yspeed *=-1
      }

      birdOnScreen = true;

      /*console.log("random number: " + randomNumber)
      console.log("xspeed " + this.xspeed)
      console.log("x: " + this.x)
      console.log("yspeed: " + this.yspeed)
      console.log("this.y: " + this.y)*/
    }
    addPoop(){
      //adds a new poop at its position into poop list
      let poop = new Poop(this.x, this.y, poopImage)
      poopList.push(poop)
    }
    moveBird(){
      //move bird
      this.x +=this.xspeed
      this.y +=this.yspeed 
     
      // 1 in 50 chance to switch directions up / down
      let randomNumber = sketch.round(sketch.random(0, 50))
      if(randomNumber == 1){
        this.yspeed *= -1
      }
      
      //if it gets close to bottom or top of screen, it will switch vertical direction
      if(this.y < 10 || this.y > sketch.windowHeight - 10){
        this.yspeed *= -1
      }
    }
    display(){
      //motion
      sketch.clear();
      sketch.image(this.image, this.x, this.y, 100, 75)
    }
  };

  //function to clear screen -- not in use
  sketch.clearScreen = function(){
    sketch.clear();

  }
  //switch to display medals
  sketch.medalRewarder = function(){
    if(points >=5){
      bronze.display()
    }
    if (points >= 15){
      silver.display()
    }
    if (points >=20){
      gold.display()
    }
  }

  class Menu {
    constructor(){
      this.x = sketch.windowWidth - 250;
      this.y = 50;
    }
    display(){
      sketch.fill("black")
      
      sketch.stroke(0)
      sketch.rect(this.x, this.y, 200, 500)
      sketch.fill("white")
      sketch.textAlign(sketch.CENTER)
      sketch.textSize(12)
      sketch.text("Press p for pooping bird!", this.x + 100, this.y + 20)
      sketch.text("Collect poop by hovering over it!", this.x + 100, this.y + 40)
      sketch.text("Points:", this.x + 100, this.y + 60)
      sketch.text("Awards Collected:", this.x + 100, this.y + 120)
      sketch.image(poopImage, this.x + 80, this.y + 70, 30, 30)
      sketch.text(points, this.x + 120, this.y + 90)
      sketch.text("Need a break from studying?\nMagical Pooping Bird can help!", this.x + 100, this.y + 450)
      //console.log("menu is drawn")
    }
  };
  class Medal {
    constructor(xPos, yPos, image, name, description){
      this.x = xPos;
      this.y = yPos;
      this.image = image;
      this.name = name;
      this.description = description;
    }
    display(){
      sketch.fill("white")
      sketch.textSize(15)
      sketch.textAlign(sketch.CENTER)
      sketch.text(this.name, this.x + 100, this.y + 65)
      sketch.image(this.image, this.x + 80, this.y, 40, 50)
      
      sketch.textSize(10)
      sketch.text(this.description, this.x + 100, this.y + 75)
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
