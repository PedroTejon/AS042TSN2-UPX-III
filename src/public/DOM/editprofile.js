function loadProfileData() {
    fetch('/api/users/').then(response => response.json()).then(data => {
        if (data.email) {
            const userNameInputElement = document.getElementById('username-form');
            userNameInputElement.value = data.name;
            const birthDateInputElement = document.getElementById('userbday-form');
            const date = new Date(data.birthDate);
            const dateString = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
            birthDateInputElement.value = dateString;
            const genderSelectElement = document.getElementById('gender-select-form')
            switch (data.gender) {
                case 'F':
                case 'Feminino':
                    genderSelectElement.selectedIndex = 0;
                    break;
                case 'M':
                case 'Masculino':
                    genderSelectElement.selectedIndex = 1;
                    break;
                default:
                    genderSelectElement.selectedIndex = 2;
                    break;
            }
        }
    })
}

function editUserDetails(event) {
    event.preventDefault();
    
    const name = document.getElementById('username-form').value;
    const birthDate = document.getElementById('userbday-form').value;
    let gender;
    switch (document.getElementById('gender-select-form').selectedIndex) {
        case 0:
            gender = 'F';
            break;
        case 1:
            gender = 'M';
            break;
        default:
            gender = 'N';
            break;
    }

    fetch('/api/users/', { 
        method: 'POST',
        body: JSON.stringify({
            name: name,
            gender: gender,
            birthDate: birthDate
        }),
        headers: {
            'Content-Type': 'application/json'
        } 
    }).then(response => response.json()).then(data => {
        if (data.message == 'Usuário alterado com sucesso!') {
            window.location.href = '/profile';
        }
    })
}

loadProfileData();
