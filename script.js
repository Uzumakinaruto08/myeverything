let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Shared move logic for both Mouse and Touch
    const handleMove = (clientX, clientY) => {
      if(!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }

    // --- MOUSE EVENTS ---
    document.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    // --- TOUCH EVENTS (MOBILE) ---
    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
    });

    paper.addEventListener('touchmove', (e) => {
      // This line is key: it stops the mobile page from scrolling while dragging
      e.preventDefault(); 
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
