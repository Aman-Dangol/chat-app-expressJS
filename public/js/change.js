let changebutton = document.getElementById("changeButton");
let input = document.getElementById("textField");
console.log(changebutton);

// changebutton.addEventListener("click", (e) => e.preventDefault());
function changeType() {
  if (textField.type == "file") {
    textField.type = "text";
    changebutton.innerText = "file";
    return;
  }
  textField.type = "file";
  changebutton.innerText = "text";
}

changebutton.onclick = changeType;
