
async function searchTech() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const search = input.value.trim();

  results.replaceChildren();

  if (!search) {
    results.textContent = "Please type something to search!";
    return;
  }

  results.textContent = "Searching TechNova... 🔎";

  try {
    const searchURL =
      "https://en.wikipedia.org/w/api.php?action=query" +
      "&list=search" +
      "&srsearch=" + encodeURIComponent(search) +
      "&srlimit=5" +
      "&format=json&origin=*";

    const response = await fetch(searchURL);

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    const data = await response.json();
    const articles = data.query.search;

    results.replaceChildren();

    if (articles.length === 0) {
      results.textContent = "No results found. Try another search.";
      return;
    }

    for (const article of articles) {
      const card = document.createElement("div");
      card.className = "result-card";

      const heading = document.createElement("h3");
      heading.textContent = article.title;

      const description = document.createElement("p");
      description.textContent = "Loading information...";

      const link = document.createElement("a");
      link.textContent = "Read more on Wikipedia";
      link.href =
        "https://en.wikipedia.org/wiki/" +
        encodeURIComponent(article.title.replaceAll(" ", "_"));
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      card.append(heading, description, link);
      results.appendChild(card);

      try {
        const summaryURL =
          "https://en.wikipedia.org/api/rest_v1/page/summary/" +
          encodeURIComponent(article.title);

        const summaryResponse = await fetch(summaryURL);

        if (summaryResponse.ok) {
          const summary = await summaryResponse.json();
          description.textContent =
            summary.extract || "No summary available.";
        } else {
          description.textContent =
            "Open the article to learn more.";
        }
      } catch {
        description.textContent =
          "Open the article to learn more.";
      }
    }
  } catch (error) {
    results.textContent =
      "Something went wrong. Please try again.";
  }
}

document.getElementById("searchInput").addEventListener(
  "keydown",
  function(event) {
    if (event.key === "Enter") {
      searchTech();
    }
  }
);
