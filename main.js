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

    console.log(apiData);
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

const form = document.getElementById("form");
const allFormControls = document.querySelectorAll(".form-control");
const InputsData = document.querySelectorAll(".input-data");
const firstName = document.getElementById("first__name");
const lastName = document.getElementById("last__name");
const email = document.getElementById("email");
const birthDate = document.getElementById("birth__date");
const adressStreet = document.getElementById("adress__street");
const streetMoreContainer = document.getElementById("street-more-container");
const adressZipCode = document.getElementById("adress__zipcode");
const adressCity = document.getElementById("adress__city");
const validateCartBtn = document.querySelector(".panier__validate-btn");

// Form validation on PANIER Page
if (window.location.href == "http://127.0.0.1:5500/panier.html") {
  // Display error message and red outline input
  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
  }

  // Display green outline input
  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
  }

  // Check if email is valid
  function checkEmail(input) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(input.value.trim())) {
      showSuccess(input);
    } else {
      showError(input, "Email invalide");
    }
  }

  // Check if ZIP Code is valid (5 chiffres)
  function checkZipCode(input) {
    const regex = /^\d{5}$/;
    if (regex.test(input.value.trim())) {
      showSuccess(input);
    } else {
      showError(input, "Code postal invalide");
    }
  }

  // Check required fields
  function checkRequired(inputArray) {
    inputArray.forEach(function (input) {
      if (input.value.trim() === "") {
        showError(input, "Ce champ est obligatoire");
      } else {
        showSuccess(input);
      }
    });
  }

  // Generate Order ID
  let order_number = +localStorage.getItem("order_number") || 0;
  let order_id = "";
  function generateOrderId() {
    order_number += 1;
    localStorage.setItem("order_number", order_number);
  }

  // Check Inputs when form is submitted
  validateCartBtn.addEventListener("click", function (e) {
    e.preventDefault();

    checkRequired([firstName, lastName, birthDate, adressStreet, adressCity]);
    checkEmail(email);
    checkZipCode(adressZipCode);
    streetMoreContainer.classList.add("success");

    checkAllFields();
  });

  // Check all fields. If valid POST request, generate Order ID & redirect to CONFIRMATION page and
  function checkAllFields() {
    let checkedCount = 0;

    allFormControls.forEach((item) => {
      if (item.classList.contains("success")) {
        checkedCount += 1;
      }
    });

    if (checkedCount == 8) {
      formatRequestData();
      generateOrderId();
      // window.location.href = "http://127.0.0.1:5500/confirmation.html";
    } else {
      window.scrollTo(0, 500);
    }
  }

  // Format data before POST request to server
  let contact = {};
  let contactData = {};
  let postRequest = {};
  let postResponse = [];
  function formatRequestData() {
    InputsData.forEach((input) => {
      const formControl = input.parentElement;
      const label = formControl.querySelector("label");
      contactData[label.innerText] = input.value;

      contact = {
        prénom: contactData.Prénom,
        nom: contactData.Nom,
        adresse: contactData.Rue,
        ville: contactData.Ville,
        email: contactData.Email,
      };
    });

    // Product_id table formatting
    let productsObject = JSON.parse(localStorage.getItem("cartDetails"));
    let product_id = [];
    productsObject.forEach((item) => {
      product_id.push(JSON.stringify(item));
    });
    postRequest = { contact, product_id };
    postData();
  }

  // POST request function
  function postData() {
    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/api/furniture/order");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(postRequest));
  }
}

// Order CONFIRMATION Page
const confirmationPrice = document.querySelector(".confirmation__price span");
const confirmationId = document.querySelector(".confirmation__id span");

if (window.location.href == "http://127.0.0.1:5500/confirmation.html") {
  confirmationPrice.textContent = localStorage.getItem("totalPrice") + "€";
  confirmationId.textContent = `cmd-${localStorage.getItem("order_number")}`;
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
