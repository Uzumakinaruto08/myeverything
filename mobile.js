let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;
  rotating = false;

  init(paper) {
    // Handle Move
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.holdingPaper) return;

      // Calculate how much the finger has moved since the last frame
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      const deltaX = touchX - this.prevTouchX;
      const deltaY = touchY - this.prevTouchY;

      if (!this.rotating) {
        this.currentPaperX += deltaX;
        this.currentPaperY += deltaY;
      }

      // Update previous touch points for the next move event
      this.prevTouchX = touchX;
      this.prevTouchY = touchY;

      // Apply Transformation
      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }, { passive: false });

    // Handle Start
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return; 
      this.holdingPaper = true;

      // Bring paper to front
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Initialize touch points
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    // Handle End
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Special Gesture for iOS (Rotation)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    
    paper.addEventListener('gesturechange', (e) => {
       if (this.rotating) {
         this.rotation += e.rotation; // Basic rotation increment
         paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
       }
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
