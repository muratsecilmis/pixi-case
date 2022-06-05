const screenWidth = window.screen.width / 4 * 3;
const screenHeight = window.screen.height / 4 * 3;
const app = new PIXI.Application({ width: screenWidth, height: screenHeight, backgroundColor: 0xffffff });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const mousePosition = new PIXI.Point();
const container = new PIXI.Container();

container.interactive = true;
container.buttonMode = true;

const rectangleArray = [];
const groupColumn = [];
const line = [];
let tempMouseX, tempMouseY;
let mouseDrag = false;
let columnID;
let scaleX = 1, scaleY = 1;


for (let i = 0; i < 18; i++) {
    rectangleArray[i] = new PIXI.Graphics();
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

    const found = app.renderer.plugins.interaction.hitTest(
        mousePosition,
        app.stage
    );

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
    app.renderer.plugins.interaction.mapPositionToPoint(mousePosition, ev.x, ev.y); // get global position in world coordinates

    const found = app.renderer.plugins.interaction.hitTest(
        mousePosition,
        app.stage
    );
   if(found)
   {
    tempMouseX = ev.x;
    tempMouseY = ev.y;
    mouseDrag = true;
   }
});

app.view.addEventListener('mouseup', (ev) => {
    mouseDrag = false;
});

let secondTempX = 0;
let secondTempY = 0;

app.view.addEventListener('mousemove', (ev) => {
    app.renderer.plugins.interaction.mapPositionToPoint(mousePosition, ev.x, ev.y); // get global position in world coordinates

    const found = app.renderer.plugins.interaction.hitTest(
        mousePosition,
        app.stage
    );

    if (mouseDrag && found) {

        container.x += ev.x - tempMouseX - secondTempX;
        container.y += ev.y - tempMouseY - secondTempY;
        secondTempX = ev.x - tempMouseX;
        secondTempY = ev.y - tempMouseY;

        console.log(ev.x + " " + ev.y + "ev.x y");
        console.log(tempMouseX + " " + tempMouseY + " tempMouse");
        console.log(container.x, container.y + " container");
    }
});


function onPointerOver(object, column) {
    object.tint = 0x50d13f;
    object.alpha = 0.3;
    if (column === groupColumn[0]) {
        columnID = 1;
        line[0].visible = true;
    }
    else if (column === groupColumn[1]) {
        columnID = 2;
        line[1].visible = true;
    }
    else if (column === groupColumn[2]) {
        columnID = 3;
        line[2].visible = true;

    } else if (column === groupColumn[3]) {
        columnID = 4;
        line[3].visible = true;
    }
}

function onPointerOut(object, column) {
    object.tint = 0xffffff;
    object.alpha = 1;
    if (column === groupColumn[0]) {
        line[0].visible = false;
    }
    else if (column === groupColumn[1]) {
        line[1].visible = false;
    }
    else if (column === groupColumn[2]) {
        line[2].visible = false;

    }
    else if (column === groupColumn[3]) {
        line[3].visible = false;
    }
} 


function createRectangle(cX, cY, cWidth, cHeight, tint, rectangleArray, groupColumn) {
    rectangleArray.beginFill(tint);
    rectangleArray.lineStyle(2, 0x000000);
    rectangleArray.drawRect(cX, cY, cWidth, cHeight);
    rectangleArray.interactive = true;
 
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