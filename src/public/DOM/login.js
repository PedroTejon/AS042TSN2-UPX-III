function login(event) {
    event.preventDefault();

    const email = document.getElementById('usermail').value;
    const password = document.getElementById('userpass').value;

    debugger
    console.log(JSON.stringify({
        email: email,
        password: password
    }))
    fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.json()).then(data => {
        if (data.message == 'Usuário logado com sucesso!') {
            window.location.href = '/'
        }
        console.log(data)
    })
}