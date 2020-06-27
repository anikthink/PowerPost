import { Point } from './point.js';

export function getLineweight() {
    var lineweight = document.getElementById("lineweight-slider").value;
    return lineweight;
}

export function getColor() {
    var color = $("#selcolor").spectrum("get")
    return color;
}

export function setCanvasSize(canvasId, canvasShape) {
    var x;
    var y;
    switch(canvasShape) {
        case 'square':
            x = 800;
            y = 800;
            break;
        case '169portrait':
            x = 800 * 9/16;
            y = 800;
            break;
        case '169landscape':
            x = 800;
            y = 800 * 9/16;
            break;
        case 'A4portrait':
            x = 622;
            y = 880;
            break;
        case 'A4landscape':
            x = 880;
            y = 622;
            break;
    }
    document.getElementById(canvasId).width = x;
    document.getElementById(canvasId).height = y;    
}

export class Fill {
    constructor(canvas, node, color){
        this.context = canvas.getContext("2d");

        this.imgData = this.context.getImageData(0,0,this.context.canvas.width, this.context.canvas.height)

        const targetColor = this.getNode(node);

        const fillColor = [Math.round(color._r), Math.round(color._g), Math.round(color._b), Math.round(255 * color._a)];

        this.fillStack = [];

        this.floodFill(node, targetColor, fillColor);
        this.fillColor();

        console.log(this.matchColor(targetColor, fillColor));
        console.log(fillColor);
    }

    floodFill(node, targetColor, fillColor){

        //check that fill color is not the same target color
        if(this.matchColor(targetColor, fillColor)) return;

        //check that color of node
        const currentColor = this.getNode(node);
        if(this.matchColor(currentColor, targetColor)){

            //set color of node to fillColor
            this.setPixel(node, fillColor);

            this.fillStack.push([new Point(node.x+1, node.y), targetColor, fillColor]);
            this.fillStack.push([new Point(node.x-1, node.y), targetColor, fillColor]);
            this.fillStack.push([new Point(node.x, node.y+1), targetColor, fillColor]);
            this.fillStack.push([new Point(node.x, node.y-1), targetColor, fillColor]);

            return;
            
        }
    }

    fillColor(){
        if(this.fillStack.length) {
            let range = this.fillStack.length;

            for(let i=0; i < range; i++){
                this.floodFill(this.fillStack[i][0], this.fillStack[i][1],this.fillStack[i][2]);
            }

            this.fillStack.splice(0, range);

            this.fillColor();
        }
        else {
            this.context.putImageData(this.imgData, 0, 0);
            this.fillStack = [];
        }
    }

    getNode(node){
        if(node.x < 0 || node.y < 0 || node.x > this.imgData.width || node.y > this.imgData.height){
            return[-1,-1,-1,-1]
        }
        else {
            const offset = (node.y * this.imgData.width + node.x) * 4;

            return [
                this.imgData.data[offset],
                this.imgData.data[offset + 1],
                this.imgData.data[offset + 2],
                this.imgData.data[offset + 3],
            ]
        }
    }

    setPixel(node, fillColor){
        const offset = (node.y * this.imgData.width + node.x) * 4;

        this.imgData.data[offset] = fillColor[0];
        this.imgData.data[offset + 1] = fillColor[1];
        this.imgData.data[offset + 2] = fillColor[2];
        this.imgData.data[offset + 3] = fillColor[3];   

    }

    matchColor(c1, c2){
        for (let i = 0; i < c1.length; i++) {
            if(c1[i] != c2[i]) return false;            
        }
        return true;
    }
}


