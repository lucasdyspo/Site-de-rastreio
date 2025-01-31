// Predefinições
const a = true;
const b = false;

// Entrar na URL com o rastreio
const urlParams = new URLSearchParams(window.location.search);
let codeRastreioUrl = urlParams.get("id");
if (codeRastreioUrl) {
    codeRastreioUrl = codeRastreioUrl.toUpperCase();
    getRastreamento(codeRastreioUrl);
}

function OnSubmit(event) {
    event.preventDefault();
    document.getElementById("tipo-postal").innerHTML = "";
    document.getElementById("ship").innerHTML = "";
    document.getElementById("code-rastreio").innerHTML = "";
    const codRastreio = document.querySelector("#rastreio").value;
    getRastreamento(codRastreio);
}

function getRastreamento(codRastreio) {
    if (validate(codRastreio)) {
        document.getElementById("error-rastreio").innerHTML = "";
        try {
            showLoader();
            fetch(`https://rastreio1.fly.dev/rastreioj?codigo=${codRastreio}&a=${a}&b=${b}`)
                .then(response => response.json())
                .then(dataJSON => success(dataJSON))
                .catch(err => error(err));
        } catch (err) {
            console.error(`Erro: ${err.message}`);
        }
    } else {
        document.getElementById("rastreio").value = "";
        document.getElementById("error-rastreio").innerHTML = "Digite o código de rastreio corretamente!";
    }
}

function success(dataJSON) {
    hideLoader();
    if (!dataJSON.hasOwnProperty("mensagem")) {
        document.getElementById("rastreio").value = "";
        document.getElementById("code-rastreio").innerHTML = dataJSON.codigo;
        document.getElementById("tipo-postal").innerHTML = buildCabecalho(dataJSON.tipo, dataJSON.dtPrevista);
        dataJSON.eventos.forEach(evento => {
            document.getElementById("ship").innerHTML += buildItem(
                evento.seta,
                evento.imagem,
                evento.descricao,
                evento.local,
                evento.data
            );
        });
    } else {
        document.getElementById("error-rastreio").innerHTML = dataJSON.mensagem;
        hidePage();
    }
}

function error(err) {
    hidePage();
    document.getElementById("error-rastreio").innerHTML = "Erro de solicitação, tente novamente!";
    console.log("Erro:", err);
}

function validate(codRastreio) {
    const regex = /^[A-Za-z]{2}[0-9]{9}[A-Za-z]{2}$|^[A-Za-z]{2}[0-9]{14}$|^BR/;
    return regex.test(codRastreio);
}

function showLoader() {
    document.getElementById("error-rastreio").innerHTML = "";
    document.getElementById("loader").style.display = "block";
    document.getElementById("form").style.display = "none";
}

function hideLoader() {
    document.getElementById("btnVoltar").style.display = "block";
    document.getElementById("loader").style.display = "none";
}

function hidePage() {
    document.getElementById("rastreio").value = "";
    document.getElementById("tipo-postal").innerHTML = "";
    document.getElementById("ship").innerHTML = "";
    document.getElementById("code-rastreio").innerHTML = "";
    document.getElementById("btnVoltar").style.display = "none";
    document.getElementById("loader").style.display = "none";
    document.getElementById("form").style.display = "block";
}

function buildCabecalho(categoria, dtPrevista) {
    return `<p>${categoria}</p><p>Data prevista: ${dtPrevista}</p>`;
}

function buildItem(seta, img, status, local, data) {
    return `<li>${status} - ${local} - ${data}</li>`;
}
