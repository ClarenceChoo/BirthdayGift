// card.js
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
    
    function typeLetter() {
      if (index < letterContent.length) {
        letterTextEl.textContent += letterContent.charAt(index);
        index++;
        setTimeout(typeLetter, 50);  // Adjust typing speed here
      }
    }
    
  })();
  