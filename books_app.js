let cart = JSON.parse(localStorage.getItem("cart")) || [];

// === ФУНКЦИИ РЕНДЕРИНГА (ОБЩИЕ) ===

function renderStars(rating) {
  let html = "";
  const starImage = '<img class="star" src="/images/star.svg" alt=".">';
  const noStarImage = '<img class="no-star" src="/images/!star.svg" alt=".">';

  for (let i = 1; i <= 5; i++) {
    html += i <= rating ? starImage : noStarImage;
  }
  return html;
}

function updateCartIndicator() {
  const cartLink = document.querySelector('nav a[href="books_cart.html"]');
  if (cartLink) {
    let cartCount = cartLink.querySelector(".cart-count");
    if (!cartCount) {
      cartCount = document.createElement("span");
      cartCount.classList.add("cart-count");
      cartCount.style.marginLeft = "5px";
      cartCount.style.color = "red";
      cartLink.appendChild(cartCount);
    }
    cartCount.textContent = cart.length;
  }
}

// === ЛОГИКА КАТАЛОГА ===

function renderBooksToContainer(container, booksToRender = books) {
  if (!container) return;

  container.innerHTML = "";

  booksToRender.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-top">
        <img src="${book.image}" class="card-img" alt="${book.title}">
        <div class="card-price-box">
          <div class="card-price">₹${book.price}</div>
        </div>
      </div>
      <div class="card-bottom">
        <h3 class="card-title">${book.title}</h3>
        <p class="card-author">${book.author}</p>
        <div class="card-rate">${renderStars(book.stars)}</div>
        <div class="card-description-container">
          <div class="card-description">${book.description}</div>
        </div>
        <button class="card-to-cart" data-id="${book.id}">
          <img src="/images/cart.svg" alt="cart" class="card-cart">
          Add To Cart
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function addToCart(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  const exists = cart.some((item) => item.id === id);

  if (!exists) {
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIndicator();
  }
}

// === ЛОГИКА КАРУСЕЛИ ДЛЯ КАТАЛОГОВ ===

function initCatalogCarousels() {
  const carouselContainers = document.querySelectorAll(".carousel-container");

  carouselContainers.forEach((container) => {
    const track = container.querySelector(".carousel-track");
    const prevBtn = container.querySelector(".carousel-prev");
    const nextBtn = container.querySelector(".carousel-next");

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let cardWidth = 280;
    let visibleCards = 4;

    function calculateVisibleCards() {
      const containerWidth = container.offsetWidth - 100;
      return Math.floor(containerWidth / cardWidth);
    }

    function updateCarousel() {
      const cards = track.querySelectorAll(".card");
      if (cards.length === 0) return;

      visibleCards = calculateVisibleCards();
      const maxIndex = Math.max(0, cards.length - visibleCards);
      currentIndex = Math.min(currentIndex, maxIndex);
      currentIndex = Math.max(0, currentIndex);

      const offset = -currentIndex * cardWidth;
      track.style.transform = `translateX(${offset}px)`;

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex || maxIndex === 0;

      prevBtn.style.opacity = prevBtn.disabled ? "0.3" : "1";
      nextBtn.style.opacity = nextBtn.disabled ? "0.3" : "1";

      console.log(
        `Carousel: index=${currentIndex}, max=${maxIndex}, visible=${visibleCards}, total=${cards.length}`
      );
    }

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      const cards = track.querySelectorAll(".card");
      const maxIndex = Math.max(0, cards.length - visibleCards);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCarousel();
      }, 100);
    });

    setTimeout(() => {
      updateCarousel();
    }, 150);
  });
}

// === ИНИЦИАЛИЗАЦИЯ ===

document.addEventListener("click", (e) => {
  const button = e.target.closest(".card-to-cart");
  if (button) {
    const bookId = parseInt(button.dataset.id);
    console.log("Add to cart clicked for book ID:", bookId);
    addToCart(bookId);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing book sections...");

  const catalogTracks = document.querySelectorAll(".catalog.carousel-track");
  catalogTracks.forEach((track) => {
    renderBooksToContainer(track, books);
  });

  setTimeout(() => {
    initCatalogCarousels();
  }, 100);

  updateCartIndicator();
});
