// funfact.js
(function() {
  // Get the fun fact text element and button.
  const funFactTextEl = document.getElementById('funFactText');
  const funFactBtn = document.getElementById('funFactBtn');
  
  // Define the fun fact content.
  const funFactContent = "Did you know? March 3rd is celebrated as World Wildlife Day—a day to appreciate and protect our natural wonders. A unique date where both the month and day are identical! What a coincidence since you like nature a lot too!😆";
  
  let index = 0;
  
  // Typewriter function: types one character at a time.
  function typeLetter() {
    if (index < funFactContent.length) {
      funFactTextEl.textContent += funFactContent.charAt(index);
      index++;
      setTimeout(typeLetter, 50);  // Adjust typing speed (50ms per character)
    } else {
      // Once done typing, show the continue button.
      const continueBtn = document.getElementById("continueBtn");
      continueBtn.classList.remove("hidden");
      continueBtn.classList.add("visible");
    }
  }
  
  // Attach a click event to the fun fact button.
  // When clicked, clear any existing text, reset the counter, and start the typewriter effect.
  funFactBtn.addEventListener("click", function() {
    funFactTextEl.textContent = "";
    index = 0;
    typeLetter();
  });
})();
