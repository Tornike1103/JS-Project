let form = document.querySelector(`#registration`);
let phone = document.querySelector(`#phone`);
let password = document.querySelector(`#password`);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(`https://rentcar.stepprojects.ge/api/Users/register`, {
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
      Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "Account created successfully. Redirecting to login...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "./login.html";
      });
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please check your details and try again.",
      });
    });
});