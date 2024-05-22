function confirmPasswordChange(event) {
    event.preventDefault();
    debugger
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password == confirmPassword) {
        debugger
        fetch('/api/users/confirmPassChange', {
            method: 'POST',
            body: JSON.stringify({
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then(response => response.json()).then(data => {
            if (data.message == 'Senha alterada com sucesso') {
                window.location.href = '/login'
            }
        })
    }
}