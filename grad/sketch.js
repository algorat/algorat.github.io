let ratImg;
let hatImg;
let congratuated = false;
let idealHatLeft;
let idealHatTop;
const margin = 30;
let soundPlayed = false;
let gradMusic;
let font;
let program;
let shaderTime;
let nameTo;
let nameFrom;
let hasMessage = false;
let message;

let origImgHeight;
let origImgWidth;
let origHatImgHeight;
let origHatImgWidth;
let originalImage;
let originalHatImage;

let xscaler, yscaler, scaler;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  scaleMouse();
  idealHatLeft = ratMid - hatImg.width / 2 + 20;
  idealHatTop = ratTop - hatImg.height + 111;
}

function preload() {
  font = loadFont(
    "https://cdn.glitch.com/130dd120-ec5f-4cfe-b3aa-d7bbee18313e%2FIndieFlower-Regular.ttf?v=1621992384094"
  );
  gradMusic = loadSound(
    "https://cdn.glitch.com/130dd120-ec5f-4cfe-b3aa-d7bbee18313e%2FPomp%26Circumstance%20March%20No1(Ukulele)-%5BAudioTrimmer.com%5D.mp3?v=1622080602139"
  );
  ratBefImg = loadImage(
    "https://cdn.glitch.com/130dd120-ec5f-4cfe-b3aa-d7bbee18313e%2Fgratuatebef.png?v=1622007716521"
  );

  ratImg = loadImage(
    "https://cdn.glitch.com/4360b341-23b7-4280-a42c-3e97bef507ee%2Fgratuate-1.png?v=1622153511830"
  );

  hatImg = loadImage(
    "https://cdn.glitch.com/130dd120-ec5f-4cfe-b3aa-d7bbee18313e%2Fgratuatehat.png?v=1621921349214"
  );

  originalImage = ratImg;
  originalHatImage = hatImg;
}

function setup() {
  var can = createCanvas(windowWidth, windowHeight, WEBGL);
  can.id("p5-canvas");
  program = createShader(vert, frag);
  textFont(font);
  origImgHeight = ratImg.height;
  origImgWidth = ratImg.width;
  origHatImgHeight = hatImg.height;
  origHatImgWidth = hatImg.width;
  scaleMouse();
}

function scaleMouse() {
  ratImg = originalImage.get();
  hatImg = originalHatImage.get();
  
  var spaceForText = height/8.;
  var s = 20. + spaceForText;
  //need to make this work and also when it does work gota update widow resized function that places the hat
  xscaler = (width - s) / origImgWidth;
  yscaler = (height - s) / origImgHeight;
  scaler = 1;


  if (origImgWidth > width-spaceForText) {
    ratImg.resize(width - s, 0);
    hatImg.resize(origHatImgWidth * xscaler, 0);
    scaler = xscaler;
  }

  if (origImgHeight > height-spaceForText) {
    if (yscaler < xscaler) {
      ratImg.resize(0, height - s);
      hatImg.resize(0, origHatImgHeight * yscaler);
      scaler = yscaler;
    }
  }
}

let ratTop;
let ratLeft;
let ratMid;
let hatLeft;
let hatTop;
let hatMid;

function mousePressed() {
  idealHatLeft = ratMid - hatImg.width / 2 + 20 * scaler;
  idealHatTop = ratTop - hatImg.height + 111 * scaler;

  if (
    Math.abs(idealHatLeft - hatLeft) < margin &&
    Math.abs(idealHatTop - hatTop) < margin
  ) {
    congratuated = true;

    var namesFromUrl = location.hash.substr(1);
    var names;
    if (namesFromUrl.includes("%C2%A7")) {
      names = namesFromUrl.split("%C2%A7");
    } else {
      names = namesFromUrl.split("-");
    }

    var nameTo1;
    var nameFrom1;
    var message1 = "";

    if (names.length == 1) {
      nameTo1 = names[0];
      nameFrom1 = "your friend";
    } else {
      nameTo1 = names[0];
      nameFrom1 = names[1];

      if (names.length > 2) {
        message1 = names[2];
      }
    }
    if (nameTo1 == "") {
      nameTo1 = "GRAD";
      nameFrom1 = "YOUR RAT";
    }

    var line1text =
      "congRATulations on your gRATuation " + decodeURI(nameTo1) + "!";
    var line2text = "love, " + decodeURI(nameFrom1) + " <3";
    var line3text = decodeURI(message1);

    var element1 = document.getElementById("id01");
    element1.innerHTML = line1text;

    var element2 = document.getElementById("id02");
    element2.innerHTML = line2text;

    var element3 = document.getElementById("id03");
    element3.innerHTML = line3text;
  }
}

function draw() {
  cursor(HAND);
  ratTop = height / 2 - ratImg.height / 2 + (height/5.);
  ratLeft = width / 2 - ratImg.width / 2;
  ratMid = width / 2;
  hatLeft = mouseX - hatImg.width / 2;
  hatTop = mouseY - hatImg.height / 2;
  hatMid = mouseX;

  translate(-width / 2, -height / 2);
  shader(program);
  shaderTime += 0.005;

  if (congratuated) {
    program.setUniform("mouseX", map(mouseX, 0, width * 2, 0, 1));
    program.setUniform("mouseY", map(mouseY, 0, height * 2, 0, 1));
    if (!soundPlayed) {
      gradMusic.play();
      soundPlayed = true;
    }
  } else {
    shaderTime = 0.0;
  }

  // lets send the resolution, mouse, and time to our shader
  // before sending mouse + time we modify the data so it's more easily usable by the shader

  program.setUniform("resolution", [width, height]);

  program.setUniform("time", shaderTime);
  // rect gives us some geometry on the screen
  rect(0, 0, width, height);

  if (!congratuated) {
    image(ratBefImg, ratLeft, ratTop, ratImg.width, ratImg.height);
    if (mouseX > 0 || mouseY > 0) {
      image(hatImg, hatLeft, hatTop);
    }
  }
  if (congratuated) {
    image(ratImg, ratLeft, ratTop);
    textSize(42);
    textAlign(CENTER, CENTER);
    c = color("hsba(160, 100%, 50%, 0.8)");
    fill(c);
    //text("congRATulations on your gRATuation "+nameTo+"!", windowWidth / 2, ratTop -100);
    //     text("love, " + nameFrom + " <3", windowWidth / 2, ratTop -50);

    image(hatImg, idealHatLeft, idealHatTop);

    // text(message, windowWidth/2, ratTop + 700)
  }
}

var vert = `
#ifdef GL_ES
      precision highp float;
      precision highp int;
    #endif
		#extension GL_OES_standard_derivatives : enable

    // attributes, in
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aVertexColor;

    // attributes, out
    varying vec3 var_vertPos;
    varying vec4 var_vertCol;
    varying vec3 var_vertNormal;
    varying vec2 var_vertTexCoord;

    // matrices
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    //uniform mat3 uNormalMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

      // just passing things through
      // var_vertPos      = aPosition;
      // var_vertCol      = aVertexColor;
      // var_vertNormal   = aNormal;
      // var_vertTexCoord = aTexCoord;
    }
`;
var frag = `

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform float rand;
uniform float mouseX;
uniform float mouseY;
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
vec2 rotateUV(vec2 uv, float rotation, float mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
//float smoothMod(float x, float y, float e){
//    float top = cos(3.1415 * (x/y)) * sin(3.1415 * (x/y));
//    float bot = pow(sin(3.1415 * (x/y)),2.)+ pow(e, sin(time));
    // float at = atan(top/bot);
    // return y * (1./2.) - (1./3.1415) * at ;
//}

void main(void)
{
   vec2 p = -1.0 + 4.0 * gl_FragCoord.xy / resolution.xy;
   vec2 uv = (gl_FragCoord.xy / resolution.xy *2.) - 3.0 - vec2(sin(time),cos(time));
   uv = rotateUV(uv, time*0.1, sin(time));
   vec2 pos = p;
   float a = time*1.0 + 5034.;
    // uv.x = smoothMod(uv.x, 20.0, time);
    // uv.y = smoothMod(uv.y, 20., time);
    
    vec3 brightness = vec3(0.5,0.5,0.5);
    brightness += (sin(atan(uv.x/uv.y)*20.) + cos(length(uv+time))) * 0.07;
    brightness = mix(brightness, vec3(0.6), clamp( 1.-(pow(length(uv),3.)*.2),0.,1.))+0.2;
    vec3 contrast =  vec3(0.2,sin(time)*0.2,cos(time)*0.2)-0.4;
    uv = rotateUV(uv, time*0.5, sin(time+1.8));
    vec3 osc = vec3(0.2,0.4,0.1); // how frequently we cycles through the colors
    uv = rotateUV(uv, time*0.2, sin(time+0.3));
    vec3 phase = vec3(15.*rand ) + length(uv)*0.1; // where does it start?

    uv *= 1.02;
    phase += (sin(atan(uv.x/uv.y)*20.) + cos(length(uv+time))) * 0.5;
    phase = mix(phase, vec3(0.6), clamp( 1.-(pow(length(uv),3.)*.2),0.,1.));

vec3 cp = cosPalette(pos.x, brightness+0.15, contrast*0.1, osc, phase*.5 );
  cp = mix(vec3(0.9),cp,clamp(time,0.,1.));
    gl_FragColor=vec4(cp,1.0) ;
}`;
