const screenWidth = window.screen.width / 4 * 3;
const screenHeight = window.screen.height / 4 * 3;
const app = new PIXI.Application({ width: screenWidth, height: screenHeight, backgroundColor: 0xffffff });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const mousePosition = new PIXI.Point();
const container = new PIXI.Container();

container.interactive = true;
container.buttonMode = true;
container
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

const rectangleArray = [];
const groupColumn = [];
const line = [];
let tempMouseX, tempMouseY;
let mouseDrag = false;
let columnID;
let scaleX = 1, scaleY = 1;


for (let i = 0; i < 18; i++) {
    var graphics = new PIXI.Graphics();
    rectangleArray[i] = graphics;
}
for (let i = 0; i < 4; i++) {
    groupColumn[i] = new PIXI.Container();
    container.addChild(groupColumn[i]);
}

for (let i = 0; i < 4; i++) {
    line[i] = new PIXI.Graphics();

}


app.view.addEventListener('mousewheel', (ev) => {
    app.renderer.plugins.interaction.mapPositionToPoint(mousePosition, ev.x, ev.y); // get global position in world coordinates
  
    // returns element directly under mouse
    const found = app.renderer.plugins.interaction.hitTest(
        mousePosition,
        app.stage
    );
    
    // Dispatch scroll event
    if (found) { found.emit('scroll', ev); }
    if (ev.wheelDelta < 0 && found) {
        container.setTransform(container.x, container.y, scaleX, scaleY);
        scaleX *= 1.01;
        scaleY *= 1.01;
    }
    else if (ev.wheelDelta >= 0 && found) {
        container.setTransform(container.x, container.y, scaleX, scaleY);
        scaleX /= 1.01;
        scaleY /= 1.01;
    }
});

app.view.addEventListener('mousedown', (ev) => {
    tempMouseX = ev.x;
    tempMouseY = ev.y;
    mouseDrag = true;
});

app.view.addEventListener('mouseup', (ev) => {
    mouseDrag = false;

});

app.view.addEventListener('mousemove', (ev) => {
    if (mouseDrag) {
        container.x += ev.x - tempMouseX
        container.y += ev.y - tempMouseY;
    }
});

function onPointerOver(object, t) {
    object.tint = 0x50d13f;
    object.alpha = 0.3; 
    if (t === groupColumn[0]) {
        columnID = 1;
        line[0].visible = true;
    }
    else if (t === groupColumn[1]) {
        columnID = 2;
        line[1].visible = true;
    }
    else if (t === groupColumn[2]) {
        columnID = 3;
        line[2].visible = true;

    } else if (t === groupColumn[3]) {
        columnID = 4;
        line[3].visible = true;
    }
}

function onPointerOut(object, t) {
    object.tint = 0xffffff;
    object.alpha = 1;
    if (t === groupColumn[0]) {
        line[0].visible = false;
    }
    else if (t === groupColumn[1]) {
        line[1].visible = false;
    }
    else if (t === groupColumn[2]) {
        line[2].visible = false;

    }
    else if (t === groupColumn[3]) {
        line[3].visible = false;
    }
}

function onClick(object) {
    object.alpha = 0.5;
}


function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
}

function onDragEnd() {
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = mousePosition.x;
        this.y = mousePosition.y;
    }
}

function createRectangle(cX, cY, cWidth, cHeight, tint, rectangleArray, groupColumn) {
    rectangleArray.beginFill(tint);
    rectangleArray.lineStyle(2, 0x000000);
    rectangleArray.drawRect(cX, cY, cWidth, cHeight);
    rectangleArray.interactive = true;

    rectangleArray.on('pointerdown', (event) => {
        onClick(rectangleArray)
    });

    rectangleArray.on('pointerover', (event) => {
        onPointerOver(rectangleArray, groupColumn)
    });

    rectangleArray.on('pointerout', (event) => {
        onPointerOut(rectangleArray, groupColumn)
    });
    groupColumn.addChild(rectangleArray);
}

function linePlotter(line, groupSprite, firstLineMoveX, firstLineMoveY, firstLineStartX, firstLineStartY, firstLineEndX, firstLineEndY, secondLineMoveX, secondLineMoveY, secondLineStartX, secondLineStartY, secondLineEndX, secondLineEndY) {
    line.lineStyle(2, 0x00ff00)
        .moveTo(firstLineMoveX, firstLineMoveY)
        .lineTo(firstLineStartX, firstLineStartY)
        .lineTo(firstLineEndX, firstLineEndY)

        .moveTo(secondLineMoveX, secondLineMoveY)
        .lineTo(secondLineStartX, secondLineStartY)
        .lineTo(secondLineEndX, secondLineEndY);
    line.visible = false;
    groupSprite.addChild(line);
}


for (let i = 0; i < 2; i++) { //left col
    createRectangle(0, screenHeight / 4 * i, screenWidth / 4, screenHeight / 4 * (1 + 2 * i), 0xffffff, rectangleArray[i], groupColumn[0]);   // 0 1
}

for (let i = 0; i < 3; i++) { //mid up 
    createRectangle(screenWidth / 4, screenHeight / 6 * i, screenWidth / 4, screenHeight / 6, 0xffffff, rectangleArray[i + 2], groupColumn[1]); // 2 3 4
    createRectangle(screenWidth / 4 * 2, screenHeight / 6 * i, screenWidth / 4, screenHeight / 6, 0xffffff, rectangleArray[i + 9], groupColumn[2]); // 9 10 11
}
for (let i = 0; i < 4; i++) { //mid down
    createRectangle(screenWidth / 4, screenHeight / 8 * (i + 4), screenWidth / 4, screenHeight / 8, 0xffffff, rectangleArray[i + 5], groupColumn[1]); // 5 6 7 8
    createRectangle(screenWidth / 4 * 2, screenHeight / 8 * (i + 4), screenWidth / 4, screenHeight / 8, 0xffffff, rectangleArray[i + 12], groupColumn[2]); // 12 13 14 15
}
for (let i = 0; i < 2; i++)  //right col
{
    createRectangle(screenWidth / 4 * 3, screenHeight / 2 * i, screenWidth / 4, screenHeight / 2, 0xffffff, rectangleArray[i + 16], groupColumn[3]); // 16 17 
}


for (let i = 0; i < 4; i++) {
    linePlotter(line[i], groupColumn[i], screenWidth / 4 * i, 0, screenWidth / 4 * i, 0, screenWidth / 4 * (i + 1), screenHeight, screenWidth / 4 * (i + 1), 0, screenWidth / 4 * (i + 1), 0, screenWidth / 4 * i, screenHeight);
}
app.stage.addChild(container);