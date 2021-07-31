/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisibleground;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3;
  jungle.x = width /2;

  kangaroo = createSprite(90,300);
  kangaroo.addAnimation("running",kangaroo_running);
  kangaroo.addAnimation("collided",kangaroo_collided);
  kangaroo.scale = 0.16;
  kangaroo.setCollider("circle",0,0,500);

  invisibleground = createSprite(400,390,800,10);

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(200);
  if (gameState === PLAY){
    kangaroo.x=camera.position.x-270;
    invisibleground.x=camera.position.x;
    kangaroo.collide(invisibleground);

    jungle.velocityX = -10;

    kangaroo.velocityY += 0.8;

    if (jungle.x < 100){
      jungle.x = width/2;
    }

    var randomnum = Math.round(random(1,2));

    if (frameCount % 150 == 0){
      if (randomnum == 1){
        spawnShrubs();
      }
      if (randomnum == 2){
        spawnObstacles();
      }
    }

    for (var i; i < shrubsGroup.length;i++){
      if (kangaroo.isTouching(shrubsGroup[i])){
        score++;
        shrubsGroup[i].destroy();
      }
    }
    
    if (obstaclesGroup.isTouching(kangaroo)){
        gameState === END;
    }
  }

  if(gameState === END){
    shrubsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    jungle.velocityX == 0;
    collidedSound.play();
  }

  drawSprites();
}

function keyPressed(){
  if (keyCode === 32 && kangaroo.y > 300 && gameState == PLAY){
    kangaroo.velocityY = -15;
    jumpSound.play();
  }
}

function spawnShrubs(){
  var shrub = createSprite(camera.position.x+500,330,40,10);
  shrub.debug = true;
  var ran = Math.round(random(1,3));
  if (ran === 1){
    shrub.addImage(shrub1);
  }
  else if (ran === 2){
    shrub.addImage(shrub2);
  }
  else{
    shrub.addImage(shrub3);
  }
  shrub.lifetime = 100;
  shrub.scale = 0.1;
  shrub.velocityX = -10;
  shrubsGroup.push(shrub);
}

function spawnObstacles(){
  var stone = createSprite(camera.position.x+500,330,40,10);
  stone.debug = true;
  stone.addImage(obstacle1);
  stone.lifetime = 100;
  stone.scale = 0.2;
  stone.velocityX = -10;
  obstaclesGroup.push(stone);
}