function loadUser() {
    fetch('/api/users/').then(response => response.json()).then(data => {
        if (data.email) {
            const usernameElement = document.getElementById('username-profile');
            usernameElement.textContent = data.name;
            const birthdateElement = document.getElementById('birthdate-profile');
            birthdateElement.textContent = data.birthDate.substring(0, 10).replaceAll('-', '/');
            const genderElement = document.getElementById('gender-profile');
            genderElement.textContent = data.gender;
            const emailElement = document.getElementById('email-profile');
            emailElement.textContent = data.email;
        }
    })
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function logout() {
    setCookie('userId', '', -1);
    setCookie('sessHash', '', -1);
    window.location.href = '/';
}

loadUser();