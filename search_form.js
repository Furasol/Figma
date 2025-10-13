const searchInput = document.querySelector(".search-bar");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (typeof books === "undefined") return;

  const filteredBooks =
    query === ""
      ? books
      : books.filter((book) => {
          const isMatch =
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query);
          return isMatch;
        });

  // Обновляем все треки карусели
  const catalogTracks = document.querySelectorAll(".catalog.carousel-track");
  catalogTracks.forEach((track) => {
    if (typeof renderBooksToContainer === "function") {
      renderBooksToContainer(track, filteredBooks);
    }
  });

  // Переинициализируем карусели после поиска
  setTimeout(() => {
    initCatalogCarousels();
  }, 150);
});
