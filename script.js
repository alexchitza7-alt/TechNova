
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const searchResults = document.getElementById("searchResults");

// Search Wikipedia for technology topics
async function searchTech(query) {
  const search = query.trim();

  if (!search) return;

  searchInput.value = search;
  searchResults.replaceChildren();

  const loading = document.createElement("p");
  loading.textContent = "Searching the world of technology...";
  searchResults.appendChild(loading);

  try {
    const url =
      "https://en.wikipedia.org/w/api.php?action=query" +
      "&list=search&srsearch=" +
      encodeURIComponent(search) +
      "&srlimit=6&format=json&origin=*";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();
    const articles = data.query.search;

    searchResults.replaceChildren();

    if (articles.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No results found. Try another search.";
      searchResults.appendChild(message);
      return;
    }

    const heading = document.createElement("h2");
    heading.textContent = "Search results for: " + search;
    searchResults.appendChild(heading);

    for (const article of articles) {
      const card = document.createElement("article");
      card.className = "result-card";

      const title = document.createElement("h3");
      title.textContent = article.title;

      const description = document.createElement("p");
      description.textContent = "Loading information...";

      const link = document.createElement("a");
      link.textContent = "Read more ↗";
      link.href =
        "https://en.wikipedia.org/wiki/" +
        encodeURIComponent(article.title.replaceAll(" ", "_"));
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      card.append(title, description, link);
      searchResults.appendChild(card);

      try {
        const summaryURL =
          "https://en.wikipedia.org/api/rest_v1/page/summary/" +
          encodeURIComponent(article.title);

        const summaryResponse = await fetch(summaryURL);

        if (summaryResponse.ok) {
          const summary = await summaryResponse.json();
          description.textContent =
            summary.extract || "Open the article to learn more.";

          if (summary.thumbnail && summary.thumbnail.source) {
            const picture = document.createElement("img");
            picture.src = summary.thumbnail.source;
            picture.alt = article.title;
            picture.className = "result-image";
            picture.loading = "lazy";
            card.insertBefore(picture, title);
          }
        } else {
          description.textContent = "Open the article to learn more.";
        }
      } catch {
        description.textContent = "Open the article to learn more.";
      }
    }

  } catch (error) {
    searchResults.replaceChildren();

    const message = document.createElement("p");
    message.textContent =
      "Search is temporarily unavailable. Please try again.";
    searchResults.appendChild(message);
  }
}

// Search button
searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  searchTech(searchInput.value);
});

// Popular searches and category buttons
document.querySelectorAll("[data-search]").forEach(button => {
  button.addEventListener("click", function() {
    searchTech(this.dataset.search);

    document.getElementById("discover").scrollIntoView({
      behavior: "smooth"
    });
  });
});
