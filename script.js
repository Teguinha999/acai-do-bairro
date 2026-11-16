
/* ==============================
   CONFIGURAÇÕES DA LOJA
============================== */

// Altere somente esta linha com o endereço de retirada.

const ENDERECO_RETIRADA = "Rua Eurico Freitagas 12 - Riviera Paulista - São Paulo/SP";

/* ==============================
   PRODUTOS DA LOJA
============================== */

const tamanhos = [
    { id: 1, nome: "300 ml", preco: 12.00 },
    { id: 2, nome: "500 ml", preco: 17.00 },
    { id: 3, nome: "700 ml", preco: 22.00 }
];

/* ==============================
   WHATSAPP DA LOJA
============================== */

// Coloque o DDD + número, somente números.
// Exemplo fictício: 5511999999999

const WHATSAPP_LOJA = "5511950326188";

// Taxa adicional para pagamento no cartão.

const TAXA_CARTAO = 1.00;



/* ==============================
   CONFIGURAÇÕES DOS COMPLEMENTOS
============================== */

const complementosGratis = 3;
const precoComplementoExtra = 2.00;

const complementos = [
    { id: 1, nome: "Granola" },
    { id: 2, nome: "Leite em pó" },
    { id: 3, nome: "Paçoca" },
    { id: 4, nome: "Leite condensado" },
    { id: 5, nome: "Banana" },
    { id: 6, nome: "Morango" },
    { id: 7, nome: "Coco ralado" },
    { id: 8, nome: "Amendoim" }
];


/* ==============================
   ADICIONAIS PAGOS
============================== */

const adicionais = [
    { id: 1, nome: "Nutella", preco: 4.00 },
    { id: 2, nome: "Ovomaltine", preco: 3.00 },
    { id: 3, nome: "Kit Kat", preco: 3.00 },
    { id: 4, nome: "Cobertura de chocolate", preco: 2.00 }
];


/* ==============================
   VARIÁVEIS DO CARRINHO
============================== */

let carrinho = [];
let itemEmEdicao = null;
let proximoId = 1;


/* ==============================
   FORMATAÇÃO DE VALORES
============================== */

function formatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

/* ==============================
   CALCULAR TEMPO DE PREPARO
============================== */

function atualizarTempoRetirada() {

    const quantidade = carrinho.length;

    const elemento = document.getElementById("tempo-estimado");

    if (quantidade === 0) {

        elemento.textContent = "Adicione açaís ao carrinho";

        return;
    }

    let minutos;

    if (quantidade === 1) {

        minutos = 15;

    } else {

        minutos = 30 + ((quantidade - 2) * 10);

    }

    elemento.textContent = minutos + " minutos";

}



/* ==============================
   CARREGAR TAMANHOS
============================== */

function carregarTamanhos() {

    const container = document.getElementById("tamanhos");

    container.innerHTML = "";

    tamanhos.forEach(function(tamanho) {

        const opcao = document.createElement("label");

        opcao.className = "opcao-tamanho";

        opcao.innerHTML = `
            <input
                type="radio"
                name="tamanho"
                value="${tamanho.id}"
            >

            <div class="info-tamanho">
                <strong>${tamanho.nome}</strong>
                <span>${formatarPreco(tamanho.preco)}</span>
            </div>
        `;

        container.appendChild(opcao);

    });

}


/* ==============================
   CARREGAR COMPLEMENTOS
============================== */

function carregarComplementos() {

    const container = document.getElementById("complementos");

    container.innerHTML = "";

    complementos.forEach(function(complemento) {

        const opcao = document.createElement("label");

        opcao.className = "opcao-complemento";

        opcao.innerHTML = `
            <input
                type="checkbox"
                name="complemento"
                value="${complemento.id}"
            >

            <span class="nome-complemento">
                ${complemento.nome}
            </span>

            <span class="preco-complemento"></span>
        `;

        opcao.querySelector("input").addEventListener(
            "change",
            atualizarComplementos
        );

        container.appendChild(opcao);

    });

    atualizarComplementos();
}


/* ==============================
   ATUALIZAR COMPLEMENTOS
============================== */

function atualizarComplementos() {

    const selecionados = document.querySelectorAll(
        'input[name="complemento"]:checked'
    );

    const quantidade = selecionados.length;

    const extras = Math.max(
        0,
        quantidade - complementosGratis
    );

    const valorExtra = extras * precoComplementoExtra;

    document.getElementById("quantidade-complementos").textContent =
        quantidade + (quantidade === 1
            ? " complemento selecionado"
            : " complementos selecionados"
        );

    document.getElementById("preco-complementos").textContent =
        formatarPreco(valorExtra);

    document.querySelectorAll(".opcao-complemento").forEach(function(opcao) {

        const checkbox = opcao.querySelector("input");
        const preco = opcao.querySelector(".preco-complemento");

        const posicao = Array.from(selecionados).indexOf(checkbox);

        if (checkbox.checked && posicao >= complementosGratis) {
            preco.textContent = "+ R$ 2,00";
        } else if (checkbox.checked) {
            preco.textContent = "Grátis";
        } else {
            preco.textContent = "";
        }

    });

}


/* ==============================
   CARREGAR ADICIONAIS
============================== */

function carregarAdicionais() {

    const container = document.getElementById("adicionais");

    container.innerHTML = "";

    adicionais.forEach(function(adicional) {

        const opcao = document.createElement("label");

        opcao.className = "opcao-adicional";

        opcao.innerHTML = `
            <input
                type="checkbox"
                name="adicional"
                value="${adicional.id}"
            >

            <span class="nome-adicional">
                ${adicional.nome}
            </span>

            <span class="preco-adicional">
                + ${formatarPreco(adicional.preco)}
            </span>
        `;

        opcao.querySelector("input").addEventListener(
            "change",
            atualizarAdicionais
        );

        container.appendChild(opcao);

    });

    atualizarAdicionais();
}


/* ==============================
   ATUALIZAR ADICIONAIS
============================== */

function atualizarAdicionais() {

    const selecionados = document.querySelectorAll(
        'input[name="adicional"]:checked'
    );

    let total = 0;

    selecionados.forEach(function(item) {

        const adicional = adicionais.find(function(adicional) {
            return adicional.id === Number(item.value);
        });

        if (adicional) {
            total += adicional.preco;
        }

    });

    document.getElementById("preco-adicionais").textContent =
        formatarPreco(total);

}


/* ==============================
   CONTADOR DE OBSERVAÇÕES
============================== */

const campoObservacoes = document.getElementById("observacoes");

campoObservacoes.addEventListener("input", function() {

    document.getElementById("contador-observacoes").textContent =
        campoObservacoes.value.length + "/300";

});


/* ==============================
   OBTER DADOS DO AÇAÍ
============================== */

function obterDadosAcai() {

    const tamanhoSelecionado = document.querySelector(
        'input[name="tamanho"]:checked'
    );

    if (!tamanhoSelecionado) {
        alert("Por favor, escolha o tamanho do açaí.");
        return null;
    }

    const tamanho = tamanhos.find(function(item) {
        return item.id === Number(tamanhoSelecionado.value);
    });

    const idsComplementos = Array.from(
        document.querySelectorAll('input[name="complemento"]:checked')
    ).map(item => Number(item.value));

    const idsAdicionais = Array.from(
        document.querySelectorAll('input[name="adicional"]:checked')
    ).map(item => Number(item.value));

    const quantidadeExtras = Math.max(
        0,
        idsComplementos.length - complementosGratis
    );

    const valorComplementos =
        quantidadeExtras * precoComplementoExtra;

    const valorAdicionais = idsAdicionais.reduce(function(total, id) {

        const adicional = adicionais.find(item => item.id === id);

        return total + (adicional ? adicional.preco : 0);

    }, 0);

    const valorTotal =
        tamanho.preco + valorComplementos + valorAdicionais;

    return {
        tamanhoId: tamanho.id,
        complementos: idsComplementos,
        adicionais: idsAdicionais,
        observacoes: campoObservacoes.value.trim(),
        valorTotal: valorTotal
    };

}


/* ==============================
   ADICIONAR OU SALVAR AÇAÍ
============================== */

function adicionarAoCarrinho() {

    const dados = obterDadosAcai();

    if (!dados) {
        return;
    }

    if (itemEmEdicao !== null) {

        const indice = carrinho.findIndex(
            item => item.id === itemEmEdicao
        );

        if (indice !== -1) {

            carrinho[indice] = {
                id: itemEmEdicao,
                ...dados
            };

        }

        itemEmEdicao = null;

        document.getElementById("adicionar-carrinho").textContent =
            "+ Adicionar ao pedido";

    } else {

        carrinho.push({
            id: proximoId++,
            ...dados
        });

    }

    renderizarCarrinho();
    limparFormulario();

}


/* ==============================
   PROTEÇÃO DE TEXTO
============================== */

function escaparHTML(texto) {

    return String(texto).replace(/[&<>"']/g, function(caractere) {

        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caractere];

    });

}


/* ==============================
   MOSTRAR CARRINHO
============================== */

function renderizarCarrinho() {

    atualizarTempoRetirada();
    atualizarPagamento();

    const container = document.getElementById("lista-carrinho");
    const totalElemento = document.getElementById("total-carrinho");

    container.innerHTML = "";

    if (carrinho.length === 0) {

        container.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        totalElemento.textContent = formatarPreco(0);

        return;
    }

    let totalPedido = 0;

    carrinho.forEach(function(item) {

        const tamanho = tamanhos.find(
            tamanho => tamanho.id === item.tamanhoId
        );

        const nomesComplementos = item.complementos.map(function(id) {
            return complementos.find(c => c.id === id)?.nome;
        }).filter(Boolean);

        const nomesAdicionais = item.adicionais.map(function(id) {
            return adicionais.find(a => a.id === id)?.nome;
        }).filter(Boolean);

        const quantidadeExtras = Math.max(
            0,
            item.complementos.length - complementosGratis
        );

        const valorExtras =
            quantidadeExtras * precoComplementoExtra;

        const valorAdicionais = item.adicionais.reduce(function(total, id) {

            const adicional = adicionais.find(a => a.id === id);

            return total + (adicional ? adicional.preco : 0);

        }, 0);

        totalPedido += item.valorTotal;

        const elemento = document.createElement("div");

        elemento.className = "item-carrinho";

        elemento.innerHTML = `
            <div class="cabecalho-item">

                <span class="nome-item">
                    Açaí ${escaparHTML(tamanho.nome)}
                </span>

                <span class="valor-item">
                    ${formatarPreco(item.valorTotal)}
                </span>

            </div>

            <div class="detalhes-item">

                <div>
                    <strong>Complementos:</strong>
                    ${nomesComplementos.length
                        ? escaparHTML(nomesComplementos.join(", "))
                        : "Nenhum"}
                </div>

                <div>
                    <strong>Valor dos complementos:</strong>
                    ${formatarPreco(valorExtras)}
                </div>

                <div>
                    <strong>Adicionais:</strong>
                    ${nomesAdicionais.length
                        ? escaparHTML(nomesAdicionais.join(", "))
                        : "Nenhum"}
                </div>

                <div>
                    <strong>Valor dos adicionais:</strong>
                    ${formatarPreco(valorAdicionais)}
                </div>

                ${item.observacoes ? `
                    <div class="observacao-item">
                        <strong>Observação:</strong>
                        ${escaparHTML(item.observacoes)}
                    </div>
                ` : ""}

            </div>

            <div class="acoes-item">

                <button
                    type="button"
                    class="botao-editar"
                    data-acao="editar"
                    data-id="${item.id}"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="botao-excluir"
                    data-acao="excluir"
                    data-id="${item.id}"
                >
                    Excluir
                </button>

            </div>
        `;

        container.appendChild(elemento);

    });

    totalElemento.textContent = formatarPreco(totalPedido);

}


/* ==============================
   EDITAR ITEM DO CARRINHO
============================== */

function editarItem(id) {

    const item = carrinho.find(item => item.id === id);

    if (!item) {
        return;
    }

    limparFormulario();

    const tamanho = document.querySelector(
        `input[name="tamanho"][value="${item.tamanhoId}"]`
    );

    if (tamanho) {
        tamanho.checked = true;
    }

    item.complementos.forEach(function(idComplemento) {

        const checkbox = document.querySelector(
            `input[name="complemento"][value="${idComplemento}"]`
        );

        if (checkbox) {
            checkbox.checked = true;
        }

    });

    item.adicionais.forEach(function(idAdicional) {

        const checkbox = document.querySelector(
            `input[name="adicional"][value="${idAdicional}"]`
        );

        if (checkbox) {
            checkbox.checked = true;
        }

    });

    campoObservacoes.value = item.observacoes;

    document.getElementById("contador-observacoes").textContent =
        campoObservacoes.value.length + "/300";

    atualizarComplementos();
    atualizarAdicionais();

    itemEmEdicao = id;

    document.getElementById("adicionar-carrinho").textContent =
        "Salvar alterações";

    document.getElementById("loja").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ==============================
   EXCLUIR ITEM DO CARRINHO
============================== */

function excluirItem(id) {

    carrinho = carrinho.filter(item => item.id !== id);

    if (itemEmEdicao === id) {
        itemEmEdicao = null;
        limparFormulario();

        document.getElementById("adicionar-carrinho").textContent =
            "+ Adicionar ao pedido";
    }

    renderizarCarrinho();

}


/* ==============================
   LIMPAR FORMULÁRIO
============================== */

function limparFormulario() {

    document.querySelectorAll(
        'input[name="tamanho"], input[name="complemento"], input[name="adicional"]'
    ).forEach(function(input) {

        input.checked = false;

    });

    campoObservacoes.value = "";

    document.getElementById("contador-observacoes").textContent =
        "0/300";

    atualizarComplementos();
    atualizarAdicionais();

}


/* ==============================
   EVENTOS DO CARRINHO
============================== */

document.getElementById("adicionar-carrinho").addEventListener(
    "click",
    adicionarAoCarrinho
);

document.getElementById("lista-carrinho").addEventListener(
    "click",
    function(event) {

        const botao = event.target.closest("button[data-acao]");

        if (!botao) {
            return;
        }

        const id = Number(botao.dataset.id);

        if (botao.dataset.acao === "editar") {
            editarItem(id);
        }

        if (botao.dataset.acao === "excluir") {
            excluirItem(id);
        }

    }
);

/* ==============================
   CONTROLE DE PAGAMENTO
============================== */

function obterFormaPagamento() {

    return document.querySelector(
        'input[name="pagamento"]:checked'
    )?.value || "";

}


function atualizarPagamento() {

    const pagamento = obterFormaPagamento();

    const areaTroco = document.getElementById("opcao-troco");
    const campoTroco = document.getElementById("valor-troco-container");

    const subtotal = carrinho.reduce(function(total, item) {
        return total + item.valorTotal;
    }, 0);

    const taxa = pagamento === "Cartão" ? TAXA_CARTAO : 0;

    const total = subtotal + taxa;

    areaTroco.hidden = pagamento !== "Dinheiro";

    if (pagamento !== "Dinheiro") {
        document.getElementById("precisa-troco").value = "";
        document.getElementById("valor-troco").value = "";
    }

    campoTroco.hidden =
        pagamento !== "Dinheiro" ||
        document.getElementById("precisa-troco").value !== "Sim";

    document.getElementById("subtotal-pedido").textContent =
        formatarPreco(subtotal);

    document.getElementById("taxa-pagamento").textContent =
        formatarPreco(taxa);

    document.getElementById("total-final").textContent =
        formatarPreco(total);

}


document.querySelectorAll('input[name="pagamento"]').forEach(function(input) {

    input.addEventListener("change", atualizarPagamento);

});


document.getElementById("precisa-troco").addEventListener(
    "change",
    atualizarPagamento
);

/* ==============================
   FINALIZAR PEDIDO NO WHATSAPP
============================== */

function finalizarPedido() {

    const nome = document.getElementById("nome-cliente").value.trim();

    const telefone = document.getElementById("telefone-cliente").value.trim();

    const pagamento = obterFormaPagamento();

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um açaí ao carrinho.");
        return;
    }

    if (!nome || !telefone) {
        alert("Preencha seu nome e telefone.");
        return;
    }

    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
        alert("Informe um telefone válido com DDD.");
        return;
    }

    if (!pagamento) {
        alert("Selecione uma forma de pagamento.");
        return;
    }

    const subtotal = carrinho.reduce(function(total, item) {
        return total + item.valorTotal;
    }, 0);

    const taxa = pagamento === "Cartão" ? TAXA_CARTAO : 0;

    const total = subtotal + taxa;

    let informacaoTroco = "";

    if (pagamento === "Dinheiro") {

        const precisaTroco = document.getElementById("precisa-troco").value;

        if (!precisaTroco) {
            alert("Informe se precisa de troco.");
            return;
        }

        if (precisaTroco === "Sim") {

            const valorTroco = Number(
                document.getElementById("valor-troco").value
            );

            if (!valorTroco || valorTroco <= total) {
                alert("O valor do troco precisa ser maior que o total do pedido.");
                return;
            }

            informacaoTroco = "\nTroco para: " + formatarPreco(valorTroco);

        } else {

            informacaoTroco = "\nNão precisa de troco.";

        }

    }

    let mensagem = "";

    mensagem += "*NOVO PEDIDO - AÇAÍ DO BAIRRO*\n\n";

    mensagem += "*DADOS DO CLIENTE*\n";
    mensagem += "Nome: " + nome + "\n";
    mensagem += "Telefone: " + telefone + "\n\n";

    mensagem += "*ITENS DO PEDIDO*\n";

    carrinho.forEach(function(item, indice) {

        const tamanho = tamanhos.find(
            tamanho => tamanho.id === item.tamanhoId
        );

        const nomesComplementos = item.complementos.map(function(id) {
            return complementos.find(c => c.id === id)?.nome;
        }).filter(Boolean);

        const nomesAdicionais = item.adicionais.map(function(id) {
            return adicionais.find(a => a.id === id)?.nome;
        }).filter(Boolean);

        mensagem += "\n* Açaí " + (indice + 1) + " - " + tamanho.nome + "*\n";

        mensagem += "Complementos: " +
            (nomesComplementos.join(", ") || "Nenhum") + "\n";

        mensagem += "Adicionais: " +
            (nomesAdicionais.join(", ") || "Nenhum") + "\n";

        if (item.observacoes) {
            mensagem += "Observações: " + item.observacoes + "\n";
        }

        mensagem += "Valor: " + formatarPreco(item.valorTotal) + "\n";

    });

    mensagem += "\n*RETIRADA*\n";
    mensagem += "Endereço: " + ENDERECO_RETIRADA + "\n";
    mensagem += "Previsão: " +
        document.getElementById("tempo-estimado").textContent + "\n";

    mensagem += "\n*PAGAMENTO*\n";
    mensagem += "Forma: " +
        (pagamento === "Cartão"
            ? "Cartão por aproximação"
            : pagamento) + "\n";

    mensagem += "Subtotal: " + formatarPreco(subtotal) + "\n";
    mensagem += "Taxa: " + formatarPreco(taxa) + "\n";
    mensagem += "Total: " + formatarPreco(total) + "\n";

    if (informacaoTroco) {
        mensagem += informacaoTroco + "\n";
    }

    mensagem += "\n_Aguardando confirmação do pedido._";

    const numero = WHATSAPP_LOJA.replace(/\D/g, "");

    if (!/^55\d{10,11}$/.test(numero)) {
        alert("Configure corretamente o número de WhatsApp da loja no JavaScript.");
        return;
    }

    const link = "https://wa.me/" + numero +
        "?text=" + encodeURIComponent(mensagem);

    window.open(link, "_blank");

}


/* ==============================
   BOTÃO FINALIZAR PEDIDO
============================== */

document.getElementById("finalizar-pedido").addEventListener(
    "click",
    finalizarPedido
);




/* ==============================
   INICIALIZAÇÃO
============================== */

carregarTamanhos();
carregarComplementos();
carregarAdicionais();

document.getElementById("endereco-retirada").textContent =
    ENDERECO_RETIRADA;

renderizarCarrinho();

console.log("Açaí do Bairro iniciado com sucesso!");
