document.getElementById("askOutBtn").addEventListener("click", function () {
  // Hide the envelope section
  document.getElementById("envelope").classList.add("hidden");
  
  // Hide the ask-out button as well
  this.classList.add("hidden");
  
  // Reveal the form section
  document.getElementById("coffeeForm").classList.remove("hidden");
});

// Global variable to store the clicked button's value
let selectedResponse = null;

// Add a click listener to each submit button to capture its value
document.querySelectorAll("#coffeeForm button[type='submit']").forEach(button => {
  button.addEventListener("click", function(e) {
    selectedResponse = e.target.value;
  });
});

document.getElementById("coffeeForm").addEventListener("submit", function (e) {
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
      document.getElementById("formMessage").textContent = "Thank you for your response: " + formData.get("response");
      console.log("Response submitted:", data);
    })
    .catch(error => {
      document.getElementById("formMessage").textContent = "There was an error submitting the form.";
      console.error("Error:", error);
    });
});
