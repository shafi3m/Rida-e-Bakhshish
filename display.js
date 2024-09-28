let currentLanguage = "en"; // Default language

// Function to fetch poems data from the JSON file
async function fetchPoems() {
  try {
    const response = await fetch("poems.json");
    if (!response.ok) {
      throw new Error("Failed to fetch poems data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Function to display the poem based on the current language
async function displayPoem(language = "en") {
  // Get the poem ID from the URL query string
  const params = new URLSearchParams(window.location.search);
  const poemId = parseInt(params.get("id"), 10);

  // Fetch all poems and find the one matching the ID
  const poems = await fetchPoems();
  const poem = poems.find((p) => p.id === poemId);

  if (poem) {
    // Destructure the required data based on the selected language
    const { title, content, category } = poem;
    const formattedContent = content[language].replace(/\n/g, "<br>");

    // Update the HTML elements with the selected language content
    document.getElementById("poem-title").textContent = title[language];
    document.getElementById("category").textContent = category[language];
    document.getElementById("poem-content").innerHTML = formattedContent;

    // Apply specific font settings based on the current language
    applyFontSettings(language);
  } else {
    // Handle the case where the poem is not found
    displayErrorMessage();
  }
}

// Function to apply font settings based on the language
function applyFontSettings(language) {
  const titleElement = document.getElementById("poem-title");
  const contentElement = document.getElementById("poem-content");
  const categoryElement = document.getElementById("category");

  if (language === "ur") {
    // Settings for Urdu language
    setFontStyles(titleElement, "'Noto Nastaliq Urdu', serif", "20px", "1.9");
    setFontStyles(contentElement, "'Noto Nastaliq Urdu', serif", "18px", "2.4");
    setFontStyles(categoryElement, "'Noto Nastaliq Urdu', serif", "16px");
  } else {
    // Settings for English language
    setFontStyles(titleElement, "'Poppins', sans-serif", "18px", "1.6");
    setFontStyles(contentElement, "'Poppins', sans-serif", "16px", "1.8");
    setFontStyles(categoryElement, "'Poppins', sans-serif", "16px");
  }
}

// Utility function to set font styles on an element
function setFontStyles(element, fontFamily, fontSize, lineHeight = "1.6") {
  element.style.fontFamily = fontFamily;
  element.style.fontSize = fontSize;
  element.style.lineHeight = lineHeight;
}

// Function to display an error message if the poem is not found
function displayErrorMessage() {
  document.getElementById("poem-title").textContent = "Poem not found";
  document.getElementById("poem-content").textContent =
    "The requested poem could not be found.";
  setFontStyles(document.getElementById("poem-title"), "'Arial', sans-serif");
  setFontStyles(document.getElementById("poem-content"), "'Arial', sans-serif");
}

// Event listener for language toggle button
document.getElementById("language-toggle").addEventListener("click", () => {
  // Toggle the current language between 'en' and 'ur'
  currentLanguage = currentLanguage === "en" ? "ur" : "en";

  // Update the button text and display the poem in the selected language
  document.getElementById("language-text").textContent =
    currentLanguage === "en" ? "ار" : "EN";
  displayPoem(currentLanguage);
});

// Initialize the page with default language content
document.getElementById("language-text").textContent = "ار";
displayPoem(currentLanguage);
