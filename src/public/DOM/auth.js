function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

let authenticated = false;
if (getCookie('userId')) {
  fetch('/api/users/').then(response => response.json()).then(data => {
    if (data.email) {
      authenticated = true;
      const profileContainer = document.querySelector('.profile-info');
      profileContainer.innerHTML = `<div class="pfp-div">
      <img src="../assets/common/pfp-icon.png" alt="Foto de perfil padrão" class="unselectable" draggable="false" >
  </div>
  <div class="userinfo-div unselectable" draggable="false" >
      <p id="username">${data.name}</p>
      <a id="see-profile" draggable="false" href="/profile">Ver meu perfil</a>
  </div>`
    }
  })
}
