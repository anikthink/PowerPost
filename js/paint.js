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

        this.activeLayer = -1;

        this.layerCount = this.layers.length;

        self = this;
    }

    selectLayer(layerId) {
        this.activeLayer = parseInt(layerId);
        console.log(this.activeLayer);
    }

    set activeTool(tool) {
        this.tool = tool;
    }

    init() {
        this.canvas.onmousedown = e => this.onMouseDown(e);

    }

    onMouseDown(e) {
     
        this.savedData = this.context.getImageData(0,0,this.canvas.clientWidth, this.canvas.clientHeight);

        if(this.undoStack.length >= this.undoLimit) this.undoStack.shift();
        this.undoStack.push(this.savedData);

        this.canvas.onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(e, this.canvas);

        this.lweight = getLineweight();

        this.context.lineWidth = this.lweight;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        let color = getColor();
        this.context.strokeStyle = 'rgba(' + color._r + ', ' + color._g + ', ' + color._b + ', ' + color._a + ')'

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
        this.currentPos = getMouseCoordsOnCanvas(e, this.canvas);

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

    }

    onMouseUp(e) {
        this.canvas.onmousemove = null;
        document.onmouseup = null;

        this.saveAction();

        for (let i = 0; i < this.layers.length; i++) {
            this.context.globalCompositeOperation = "destination-out";
            this.context.drawImage(this.layers[i],0,0);
            this.context.globalCompositeOperation = "source-over";
            this.context.drawImage(this.layers[i],0,0);
            console.log("b");
        }

    }

    drawShape() {
        this.context.putImageData(this.savedData,0,0);

        this.context.beginPath();

        if(this.tool == Tool.TOOL_LINE) {
            this.context.moveTo(this.startPos.x, this.startPos.y);
            this.context.lineTo(this.currentPos.x, this.currentPos.y);
        }
        else if(this.tool == Tool.TOOL_RECT) {
            this.context.lineCap = 'mitre';
            this.context.lineJoin = 'mitre';
            this.context.rect(this.startPos.x, this.startPos.y, this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y)
        }
        else if(this.tool == Tool.TOOL_CIRCLE) {
            let radX = Math.abs(this.currentPos.x - this.startPos.x);
            let radY = Math.abs(this.currentPos.y - this.startPos.y);
            this.context.ellipse(this.startPos.x, this.startPos.y, radX, radY, 0, 0, 2 * Math.PI, false)
        }
        
        this.context.stroke();
    }

    drawFreeLine() {
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.putImageData(this.savedData,0,0);
        this.context.stroke();
    }

    eraser() {
        this.context.globalCompositeOperation = "destination-out";
        this.context.strokeStyle = "rgba(255,255,255,1)";
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.putImageData(this.savedData,0,0);
        this.context.stroke();
        this.context.globalCompositeOperation = "source-over";
    }

    undoPaint() {
        if(this.undoStack.length > 0){
            this.context.putImageData(this.undoStack[this.undoStack.length-1], 0, 0);
            this.undoStack.pop();
        }
    }

    

    handleImage() {
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
        this.context.drawImage(img,0,0);
    }

    newLayer() {
        this.layers.push(document.createElement("canvas"));
        this.layers[this.layers.length-1].context = this.layers[this.layers.length-1].getContext("2d");
        this.layers[this.layers.length-1].width = this.canvas.clientWidth;
        this.layers[this.layers.length-1].height = this.canvas.clientHeight;
    }

    saveAction() {
        if (this.activeLayer < 0) return;
        console.log("a");
        let x = this.undoStack.length - 1;
        this.tmpCanvas = document.createElement("canvas");
        this.tmpCanvas.height = this.canvas.clientHeight;
        this.tmpCanvas.width = this.canvas.clientWidth;
        this.tmpContext = this.tmpCanvas.getContext("2d");
        this.tmpContext.globalCompositeOperation = "source-over";
        this.tmpContext.putImageData(this.undoStack[x],0,0);
        this.tmpContext.globalCompositeOperation = "destination-out";
        if (this.undoStack[x-1]) {
            this.tmpContext.putImageData(this.undoStack[x-1],0,0);
        }
        this.layers[this.activeLayer].context.drawImage(this.tmpCanvas,0,0);
        console.log(this.tmpCanvas)
    }

}

