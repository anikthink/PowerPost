export class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

export function getMouseCoordsOnCanvas(e) {
    let rect = document.getElementById("canvas").getBoundingClientRect();
    let x = Math.floor(e.clientX - rect.left);
    let y = Math.floor(e.clientY - rect.top);
    return new Point(x,y);
}
