// funfact.js
(function() {
  // Get the fun fact text element and button.
  const funFactTextEl = document.getElementById('funFactText');
  const funFactBtn = document.getElementById('funFactBtn');
  
  // Define the fun fact content.
  const funFactContent = "Did you know? March 3rd is celebrated as World Wildlife Day—a day to appreciate and protect our natural wonders. A unique date where both the month and day are identical!";
  
  let index = 0;
  
  // Typewriter function: types one character at a time.
  function typeLetter() {
    if (index < funFactContent.length) {
      funFactTextEl.textContent += funFactContent.charAt(index);
      index++;
      setTimeout(typeLetter, 50);  // Adjust typing speed (50ms per character)
    }
  }
  
  // Attach a click event to the fun fact button.
  // When clicked, clear the text, reset the index, and start the typewriter effect.
  funFactBtn.addEventListener("click", function() {
    // Clear any previously typed text and reset the counter.
    funFactTextEl.textContent = "";
    index = 0;
    typeLetter();
  });
})();

  