const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const toolsOption = document.querySelectorAll(".option");
const rangeSlider = document.querySelector("#thickness-slider");
const toolColor = document.querySelector("#color-picker");
const backgroundtoolColor = document.querySelector("#background-color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector("#jpg");
const saveSvg=document.querySelector("#svg");

let backgroundColor = "#fff";
let selectedColor = "#000";
let drawingNow = false;
let lineThickness = 4;
let selectedTool = "brush";
let figures=[];

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.backgroundColor=backgroundColor;
});

const drawEllipse = (e) => {
    context.beginPath();
    let radiusX = Math.abs(e.offsetX - initialPosX) / 2;
    let radiusY = Math.abs(e.offsetY - initialPosY) / 2;
    let centerX = Math.min(e.offsetX, initialPosX) + radiusX;
    let centerY = Math.min(e.offsetY, initialPosY) + radiusY;

    context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    context.stroke();

}

const drawRect = (e) => { 
    context.strokeRect(e.offsetX, e.offsetY, initialPosX - e.offsetX, initialPosY - e.offsetY);
}

const drawLine = (e) => {
    context.beginPath(); 
    context.moveTo(initialPosX, initialPosY); 
    context.lineTo(e.offsetX, e.offsetY); 
    context.stroke(); 
}

const startDraw = (e) => {
    drawingNow = true;

    initialPosX = e.offsetX; 
    initialPosY = e.offsetY; 

    context.beginPath(); 

    context.lineWidth = lineThickness; 
    context.strokeStyle = selectedColor; 
    context.fillStyle = selectedColor;

    canvasState = context.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!drawingNow){
        return;
    }
    else{
        context.putImageData(canvasState, 0, 0);
        switch (selectedTool) {
            case "brush":
            case "eraser":
                if (selectedTool === "eraser") {
                    context.strokeStyle = backgroundColor;
                } else {
                    context.strokeStyle = selectedColor;
                }
                context.lineTo(e.offsetX, e.offsetY);
                context.stroke();
                break;
        
            case "rectangle":
                drawRect(e);
                break;
        
            case "ellipse":
                drawEllipse(e);
                break;
        
            default:
                drawLine(e);
        }
        
    }
}

function addFigure(type, coordinates) {
    figures.push({
        type: type,
        coordinates: coordinates,
        thickness: lineThickness,
        color: selectedColor,
    });
}



const endDrawing = (e) => {
    drawingNow = false;
    context.closePath();

    let figureType = "line";
    if (selectedTool === "rectangle") {
        figureType = "rectangle";
    } else if (selectedTool === "ellipse") {
        figureType = "ellipse";
    }

    const figureCoordinates = {
        x: initialPosX,
        y: initialPosY,
    };

    addFigure(figureType, figureCoordinates);
};


function chooseOption(btn) {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
}

for (let i = 0; i < toolsOption.length; i++) {
    toolsOption[i].addEventListener("click", function() {
        chooseOption(this);
    });
}

rangeSlider.addEventListener("change", () => lineThickness = rangeSlider.value);

toolColor.addEventListener("change", (event) => {
    selectedColor = event.target.value;
});

backgroundtoolColor.addEventListener("input", (event) => {
    canvas.style.backgroundColor = event.target.value;
    backgroundColor = event.target.value;
});

clearCanvas.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor="#fff";
    backgroundtoolColor.value = "#ffffff";
    backgroundColor = "#ffffff";
    toolColor.value="#000000";
    figures=[]
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDrawing);

function formatSVGData(svgData) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgData.width}" height="${svgData.height}">${svgData}</svg>`;
}

saveImg.addEventListener("click", () => {

    const tempCanvas = document.createElement("canvas");
    const tempcontext = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempcontext.fillStyle = backgroundtoolColor.value;
    tempcontext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempcontext.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = 'myPaint.jpg'; 
    link.href = tempCanvas.toDataURL(); 
    link.click();
});

saveSvg.addEventListener("click", () => {
    const svgData = canvas.toDataURL("image/svg+xml");
    const formattedSVGData = formatSVGData(svgData);

    const blob = new Blob([formattedSVGData], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "myPaint.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
});


// function generateFigureListHTML() {
//     let html = '<ul>';
//     figures.forEach((figure, index) => {
//         html += `<li>${index + 1}. Type: ${figure.type}, Thickness: ${figure.thickness}, Color: ${figure.color}</li>`;
//     });
//     html += '</ul>';
//     return html;
// }


const showFiguresButton = document.querySelector('.show-figures');
// const figureListModal = document.getElementById('figure-list-modal');

showFiguresButton.addEventListener('click', () => {
    // const modalContent = generateFigureListHTML();
    // document.getElementById('figure-list-modal-body').innerHTML = modalContent;
    // document.getElementById('figureListModal').classList.add('show');
    console.log(figures);
    alert("Lista figurilor a fost afisata in consola!");
});

