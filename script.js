// --- SELEÇÃO DE ELEMENTOS ---
const inputData = document.getElementById("data");
const inputValor = document.getElementById("valor");
const btnAdicionar = document.getElementById("btn-adicionar");
const listaNotas = document.getElementById("lista-notas");
const displayTotal = document.getElementById("valor-total");

// Elementos da Meta
const inputMeta = document.getElementById("input-meta");
const progressBar = document.getElementById("progress-bar");
const metaStatus = document.getElementById("meta-status");

// Elemento de Download
const btnDownload = document.getElementById("btn-download");

// --- ESTADO DA APLICAÇÃO (DADOS) ---
// Carrega notas do LocalStorage ou inicia vazio
let notas = JSON.parse(localStorage.getItem("minhas_notas")) || [];

// Carrega meta do LocalStorage ou inicia com 0
let metaMensal = parseFloat(localStorage.getItem("meta_mercado")) || 0;
inputMeta.value = metaMensal > 0 ? metaMensal : "";

// Inicializa a tela com os dados salvos
atualizarInterface();

// --- FUNÇÕES DE LÓGICA ---

function atualizarInterface() {
  listaNotas.innerHTML = "";
  let somaTotal = 0;

  // Renderiza a lista de notas
  notas.forEach((nota, index) => {
    // Formata a data de AAAA-MM-DD para DD/MM/AA
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

  // Atualiza o valor total no HTML
  displayTotal.textContent = somaTotal.toFixed(2);

  // SALVA as notas atuais no LocalStorage
  localStorage.setItem("minhas_notas", JSON.stringify(notas));

  // ATUALIZA A META (Onde estava o erro)
  gerenciarMeta(somaTotal);
}

function gerenciarMeta(totalGasto) {
  if (metaMensal <= 0) {
    metaStatus.textContent = "Defina uma meta para acompanhar seu progresso.";
    progressBar.style.width = "0%";
    progressBar.className = "";
    return;
  }

  const porcentagem = (totalGasto / metaMensal) * 100;
  const larguraBarra = Math.min(porcentagem, 100);

  progressBar.style.width = `${larguraBarra}%`;

  // Lógica de cores e mensagens
  if (porcentagem >= 100) {
    progressBar.className = "barra-perigo";
    metaStatus.className = "meta-perigo";
    metaStatus.textContent = `⚠️ Meta atingida! (${porcentagem.toFixed(1)}%)`;
  } else if (porcentagem >= 80) {
    progressBar.className = "barra-atencao";
    metaStatus.className = "";
    metaStatus.textContent = `Atenção: ${porcentagem.toFixed(1)}% da meta utilizada.`;
  } else {
    progressBar.className = "";
    metaStatus.className = "";
    metaStatus.textContent = `Você gastou ${porcentagem.toFixed(1)}% da sua meta.`;
  }
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

  let conteudo = "--- CONTROLE DE MERCADO ---\n\n";
  let somaTotal = 0;

  notas.forEach((nota) => {
    const partes = nota.data.split("-");
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    conteudo += `Data: ${dataFormatada} | Valor: R$ ${nota.valor.toFixed(2)}\n`;
    somaTotal += nota.valor;
  });

  conteudo += `\nTOTAL: R$ ${somaTotal.toFixed(2)}\nMETA: R$ ${metaMensal.toFixed(2)}`;

  const blob = new Blob([conteudo], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const hoje = new Date().toLocaleDateString("pt-BR").replaceAll("/", "-");

  a.href = url;
  a.download = `resumo-mercado-${hoje}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// --- EVENT LISTENERS (OUVINTES) ---

btnAdicionar.addEventListener("click", adicionarNota);

inputValor.addEventListener("keypress", (e) => {
  if (e.key === "Enter") adicionarNota();
});

inputMeta.addEventListener("input", (e) => {
  metaMensal = parseFloat(e.target.value) || 0;
  localStorage.setItem("meta_mercado", metaMensal);
  atualizarInterface(); // Recalcula tudo com a nova meta
});

btnDownload.addEventListener("click", baixarResumo);
