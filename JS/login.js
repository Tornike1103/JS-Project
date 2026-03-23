let form = document.querySelector(`#registration`);
let phone = document.querySelector(`#phone`);
let password = document.querySelector(`#password`);

console.log(localStorage.getItem("token"));

form.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch(`https://rentcar.stepprojects.ge/api/Users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: phone.value,
        password: password.value,
      }),
    })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", data.token);
      window.location.href = "../index.html";
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Incorrect phone number or password. Please try again.",
      });
    });
});