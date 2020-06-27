document.querySelectorAll(".selection.question").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector(".selection.question.active").classList.toggle("active");
            item.classList.add("active");

            let selection = item.getAttribute("id");

            switch (selection) {
                case 'des-outcome':
                case 'message':
                case 'target-aud':
                    document.querySelector(".sidebar-right").style.display = "none";
                    break;
                case 'sp-context':
                    document.querySelector(".sidebar-right").style.display = "none";
                    break;
            }
        })
    }
)