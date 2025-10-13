const gridCardsContainer = document.querySelector(".grid-cards");
const subtotalEl = document.querySelector(".order-price");
const totalEl = document.querySelector(".total-price");

function renderCart() {
  if (!gridCardsContainer) return;

  gridCardsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((book, index) => {
    const priceString = String(book.price).replace(/[^0-9.]/g, "");
    const priceValue = parseFloat(priceString);
    subtotal += priceValue;

    const card = document.createElement("div");
    card.classList.add("grid-card");

    card.innerHTML = `
        <div class="grid-card-left-side">
            <div class="grid-card-img-item">
                <img src="${book.image}" alt="${
      book.title
    }" class="grid-card-img">
            </div>
            <div class="grid-card-left-sidess">
                <h3 class="grid-card-title">${book.title}</h3>
                <div class="grid-card-author">${book.author}</div>
                <div class="grid-card-rate">
                    ${renderStars(book.stars || book.rating)}
                </div>
            </div>
        </div>
        <div class="grid-card-right-side">
            <div class="grid-card-price">₹${priceValue.toFixed(2)}</div>
            <div class="grid-card-delete" data-index="${index}">
                <img src="/images/Delete.svg" alt="Удалить" class="grid-card-delete-img">
            </div>
        </div>
        `;

    gridCardsContainer.appendChild(card);
  });

  if (subtotalEl && totalEl) {
    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;

    totalEl.textContent = `₹${(subtotal + 80).toFixed(2)}`;
  }
}

document.addEventListener("click", (e) => {
  const deleteButton = e.target.closest(".grid-card-delete");
  if (deleteButton) {
    const index = deleteButton.dataset.index;
    if (index !== undefined) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();

      if (typeof updateCartIndicator === "function") {
        updateCartIndicator();
      }
    }
  }
});

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  if (typeof updateCartIndicator === "function") {
    updateCartIndicator();
  }
});

if (document.querySelector(".grid-cards")) {
  renderCart();
}

if (typeof updateCartIndicator === "function") {
  updateCartIndicator();
}
