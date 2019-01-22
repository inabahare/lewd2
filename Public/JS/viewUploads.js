import axios from "axios";

const buttons = document.querySelectorAll(".delete-one");

for (const button of buttons) {
    button.onclick = onButtonClick;
}


function onButtonClick(e) {
    e.preventDefault();
        
    
}