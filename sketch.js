let coverImg, pageImg, gameImg, radarImg, colorImg, seaImg, bgImg, w2Img, smileImg, faceImg; 
let page = 0; 
let totalPages = 4; 
let flipAnim = 1; 
let flashAlpha = 0; 
let particles = []; 

let menuItems = ["封面導覽", "W1 水中", "W2 微笑臉", "W3 水草", "W4 彩色", "W5 雷達", "W6 急急棒", "W7 相機濾鏡"];
let menuY = [];

function preload() {
  coverImg = loadImage('book.jpg');
  pageImg = loadImage('book2.jpg');
  bgImg = loadImage('背景.jpg'); 
  w2Img = loadImage('w2.png'); 
  smileImg = loadImage('4.png');    
  seaImg = loadImage('水草.png');
  colorImg = loadImage('彩色.png');
  radarImg = loadImage('雷達.png');
  gameImg = loadImage('急急棒.gif'); 
  faceImg = loadImage('face.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  updateMenuPositions();

  for (let i = 0; i < 50; i++) {
    particles.push({x: random(width), y: random(height), size: random(2, 4), speed: random(0.2, 0.4)});
  }
}

function updateMenuPositions() {
  menuY = [];
  let startY = height/2 - 150; 
  for(let i=0; i<menuItems.length; i++) {
    menuY.push(startY + i * 40);
  }
}

function draw() {
  push();
  imageMode(CORNER);
  image(bgImg, 0, 0, width, height);
  pop();
  
  drawParticles();
  drawSidebar(); 

  flipAnim = lerp(flipAnim, 1, 0.15);

  push();
  translate(width / 2, height / 2);
  let s = map(flipAnim, 0, 1, 0.9, 1);
  scale(s);

  if (page === 0) drawCoverPage();
  else drawInnerContent(page);
  pop();

  drawUI();

  if (flashAlpha > 0) {
    fill(255, 255, 255, flashAlpha);
    noStroke();
    rect(0, 0, width, height);
    flashAlpha -= 15;
  }
}

function drawSidebar() {
  push();
  fill(40, 40, 40, 220); 
  noStroke();
  rect(15, height/2 - 200, 160, 400, 12);
  fill(255);
  textSize(17);
  textStyle(BOLD);
  textAlign(LEFT);
  text("目錄索引", 35, height/2 - 175);
  stroke(100);
  line(35, height/2 - 160, 145, height/2 - 160);
  noStroke();
  textSize(13);
  textStyle(NORMAL);
  for(let i=0; i<menuItems.length; i++) {
    let isActive = false;
    if (i === 0 && page === 0) isActive = true;
    else if ((i === 1 || i === 2) && page === 1) isActive = true; 
    else if ((i === 3 || i === 4) && page === 2) isActive = true; 
    else if ((i === 5 || i === 6) && page === 3) isActive = true; 
    else if (i === 7 && page === 4) isActive = true; 
    let isHover = (mouseX > 15 && mouseX < 175 && mouseY > menuY[i]-15 && mouseY < menuY[i]+15);
    if (isActive) fill(255, 200, 0); 
    else if (isHover) { fill(180, 220, 255); cursor(HAND); }
    else fill(210);
    text(menuItems[i], 45, menuY[i]);
    if (isActive) ellipse(35, menuY[i], 5, 5);
  }
  pop();
}

function drawParticles() {
  fill(255, 120);
  noStroke();
  for (let p of particles) {
    ellipse(p.x, p.y, p.size);
    p.y -= p.speed; 
    if (p.y < 0) p.y = height;
  }
}

function drawCoverPage() {
  let h = height * 0.8;
  let w = h * (coverImg.width / coverImg.height);
  push();
  scale(flipAnim, 1);
  image(coverImg, 0, 0, w, h);
  fill(255, 230); 
  ellipse(20, 0, w * 0.8, 120); 
  fill(50);
  textSize(width * 0.025); 
  text("大一下作品集", 20, 0);
  drawTinyPageNum(0, h, "cover");
  pop();
}

function drawInnerContent(index) {
  let h = height * 0.9;
  let w = h * (pageImg.width / pageImg.height);
  push();
  scale(flipAnim, 1);
  image(pageImg, 0, 0, w, h);
  fill(0, 30);
  rect(-2, -h/2, 4, h); 
  
  let leftX = -w * 0.25;
  let rightX = w * 0.25;

  if (index === 1) {
    drawWork(leftX, h, w, "水中音樂會", w2Img, "https://22kzcc.github.io/-W2/", true, false);
    drawWork(rightX, h, w, "微笑臉", smileImg, "https://22kzcc.github.io/w4/", true, false); 
  } else if (index === 2) {
    drawWork(leftX, h, w, "水草網頁", seaImg, "https://22kzcc.github.io/sea/", false, false);
    drawWork(rightX, h, w, "玩耍彩色", colorImg, "https://22kzcc.github.io/041403/", false, false);
  } else if (index === 3) {
    drawWork(leftX, h, w, "雷達找遊戲", radarImg, "https://22kzcc.github.io/040730118/", false, false);
    drawWork(rightX, h, w, "電流急急棒", gameImg, "https://22kzcc.github.io/4147301180407/", false, false);
  } else if (index === 4) {
    // W7 相機濾鏡：設定為不使用小尺寸(false)，且旋轉(true)，圖片會變大
    drawWork(leftX, h, w, "相機濾鏡", faceImg, "https://22kzcc.github.io/04210/", false, true);
    push();
    translate(rightX, 0);
    fill(100);
    textSize(20);
    text("END", 0, 0);
    pop();
  }
  
  drawTinyPageNum(leftX, h, index * 2 - 1);
  drawTinyPageNum(rightX, h, index * 2);
  pop();
}

function drawWork(px, h, w, title, img, url, isSmall, isRotated) {
  noStroke();
  fill(60);
  textSize(width * 0.015);
  textStyle(BOLD);
  text(title, px, -h * 0.22);
  
  if (img) {
    // 調大尺寸因子：如果是旋轉圖(W7)，給予較大的顯示範圍
    let sizeFactor = isRotated ? 0.45 : (isSmall ? 0.23 : 0.38);
    let maxW = w * sizeFactor; 
    let maxH = h * sizeFactor; 
    
    push();
    translate(px, -20);
    if (isRotated) rotate(-HALF_PI); 
    
    // 根據旋轉後的容器計算比例
    let scaleRatio = min(maxW / img.width, maxH / img.height);
    let imgW = img.width * scaleRatio;
    let imgH = img.height * scaleRatio;
    image(img, 0, 0, imgW, imgH);
    pop();
    
    fill(0, 102, 204);
    textStyle(NORMAL);
    textSize(14);
    // 連結位置根據圖片大小微調
    let labelY = isRotated ? h * 0.28 : h * 0.25;
    text("GO PLAY ➔", px, labelY);
  }
}

function drawTinyPageNum(px, h, num) {
  fill(80);
  textSize(20); 
  let label = (num === "cover") ? "Cover" : "P. " + num;
  text(label, px, h/2 - 60); 
}

function drawUI() {
  cursor(ARROW); 
  fill(100);
  textSize(12);
  if (page > 0) text("PREV", 40, height - 40);
  if (page < totalPages) text("NEXT", width - 40, height - 40);
}

function mousePressed() {
  for(let i=0; i<menuItems.length; i++) {
    if (mouseX > 15 && mouseX < 175 && mouseY > menuY[i]-15 && mouseY < menuY[i]+15) {
      if (i === 0) page = 0;
      else if (i === 1 || i === 2) page = 1;
      else if (i === 3 || i === 4) page = 2;
      else if (i === 5 || i === 6) page = 3;
      else if (i === 7) page = 4;
      flipAnim = 0;
      flashAlpha = 150;
      return; 
    }
  }

  if (page >= 1) {
    let h = height * 0.9;
    let w = h * (pageImg.width / pageImg.height);
    let leftX = width/2 - w*0.25;
    let rightX = width/2 + w*0.25;

    if (page === 1) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/-W2/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/w4/");
    }
    if (page === 2) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/sea/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/041403/");
    }
    if (page === 3) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/040730118/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/4147301180407/");
    }
    if (page === 4) {
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 120) window.open("https://22kzcc.github.io/04210/");
    }
  }

  let oldPage = page;
  if (mouseX > width * 0.6 && page < totalPages) page++;
  else if (mouseX < width * 0.4 && page > 0) page--;
  if (oldPage !== page) { flipAnim = 0; flashAlpha = 150; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateMenuPositions();
}