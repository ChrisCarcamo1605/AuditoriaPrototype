window.addEventListener("load", () => loadDefectos());

class Defecto {
    errorCode;
    errorDescription;
    quantity;

    constructor(errorCode, errorDescription, quantity) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.quantity = quantity;
    }
}

const defectosFijos = [
    { codigo: "E001", descripcion: "defecto de documentación" },
    { codigo: "E002", descripcion: "Fallo en procedimiento" },
    { codigo: "E003", descripcion: "Incumplimiento de seguridad" },
    { codigo: "E004", descripcion: "defecto de etiquetado" },
    { codigo: "E005", descripcion: "Material incorrecto" },
    { codigo: "E006", descripcion: "Falta de limpieza" },
    { codigo: "E007", descripcion: "Equipo defectuoso" }
];

//Initialize defecto search and list
let defectosGuardados = [];
const defectoSearch = document.getElementById('DefectoSearch');
const defectoList = document.getElementById('DefectoList');
const defectoCodeField = document.getElementById('DefectoCode');

defectoSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    defectoList.innerHTML = '';

    if (query.length === 0) return;
    const filtrados = defectosFijos.filter(e => e.descripcion.toLowerCase().includes(query));

    filtrados.forEach(defecto => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-group-item list-group-item-action';
        item.textContent = `${defecto.descripcion} (${defecto.codigo})`;
        item.onclick = () => {
            defectoSearch.value = defecto.descripcion;
            defectoCodeField.value = defecto.codigo;
            defectoList.innerHTML = '';
        };
        defectoList.appendChild(item);
    });
});

// Add event listener to the button to add defectos
let addDefectoBtn = document.getElementById('addDefecto-btn');
addDefectoBtn.addEventListener('click', function () {
    let defectoCode = defectoCodeField.value;
    let defectoDescription = defectoSearch.value;

    if (defectoCode && defectoDescription) {
        setDefectoToArray(new Defecto(defectoCode, defectoDescription, 1));
        defectoCodeField.value = '';
        defectoSearch.value = '';
        defectoList.innerHTML = ''; // Clear the list after adding

        let modalElement = document.querySelector('#DefectoFormModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        }

        loadDefectos();

    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Function to load defectos from localStorage and display them
let loadDefectos = () => {
    document.querySelector(".main__defectos-container").innerHTML = '';
    defectosGuardados = [];
    let defectos = localStorage.getItem('defectosGuardados');

    if (defectos) {
        defectosGuardados = JSON.parse(defectos);

        // If the parsed value is not an array, wrap it in an array
        if (!Array.isArray(defectosGuardados)) {
            defectosGuardados = [defectosGuardados];
        }

        defectosGuardados.forEach(defecto => { loadDefectoHtml(defecto) });
    } else {
        return;
    }
}

// Function to create and display a defecto HTML element
let loadDefectoHtml = (defecto) => {
    let newDefecto = document.createElement('div');
    newDefecto.className = 'defecto_data-group';
    newDefecto.innerHTML = `  
        <div class="defecto__data-container"> 
            <label class="defecto__title">Defecto:</label>
            <label class="defecto__uneditable-text">${defecto.errorDescription}</label>
        </div>
        <div class="defecto__data-container">
            <label class="defecto__title">Código:</label>
            <label class="defecto__uneditable-text">${defecto.errorCode}</label>
        </div>
        <input class="defecto__input" type="number" id="quantity" placeholder="Puntos Penalizados" value="${defecto.quantity}">
    `;

    let divButtons = document.createElement('div');
    divButtons.className = 'defecto__container-buttons';

    let deleteBtn = document.createElement('ion-icon');
    deleteBtn.setAttribute('name', 'trash-outline');
    deleteBtn.addEventListener('click', function () {
        newDefecto.remove();
        removeDefectoFromArray(defecto.errorCode);
    });

    divButtons.appendChild(deleteBtn);
    newDefecto.appendChild(divButtons);

    document.querySelector('.main__defectos-container').appendChild(newDefecto);
};

// Function to add a new defecto to the localStorage array
function setDefectoToArray(newDefecto) {
    let defectosGuardados = [];
    let stored = localStorage.getItem('defectosGuardados');
    if (stored) {
        try {
            defectosGuardados = JSON.parse(stored);
            if (!Array.isArray(defectosGuardados)) defectosGuardados = [];
        } catch {
            defectosGuardados = [];
        }
    }

    const existingDefectoIndex = defectosGuardados.findIndex(defecto => defecto.errorCode === newDefecto.errorCode);
    if (existingDefectoIndex !== -1) {
        defectosGuardados[existingDefectoIndex].quantity += 1;
    } else {
        defectosGuardados.push(newDefecto);
    }
    localStorage.setItem('defectosGuardados', JSON.stringify(defectosGuardados));
}

// Function to clear all defectos from localStorage and the displayed list
function clearDefectosArray() {
    localStorage.removeItem('defectosGuardados');
    defectosGuardados = [];
    document.querySelector('.main__Defectos-container').innerHTML = '';
}

// Function to remove a specific defecto from the localStorage array
function removeDefectoFromArray(errorCode) {
    let defectosGuardados = [];
    let stored = localStorage.getItem('defectosGuardados');
    if (stored) {
        try {
            defectosGuardados = JSON.parse(stored);
            if (!Array.isArray(defectosGuardados)) defectosGuardados = [];
        } catch {
            defectosGuardados = [];
        }
    }
    defectosGuardados = defectosGuardados.filter(defecto => defecto.errorCode !== errorCode);
    localStorage.setItem('defectosGuardados', JSON.stringify(defectosGuardados));
}

function defectoExists(errorCode) {
    let defectosGuardados = [];
    let stored = localStorage.getItem('defectosGuardados');
    if (stored) {
        try {
            defectosGuardados = JSON.parse(stored);
            if (!Array.isArray(defectosGuardados)) defectosGuardados = [];
        } catch {
            defectosGuardados = [];
        }
    }
    return defectosGuardados.some(defecto => defecto.errorCode === errorCode);
}

// Function to clear all defectos from the displayed list
let clearDefectosBtn = document.getElementById('clearDefectos-btn');
clearDefectosBtn.addEventListener('click', function () {
    clearDefectosArray();
    document.querySelector('.main__Defectos-container').innerHTML = '';
});


