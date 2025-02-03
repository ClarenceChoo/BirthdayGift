(function() {
  const cardEl = document.getElementById('card');
  const letterTextEl = document.getElementById('letterText');
  const letterContent = `Dear Rebecca,
  
Happy 21st Birthday!

I know how much you love hiking, daisies, and the Flower Dome in Singapore.
Your passion and dedication to becoming an occupational therapist inspire me every day.
May this new year of life bring you adventures, joy, and success.

With all my best wishes,
[Your Name]`;
  
  let index = 0;
  
  // Typewriter function: types one character at a time.
  function typeLetter() {
    if (index < letterContent.length) {
      letterTextEl.textContent += letterContent.charAt(index);
      index++;
      setTimeout(typeLetter, 50);  // Adjust typing speed (50ms per character)
    }
  }
  
  // When the continue button is clicked, start the typewriter effect.
  const continueBtn = document.getElementById("continueBtn");
  continueBtn.addEventListener("click", function() {
    // Hide the fun fact section.
    funFact.classList.add("hidden");
    
    // Show the card section.
    card.classList.remove("hidden");
    
    // Optionally, hide the continue button after clicking it.
    this.classList.add("hidden");
    
    // Clear any previously typed text and reset the index.
    letterTextEl.textContent = "";
    index = 0;
    
    // Start the typewriter effect.
    typeLetter();
  });
})();
