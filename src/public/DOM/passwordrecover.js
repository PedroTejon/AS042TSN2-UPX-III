function passwordRecovery(event) {
    event.preventDefault();

    const email = document.getElementById('usermail').value;

    fetch('/api/users/requestPassChange', {
        method: 'POST',
        body: JSON.stringify({
            email: email
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.json()).then(data => {
        if (data.message == 'Solicitação de troca de senha feita com sucesso.') {
            window.location.href = '/emailcode'
        }
    })
}