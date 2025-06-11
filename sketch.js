//Env Setup
let pg;
let ivory, delvard, eugenio;
let cnv;



// console.log(mainText);

function preload() {
  ivory   = loadFont('./Fonts/IvoryDisplayTrialTT-Bold.ttf');
  delvard = loadFont('./Fonts/DelvardSerifDisplayxsTRIAL-Semibold.otf');
  eugenio = loadFont('./Fonts/EugenioSerifPoster-BlackItalic-Trial.otf');
}

function setup() {
  cnv = createCanvas(1920, 300, P2D); 
  cnv.parent('kinetic-type');         
  pg  = createGraphics(1920, 300, P2D);
  frameRate(30);

  // Setup live slider display updates
  const sliders = [
    { id: 'main-amp' },
    { id: 'amb-amp' },
    { id: 'tiles' },
    { id: 'mouse-affector' }
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


function draw() {

    //Global Vars
    let mainAmp = +document.getElementById("main-amp").value;
    let ambAmp = +document.getElementById("amb-amp").value;
    let tiles = +document.getElementById("tiles").value * 3;
    let mouseDist = +document.getElementById("mouse-affector").value;
    let mainText = document.getElementById("main-text").value;

    //tiles *= 3;
    //console.log(mouseDist);

    background(255);
    
    pg.background(255);
    pg.fill(0);
    pg.textFont(eugenio);
    pg.textSize(210);
    pg.textAlign(CENTER, CENTER);
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