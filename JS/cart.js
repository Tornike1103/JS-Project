let cart= document.querySelector(`#cartContainer`);




if (!localStorage.getItem("token")) {

  Swal.fire({
    icon: 'warning',
    title: 'Not authorized',
    text: 'Please sign in first',
    confirmButtonText: 'Go to Login'
  }).then(() => {
    window.location.href = "../template/login.html";
  });

}

try{

fetch ("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
.then(response=> response.json())
.then(data=> {console.log( data )
displayCartProducts(data)

})

}

catch (error ){}

function displayCartProducts (arr){

arr.forEach(element => {

    let div = document.createElement("div");

    div.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${element.product.image}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${element.product.name}</h5>
          <p class="card-text">Price: ${element.price} ₾</p>
          <p class="card-text">Quantity: ${element.quantity} </p>
          
        </div>
      </div>
    `;
    let plus= document.createElement(`button`)
    plus.innerHTML= `+`
plus.addEventListener(`click`, ()=> {

fetch(`https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket`, {

    method:"PUT",

    headers: {

        "Content-Type": "application/json"
    },

    body:JSON.stringify({

quantity: element.quantity+1,
  price: element.price+ element.product.price,
  productId: element.product.id
    })

    

})

   .then(resp=> resp.text())
   .then(data=> {console.log(data),
    window.location.reload()
   })


})
    div.appendChild(plus)

     
let minus = document.createElement(`button`)
minus.innerHTML = `-`

minus.addEventListener(`click`, ()=> {

  if (element.quantity==1) {

    fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${element.product.id}`,

            {method:"DELETE"}
            
        )
        .then(resp => resp.text()) 
        .then(data=> {console.log (data)


        })
window.location.reload()
    }
    else{

fetch(`https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket`, {

    method:"PUT",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        quantity: element.quantity - 1,
        price: element.price - element.product.price,
        productId: element.product.id
    })
})

.then(resp => resp.text())
.then(data => {console.log(data)})

window.location.reload()

}})

div.appendChild(minus)
    

     let deleteBtn= document.createElement(`button`)
    deleteBtn.innerHTML= `Delete`

    deleteBtn.addEventListener( `click`, ()=> {

        fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${element.product.id}`,

            {method:"DELETE"}
            
        )
        .then(resp => resp.text()) 
        .then(data=> {console.log (data)


        })
window.location.reload()
    })

    div.appendChild(deleteBtn)
  cart.appendChild(div)  
});

}


//=============
//log out button
//============

let logout= document.querySelector(`#logout`)

logout.addEventListener("click", () => {

  localStorage.removeItem("token")
  window.location.href="../template/login.html"
})
