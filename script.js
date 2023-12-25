let canvas=document.querySelector("canvas");
ctx=canvas.getContext("2d");
let toolsBtns=document.querySelectorAll(".tool");
let fillColor=document.querySelector("#fill-color");
let sizeSlieder=document.querySelector("#size-slider");
let colorBtns=document.querySelectorAll(".colors .option");
let colorPicker=document.querySelector("#color-picker");
let clearCanvas=document.querySelector(".clear-canvas");
let savImg=document.querySelector(".save-img");

// The above is the striaght line code for canvas
// let straihtline=(e)=>{
//     ctx.beginPath();
//     ctx.moveTo(previousMouseX,previousMouseY);
//     ctx.lineTo(e.offsetX,e.offsetY);
//     ctx.stroke();
// }

let previousMouseX,previousMouseY,snapshot;
let isDrawing=false;
let brushsize=5;
let selectedTool="brush";
let selectedColor="#000";

const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
};

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
})

let drawCircle=(e)=>{
    ctx.beginPath();//creating a new path for circle
    let radius=Math.sqrt(Math.pow((previousMouseX-e.offsetX),2)+Math.pow((previousMouseY-e.offsetY),2));
    ctx.arc(previousMouseX,previousMouseY,radius,0,2*Math.PI);
    fillColor.checked ? ctx.fill():ctx.stroke();
}

let drawTriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(previousMouseX,previousMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);//creating the striaght line of the triangle
    ctx.lineTo(previousMouseX*2-e.offsetX,e.offsetY);//creating bottom line of the triangle
    ctx.closePath();
    ctx.stroke();
    fillColor.checked ? ctx.fill():ctx.stroke();

}

let drawRect=(e)=>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,previousMouseX-e.offsetX,previousMouseY-e.offsetY);
    }
    else{
        ctx.fillRect(e.offsetX,e.offsetY,previousMouseX-e.offsetX,previousMouseY-e.offsetY);

    }
    // ctx.stroke();
}

let startDrawing=(e)=>{
    // if(isDrawing){
    //     isDrawing=false;
    // }
    // else{
    //     isDrawing=true;
    // }
    isDrawing=true;
    previousMouseX=e.offsetX;
    previousMouseY=e.offsetY;
    ctx.strokeStyle=selectedColor;// passsing the selected the color as stroke style
    ctx.fillStyle=selectedColor;//filling the color with the selected the color
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);//copying the canvas data
    ctx.beginPath();
    //creating a new path to drawing, means not continuing
    //the drawing from the previously left pointer
    ctx.lineWidth=brushsize;//setting the brush size or setting the line
    //width of the canvas
}

let drawing = (e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="brush" || selectedTool==="eraser"){
        ctx.strokeStyle=selectedTool==="eraser" ? "#fff" : selectedTool;
        ctx.lineTo(e.offsetX,e.offsetY);//creating line according to the mouse pointer
        ctx.stroke();//drawing logic by filling line with color
    }
    else if(selectedTool==="circle"){
        drawCircle(e);
    }
    else if(selectedTool==="triangle"){
        drawTriangle(e);
    }
    else if(selectedTool==="rectangle"){
        drawRect(e);
    }
    else{
        // drawRect(e);
        // selectedTool="brush";
    }
}

toolsBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        // document.querySelector(".options .active").classList.remove("active");
        // btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    });
});

colorBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing the selected color to the variable
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");

    });
});

colorPicker.addEventListener("change",()=>{
    // Passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click",()=>{
    // Clearing the entire canvas:-
    ctx.clearRect(0,0,canvas.width,canvas.height);
});

savImg.addEventListener("click",()=>{
    // Logic to download the canvas in image is to call the method 'toDateURL' in a variable and then download it using a link.
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
});

sizeSlieder.addEventListener("change",()=> brushsize=sizeSlieder.value);
canvas.addEventListener("mousedown",startDrawing);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>{
    isDrawing=false;
});