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
  
if (getCookie('userId')) {
  fetch('/api/users/').then(response => response.json()).then(data => {
    if (data.email) {
      const profileContainer = document.querySelector('.profile-info');
      profileContainer.innerHTML = `<div class="pfp-div">
      <img src="../assets/common/pfp-icon.png" alt="Foto de perfil padrão" class="unselectable" draggable="false" >
  </div>
  <div class="userinfo-div unselectable" draggable="false" >
      <p id="username">${data.name}</p>
      <a id="see-profile" draggable="false" href="/profile">Ver meu perfil</a>
  </div>`
    }
    // if (data.error) {
    //   console.log(data.error);
    // } else {
    //   let user = data.user;
    //   let name = document.getElementById('name');
    //   let email = document.getElementById('email');
    //   let phone = document.getElementById('phone');
    //   let cpf = document.getElementById('cpf');
    //   let birthdate = document.getElementById('birthdate');
    //   let address = document.getElementById('address');
    //   let city = document.getElementById('city');
    //   let state = document.getElementById('state');
    //   let country = document.getElementById('country');
    //   let zip = document.getElementById('zip');
    //   let products = document.getElementById('products');
    //   name.value = user.name;
    //   email.value = user.email;
    //   phone.value = user.phone;
    //   cpf.value = user.cpf;
    //   birthdate.value = user.birthdate;
    //   address.value = user.address;
    //   city.value = user.city;
    //   state.value = user.state;
    //   country.value = user.country;
    //   zip.value = user.zip;
    //   products.value = user.products;
    // }
  })
}
