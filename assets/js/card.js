(function () {
  const funFact = document.getElementById("funFact");
  const envelope = document.getElementById("envelope");
  const letter = envelope.querySelector(".letter");
  const letterContent = document.getElementById("letterContent");
  const letterMessage = `Dear Rebecca,
  
Happy 21st Birthday!

Today, I want to celebrate the birthday of the most wonderful person I know. 
Your dedication to volunteering and helping others is truly amazing, they're constant reminders of how beautiful the world can be. 
Even though we don't talk every day, every interaction with you fills me with hope warms my heart.
To making more memories with you, I hope this new year brings you countless moments of joy and adventures!

With all my best wishes,
Clarence :)`;

  let index = 0;

  // Typewriter function: types one character at a time.
  function typeLetter() {
    if (index < letterMessage.length) {
      letterContent.textContent += letterMessage.charAt(index);
      index++;
      setTimeout(typeLetter, 50); // Adjust typing speed (50ms per character)
    } else {
        document.getElementById("hrLine").classList.remove("hidden");
        document.getElementById("hrLine").classList.add("visible");
        document.getElementById("askOutBtn").classList.remove("hidden");
        document.getElementById("askOutBtn").classList.add("visible");
    }
  }

  // When the continue button is clicked, start the typewriter effect.
  const continueBtn = document.getElementById("continueBtn");
  continueBtn.addEventListener("click", function () {
    // Hide the fun fact section.
    funFact.classList.add("hidden");

    envelope.classList.remove("hidden");

    // Optionally, hide the continue button after clicking it.
    this.classList.add("hidden");

    // Clear any previously typed text and reset the index.
    letterContent.textContent = "";
    index = 0;
    // Start the envelope opening animation
    setTimeout(() => {
      envelope.classList.add("open");

      // Wait for envelope animation to fully finish (1.5s) plus an additional 1s delay
      setTimeout(() => {
        // Show and animate the letter
        letter.classList.add("show-letter");

        // Start typewriter effect after letter is visible and in position
        setTimeout(() => {
          typeLetter();
        }, 1000); // Wait 1s after letter is in position before starting typewriter effect
      }, 2000); // 1.5s for envelope animation + 1s additional delay
    }, 500); // Initial delay before starting the animation
  });
})();
