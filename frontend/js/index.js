const articlesContainer = document.querySelector(".articles__container");

// Display list of items on homepage
function displayList() {
  let rank = 0;

  apiData.forEach((item) => {
    let linkEl = document.createElement("a");
    linkEl.setAttribute("href", "produit.html");
    linkEl.setAttribute("id", rank);
    linkEl.classList.add("article__container");
    linkEl.innerHTML = `<img class="${rank}"  src="${item.imageUrl}"/>
          <div class="${rank}">
            <h2 class="${rank}">${item.name}</h2>
            <h3  class="${rank}">${item.price / 100 + "€"}</h3>
            <h4 class="${rank}">${item.description}</h4>
          </div>
          <button class="${rank}">Fiche Produit</button>`;

    articlesContainer.appendChild(linkEl);
    rank++;
  });
}

// EVENT LISTENERS
// Save clicked item to display on produit page
window.addEventListener("click", (e) => {
  if (!e.target.id) {
    localStorage.setItem("product", e.target.className);
  } else {
    localStorage.setItem("product", e.target.id);
  }
});
