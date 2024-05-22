function codeConfirmation(event) {
    event.preventDefault();

    const code = document.getElementById('mailcode').value;

    fetch('/api/users/confirmCode', {
        method: 'POST',
        body: JSON.stringify({
            requestCode: code
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.json()).then(data => {
        console.log(data)
        debugger
        if (data.message == 'Código correto') {
            window.location.href = '/newpassword'
        }
    })
}