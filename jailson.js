//Entrar na URL com o rastreio
var url_string = window.location.href;
var url = new URL(url_string);
var codeRastreioUrl = url.searchParams.get("id");
if (codeRastreioUrl != null) {
  codeRastreioUrl = codeRastreioUrl.toUpperCase();
  getRastreamento(codeRastreioUrl);
}
else {
  codeRastreioUrl = "";
}

function buildCabecalho(categoria, dtPrevista) {
  var html = "";
  html += `            <div class="arrow-dashed">`;
  html += `              <div class="circle">`;
  if(categoria == "Xpress"){
    html += `                <img class="circle-img" src="https://cdn-icons-png.flaticon.com/512/726/726455.png" width="35px" height="35px" />`;
  }else{
    html += `                <img class="circle-img" src="https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/correios-sf.png" width="35px" height="35px" />`;
  }
  html += `              </div>`;
  html += `            </div>`;
  html += `            <div class="cabecalho-content">`;
  html += `              <p class="text text-content">${categoria}</p>`;
  html += `                <p class="text text-content">Data prevista: ${dtPrevista}</p>`;
  html += `            </div>`;
  return html;
}

function buildItem(seta, img, status, local, data) {
    var html = "";
    html += `<li class="step">`;
    html += `              <div class="${seta}">`;
    html += `                <div class="circle">`;
    html += `                  <img class="circle-img" src="https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/${img}">`;
    html += `                </div>`;
    html += `              </div>`;
    html += `              <div class="step-content">`;
    html += `                <p class="text text-head">${status}</p>`;
    local.forEach(function (linha) {
      if (typeof linha === 'object' && linha !== null)
        html += `                <p class="text text-head">${linha.detalhe}</p>`;
      else
        html += `                <p class="text text-content">${linha}</p>`;
    });
    html += `                <p class="text text-content">${data}</p>`;
    html += `              </div>`;
    html += `</li>`;
    return html;
  }

// função para tratar o sucesso
function success() {
  try {
    var dataJSON = JSON.parse(this.responseText).data;
    if (!dataJSON.hasOwnProperty("mensagem")) {
      hideLoader();
      document.getElementById("rastreio").value = "";
      document.getElementById("code-rastreio").innerHTML = dataJSON.codigo;
      document.getElementById("tipo-postal").innerHTML = buildCabecalho(dataJSON.tipo, dataJSON.dtPrevista);
      dataJSON.eventos.forEach(function (item, index) {
        document.getElementById("ship").innerHTML += buildItem(
          item.seta,
          item.imagem,
          item.descricao,
          item.local,
          item.data
        );
      });
    } else {
      document.getElementById("error-rastreio").innerHTML = dataJSON.mensagem;
      hidePage();
    }
  } catch (err) {
    error(err);
  }
}

// função para tratar o erro
function error(err) {
  hidePage();
  document.getElementById("error-rastreio").innerHTML = "Erro de solicitação, tente novamente!";
  console.log("Erro de solicitação", err); //os detalhes do erro estarão no objeto "err"
}

function OnSubmit() {
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
        var xhr = new XMLHttpRequest(); //invocar uma nova instância de XMLHttpRequest
        xhr.onload = success; // chamar a função success se a solicitação for um sucesso
        xhr.onerror = error; // chamar a função error se a solicitação der errado
        xhr.open("GET", `https://rastreio1.fly.dev/rastreioj?codigo=${codRastreio}&a=${a}&b=${b}`); // abrir uma solicitação
        xhr.send(); // enviar a solicitação ao servidor.
      } catch (err) {
        console.error(`Error: ${err.value}`);
      }
    } else {
      document.getElementById("rastreio").value = "";
      document.getElementById("error-rastreio").innerHTML =
        "Digite o código de rastreio corretamente!";
    }
  }
  
  function validate(codRastreio) {
    var codRastreioRGEX = /^[A-Za-z]{2}[0-9]{9}[A-Za-z]{2}$|^[A-Za-z]{2}[0-9]{14}$|^BR/;
    return codRastreioRGEX.test(codRastreio);
  }

function showLoader() {
  document.getElementById("error-rastreio").innerHTML ="";
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