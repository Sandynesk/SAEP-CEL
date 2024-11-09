async function handleLogin(email, senha) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login realizado com sucesso!");

            // Atualiza a navbar com o nome do usuário
            updateUserName();

            // Redireciona para a página principal
            window.location.href = '/';  // A página de destino após o login bem-sucedido
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
}

function updateUserName() {
    const userNameSpan = document.querySelector('#userName');

    // Faz uma requisição para verificar a sessão do usuário
    fetch('/profile')
        .then((response) => response.json())
        .then((data) => {
            if (data.user) {
                userNameSpan.textContent = `Bem-vindo, ${data.user.nome}`;
            } else {
                userNameSpan.textContent = 'Bem-vindo, visitante';
            }
        })
        .catch(() => {
            userNameSpan.textContent = 'Bem-vindo, visitante';
        });
}

// Atualiza o nome ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateUserName();
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/profile', {
            method: 'GET',
            credentials: 'same-origin'  // Envia os cookies da sessão
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Dados do usuário:', data.user);
            const userProfile = document.querySelector('#userProfile');
            userProfile.innerHTML = `
                <h1>Bem-vindo, ${data.user.nome}</h1>
                <p>Email: ${data.user.email}</p>
                <p>ID: ${data.user.id}</p>
            `;
        } else {
            alert(data.message);  // Se não estiver logado, mostra a mensagem
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
});
