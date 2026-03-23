let container = document.getElementById("container");
let veganCheckbox = document.getElementById("vegan");
let nutsCheckbox = document.getElementById("nuts");
let spicyRange = document.getElementById("spicy");
let label = document.getElementById("label");

let applyBtn = document.getElementById("applyBtn");
let resetBtn = document.getElementById("resetBtn");

let categoryButtons = document.querySelector("#categories");



// =====================
// REGISTRATION
// =====================
if (!localStorage.getItem("token")) {

  Swal.fire({
    icon: 'warning',
    title: 'Not authorized',
    text: 'Please sign in first',
    confirmButtonText: 'Go to Login'
  }).then(() => {
    window.location.href = "./template/login.html";
  });

}


// =====================
// LOAD PRODUCTS
// =====================

fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
  .then(response => {
    if (!response.ok) throw new Error("Products fetch failed");
    return response.json();
  })
  .then(data => showProducts(data))
  .catch(error => {
    console.log("Error loading products:", error);
    container.innerHTML = "<h3>Failed to load products</h3>";
  });


// =====================
// LOAD CATEGORIES
// =====================

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then(response => {
    if (!response.ok) throw new Error("Categories fetch failed");
    return response.json();
  })
  .then(data => displayButtons(data))
  .catch(error => {
    console.log("Error loading categories:", error);
  });


// =====================
// SHOW PRODUCTS
// =====================

function showProducts(products) {

  container.innerHTML = "";

  products.forEach(product => {

    let div = document.createElement("div");

    div.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${product.image}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Price: ${product.price} ₾</p>
          <button class="btn btn-primary addBtn">Add to Cart</button>
        </div>
      </div>
    `;

    let btnAdd = div.querySelector(".addBtn");

    btnAdd.addEventListener("click", () => {

      fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: 1,
          price: product.price,
          productId: product.id
        })
      })
        .then(resp => resp.json())
        .then(data => {
          console.log(data);
          Swal.fire({
            title: "Success!",
            text: "Product added successfully",
            icon: "success",
            confirmButtonText: "OK"
          });
        })
        .catch(error => {
          console.log("Add to basket error:", error);
          Swal.fire({ title: "Error", text: "Could not add product", icon: "error" });
        });

    });

    container.appendChild(div);

  });

}


// =====================
// FILTER PRODUCTS
// =====================

function applyFilters() {

  fetch(`https://restaurant.stepprojects.ge/api/Products/GetFiltered?vegeterian=${veganCheckbox.checked}&nuts=${nutsCheckbox.checked}&spiciness=${spicyRange.value}`)
    .then(response => {
      if (!response.ok) throw new Error("Filter fetch failed");
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        container.innerHTML = "<h3>No products found</h3>";
        return;
      }
      showProducts(data);
    })
    .catch(error => {
      console.log("Filter error:", error);
      container.innerHTML = "<h3>Filter failed</h3>";
    });

}


// =====================
// SPICINESS LABEL
// =====================

label.innerHTML = `Spiciness: ${spicyRange.value}`;

spicyRange.addEventListener("input", () => {
  label.innerHTML = `Spiciness: ${spicyRange.value}`;
});


// =====================
// BUTTON EVENTS
// =====================

applyBtn.addEventListener("click", applyFilters);
resetBtn.addEventListener("click", resetFilters);


// =====================
// RESET FILTERS
// =====================

function resetFilters() {

  veganCheckbox.checked = false;
  nutsCheckbox.checked = false;
  spicyRange.value = 0;
  label.innerHTML = `Spiciness: 0`;

  // Reset active highlight back to "All"
  document.querySelectorAll("#categories button").forEach(btn => btn.classList.remove("active"));
  categoryButtons.querySelector("button").classList.add("active");

  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then(response => {
      if (!response.ok) throw new Error("Reset fetch failed");
      return response.json();
    })
    .then(data => showProducts(data))
    .catch(error => console.log("Reset error:", error));

}


// =====================
// CATEGORY BUTTONS
// =====================

function displayButtons(arr) {

 
  let allBtn = categoryButtons.querySelector("button");

  allBtn.addEventListener("click", () => {
    document.querySelectorAll("#categories button").forEach(btn => btn.classList.remove("active"));
    allBtn.classList.add("active");

    fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
      .then(response => response.json())
      .then(data => showProducts(data))
      .catch(error => console.log("All button error:", error));
  });


  arr.forEach(category => {

    let button = document.createElement("button");
    button.classList.add("btn");
    button.innerText = category.name;

    button.addEventListener("click", () => {

      
      document.querySelectorAll("#categories button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${category.id}`)
        .then(response => {
          if (!response.ok) throw new Error("Category fetch failed");
          return response.json();
        })
        .then(data => showProducts(data.products))
        .catch(error => console.log("Category error:", error));

    });

    categoryButtons.appendChild(button);

  });

}

//=============
//log out button
//============

let logout= document.querySelector(`#logout`)

logout.addEventListener("click", () => {

  localStorage.removeItem("token")
  window.location.href="./template/login.html"
})