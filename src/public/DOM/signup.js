function signup(event) {
    event.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById('usermail').value;
    const password = document.getElementById('userpass').value;
    const birthDate = document.getElementById('userbday').value;
    const gender = document.getElementById('usergender').value;

    

    fetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            gender: gender,
            birthDate: birthDate
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.json()).then(data => {
        if (data.message == 'Usuário criado com sucesso!') {
            window.location.href = '/login'
        }
    })
}