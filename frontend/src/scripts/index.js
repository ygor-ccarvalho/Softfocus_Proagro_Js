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
        id = itens[index].id; 
        console.log('Edit mode - ID:', id); 
    } else {
        sNome.value = '';
        sEmail.value = '';
        sCpf.value = '';
        sLatitude.value = '';
        sLongitude.value = '';
        sDataColheita.value = '';
        id = undefined;
        console.log('Create mode - ID:', id);
    }
}

function editItem(index) {
    openModal(true, index);
}

async function deleteItem(index) {
    const id = itens[index].id;
    console.log('Delete - ID:', id);
    if (!id) {
        console.error('ID está indefinido ou nulo');
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/comunicacoes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao excluir comunicação');
        }
        const result = await response.json();
        alert(result.message);
        loadItens();
    } catch (error) {
        console.error('Erro ao excluir comunicação:', error);
        alert('Erro ao excluir comunicação');
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
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
        
    `;
    tbody.appendChild(tr);
}

btnSalvar.onclick = async e => {
    e.preventDefault();

    if (sNome.value === '' || sEmail.value === '' || sCpf.value === '' || sLatitude.value === '' || sLongitude.value === '' || sDataColheita.value === '') {
        return alert('Existem campos obrigatórios não preenchidos!');
    } else if (!validaCPF(sCpf.value)) {
        return alert('CPF inválido!');
    } else if (!validatelocale(sLatitude.value, sLongitude.value)) {
        return alert("Latitude ou longitude inválidas!");
    }

    const newItem = {
        nome: sNome.value,
        email: sEmail.value,
        cpf: sCpf.value,
        latitude: parseFloat(sLatitude.value),
        longitude: parseFloat(sLongitude.value),
        tipo_lavoura: sTipoLavoura.value,
        data_colheita: sDataColheita.value,
        evento_ocorrido: sEventoOcorrido.value,
    };

    try {
        if (id !== undefined) {
            console.log('Edit mode - ID:', id); // Adicione este log para verificar o ID
            const response = await fetch(`http://127.0.0.1:8000/comunicacoes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar comunicação');
            }
        } else {
            console.log('Create mode - ID:', id); // Adicione este log para verificar o ID
            const response = await fetch("http://127.0.0.1:8000/comunicacoes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) {
                throw new Error('Erro ao criar comunicação');
            }
        }

        modal.classList.remove('active');
        loadItens();
        id = undefined;
    } catch (error) {
        console.error('Erro ao salvar comunicação:', error);
        alert('Erro ao salvar comunicação');
    }
};


    

async function loadItens() {
    itens = await getComunicacoes();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
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
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}


function validaCPF(sCpf) {
    var Soma = 0
    var Resto

    var strCPF = String(sCpf).replace(/[^\d]/g, '')

    if (strCPF.length !== 11)
        return false

    if ([
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ].indexOf(strCPF) !== -1)
        return false

    for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    Resto = (Soma * 10) % 11

    if ((Resto == 10) || (Resto == 11))
        Resto = 0

    if (Resto != parseInt(strCPF.substring(9, 10)))
        return false

    Soma = 0

    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)

    Resto = (Soma * 10) % 11

    if ((Resto == 10) || (Resto == 11))
        Resto = 0

    if (Resto != parseInt(strCPF.substring(10, 11)))
        return false

    return true
}

function convertDMSToDecimal(dms) {
    const regex = /^-?(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)"?$/;
    const match = dms.match(regex);

    if (!match) {
        return null; // Invalid format
    }

    const degrees = parseFloat(match[1]);
    const minutes = parseFloat(match[2]);
    const seconds = parseFloat(match[3]);
    const decimal = degrees + (minutes / 60) + (seconds / 3600);

    return dms.startsWith('-') ? -decimal : decimal;
}

function validatelocale(latitude, longitude) {
    const lat = parseFloat(latitude) || convertDMSToDecimal(latitude);
    const lon = parseFloat(longitude) || convertDMSToDecimal(longitude);

    if (lat === null || lon === null) {
        return false; 
    }

    const latRegex = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)$/;
    const lonRegex = /^-?((1[0-7][0-9](\.\d+)?)|([1-9]?[0-9](\.\d+)?)|180(\.0+)?)$/;

    return latRegex.test(lat) && lonRegex.test(lon);
}

document.getElementById('search-btn').addEventListener('click', async () => {
    const cpf = document.getElementById('cpf-search').value;
    if (cpf === '') {
        alert('Por favor, insira um CPF.');
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/comunicacoes/${cpf}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        displaySearchResults(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

function displaySearchResults(data) {
    tbody.innerHTML = ''; // Clear previous results
    if (data.length === 0) {
        alert('Nenhuma comunicação encontrada para o CPF fornecido.');
        return;
    }

    data.forEach((item, index) => {
        insertItem(item, index);
    });
}

function displaySearchResults(data) {
    tbody.innerHTML = ''; 
    if (data.length === 0) {
        alert('Nenhuma comunicação encontrada para o CPF fornecido.');
        return;
    }

    data.forEach((item, index) => {
        insertItem(item, index);
    });
}