const form = document.getElementById('form-contato');
const sucessoDiv = document.getElementById('sucesso-envio');

form.addEventListener('submit', (event) => {
    // Bloqueia o envio automático para validar primeiro
    event.preventDefault();

    // Captura dos campos
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const mensagem = document.getElementById('mensagem');

    // Limpeza de estados anteriores
    let formularioValido = true;
    const campos = [nome, email, mensagem];
    
    campos.forEach(campo => {
        campo.classList.remove('invalid');
        document.getElementById(`erro-${campo.id}`).textContent = "";
    });

    // --- VALIDAÇÕES ---

    // 1. Nome (obrigatório)
    if (nome.value.trim() === "") {
        mostrarErro(nome, "O nome não pode estar vazio.");
        formularioValido = false;
    }

    // 2. E-mail (obrigatório e formato válido)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
        mostrarErro(email, "O e-mail é obrigatório.");
        formularioValido = false;
    } else if (!emailRegex.test(email.value)) {
        mostrarErro(email, "Por favor, insira um e-mail válido.");
        formularioValido = false;
    }

    // 3. Mensagem (obrigatório e mín. 10 caracteres)
    if (mensagem.value.trim() === "") {
        mostrarErro(mensagem, "Escreva uma mensagem.");
        formularioValido = false;
    } else if (mensagem.value.trim().length < 10) {
        mostrarErro(mensagem, "A mensagem precisa ter pelo menos 10 caracteres.");
        formularioValido = false;
    }

    // Ação Final
    if (formularioValido) {
        form.style.display = 'none';
        sucessoDiv.style.display = 'block';
        console.log("Sucesso! Dados prontos para envio.");
    }
});

function mostrarErro(campo, texto) {
    campo.classList.add('invalid');
    const span = document.getElementById(`erro-${campo.id}`);
    span.textContent = texto;
}