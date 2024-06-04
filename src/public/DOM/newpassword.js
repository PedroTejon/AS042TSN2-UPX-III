function confirmPasswordChange(event) {
    event.preventDefault();
    
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password == confirmPassword && password != '' && password.match('[*@-$&!%#]+') && password.match('[A-Z]+') && password.match('[a-z]+') && password.length >= 8) {
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
    } else {
        document.getElementById('fillCorrectly').style.display = 'flex';
    }
}