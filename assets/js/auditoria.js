window.addEventListener("load",()=> loadErrors())



class Error {
    errorCode;
    errorDescription;
    quantity;

    constructor(errorCode, errorDescription, quantity) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.quantity = quantity;
    }
}

const erroresFijos = [
    { codigo: "E001", descripcion: "Error de documentación" },
    { codigo: "E002", descripcion: "Fallo en procedimiento" },
    { codigo: "E003", descripcion: "Incumplimiento de seguridad" },
    { codigo: "E004", descripcion: "Error de etiquetado" },
    { codigo: "E005", descripcion: "Material incorrecto" },
    { codigo: "E006", descripcion: "Falta de limpieza" },
    { codigo: "E007", descripcion: "Equipo defectuoso" }
];



//Initialize error search and list
let errorListed = [];
const errorSearch = document.getElementById('errorSearch');
const errorList = document.getElementById('errorList');
const errorCodeField = document.getElementById('errorCode');

errorSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    errorList.innerHTML = '';

    if (query.length === 0) return;
    const filtrados = erroresFijos.filter(e => e.descripcion.toLowerCase().includes(query));

    filtrados.forEach(error => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-group-item list-group-item-action';
        item.textContent = `${error.descripcion} (${error.codigo})`;
        item.onclick = () => {
            errorSearch.value = error.descripcion;
            errorCodeField.value = error.codigo;
            errorList.innerHTML = '';
        };
        errorList.appendChild(item);
    });
});


// Add event listener to the button to add errors
let addErrorBtn = document.getElementById('addError-btn');
addErrorBtn.addEventListener('click', function () {
    let errorCode = document.getElementById('errorCode').value;
    let errorDescription = document.getElementById('errorSearch').value;

    if (errorCode && errorDescription) {


        setErrorToArray(new Error(errorCode, errorDescription, 1));
        errorCodeField.value = '';
        errorSearch.value = '';
        errorList.innerHTML = ''; // Clear the list after adding
        console.log("añadiendo otro");

        let modalElement = document.querySelector('#errorFormModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            console.log(modalInstance)
            modalInstance.hide();
        }

        loadErrors();

    } else {
        alert('Por favor, completa todos los campos.');
    }
});



// Function to load errors from localStorage and display them
let loadErrors = () => {
    document.querySelector(".main__errors-container").innerHTML = '';
    errorListed = [];
    let errors = localStorage.getItem('errorListed');
    console.log("errors: " + errors)

    if (errors) {
        errorListed = JSON.parse(errors);
        console.log("errorListed: ", errorListed)

        // If the parsed value is not an array, wrap it in an array
        if (!Array.isArray(errorListed)) {
            errorListed = [errorListed];
        }

        errorListed.forEach(error => { loadErrorHtml(error) });
    } else {
        return;
    }
}

// Function to create and display an error HTML element
let loadErrorHtml = (error) => {
    let newError = document.createElement('div');
    newError.className = 'error_data-group';
    newError.innerHTML = `  
                                    <div class="error__data-container"> 
                                        <label class="error__title">Error:</label>
                                        <label class="error__uneditable-text">${error.errorDescription}</label>
                                    </div>
                                    <div class="error__data-container">
                                        <label class="error__title">Codigo:</label>
                                        <label class="error__uneditable-text">${error.errorCode}</label>
                                    </div>
                                    <input class="error__input" type="number" id="quantity" placeholder="Puntos Penalizados" value="${error.quantity}">
                                `;

    let divButtons = document.createElement('div');
    divButtons.className = 'error__container-buttons';

    let deleteBtn = document.createElement('ion-icon');
    deleteBtn.setAttribute('name', 'trash-outline');
    deleteBtn.addEventListener('click', function () {
        newError.remove();
        removeErrorFromArray(error.errorCode);
    });


    divButtons.appendChild(deleteBtn);
    newError.appendChild(divButtons)

    document.querySelector('.main__errors-container').appendChild(newError);
};


// Function to add a new error to the localStorage array
function setErrorToArray(newError) {

    errorListed = JSON.parse(localStorage.getItem('errorListed')) || [];
    const existingErrorIndex = errorListed.findIndex(error => error.errorCode === newError.errorCode);
    if (existingErrorIndex !== -1) {
        errorListed[existingErrorIndex].quantity += 1;
    } else {
        errorListed.push(newError);
    }
    localStorage.setItem('errorListed', JSON.stringify(errorListed));

}

// Function to clear all errors from localStorage and the displayed list
function clearErrorsArray() {
    localStorage.removeItem('errorListed');
    errorListed = [];
    document.querySelector('.main__errors-container').innerHTML = '';
}

// Function to remove a specific error from the localStorage array
function removeErrorFromArray(errorCode) {
    errorListed = JSON.parse(localStorage.getItem('errorListed')) || [];
    errorListed = errorListed.filter(error => error.errorCode !== errorCode);
    localStorage.setItem('errorListed', JSON.stringify(errorListed));
}


function errorExists(errorCode) {
    return errorListed.some(error => error.errorCode === errorCode);
}

// Function to clear all errors from the displayed list
let clearErrorsBtn = document.getElementById('clearErrors-btn');
clearErrorsBtn.addEventListener('click', function () {
    clearErrorsArray();
    document.querySelector('.main__errors-container').innerHTML = '';
});


