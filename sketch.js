//Env Setup
let pg;
let ivory, delvard, eugenio;
let cnv;

//record setup
let recording = false;
let recorder;
let chunks = [];



//Preload Text///////////////////////////////////////////////////////////////
function preload() {
  ivory = loadFont('./Fonts/IvoryDisplayTrialTT-Medium.ttf');
  delvard = loadFont('./Fonts/DelvardSerifDisplayxsTRIAL-Semibold.otf');
  eugenio = loadFont('./Fonts/EugenioSerifPoster-BlackItalic-Trial.otf');
}

//Recording Setup///////////////////////////////////////////////////////////
function record() {
  chunks.length = 0;

  let stream = document.querySelector('canvas').captureStream(30);

  if (!MediaRecorder.isTypeSupported('video/webm; codecs="vp9"')) {
    console.warn("VP9 not supported. Falling back.");
  }

  recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm; codecs="vp9"',
    videoBitsPerSecond: 30_000_000
  });

  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = exportVideo;
}

function exportVideo(e) {
  var blob = new Blob(chunks, { 'type' : 'video/webm' });

    // Draw video to screen
    var videoElement = document.createElement('video');
    videoElement.setAttribute("id", Date.now());
    videoElement.controls = true;
    document.body.appendChild(videoElement);
    videoElement.src = window.URL.createObjectURL(blob);
  
  // Download the video 
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'a-beautiful-video.webm';
  a.click();
  window.URL.revokeObjectURL(url);

}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    recording = !recording;
    if (recording) {
      console.log("Recording started!");
      recorder.start();
    } else {
      console.log("Recording stopped!");
      recorder.stop();
    }
  }
}

//Main Sketch Setup////////////////////////////////////////////////////////////

function setup() {
  cnv = createCanvas(1920, 600, P2D);
  cnv.parent('kinetic-type');
  pg = createGraphics(1920, 600, P2D);
  frameRate(30);

  record();

  // Setup live slider display updates
  const sliders = [
    { id: 'main-amp' },
    { id: 'amb-amp' },
    { id: 'tiles' },
    { id: 'mouse-affector' },
    { id: 'leading'},
    { id: 'font-size'}
  ];

  sliders.forEach(({ id }) => {
    const slider = document.getElementById(id);

    // Create a span element if not already present
    let display = document.getElementById(`${id}-val`);
    if (!display) {
      display = document.createElement("span");
      display.id = `${id}-val`;
      slider.parentNode.appendChild(display);
    }

    // Set initial value
    display.textContent = slider.value;

    // Update value on input
    slider.addEventListener('input', () => {
      display.textContent = slider.value;
    });
  });
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    recording = !recording;
    if (recording) {
      console.log("Recording started!");
      recorder.start();
    } else {
      console.log("Recording stopped!");
      recorder.stop();
    }
  }
}

function draw() {

  //Global Vars
  let mainAmp = +document.getElementById("main-amp").value;
  let ambAmp = +document.getElementById("amb-amp").value;
  let tiles = +document.getElementById("tiles").value * 3;
  let mouseDist = +document.getElementById("mouse-affector").value;
  let mainText = document.getElementById("main-text").value;
  let leadingValue = +document.getElementById("leading").value;
  let fontSize = +document.getElementById("font-size").value;

  //tiles *= 3;
  //console.log(mouseDist);

  background(255);

  pg.background(255);
  pg.fill(0);
  pg.textFont(ivory);
  pg.textSize(fontSize);
  pg.textAlign(CENTER, CENTER);
  pg.textLeading(leadingValue);
  pg.text(mainText, width / 2, height / 2);

  let tilesX = tiles;
  let tilesY = Math.round((tilesX * height) / width);
  let tileW = (width / tilesX);
  let tileH = (height / tilesY);
  let maxDist = mouseDist + cos(frameCount * 0.1) * 60;
  let maxAmbDist = mouseDist * 5.5;

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {

      //Define Displacement
      let wave;
      let ambient;

      //Source
      let sx = Math.floor(x * tileW);
      let sy = Math.floor(y * tileH);
      let sw = Math.ceil(tileW);
      let sh = Math.ceil(tileH);

      //Destination
      let dx = sx;
      let dy = sy;
      let dw = sw;
      let dh = sh;

      //Tile Centers
      let cx = sx + tileW / 2;
      let cy = sy + tileH / 2;

      //Mouse Distance
      let distance = dist(pmouseX - 2, pmouseY - 4, cx, cy);
      let ambDist = map(distance, 0, maxAmbDist, 1, 0);

      distance = constrain(distance, 0, maxDist);
      distance = map(distance, 0, maxDist, 1, 0);

      //Calculate Displacements
      wave = int(sin(frameCount * 0.1 + (x + y) * 0.2) * mainAmp * distance);
      ambient = (sin(frameCount * 0.2 + floor((x + y) / 2) * 2) * ambAmp * ambDist);

      //Assign Displacements
      dx += wave;
      sw += ambient;

      // Final Copy //
      copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }
}