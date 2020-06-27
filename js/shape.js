document.querySelectorAll(".med .item").forEach(
    item => {
        
        item.addEventListener("click", e => {

            document.querySelector(".med .item.active").classList.toggle("active");
            item.classList.add("active");

            document.querySelector(".cnv .item.active").classList.toggle("active");
            document.querySelector("#square").classList.add("active");
            
            let medium = item.getAttribute("data-medium");

            let MEDIUM_DIGITAL = 'digital';
            let MEDIUM_PRINT = 'print';

            switch(medium) {
                case 'digital':
                    console.log(item);
                    document.getElementById("169portrait").style.display = "inline-block";
                    document.getElementById("169landscape").style.display = "inline-block";
                    document.getElementById("A4portrait").style.display = "none";
                    document.getElementById("A4landscape").style.display = "none";
                    break;
                case 'print':
                    console.log(item);
                    document.getElementById("169portrait").style.display = "none";
                    document.getElementById("169landscape").style.display = "none";
                    document.getElementById("A4portrait").style.display = "inline-block";
                    document.getElementById("A4landscape").style.display = "inline-block";
                    break;
            }


        })
    }
);

document.querySelectorAll(".cnv .item").forEach(
    item => {

        item.addEventListener("click", e => {

            document.querySelector(".cnv .item.active").classList.toggle("active");
            item.classList.add("active");

        })
    }
);

document.querySelector(".continue.button").onclick = e => {
    localStorage["CanvasShape"] = document.querySelector(".cnv .item.active").getAttribute("id");
}