const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sEmail = document.querySelector('#m-email');
const sCpf = document.querySelector('#m-cpf');
const sLatitude = document.querySelector('#m-latitude');
const sLongitude = document.querySelector('#m-longitude');
const sTipoLavoura = document.querySelector('#m-tipo-lavoura');
const sDataColheita = document.querySelector('#m-data-colheita');
const sEventoOcorrido = document.querySelector('#m-evento-ocorrido');
const btnSalvar = document.querySelector('#btnSalvar');

let itens = [];
let id;

loadItens();
async function getComunicacoes() {
    try {
        const response = await fetch("http://127.0.0.1:8000/comunicacoes");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        sNome.value = itens[index].nome;
        sEmail.value = itens[index].email;
        sCpf.value = itens[index].cpf;
        sLatitude.value = itens[index].latitude;
        sLongitude.value = itens[index].longitude;
        sTipoLavoura.value = itens[index].tipo_lavoura;
        sDataColheita.value = itens[index].data_colheita;
        sEventoOcorrido.value = itens[index].evento_ocorrido;
        id = itens[index].id; // Use o ID real do item do banco de dados
    } else {
        sNome.value = '';
        sEmail.value = '';
        sCpf.value = '';
        sLatitude.value = '';
        sLongitude.value = '';
        sTipoLavoura.value = '';
        sDataColheita.value = '';
        sEventoOcorrido.value = '';
        id = undefined;
    }
}

function editItem(index) {
    openModal(true, index);
}

async function deleteItem(index) {
    try {
        await fetch(`http://127.0.0.1:8000/comunicacoes/${itens[index].id}`, {
            method: 'DELETE'
        });
        loadItens();
    } catch (error) {
        console.error('There was an error deleting the item:', error);
    }
}

function insertItem(item, index) {
    let tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.email}</td>
        <td>${item.cpf}</td>
        <td>${item.latitude}</td>
        <td>${item.longitude}</td>
        <td>${item.tipo_lavoura}</td>
        <td>${item.data_colheita}</td>
        <td>${item.evento_ocorrido}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

btnSalvar.onclick = async e => {
    e.preventDefault();

    if (sNome.value == '' || sEmail.value == '' || sCpf.value == '' || sLatitude.value == '' || sLongitude.value == '' || sTipoLavoura.value == '' || sDataColheita.value == '' || sEventoOcorrido.value == '') {
        return;
    }

    const newItem = {
        nome: sNome.value,
        email: sEmail.value,
        cpf: sCpf.value,
        latitude: parseFloat(sLatitude.value),
        longitude: parseFloat(sLongitude.value),
        tipo_lavoura: sTipoLavoura.value,
        data_colheita: sDataColheita.value,
        evento_ocorrido: sEventoOcorrido.value
    };

    if (id !== undefined) {
        // Edit item
        try {
            await fetch(`http://127.0.0.1:8000/comunicacoes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
        } catch (error) {
            console.error('There was an error updating the item:', error);
        }
    } else {
        // Create new item
        try {
            await fetch("http://127.0.0.1:8000/comunicacoes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
        } catch (error) {
            console.error('There was an error creating the item:', error);
        }
    }

    modal.classList.remove('active');
    loadItens();
    id = undefined;
};

async function loadItens() {
    itens = await getComunicacoes();
    console.log(itens);
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
}