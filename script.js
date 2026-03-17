const inputData = document.getElementById("data");
const inputValor = document.getElementById("valor");
const btnAdicionar = document.getElementById("btn-adicionar");
const listaNotas = document.getElementById("lista-notas");
const displayTotal = document.getElementById("valor-total");
const btnDownload = document.getElementById("btn-download");

// 1. Tenta carregar os dados do localStorage ao iniciar, ou cria um array vazio
let notas = JSON.parse(localStorage.getItem("minhas_notas")) || [];

// Chamada inicial para renderizar o que já estiver salvo
atualizarInterface();

function atualizarInterface() {
  listaNotas.innerHTML = "";
  let somaTotal = 0;

  notas.forEach((nota, index) => {
    // Formata a data para dd/mm/aa
    const partes = nota.data.split("-");
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0].slice(-2)}`;

    const li = document.createElement("li");
    li.innerHTML = `
    <span>${dataFormatada} - R$ ${nota.valor.toFixed(2)}</span>
    <button class="btn-remover" onclick="removerNota(${index})">Remover</button>
`;
    listaNotas.appendChild(li);
    somaTotal += nota.valor;
  });

  displayTotal.textContent = somaTotal.toFixed(2);

  // 2. Salva o estado atual no localStorage sempre que a interface atualiza
  localStorage.setItem("minhas_notas", JSON.stringify(notas));
}

function adicionarNota() {
  const data = inputData.value;
  const valor = parseFloat(inputValor.value);

  if (data && !isNaN(valor)) {
    notas.push({ data, valor });
    inputValor.value = "";
    atualizarInterface();
    inputData.focus();
  } else {
    alert("Por favor, preencha a data e o valor corretamente.");
  }
}

function removerNota(index) {
  if (confirm("Deseja remover esta nota?")) {
    notas.splice(index, 1);
    atualizarInterface();
  }
}

function baixarResumo() {
  if (notas.length === 0) {
    alert("Não há notas para baixar.");
    return;
  }

  // Criando o cabeçalho do arquivo
  let conteudo = "--- CONTROLE DE MERCADO ---\n\n";
  let somaTotal = 0;

  // Percorrendo as notas para montar o texto
  notas.forEach((nota) => {
    const partes = nota.data.split("-");
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    conteudo += `Data: ${dataFormatada} | Valor: R$ ${nota.valor.toFixed(2)}\n`;
    somaTotal += nota.valor;
  });

  conteudo += `\n---------------------------\n`;
  conteudo += `TOTAL ACUMULADO: R$ ${somaTotal.toFixed(2)}`;

  // Criando o arquivo para download
  const blob = new Blob([conteudo], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  // Configurando o nome do arquivo com a data atual
  const hoje = new Date().toLocaleDateString("pt-BR").replaceAll("/", "-");
  a.href = url;
  a.download = `resumo-mercado-${hoje}.txt`;

  // Simula o clique para baixar
  a.click();

  // Limpa a memória
  window.URL.revokeObjectURL(url);
}

btnDownload.addEventListener("click", baixarResumo);

// Evento de clique no botão
btnAdicionar.addEventListener("click", adicionarNota);

// Evento de apertar Enter no campo de valor
inputValor.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    adicionarNota();
  }
});
