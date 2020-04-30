const panierTitleOrder = document.querySelector(".panier__title span");
const panierItemsContainer = document.querySelector(".panier__items-container");
const panierTotalContainer = document.querySelector(".total-container");
const panierTotalPrice = document.querySelector(".panier__total-price");

// Update Number of articles on PANIER Page
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
  } else {
    window.scrollTo(0, 455);
  }
}

// Format data before POST request to server
let contact = {};
let contactData = {};
let postRequest = {};

function formatRequestData() {
  InputsData.forEach((input) => {
    contactData[input.id] = input.value;
    contact = {
      prenom: contactData.first__name,
      nom: contactData.last__name,
      adresse: contactData.adress__street,
      ville: contactData.adress__city,
      email: contactData.email,
    };
  });

  // Product_id table formatting
  let productsObject = JSON.parse(localStorage.getItem("cartDetails"));
  let products = [];
  productsObject.forEach((item) => {
    products.push(item);
  });
  postRequest = { contact, products };
  console.log(postRequest);
  postData();
}

// POST request function
function postData() {
  var req = new XMLHttpRequest();
  req.open("POST", "http://localhost:3000/api/furniture/order");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(postRequest));

  req.onreadystatechange = (e) => {
    if (req.readyState > 3 && req.status == 201) {
      let response = JSON.parse(req.response);
      localStorage.setItem("orderId", response.orderId);
      window.location.href = "http://127.0.0.1:5500/frontend/confirmation.html";
    }
  };
}
