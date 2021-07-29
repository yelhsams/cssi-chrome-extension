// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain


var s = function(sketch) {
  let bronze;
  let silver;
  let gold;
  let col = "black";
  let menuObj;
  let poopImage, poopList;
  let birdImage, flippedBirdImage, bird, birdOnScreen;
  let points;
  let thirdMedal, secondMedal, firstMedal;
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
    menuObj = new Menu();
    //nightButton = new Button(1, "night", birdImage)

    poopList = [];
    medalList = [];
    points = 20
    
    bronze = new Medal(menuObj.x, menuObj.y + 125, thirdMedal, "Novice Pooper",  "You've collected 5 Poops!")
    silver = new Medal(menuObj.x, menuObj.y + 225, secondMedal, "Intermediate Pooper", "You've collected 15 Poops!")
    gold = new Medal(menuObj.x, menuObj.y + 325, firstMedal,  "Expert Pooper", "You've collected 20 Poops!")
  };

  sketch.draw = function() {
    
    //nightButton.display()
    
    sketch.lineArt()
    if(birdOnScreen){
      bird.moveBird()
      bird.display()
      console.log(poopList)
      if(sketch.frameCount % 120 == 0){
        bird.addPoop()
      }
      for(let poop of poopList){
        poop.display()
        //error here!!
        //poop.checkCollect()
      }
    }
    menuObj.display()
    sketch.medalRewarder()

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
      //not working-- ask 
      let collide = collideCircleCircle(this.x, this.y, 30, sketch.mouseX, sketch.mouseY, 3)
      if(collide){
        points+=1
        let index = poopList.indexOf(this)
        poopList.splice(index, 1)
      }
    }
  };
  class Bird {
    constructor(){
      
      let randomNumber = sketch.round(sketch.random(0, 1))
      
      
      this.xspeed = sketch.round(sketch.random(1, 3))
      
      if(randomNumber == 1){
        this.x = sketch.windowWidth - 50
        this.xspeed *=-1
        this.image = birdImage;
      } else {
        this.x = -50
        this.image = flippedBirdImage;
      }

      this.y = sketch.random(100, sketch.height - 100)
      this.yspeed = sketch.random(2, 5)

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
      let poop = new Poop(this.x, this.y, poopImage)
      poopList.push(poop)
      console.log("poop dropped")
    }
    moveBird(){
      this.x +=this.xspeed
      this.y +=this.yspeed 
     
      // 1 in 50 chance to switch directions
      let randomNumber = sketch.round(sketch.random(0, 50))
      if(randomNumber == 1){
        this.yspeed *= -1
      }

      console.log("yspeed: " + this.yspeed)
      console.log("this.y: " + this.y)
      console.log("xspeed: " + this.xspeed)
      console.log("this.x: " + this.x)
    }
    display(){
      sketch.clear();
      sketch.image(this.image, this.x, this.y, 100, 75)
    }
  };
  sketch.clearScreen = function(){
    sketch.clear();

  }
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
      sketch.fill(60)
      sketch.stroke(60)
      sketch.rect(this.x, this.y, 200, 500)
      sketch.fill("white")
      sketch.textAlign(sketch.CENTER)
      sketch.text("Collect the bird's poop for points!", this.x + 100, this.y + 10)
      sketch.text("Points:", this.x + 100, this.y + 30)
      sketch.image(poopImage, this.x + 100, this.y + 50, 30, 30)
      sketch.text(points, this.x + 140, this.y + 75)
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
      sketch.image(this.image, this.x + 100, this.y, 40, 50)
      
      sketch.textSize(10)
      sketch.text(this.description, this.x + 100, this.y + 75)
    }
    checkCollide(){
      let collide = sketch.collideCircleCircle(this.x, this.y, 10, 10, sketch.mouseX, sketch.mouseY, 3, 3)
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
