const confirmationPrice = document.querySelector(".confirmation__price span");
const confirmationId = document.querySelector(".confirmation__id span");

confirmationPrice.textContent = localStorage.getItem("totalPrice") + "€";
confirmationId.textContent = `cmd-${localStorage.getItem("order_number")}`;
