let headerCartText = document.querySelector(".header__cart-title span");

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

let cartAmount = +localStorage.getItem("cartAmount");

// Initial Cart values
localStorage.getItem("cartAmount") !== null
  ? (headerCartText.textContent = `(${localStorage.getItem("cartAmount")})`)
  : (headerCartText.textContent = "(0)");
