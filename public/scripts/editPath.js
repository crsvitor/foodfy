function addIngredient(){
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    if(newField.children[0].value == "") return false;

    newField.children[0].value = "";
    ingredients.appendChild(newField);
}

document.querySelector(".add-ingredient").addEventListener("click", addIngredient);

function addSteps() {
    const method = document.querySelector("#prepariation-method");
    const step = document.querySelectorAll(".methods");

    const newStep = step[step.length - 1].cloneNode(true);

    if(newStep.children[0].value == "") return false;

    newStep.children[0].value = "";
    method.appendChild(newStep);
}

document.querySelector(".add-preparation").addEventListener("click", addSteps);

const formDelete = document.querySelector("#form-delete");
formDelete.addEventListener("submit", function (event) {
    const confirmation = confirm("Deseja excluir?");

    if(!confirmation) {
        event.preventDefault();
    }
})
