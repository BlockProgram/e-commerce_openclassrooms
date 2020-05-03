const productImg = document.querySelector(".product__img");
const productName = document.querySelector(".product__name");
const productVernis = document.querySelector(".product__vernis-select");
const productDetails = document.querySelector(".product__details");
const productPrice = document.querySelector(".product__price");
const productTotalPrice = document.querySelector(".product__total-price span");
const productQuantity = document.querySelector(".product__quantity-select");
const addToCartBtn = document.querySelector(".btn__add-cart");
const orderNowBtn = document.querySelector(".btn__order-now");

const productToLoad = window.location.href.split("=")["1"];
let getProductFromId = "";

// Call API and store response inside array. Display some results on UI
getData()
  .then(function (response) {
    getProductFromId = JSON.parse(response).find(
      (element) => element._id === productToLoad
    );
    // Load list only on Homepage
    loadProductPage(JSON.parse(response));
  })
  .catch(function (error) {
    console.error("Failed!", error);
  });

// Load product page with clicked item on homepage
function loadProductPage(apiData) {
  productName.textContent = getProductFromId.name;
  productDetails.textContent = getProductFromId.description;
  productPrice.textContent = `${getProductFromId.price / 100 + "€"}`;
  productImg.setAttribute("src", `${getProductFromId.imageUrl}`);

  // Insert vernis options
  let vernisOptions = getProductFromId.varnish;

  vernisOptions.forEach((vernis) => {
    let newOption = document.createElement("option");
    newOption.setAttribute("value", vernis);
    newOption.textContent = vernis;
    productVernis.appendChild(newOption);
  });

  productTotalPrice.textContent = productPrice.textContent;
}

cartAmount = +localStorage.getItem("cartAmount");
// Update cart amount on UI and store items
function updateCart() {
  cartAmount += 1;
  headerCartText.textContent = `(${cartAmount})`;
  localStorage.setItem("cartAmount", cartAmount);

  let item = {
    name: getProductFromId.name,
    _id: getProductFromId._id,
    quantity: productQuantity.value,
    totalprice: `${(productQuantity.value * getProductFromId.price) / 100}`,
  };

  cartDetails.push(item);
  localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
}

// Display "Commander" button
if (cartAmount >= 1) {
  orderNowBtn.classList.add("active");
}

// EVENT LISTENERS

//Recalculate total price if quantity changes
productQuantity.addEventListener("change", (e) => {
  productTotalPrice.textContent = `${
    (getProductFromId.price / 100) * e.target.value + "€"
  }`;
});

// Add to cart button events
addToCartBtn.addEventListener("click", () => {
  updateCart();
  orderNowBtn.classList.add("active");
});
