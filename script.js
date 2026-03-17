const inputData = document.getElementById("data");
const inputValor = document.getElementById("valor");
const btnAdicionar = document.getElementById("btn-adicionar");
const listaNotas = document.getElementById("lista-notas");
const displayTotal = document.getElementById("valor-total");

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

// Evento de clique no botão
btnAdicionar.addEventListener("click", adicionarNota);

// Evento de apertar Enter no campo de valor
inputValor.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    adicionarNota();
  }
});
