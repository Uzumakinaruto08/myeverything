let highestZ = 1;

class Paper {
  holdingPaper = false;
  prevMouseX = 0;
  prevMouseY = 0;
  mouseX = 0;
  mouseY = 0;
  velocityX = 0;
  velocityY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;
  rotating = false;

  init(paper) {
    // Shared Move Logic
    const onMove = (clientX, clientY) => {
      if (!this.holdingPaper) return;

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velocityX = this.mouseX - this.prevMouseX;
        this.velocityY = this.mouseY - this.prevMouseY;

        this.currentPaperX += this.velocityX;
        this.currentPaperY += this.velocityY;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    // --- MOUSE ---
    document.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    // --- TOUCH (MOBILE) ---
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Capture initial touch position immediately
      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
    });

    paper.addEventListener('touchmove', (e) => {
      // Prevent browser from scrolling or zooming while dragging
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    // --- CLEANUP ---
    const endInteraction = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', endInteraction);
    window.addEventListener('touchend', endInteraction);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
