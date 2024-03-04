//Snake game with Teachable Machine 
//NB the webcam is very buggy to learn the poses
let imageModelURL = "https://teachablemachine.withgoogle.com/models/rfrmQGqz_/";


let keyboard_control = false;


let speed = 5;




let video;
let flipVideo;
let label = "waiting...";

let classifier;


function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

let snake;
let rez = 20;
let food;
let w;
let h;

function setup() {
  createCanvas(640, 480);
  // Create the video

  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();

  w = floor(width / rez);
  h = floor(height / rez);
  // frameRate(5);
  snake = new Snake();
  foodLocation();
}


function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}


function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  
  label = results[0].label;
  
  controlSnake();
  classifyVideo();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (keyboard_control) {
    if (keyCode == RIGHT_ARROW) snake.setDir(1, 0);
    if (keyCode == LEFT_ARROW) snake.setDir(-1, 0);
    if (keyCode == UP_ARROW) snake.setDir(0, -1);
    if (keyCode == DOWN_ARROW) snake.setDir(0, 1);
  }
}

function controlSnake() {
  // console.log(label);
  if (!keyboard_control) {
    if (label === "UP") {
      // UP
      snake.setDir(0, -1);
    } else if (label === "RIGHT") {
      // RIGHT
      snake.setDir(1, 0);
    } else if (label === "LEFT") {
      // LEFT
      snake.setDir(-1, 0);
    } else if (label === "DOWN") {
      // DOWN
      snake.setDir(0, 1);
    }
  }
}

function draw() {
  background(220);
  if (!keyboard_control) {
    image(flippedVideo, 0, 0, 160, 120);
    textSize(32);
    fill(255);
    stroke(0);
    text(label, 10, 40);
  }

  scale(rez);
  if (snake.eat(food)) {
    foodLocation();
    snake.update();
  }
  if (frameCount % speed == 0) {
    snake.update();
  }
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}
