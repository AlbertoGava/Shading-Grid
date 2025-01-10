let img;
let blockWidth, blockHeight;
let imgSegments = [];
let gui;
let canvas;

let controls = {
  gridSizeX: 15,
  loadImage: loadImageFromFile,
  saveImage: () => saveCanvas(canvas, 'image', 'png')
};

function preload() {
  img = loadImage('imgs/1.png', () => {
    img.filter(BLUR, 3);
  });
}

function setup() {
  canvas = createCanvas(1200, 880);
  imageMode(CENTER);

  gui = new dat.GUI();
  gui.add(controls, 'loadImage').name('UPLOAD IMAHE');
  gui.add(controls, 'gridSizeX', 2, 30).step(1).name('COLS').onChange(updateGrid);
  gui.add(controls, 'saveImage').name('SAVE .PNG');
  
  updateGrid();
}

function updateGrid() {
  blockWidth = width / controls.gridSizeX;
  blockHeight = height / Math.ceil(img.height / blockWidth);
  divideImageVertically();
  redraw();
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      img.filter(BLUR, 3);
      resizeCanvas(img.width, img.height);
      updateGrid();
    });
  }
}

function loadImageFromFile() {
  let fileInput = createFileInput(handleFile);
  fileInput.elt.click();
}

function divideImageVertically() {
  imgSegments = [];
  let segmentHeight = img.height / Math.ceil(img.height / blockWidth);

  for (let i = 0; i < Math.ceil(img.height / segmentHeight); i++) {
    let startY = i * segmentHeight;
    let segment = img.get(0, startY, img.width, segmentHeight);
    imgSegments.push(segment);
  }
}

function draw() {
  background(255);
  drawGrid();
}

function drawGrid() {
  for (let y = 0; y < imgSegments.length; y++) {
    for (let x = 0; x < controls.gridSizeX; x++) {
      let posX = x * blockWidth;
      let posY = y * blockHeight;
      let imgSegment = imgSegments[y];

      for (let by = 0; by < blockHeight; by++) {
        let imgY = map(by, 0, blockHeight, 0, imgSegment.height);

        let imgX = map(posX, 0, width, 0, imgSegment.width);

        let color = imgSegment.get(imgX, imgY);

        fill(color);
        noStroke();
        rect(posX, posY + by, blockWidth, 1);
      }
    }
  }
}
