document.getElementById("askOutBtn").addEventListener("click", function () {
  // Hide the envelope section
  document.getElementById("envelope").classList.add("hidden");
  
  // Hide the ask-out button as well
  this.classList.add("hidden");
  
  // Reveal the form section
  document.getElementById("coffeeForm").classList.remove("hidden");
  document.getElementById("coffeeForm").style.opacity = 1;
});

// Global variable to store the clicked button's value
let selectedResponse = null;

// Add a click listener to each submit button to capture its value
document.querySelectorAll("#coffeeQuestion button[type='submit']").forEach(button => {
  button.addEventListener("click", function(e) {
    selectedResponse = e.target.value;
  });
});

let answerCounter = 0;
document.getElementById("coffeeQuestion").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission (redirect)
  
  // Create FormData from the form.
  const formData = new FormData(this);
  
  // Append the selected response if it's not already in the form data.
  if (!formData.get("response") && selectedResponse) {
    formData.append("response", selectedResponse);
  }
  
  // For debugging, log all the key-value pairs:
  for (let [key, value] of formData.entries()) {
    console.log(key + ': ' + value);
  }

  // Get the yes button and modify its styling (or call your function)
  const yesBtn = document.getElementById("yesBtn");
  // Get no button and modify its styling
  const noBtn = document.getElementById("noBtn");

  // Parse the response:
  const responseValue = formData.get("response"); // "Yes" or "No"
  console.log("Response Value:", responseValue);

  if (responseValue == "No" && answerCounter < 4) {
    // If "No" is clicked, execute alternative logic
    console.log("User clicked 'No'. Making the Yes button bigger...");
    answerCounter++; // Increase counter each time clicked
  }

  if (answerCounter == 1)
  {
    yesBtn.style.transform = 'scale(1.5)';
    noBtn.textContent = "Are you sure";
  }
  else if (answerCounter == 2)
  {
    yesBtn.style.transform = 'scale(2)';
    noBtn.textContent = "Are you really sure";
  }
  else if (answerCounter == 3)
  {
    yesBtn.style.transform = 'scale(2.5)';
    noBtn.textContent = "Are you really really sure";
  }

  if (responseValue == "Yes" || (responseValue == "No" && answerCounter == 4))
  {
    // Send the data using the Fetch API.
    fetch("https://formspree.io/f/mldgnwyj", {  // Replace with your actual Formspree endpoint URL.
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        console.log("Response status:", response.status);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then(data => {
        if (responseValue == "Yes")
        {
          document.getElementById("formMessage").textContent = "Let me know when you're free!";
          console.log("Response submitted:", data);
          // After a short delay, transition to the final message section.
          setTimeout(showFinalMessage, 1500);
        }
        else if (responseValue == "No" && answerCounter == 4)
        {
          document.getElementById("formMessage").textContent = "Alright then 😔";
          console.log("Response submitted:", data);
          // After a short delay, transition to the final message section.
          setTimeout(showFinalMessage, 1500);
        }
      })
      .catch(error => {
        document.getElementById("formMessage").textContent = "Error, try again.";
        console.error("Error:", error);
      });
  }

});

function showFinalMessage() {
  // Hide the coffee form
  const coffeeForm = document.getElementById("coffeeForm");
  coffeeForm.classList.add("hidden");
  
  // Show the final message section by removing the hidden class and adding visible
  const finalMessage = document.getElementById("finalMessage");
  finalMessage.classList.remove("hidden");
  
  // Ensure the element is in the layout (if it was set to display: none, set it to block)
  finalMessage.style.display = "block";
  
  // Trigger the opacity transition
  setTimeout(() => {
    finalMessage.classList.add("visible");
  }, 50); // slight delay to ensure display change takes effect
}
