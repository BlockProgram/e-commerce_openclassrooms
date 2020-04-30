const productImg = document.querySelector(".product__img");
const productName = document.querySelector(".product__name");
const productVernis = document.querySelector(".product__vernis-select");
const productDetails = document.querySelector(".product__details");
const productPrice = document.querySelector(".product__price");
const productTotalPrice = document.querySelector(".product__total-price span");
const productQuantity = document.querySelector(".product__quantity-select");
const addToCartBtn = document.querySelector(".btn__add-cart");
const orderNowBtn = document.querySelector(".btn__order-now");

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

cartAmount = +localStorage.getItem("cartAmount");
// Update cart amount on UI and store items
function updateCart() {
  cartAmount += 1;
  headerCartText.textContent = `(${cartAmount})`;
  localStorage.setItem("cartAmount", cartAmount);

  let item = {
    name: apiData[productToLoad].name,
    _id: apiData[productToLoad]._id,
    quantity: productQuantity.value,
    totalprice: `${
      (productQuantity.value * apiData[productToLoad].price) / 100
    }`,
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
    (apiData[productToLoad].price / 100) * e.target.value + "€"
  }`;
});

// Add to cart button events
addToCartBtn.addEventListener("click", () => {
  updateCart();
  orderNowBtn.classList.add("active");
});
