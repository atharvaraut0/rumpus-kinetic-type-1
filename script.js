let pg;
let ivory, delvard, eugenio;
let cnv;                    

function preload() {
  ivory   = loadFont('./Fonts/IvoryDisplayTrialTT-Bold.ttf');
  delvard = loadFont('./Fonts/DelvardSerifDisplayxsTRIAL-Semibold.otf');
  eugenio = loadFont('./Fonts/EugenioSerifPoster-BlackItalic-Trial.otf');
}

function setup() {
  cnv = createCanvas(1440, 300, P2D); 
  cnv.parent('kinetic-type');         
  pg  = createGraphics(1440, 300, P2D);
  frameRate(30);
}

function draw() {
    background(255);
    // pg.beginDraw();
    pg.background(255);
    pg.fill(0);
    pg.textFont(eugenio);
    pg.textSize(220);
    pg.textAlign(CENTER, CENTER);
    pg.text("The Rumpus", width / 2, height / 2);
    //pg.endDraw();
    let tilesX = 350;
    let tilesY = int((tilesX * height) / width);
    let tileW = int(width / tilesX);
    let tileH = int(height / tilesY);
    let maxDist = 120.0 + cos(frameCount * 0.1) * 60;
    let maxAmbDist = 600.0;
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            
            //Define Displacement
            let wave;
            let ambient; 
            
            //Source
            let sx = x * tileW;
            let sy = y * tileH;
            let sw = tileW;
            let sh = tileH; 
            
            //Destination
            let dx = x * tileW;
            let dy = y * tileH;
            let dw = tileW;
            let dh = tileH; 
            
            //Tile Centers
            let cx = sx + tileW / 2;
            let cy = sy + tileH / 2; 
            
            //Mouse Distance
            let distance = dist(pmouseX - 2, pmouseY - 4, cx, cy);
            let ambDist = map(distance, 0, maxAmbDist, 1, 0);
            
            distance = constrain(distance, 0, maxDist);
            distance = map(distance, 0, maxDist, 1, 0); 
            
            //Calculate Displacements
            wave = int(sin(frameCount * 0.1 + (x + y) * 0.2) * 50 * distance);
            ambient = (sin(frameCount * 0.2 + floor((x + y) / 2) * 2) * 9 * ambDist); 
            
            //Assign Displacements
            dx += wave; 
            sw += ambient;
            
            // Final Copy //
            copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);
        }
    }
}