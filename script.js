let currentLanguage = "en"; // Default language

// Store all poems globally for reuse
let allPoems = [];

// Fetch poems from the JSON file and store them globally
async function fetchPoems() {
  try {
    const response = await fetch("poems.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    allPoems = await response.json(); // Store the fetched poems
    return allPoems;
  } catch (error) {
    console.error("Failed to fetch poems:", error);
    return [];
  }
}

// Filter poems based on the search query and current language
function filterPoems(query) {
  return allPoems.filter((poem) =>
    poem.title[currentLanguage].toLowerCase().includes(query.toLowerCase())
  );
}

// Populate the poem list dynamically
async function populatePopularPoems(poems = null) {
  const poemListDiv = document.getElementById("poem-list");

  // Fetch poems if not provided
  if (!poems) {
    poems = await fetchPoems();
  }

  // Clear the existing content
  poemListDiv.innerHTML = "";

  // Loop through each poem and create the corresponding HTML elements
  poems.forEach((poem) => {
    const h4 = document.createElement("h4");
    const a = document.createElement("a");

    a.href = `display.html?id=${poem.id}`; // Set link to display poem based on ID
    a.textContent = poem.title[currentLanguage]; // Display the title in the current language

    // Apply styling based on the current language
    applyLanguageStyles(a, currentLanguage);

    h4.appendChild(a);
    poemListDiv.appendChild(h4);
  });
}

// Apply font and direction styles based on the language
function applyLanguageStyles(element, language) {
  if (language === "ur") {
    element.style.direction = "rtl"; // Right-to-left for Urdu
    element.style.textAlign = "right"; // Align text to the right
    element.style.fontFamily = "'Noto Nastaliq Urdu', serif"; // Urdu font
  } else {
    element.style.direction = "ltr"; // Left-to-right for English
    element.style.textAlign = "left"; // Align text to the left
    element.style.fontFamily = "'Poppins', sans-serif"; // English font
  }
  element.style.display = "block"; // Ensure block-level display for alignment
}

// Toggle language between English and Urdu
function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "ur" : "en";

  // Update the language toggle button text
  document.getElementById("language-text").textContent =
    currentLanguage === "en" ? "ار" : "EN";

  const poemListDiv = document.getElementById("poem-list");
  poemListDiv.style.direction = currentLanguage === "ur" ? "rtl" : "ltr"; // Adjust container direction

  populatePopularPoems(); // Refresh the poems in the new language
}

// Event listener for language toggle button
document
  .getElementById("language-toggle")
  .addEventListener("click", toggleLanguage);

// Event listener for search input
document.getElementById("search-input").addEventListener("input", (event) => {
  const query = event.target.value;
  if (query) {
    const filteredPoems = filterPoems(query); // Filter poems based on search input
    populatePopularPoems(filteredPoems); // Populate with filtered poems
  } else {
    populatePopularPoems(); // Show all poems if search is cleared
  }
});

// Revert to default poem list when search input loses focus
document.getElementById("search-input").addEventListener("blur", () => {
  populatePopularPoems();
});

// Initialize the page by displaying popular poems
populatePopularPoems();

// Focus the search input when the search icon is clicked
document.querySelector(".search-icon").addEventListener("click", () => {
  document.getElementById("search-input").focus();
});
