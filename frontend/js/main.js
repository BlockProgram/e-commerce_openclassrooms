const headerCartText = document.querySelector(".header__cart-title span");

// API call function
function getData() {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/api/furniture");

    request.onload = function () {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        reject(Error(this.statusText));
      }
    };
    request.send();
  });
}

let apiData = [];

// Call API and store response inside array. Display some results on UI
{
  getData()
    .then(function (response) {
      apiData = JSON.parse(response);

      console.log(apiData);
      // Load list only on Homepage
      if (window.location.href == "http://127.0.0.1:5500/frontend/index.html") {
        displayList();
      } else if (
        window.location.href == "http://127.0.0.1:5500/frontend/produit.html"
      ) {
        loadProductPage();
      }
    })
    .catch(function (error) {
      console.error("Failed!", error);
    });
}

// Initial Cart values
let cartAmount = +localStorage.getItem("cartAmount");
localStorage.getItem("cartAmount") !== null
  ? (headerCartText.textContent = `(${localStorage.getItem("cartAmount")})`)
  : (headerCartText.textContent = "(0)");
let cartDetails = JSON.parse(localStorage.getItem("cartDetails")) || [];

// Update cart amount on UI and store items
function updateCart() {
  cartAmount += 1;
  headerCartText.textContent = `(${cartAmount})`;
  localStorage.setItem("cartAmount", cartAmount);

  let item = {
    name: apiData[productToLoad].name,
    quantity: productQuantity.value,
    totalprice: `${
      (productQuantity.value * apiData[productToLoad].price) / 100
    }`,
  };

  cartDetails.push(item);
  localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
}
