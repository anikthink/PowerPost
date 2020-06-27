import Paint from './paint.js';

layers = [];

layerCount = 0;






selectedLayer = 0

document.querySelectorAll(".layer"). forEach(
    item => {
        item.addEventListener("click", e => {
            selectedLayer = item.getAttribute("data-layer-id")
        })
    }
)

newlayer() {
    const n = new Paint;
    layers.push(n);
    layerCount = layerCount + 1;
}

deleteLayer() {

}

