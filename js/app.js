import Tool from './tool.js';
import Paint from './paint.js';
import { getLineweight, setCanvasSize } from './utility.js';

//defining new Paint element -- All canvas interactions pass through this
var paint = new Paint("canvas");
paint.activeTool = Tool.TOOL_BRUSH;
paint.init();

let selectedShape = Tool.TOOL_RECT;
let selectedLayer = "0";

let canvasShape = localStorage["CanvasShape"];

document.querySelectorAll("canvas").forEach(
    item => {
        let canvasId = item.getAttribute("id");
        setCanvasSize(canvasId, canvasShape);
    }
);


var imglLoader = document.getElementById("image-input");

//defining actions for selected command from left toolbar
document.querySelectorAll("[data-command]").forEach(
    item => {
        item.addEventListener("click", e => {

            let command = item.getAttribute("data-command")
            console.log(command);

            switch(command) {
                case 'undo':
                    paint.undoPaint();
                    break;
                case 'import-image':
                    $('#image-input').click();
                    imglLoader.addEventListener('change', paint.handleImage);
                    break;
            }

        })
    }
);

//defining actions for selected tool from left toolbar
document.querySelectorAll("[data-tool]").forEach(
    item => {
        item.addEventListener("click", e => {

            document.querySelector("[data-tool].active").classList.toggle("active")
            item.classList.add("active")

            let selectedTool = item.getAttribute("data-tool")

            switch(selectedTool) {
                case Tool.TOOL_TEXT:
                case Tool.TOOL_FILL:
                    document.querySelector(".group.linewidth").style.display = "none";
                    document.querySelector(".group.shape").style.display = "none";
                    break;
                case Tool.TOOL_SHAPE:
                    document.querySelector(".group.linewidth").style.display = "inline-block";
                    document.querySelector(".group.shape").style.display = "inline-block";
                    selectedTool = selectedShape;
                    break;
                case Tool.TOOL_ERASER:
                case Tool.TOOL_BRUSH:
                case Tool.TOOl_PEN:
                   //activate lineweight bar on top toolbar
                    document.querySelector(".group.linewidth").style.display = "inline-block";
                    //make other groups invisible on top toolbar
                    document.querySelector(".group.shape").style.display = "none";
                    break;
                default:   
                    document.querySelector(".group.linewidth").style.display = "none";
                    document.querySelector(".group.shape").style.display = "none";
            }  

            paint.activeTool = selectedTool;
            
            console.log("active tool:")
            console.log(selectedShape)

        })
    }
);

//defining actions for selected shape on top toolbar
document.querySelectorAll(".group.shape img").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector(".group.shape img.active").classList.toggle("active")
            item.classList.add("active")

            selectedShape = item.getAttribute("data-shape");
            paint.activeTool = selectedShape;

            switch(selectedShape) {
                case Tool.TOOL_LINE:
                    document.getElementById("imgShape").src = "assets/icons/line_50px.png";
                    break;
                case Tool.TOOL_CIRCLE:
                    document.getElementById("imgShape").src = "assets/icons/circle_50px.png";
                    break;
                case Tool.TOOL_RECT:
                    document.getElementById("imgShape").src = "assets/icons/rectangular_50px.png";
                    break;

            }
        })
    }
);

document.getElementById("lineweight-slider").onmousedown = e => {
    document.getElementById("lineweight-slider").onmousemove = f =>document.getElementById("lineweight-value").value = getLineweight();
    document.getElementById("lineweight-slider").onmouseup = null;
}

$("#selcolor").spectrum({
    preferredFormat: 'hex',
    color: "#f00",
    showAlpha: true,
    showInitial: true,
    showInput: true,
});


//setting active Layer from right toolbar
document.querySelectorAll("[data-layer-id]"). forEach(
    item => {
        item.addEventListener("click", e => {
            selectedLayer = item.getAttribute("data-layer-id");
            paint.selectLayer(selectedLayer);
        })
    }
)
