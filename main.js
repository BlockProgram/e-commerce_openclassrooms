const articlesContainer = document.querySelector(".articles__container");
const articleContainer = document.querySelector(".article__container");
const productImg = document.querySelector(".product__img");
const productName = document.querySelector(".product__name");
const productVernis = document.querySelector(".product__vernis-select");
const productDetails = document.querySelector(".product__details");
const productPrice = document.querySelector(".product__price");
const productTotalPrice = document.querySelector(".product__total-price span");
const productQuantity = document.querySelector(".product__quantity-select");
const addToCartBtn = document.querySelector(".btn__add-cart");
const orderNowBtn = document.querySelector(".btn__order-now");
const headerCartText = document.querySelector(".header__cart-title span");
const panierTitleOrder = document.querySelector(".panier__title span");
const panierItemsContainer = document.querySelector(".panier__items-container");
const panierTotalContainer = document.querySelector(".total-container");
const panierTotalPrice = document.querySelector(".panier__total-price");
const quantityOrder = document.querySelector(".panier__item-name span ");

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
getData()
  .then(function (response) {
    apiData = JSON.parse(response);

    // Load list only on Homepage
    if (window.location.href == "http://127.0.0.1:5500/") {
      displayList();
    } else if (window.location.href == "http://127.0.0.1:5500/produit.html") {
      loadProductPage();
    }
  })
  .catch(function (error) {
    console.error("Failed!", error);
  });

// Display list of items on homepage
function displayList() {
  let rank = 0;

  apiData.forEach((item) => {
    let linkEl = document.createElement("a");
    linkEl.setAttribute("href", "produit.html");
    linkEl.setAttribute("id", rank);
    linkEl.classList.add("article__container");
    linkEl.innerHTML = `<img class="article__img" id="${rank}" src="${
      item.imageUrl
    }"/>
        <div id="${rank}" class="article__details-container">
          <h2 id="${rank}" class="article__name">${item.name}</h2>
          <h3 id="${rank}" class="article__price">${item.price / 100 + "€"}</h3>
          <h4 id="${rank}" class="article__details">${item.description}</h4>
        </div>
        <button class="article__btn">Fiche Produit</button>`;

    articlesContainer.appendChild(linkEl);
    rank++;
  });
}

let productToLoad = localStorage.getItem("product");

// Load product page with clicked item on homepage
function loadProductPage() {
  productName.textContent = apiData[productToLoad].name;
  productDetails.textContent = apiData[productToLoad].description;
  productPrice.textContent = `${apiData[productToLoad].price / 100 + "€"}`;
  productImg.setAttribute("src", `${apiData[productToLoad].imageUrl}`);

  // Insert vernis options
  let vernisOptions = apiData[productToLoad].varnish;

  vernisOptions.forEach((vernis) => {
    let newOption = document.createElement("option");
    newOption.setAttribute("value", vernis);
    newOption.textContent = vernis;
    productVernis.appendChild(newOption);
  });

  productTotalPrice.textContent = productPrice.textContent;
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

// Display "Commander" button
if (
  cartAmount >= 1 &&
  window.location.href == "http://127.0.0.1:5500/produit.html"
) {
  orderNowBtn.classList.add("active");
}

// Update Number of articles on PANIER Page
if (window.location.href == "http://127.0.0.1:5500/panier.html") {
  panierTitleOrder.textContent = `(${cartAmount} articles)`;

  let totalToPay = 0;

  // Print content of cart to PANIER page
  cartDetails.forEach((item) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("panier__item-container");
    newDiv.innerHTML = `
      <h3 class="panier__item-name">
        ${item.name}<span>(x ${item.quantity})</span>
      </h3>
      <h3 class="panier__item-price">${item.totalprice}€</h3>
    `;

    panierItemsContainer.insertBefore(newDiv, panierTotalContainer);

    //Calculate Total Price
    totalToPay += +item.totalprice;
  });
  panierTotalPrice.textContent = totalToPay + "€";
  localStorage.setItem("totalPrice", totalToPay);
}

const panierValidateBtn = document.querySelector(".panier__validate-btn");
const firstName = document.getElementById("first__name");
const lastName = document.getElementById("last__name");
const email = document.getElementById("email");
const birthDate = document.getElementById("birth__date");
const adressStreet = document.getElementById("adress__street");
const adressStreetMore = document.getElementById("adress__street-more");
const adressZipCode = document.getElementById("adress__zipcode");
const adressCity = document.getElementById("adress__city");

// Form validation on PANIER Page
if (window.location.href == "http://127.0.0.1:5500/panier.html") {
  function checkNames(firstName, lastName) {
    const regex = /\D{2,30}/;
    if (regex.test(firstName.value) && regex.test(lastName.value)) {
      alert("passed");
    } else if (!regex.test(lastName.value) && !regex.test(firstName.value)) {
      alert("first name & last name not valid");
    } else if (!regex.test(firstName.value)) {
      alert("first name not valid");
    } else if (!regex.test(lastName.value)) {
      alert("last name not valid");
    }
  }

  // Generate Order ID
  function generateOrderId() {}

  // Check Inputs when form is submitted
  panierValidateBtn.addEventListener("click", () => {
    checkNames(firstName, lastName);

    // If all inputs are valid, trigger Order ID generation function
  });
}

// Order CONFIRMATION Page
const confirmationPrice = document.querySelector(".confirmation__price span");
const confirmationId = document.querySelector(".confirmation__id span");

if (window.location.href == "http://127.0.0.1:5500/confirmation.html") {
  confirmationPrice.textContent = localStorage.getItem("totalPrice") + "€";
  confirmationId.textContent = "Generated ID";
}

// Event listeners
// Save clicked item on homepage
if (window.location.href == "http://127.0.0.1:5500/") {
  window.addEventListener("click", (e) => {
    localStorage.setItem("product", e.target.id);
  });
}

//Recalculate total price if quantity changes
if (window.location.href == "http://127.0.0.1:5500/produit.html") {
  productQuantity.addEventListener("change", (e) => {
    productTotalPrice.textContent = `${
      (apiData[productToLoad].price / 100) * e.target.value + "€"
    }`;
  });

  // Add to cart button events
  addToCartBtn.addEventListener("click", () => {
    updateCart();
    orderNowBtn.classList.add("active");
  });
}
