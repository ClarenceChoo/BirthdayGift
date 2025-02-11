// slideshow.js
(function() {
    const images = [
      'assets/images/image1.jpg',
      'assets/images/image2.jpg',
      'assets/images/image3.jpg',
      'assets/images/image4.jpg',
      'assets/images/image5.jpg',
      'assets/images/image6.jpg',
      'assets/images/image7.jpg',
      'assets/images/image8.jpg',
      'assets/images/image9.jpg',
      'assets/images/image10.jpg'
      // Add more image paths if needed
    ];
    
    // Preload images
    const preloadedImages = [];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
        preloadedImages.push(img);
    });

    let currentIndex = 0;
    const slideshowEl = document.getElementById('slideshow');
    
    // Ensure the container has a background color to hide any white flashes.
    slideshowEl.style.backgroundColor = '#000';
    
    // Create two slide elements.
    const slide1 = document.createElement('div');
    const slide2 = document.createElement('div');
    slide1.classList.add('slide');
    slide2.classList.add('slide');
    
    // Append slides to the container.
    slideshowEl.appendChild(slide1);
    slideshowEl.appendChild(slide2);
    
    // Set the initial image for the current slide.
    slide1.style.backgroundImage = `url(${images[currentIndex]})`;
    slide1.style.transform = 'translateX(0)';  // Fully visible
    
    // Prepare the next slide with the next image, positioned offscreen to the right.
    currentIndex = (currentIndex + 1) % images.length;
    slide2.style.backgroundImage = `url(${images[currentIndex]})`;
    slide2.style.transform = 'translateX(100%)';  // Offscreen to the right
    
    // Track the current and next slide.
    let currentSlide = slide1;
    let nextSlide = slide2;
    
    function nextSlideTransition() {
        // Set transitions on both slides.
        currentSlide.style.transition = 'transform 1.5s ease-in-out';
        nextSlide.style.transition = 'transform 1.5s ease-in-out';
        
        // Slide the current slide out to the left.
        currentSlide.style.transform = 'translateX(-100%)';
        // Slide the next slide in from the right.
        nextSlide.style.transform = 'translateX(0)';
        
        // After the transition, swap the roles.
        setTimeout(() => {
        // Swap references.
        let temp = currentSlide;
        currentSlide = nextSlide;
        nextSlide = temp;
        
        // Immediately reposition the new nextSlide offscreen to the right (without animation).
        nextSlide.style.transition = 'none';
        nextSlide.style.transform = 'translateX(100%)';
        
        // Force reflow so the browser applies the new position.
        void nextSlide.offsetWidth;
        
        // Re-enable transition for the next cycle.
        nextSlide.style.transition = 'transform 1.5s ease-in-out';
        
        // Update nextSlide's background image.
        currentIndex = (currentIndex + 1) % images.length;
        nextSlide.style.backgroundImage = `url(${images[currentIndex]})`;
        }, 1500); // Duration matches the CSS transition duration (1 second).
    }
    
    // Automatically trigger the transition every 5 seconds.
    setInterval(nextSlideTransition, 5000);
})();