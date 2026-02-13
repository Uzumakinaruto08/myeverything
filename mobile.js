let highestZ = 1;

class Paper {
  holdingPaper = false;
  prevTouchX = 0;
  prevTouchY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;
  rotating = false;

  init(paper) {
    // MOVE EVENT
    paper.addEventListener('touchmove', (e) => {
      // Importante ito para hindi gumalaw ang buong webpage habang nagda-drag
      e.preventDefault();
      
      if (!this.holdingPaper) return;

      const touch = e.touches[0];
      
      // Kunin ang distansya ng nilakbay ng daliri
      const deltaX = touch.clientX - this.prevTouchX;
      const deltaY = touch.clientY - this.prevTouchY;

      if (!this.rotating) {
        this.currentPaperX += deltaX;
        this.currentPaperY += deltaY;
      }

      // I-update ang prev values para sa susunod na frame
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;

      // I-apply ang galaw sa papel
      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }, { passive: false }); // 'passive: false' ay kailangan sa mobile browsers

    // START EVENT
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return; 
      this.holdingPaper = true;

      // Paibabawin ang papel na hinawakan
      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;
    });

    // END EVENT
    const stopHolding = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    paper.addEventListener('touchend', stopHolding);
    paper.addEventListener('touchcancel', stopHolding);

    // PARA SA IOS GESTURES (ROTATION)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gesturechange', (e) => {
      e.preventDefault();
      if (this.rotating) {
        this.rotation += e.rotation; 
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
