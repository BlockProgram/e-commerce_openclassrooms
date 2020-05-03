const articlesContainer = document.querySelector(".articles__container");

// Call API
getData()
  .then(function (response) {
    // Load list only on Homepage
    displayList(JSON.parse(response));
  })
  .catch(function (error) {
    console.error("Failed!", error);
  });

// Display list of items on homepage
function displayList(apiData) {
  apiData.forEach((item) => {
    let linkEl = document.createElement("a");
    linkEl.setAttribute("href", `produit.html?id=${item._id}`);
    linkEl.classList.add("article__container");
    linkEl.innerHTML = `<img class=""  src="${item.imageUrl}"/>
          <div class="">
            <h2 class="">${item.name}</h2>
            <h3  class="">${item.price / 100 + "€"}</h3>
            <h4 class="$">${item.description}</h4>
          </div>
          <button class="">Fiche Produit</button>`;

    articlesContainer.appendChild(linkEl);
  });
}
