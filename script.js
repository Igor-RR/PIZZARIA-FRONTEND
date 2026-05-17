/* ============================================================
   CONFIGURAÇÃO INICIAL E PERSISTÊNCIA (LocalStorage)
   ============================================================ */

// 1. Tenta recuperar os dados salvos. Se não houver, inicia array vazio.

let pedidos = JSON.parse(localStorage.getItem('carrinho_pizzaria')) || [];

// Função para salvar o estado atual no navegador

function salvarLocalStorage() {
    localStorage.setItem('carrinho_pizzaria', JSON.stringify(pedidos));
}

/* =========================
   ELEMENTOS DO DOM
========================= */

const carrinhoIcone = document.getElementById('carrinho');
const listaPedidosUI = document.getElementById('lista-pedidos');
const modal = document.querySelector('.modal');
const totalPrecoEl = document.getElementById('total-preco');
const totalQuantidadeEl = document.getElementById('total-quantidade');
const botaoFechar = document.getElementById('botao-modal-fechar');
const botaoFinalizar = document.getElementById('botao-modal-finalizar');
const botoesPedir = document.querySelectorAll('.pedir');

/* ============================================================
   LÓGICA DE COLETA DOS PEDIDOS
   ============================================================ */

botoesPedir.forEach(botao => {
    botao.addEventListener('click', (event) => {
        const card = event.currentTarget.closest('.card');
        const sabor = card.querySelector('.titulo-card').textContent;
        const precoTexto = card.querySelector('.preco').textContent;
        
        // Converte "R$ 50,00" para o número 50.00
        const preco = parseFloat(precoTexto.replace('R$ ', '').replace(',', '.'));

        const itemExistente = pedidos.find(item => item.sabor === sabor);

        if (!itemExistente) {
            // Adiciona se o item não existir
            pedidos.push({
                sabor: sabor,
                preco: preco,
                quantidade: 1
            });
        } else {
            // Se não, soma a quantidade
            itemExistente.quantidade++;
        }

        // Salva no LocalStorage após adicionar
        salvarLocalStorage();
        alert(`${sabor} adicionado ao carrinho!`);
        atualizarTotaisInterface();
    });
});

/* ============================================================
   FUNÇÕES DE CÁLCULO E INTERFACE
   ============================================================ */

function calcularTotais(lista) {
    return lista.reduce((acc, item) => {
        acc.totalPreco += item.preco * item.quantidade;
        acc.totalQuantidade += item.quantidade;
        return acc;
    }, { totalPreco: 0, totalQuantidade: 0 });
}

function atualizarTotaisInterface() {
    const totais = calcularTotais(pedidos);
    
    totalPrecoEl.textContent = totais.totalPreco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    totalQuantidadeEl.textContent = totais.totalQuantidade;
}

/* ============================================================
   RENDERIZAÇÃO DO CARRINHO (MODAL)
   ============================================================ */

function renderizarCarrinho() {
    listaPedidosUI.innerHTML = ""; // Limpa a lista antes de desenhar

    pedidos.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = "item-carrinho"; 

        // Texto com informações da pizza
        const infoTexto = document.createElement('span');
        const subtotal = item.preco * item.quantidade;
        infoTexto.textContent = `${item.sabor} (x${item.quantidade}) - ${subtotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })}`;

        // Imagem de Excluir (Botão)
        const imgExcluir = document.createElement('img'); 
        imgExcluir.src = "assets/excluir.jpeg";
        imgExcluir.alt = "Remover item";
        imgExcluir.title = "Remover do carrinho";
        
        // Evento de remover
        imgExcluir.addEventListener('click', () => {
            pedidos.splice(index, 1); // Remove do array
            salvarLocalStorage();     // Atualiza o LocalStorage
            renderizarCarrinho();     // Recria a lista na tela
            atualizarTotaisInterface(); // Atualiza os preços
        });

        // Montagem do elemento
        li.appendChild(infoTexto);
        li.appendChild(imgExcluir);
        listaPedidosUI.appendChild(li);
    });

    atualizarTotaisInterface();
}

/* ============================================================
   CONTROLE DO MODAL
   ============================================================ */

carrinhoIcone.addEventListener('click', () => {
    modal.style.display = 'block';
    renderizarCarrinho();
});

botaoFechar.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

/* ============================================================
   FINALIZAR PEDIDO
   ============================================================ */

botaoFinalizar.addEventListener('click', () => {
    if (pedidos.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Substitui o conteúdo do modal pela mensagem de confirmação
    const conteudoModal = document.querySelector('.modal .content');
    conteudoModal.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 20px;
            text-align: center;
        ">
            <span style="font-size: 5rem;">✅</span>
            <h2 style="color: darkgreen;">Pedido enviado com sucesso!</h2>
            <p style="color: #555;">Em breve sua pizza estará na sua mesa. 🍕</p>
            <button onclick="location.reload()" style="
                padding: 12px 30px;
                background-color: orange;
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
            ">Fazer novo pedido</button>
        </div>
    `;

    // Limpa o carrinho
    pedidos = [];
    salvarLocalStorage();
    atualizarTotaisInterface();
});

/* ============================================================
   INICIALIZAÇÃO AO CARREGAR A PÁGINA
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Garante que os totais apareçam corretamente logo no início
    atualizarTotaisInterface();
});