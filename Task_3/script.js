const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-book-input");
const booksContainer = document.querySelector("#books-container");
const genreFilter = document.querySelector("#genre-filter");
const noBooksMessage = document.getElementById("no-books-message");
const categoryGrid = document.getElementById("category-grid");
const favoritesBtn = document.getElementById("favorites-btn");
const favoritesModal = document.getElementById("favorites-modal");
const closeFavorites = document.getElementById("close-favorites");
const favoritesContainer = document.getElementById("favorites-container");
const favButtons = document.querySelectorAll(".book-favorite-btn");

const genreMap = {
  fiction: ["fiction", "novel", "literature"],
  history: ["history", "historical", "war"],
  science: ["science", "scientific", "physics", "biology", "chemistry"],
  biography: ["biography", "memoir", "autobiography", "life"],
  fantasy: ["fantasy", "magic", "myth", "dragon", "wizard", "harry potter"],
  romance: ["romance", "love", "relationship"],
  mystery: ["mystery", "detective"],
};

const authorGenreMap = {
  "agatha christie": "mystery",
  "j.k. rowling": "fantasy",
  "william shakespeare": "fiction",
  "stephen hawking": "science",
  "jane austen": "romance",
  "george orwell": "fiction",
  "walter isaacson": "biography",
  "yuval noah harari": "history",
};

searchBtn.addEventListener("click", getBooks);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getBooks();
});

genreFilter.addEventListener("change", () => {
  const query = searchInput.value.trim();
  if (query) getBooks();
});

function getBooks() {
  const query = searchInput.value.trim();
  if (query) {
    fetch(
      `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => displayBooks(data.docs))
      .catch(() => {
        booksContainer.innerHTML = "<p>Error fetching books.</p>";
      });
  } else {
    booksContainer.innerHTML = "<p>Please enter a search term.</p>";
  }
}

function displayBooks(books) {
  booksContainer.innerHTML = "";
  noBooksMessage.textContent = "";
  const selectedGenre = genreFilter.value.toLowerCase();

  const filteredBooks =
    selectedGenre === "all"
      ? books
      : books.filter((book) => {
          const subjectsLower = (book.subject || []).map((s) =>
            s.toLowerCase()
          );
          const keywords = genreMap[selectedGenre] || [selectedGenre];
          if (keywords.some((keyword) => subjectsLower.includes(keyword))) {
            return true;
          }
          if (book.author_name) {
            const lowerAuthors = book.author_name.map((name) =>
              name.toLowerCase()
            );
            return lowerAuthors.some(
              (author) => authorGenreMap[author] === selectedGenre
            );
          }
          return false;
        });

  if (filteredBooks.length === 0) {
    noBooksMessage.textContent = "No books found for this category.";
    booksContainer.innerHTML = "";
    populateCategories({}, 0); // Reset counts
    return;
  }

  const genreCounts = {
    fiction: 0,
    history: 0,
    science: 0,
    biography: 0,
    fantasy: 0,
    romance: 0,
    mystery: 0,
  };

  filteredBooks.forEach((book) => {
    const subjects = (book.subject || []).map((s) => s.toLowerCase());
    const authors = (book.author_name || []).map((a) => a.toLowerCase());

    for (const genre in genreMap) {
      const keywords = genreMap[genre];
      const matchesSubject = keywords.some((kw) => subjects.includes(kw));
      const matchesAuthor = authors.some(
        (author) => authorGenreMap[author] === genre
      );
      if (matchesSubject || matchesAuthor) {
        genreCounts[genre]++;
      }
    }
  });

  filteredBooks.forEach((book) => {
    const div = document.createElement("div");
    div.className = "book";

    const coverID = book.cover_i;
    const imgURL = coverID
      ? `https://covers.openlibrary.org/b/id/${coverID}-M.jpg`
      : `https://picsum.photos/200/300?random=${Math.random() * 1000}`;

    let title = book.title || "Untitled";
    title = title.split(/[.;,:([\]]/)[0].trim();

    const isFav = isFavorite(title);

    div.innerHTML = `
    <div class="book-header">
      <button class="favorite-btn book-favorite-btn" data-title="${title}">
       <i class="fa${isFav ? "s filled" : "r"} fa-heart"></i>
       </button>
     </div>
      <img src="${imgURL}" alt="${title}">
      <h3>${title}</h3>
      <p>By ${book.author_name?.[0] || "Unknown"}</p>
      <p>Published: ${book.first_publish_year || "N/A"}</p>     
       <button class="borrow-btn" data-title="${title}">Borrow</button>
    `;

    booksContainer.appendChild(div);
  });

  attachBorrowButtonHandlers();
  attachFavoriteButtonHandlers();
  populateCategories(genreCounts, filteredBooks.length);
}

function attachBorrowButtonHandlers() {
  const borrowButtons = document.querySelectorAll(".borrow-btn");
  borrowButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title");
      localStorage.setItem("selectedBookTitle", title);
      window.location.href = "borrowbook.html";
    });
  });
}

// function attachFavoriteButtonHandlers() {
//   const favButtons = document.querySelectorAll(".favorite-btn");
//   favButtons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const title = btn.getAttribute("data-title");
//       let favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];

//       if (favorites.includes(title)) {
//         favorites = favorites.filter((t) => t !== title);
//       } else {
//         favorites.push(title);
//       }

//       localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
//       getBooks();
//     });
//   });
// }

function attachFavoriteButtonHandlers() {
  const favButtons = document.querySelectorAll(".favorite-btn");
  favButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title");
      let favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
      const icon = btn.querySelector("i");

      const isFavorite = favorites.includes(title);
      if (isFavorite) {
        favorites = favorites.filter((t) => t !== title);
        icon.classList.remove("fas", "filled");
        icon.classList.add("far");
      } else {
        favorites.push(title);
        icon.classList.remove("far");
        icon.classList.add("fas", "filled");
      }

      localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
    });
  });
}

function isFavorite(title) {
  const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
  return favorites.includes(title);
}

function populateCategories(counts = {}, total = 0) {
  const categories = [
    {
      key: "all",
      name: "All Genres",
      icon: '<i class="fa-solid fa-book"></i>',
      books: total,
    },
    {
      key: "fiction",
      name: "Fiction",
      icon: '<i class="fa-solid fa-book-open"></i>',
      books: counts.fiction || 0,
    },
    {
      key: "history",
      name: "History",
      icon: '<i class="fa-solid fa-landmark"></i>',
      books: counts.history || 0,
    },
    {
      key: "science",
      name: "Science",
      icon: '<i class="fa-solid fa-flask"></i>',
      books: counts.science || 0,
    },
    {
      key: "biography",
      name: "Biography",
      icon: '<i class="fa-solid fa-user"></i>',
      books: counts.biography || 0,
    },
    {
      key: "fantasy",
      name: "Fantasy",
      icon: '<i class="fa-solid fa-dragon"></i>',
      books: counts.fantasy || 0,
    },
    {
      key: "romance",
      name: "Romance",
      icon: '<i class="fa-solid fa-heart"></i>',
      books: counts.romance || 0,
    },
    {
      key: "mystery",
      name: "Mystery",
      icon: '<i class="fa-solid fa-user-secret"></i>',
      books: counts.mystery || 0,
    },
  ];

  categoryGrid.innerHTML = "";

  categories.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "category";
    div.innerHTML = `
      <div class="category-icon">${cat.icon}</div>
      <h3>${cat.name}</h3>
      <p>${cat.books} books</p>
    `;

    div.addEventListener("click", () => {
      genreFilter.value = cat.key === "all" ? "all" : cat.key;
      getBooks(); // Trigger search again with selected genre
    });

    categoryGrid.appendChild(div);
  });
}

// Initialize
populateCategories({}, 0);

favoritesBtn.addEventListener("click", showFavoriteBooks);
closeFavorites.addEventListener("click", () => {
  favoritesModal.classList.add("hidden");
});

function showFavoriteBooks() {
  const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favorite books added yet.</p>";
  } else {
    favorites.forEach((title) => {
      const div = document.createElement("div");
      div.className = "book favorite";

      div.innerHTML = `
        <h3>${title}</h3>
        <button class="remove-fav-btn" data-title="${title}">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      `;

      favoritesContainer.appendChild(div);
    });

    // Attach remove handlers
    document.querySelectorAll(".remove-fav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        let favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
        favorites = favorites.filter((t) => t !== title);
        localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
        showFavoriteBooks();
        getBooks();
      });
    });
  }

  favoritesModal.classList.remove("hidden");
}
