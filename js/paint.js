import { getMouseCoordsOnCanvas } from './point.js'
import Tool from './tool.js';
import { getLineweight, getColor, Fill } from './utility.js'

export default class Paint {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);

        this.context = canvas.getContext("2d");
        
        this.undoStack = [];
        this.undoLimit = 10;

        this.layers = [];
        this.layers[0] = this.canvas
        this.layers[0].context = this.context;

        this.newLayer();

        this.activeLayer = 0;

        this.layerCount = this.layers[this.activeLayer].length;

        self = this;
    }

    selectLayer(layerId) {
        this.activeLayer = parseInt(layerId);
        console.log(this.layers[this.activeLayer].context);
    }

    set activeTool(tool) {
        this.tool = tool;
    }

    init() {
        this.layers[this.activeLayer].onmousedown = e => this.onMouseDown(e);

    }

    onMouseDown(e) {
        
        this.savedData = this.context.getImageData(0,0,this.canvas.clientWidth, this.canvas.clientHeight);

        if(this.undoStack.length >= this.undoLimit) this.undoStack.shift();
        this.undoStack.push(this.savedData);

        this.layers[this.activeLayer].onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(e, this.layers[this.activeLayer]);

        this.lweight = getLineweight();

        this.layers[this.activeLayer].context.lineWidth = this.lweight;
        this.layers[this.activeLayer].context.lineCap = 'round';
        this.layers[this.activeLayer].context.lineJoin = 'round';
        let color = getColor();
        this.layers[this.activeLayer].context.strokeStyle = 'rgba(' + color._r + ', ' + color._g + ', ' + color._b + ', ' + color._a + ')'

        switch(this.tool){
            case Tool.TOOL_ERASER:
            case Tool.TOOL_BRUSH:
                this.context.beginPath();
                this.context.moveTo(this.startPos.x, this.startPos.y);
                break;
            case Tool.TOOL_FILL:
                new Fill(this.canvas, this.startPos, color);
                break;

            default:
                break;
        }
    }

    onMouseMove(e) {
        this.currentPos = getMouseCoordsOnCanvas(e, this.layers[this.activeLayer]);
        switch(this.tool){
            case Tool.TOOL_LINE:
            case Tool.TOOL_CIRCLE:
            case Tool.TOOL_RECT:
                this.drawShape();
                break;
            case Tool.TOOL_BRUSH:
                this.drawFreeLine();
                break;
            case Tool.TOOL_ERASER:
                this.eraser();
                break;
            default:
                break;
        }

        this.context.drawImage(this.layers[1],0,0,this.canvas.clientWidth, this.canvas.clientHeight);

        for (let i = 0; i < this.layers.length; i++) {
            this.context.drawImage(this.layers[i],0,0,this.canvas.clientWidth, this.canvas.clientHeight) ;           
        }
    }

    onMouseUp(e) {
        this.layers[this.activeLayer].onmousemove = null;
        document.onmouseup = null;
    }

    drawShape() {
        this.layers[this.activeLayer].context.putImageData(this.savedData,0,0);

        this.layers[this.activeLayer].context.beginPath();

        if(this.tool == Tool.TOOL_LINE) {
            this.layers[this.activeLayer].context.moveTo(this.startPos.x, this.startPos.y);
            this.layers[this.activeLayer].context.lineTo(this.currentPos.x, this.currentPos.y);
        }
        else if(this.tool == Tool.TOOL_RECT) {
            this.layers[this.activeLayer].context.lineCap = 'mitre';
            this.layers[this.activeLayer].context.lineJoin = 'mitre';
            this.layers[this.activeLayer].context.rect(this.startPos.x, this.startPos.y, this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y)
        }
        else if(this.tool == Tool.TOOL_CIRCLE) {
            let radX = Math.abs(this.currentPos.x - this.startPos.x);
            let radY = Math.abs(this.currentPos.y - this.startPos.y);
            this.layers[this.activeLayer].context.ellipse(this.startPos.x, this.startPos.y, radX, radY, 0, 0, 2 * Math.PI, false)
        }
        
        this.layers[this.activeLayer].context.stroke();
    }

    drawFreeLine() {
        this.layers[this.activeLayer].context.lineTo(this.currentPos.x, this.currentPos.y);
        this.layers[this.activeLayer].context.putImageData(this.savedData,0,0);
        this.layers[this.activeLayer].context.stroke();
        console.log("a");
        this.context.drawImage(this.layers[1],0,0,this.canvas.clientWidth, this.canvas.clientHeight);
    }

    eraser() {
        this.layers[this.activeLayer].context.globalCompositeOperation = "destination-out";
        this.layers[this.activeLayer].context.strokeStyle = "rgba(255,255,255,1)";
        this.layers[this.activeLayer].context.lineTo(this.currentPos.x, this.currentPos.y);
        this.layers[this.activeLayer].context.putImageData(this.savedData,0,0);
        this.layers[this.activeLayer].context.stroke();
        this.layers[this.activeLayer].context.globalCompositeOperation = "source-over";
    }

    undoPaint() {
        if(this.undoStack.length > 0){
            this.context.putImageData(this.undoStack[this.undoStack.length-1], 0, 0);
            this.undoStack.pop();
        }
    }

    

    handleImage() {
        console.log(self);
        const FR = new FileReader();
        FR.addEventListener("load", (evt) => {
            const img = new Image();
            img.addEventListener("load", () => {
                self.drawImg(img);
            });
            img.src = evt.target.result;
        });
        FR.readAsDataURL(this.files[0]); 
    }

    drawImg(img) {
        console.log(img);
        this.context.drawImage(img,0,0);
    }

    newLayer() {
        this.layers.push(document.createElement("canvas"));
        this.layers[this.layers.length-1].context = canvas.getContext("2d");
        this.layers[this.layers.length-1].width = this.canvas.clientWidth;
        this.layers[this.layers.length-1].height = this.canvas.clientHeight;
    }

}

