// Logic-only JavaScript: selects DOM elements and attaches behavior.
// Refactored for clarity: separate hero (drag) slider and main (carousel) slider.

/** Clamp a number between min and max (inclusive). */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ---------------------- Hero (drag) slider ---------------------- */

function initHeroDragSlider() {
  const slider = document.getElementById('alien-slider');
  if (!slider) return;               // no hero slider on this page

  // State for pointer-drag translation

  let isPointerDown = false;
  let pointerStartX = 0;
  let lastTranslate = 0;          // translate value before current drag
  let currentTranslate = 0;       // current translate applied

  const MAX_LEFT = -3000;         // limit for dragging left (px)
  const MAX_RIGHT = 0;            // limit for dragging right (px)

  slider.style.transform = 'translateX(0px)';

  slider.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    pointerStartX = e.clientX;
    slider.setPointerCapture?.(e.pointerId);
    slider.style.cursor = 'grabbing';
  });

  slider.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - pointerStartX;
    const next = lastTranslate + dx;
    const clamped = clamp(next, MAX_LEFT, MAX_RIGHT);
    slider.style.transform = `translateX(${clamped}px)`;
    currentTranslate = clamped;
  });

  function finishDrag(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    lastTranslate = currentTranslate;
    slider.style.cursor = 'grab';
    try { slider.releasePointerCapture?.(e.pointerId); } catch (err) {}
  }

  slider.addEventListener('pointerup', finishDrag);
  slider.addEventListener('pointercancel', finishDrag);
}

/* ---------------------- Main carousel slider ---------------------- */

function initMainSlider() {

  // Data for each slide (keeps this separate from DOM rendering code)

  const aliens = [
    { name: 'Swampfire', img: 'images/slider4.png', description: 'A methane-based alien with plant powers and the ability to ignite flames.', background: 'linear-gradient(135deg, #0a0f2c, #0d3b1f)' },
    { name: 'Humungousaur', img: 'images/slider6.png', description: 'A giant dinosaur-like alien with immense strength and durability.', background: 'linear-gradient(135deg, #1a0f0f, #4d1a1a)' },
    { name: 'Big Chill', img: 'images/slider1.png', description: 'A moth-like alien with the power of intangibility and ice breath.', background: 'linear-gradient(135deg, #0a0f2c, #1e3c72)' },
    { name: 'Echo Echo', img: 'images/slider2.png', description: 'A small silicon-based alien capable of creating sonic clones.', background: 'linear-gradient(135deg, #1a1a1a, #444444)' },
    { name: 'Chromastone', img: 'images/slider5.png', description: 'A crystalline alien with the ability to absorb and channel energy.', background: 'linear-gradient(135deg, #220a2c, #6e1f7c)' },
    { name: 'Rath', img: 'images/slider3.png', description: 'A tiger-like alien with unmatched strength and ferocity.', background: 'linear-gradient(135deg, #2c0a0a, #ff6600)' }
  ];

  const mainSlider = document.getElementById('main-slider');
  const imageElements = Array.from(document.querySelectorAll('#slider-images .alien-img'));
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const info = document.getElementById('slider-info');
  const titleEl = document.getElementById('slider-title');
  const descEl = document.getElementById('slider-desc');

  // Index of the currently active slide

  let currentIndex = 0;

  /** Update DOM to reflect `currentIndex`. Keeps visual layout rules here. */

  function render() {
    if (mainSlider) mainSlider.style.background = aliens[currentIndex].background;

    imageElements.forEach((imgEl, i) => {

      // offset is how far this element is from the active index in circular space

      const offset = (i - currentIndex + aliens.length) % aliens.length;
      let x = 0, y = 0, scale = 1, opacity = 1, blur = 'none', zIndex = 1;

      // Positioning rules for three main visible slots (center, right, left)

      if (offset === 0) {

        // center (active)

        x = 0; y = 0; scale = 1.4; opacity = 1; blur = 'none'; zIndex = 3;
      } else if (offset === 1) {

        // right neighbor

        x = 220; y = -90; scale = 0.95; opacity = 0.4; blur = 'blur(3px)'; zIndex = 2;
      } else if (offset === aliens.length - 1) {

        // left neighbor (wrap-around)

        x = -290; y = 200; scale = 0.65; opacity = 0.4; blur = 'blur(6px)'; zIndex = 2;
      } else {

        // off-screen / hidden

        x = 0; y = 0; scale = 0.9; opacity = 0; blur = 'blur(10px)'; zIndex = 0;
      }

      imgEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      imgEl.style.opacity = opacity;
      imgEl.style.filter = blur;
      imgEl.style.zIndex = zIndex;
    });

    // Fade out info, change text, fade back in for a subtle transition

    if (info && titleEl && descEl) {
      info.style.opacity = 0;
      setTimeout(() => {
        titleEl.textContent = aliens[currentIndex].name;
        descEl.textContent = aliens[currentIndex].description;
        info.style.opacity = 1;
      }, 160);
    }
  }

  // Button wiring (safe-guard if buttons are missing)

  leftBtn?.addEventListener('click', () => { currentIndex = (currentIndex - 1 + aliens.length) % aliens.length; render(); });
  rightBtn?.addEventListener('click', () => { currentIndex = (currentIndex + 1) % aliens.length; render(); });

  // Initial paint

  render();
}

// Initialize both widgets when the script loads

(function initAll() {
  initHeroDragSlider();
  initMainSlider();
})();

// Logic-only JavaScript: select DOM elements and attach behavior (no HTML creation here)

/* Hero slider drag behavior */

(function() {
  const slider = document.getElementById('alien-slider');
  if (!slider) return;

  let isDown = false;
  let startX = 0;
  let prevTranslate = 0;
  let currentTranslate = 0;
  const MAX_LEFT = -3000;
  const MAX_RIGHT = 0;

  slider.style.transform = 'translateX(0px)';

  slider.addEventListener('pointerdown', (e) => {
    isDown = true;
    startX = e.clientX;
    slider.setPointerCapture(e.pointerId);
    slider.style.cursor = 'grabbing';
  });

  slider.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    const next = prevTranslate + dx;
    const clamped = Math.max(MAX_LEFT, Math.min(MAX_RIGHT, next));
    slider.style.transform = `translateX(${clamped}px)`;
    currentTranslate = clamped;
  });

  slider.addEventListener('pointerup', (e) => {
    if (!isDown) return;
    isDown = false;
    prevTranslate = currentTranslate;
    slider.style.cursor = 'grab';
    try { slider.releasePointerCapture(e.pointerId); } catch (err) {}
  });

  slider.addEventListener('pointercancel', () => {
    isDown = false;
    prevTranslate = currentTranslate;
    slider.style.cursor = 'grab';
  });
})();


/* Main slider: update positions and info */


(function(){
  const aliens = [
    { name: 'Swampfire', img: 'images/slider4.png', description: 'A methane-based alien with plant powers and the ability to ignite flames.', background: 'linear-gradient(135deg, #0a0f2c, #0d3b1f)'},
    { name: 'Humungousaur', img: 'images/slider6.png', description: 'A giant dinosaur-like alien with immense strength and durability.', background: 'linear-gradient(135deg, #1a0f0f, #4d1a1a)'},
    { name: 'Big Chill', img: 'images/slider1.png', description: 'A moth-like alien with the power of intangibility and ice breath.', background: 'linear-gradient(135deg, #0a0f2c, #1e3c72)'},
    { name: 'Echo Echo', img: 'images/slider2.png', description: 'A small silicon-based alien capable of creating sonic clones.', background: 'linear-gradient(135deg, #1a1a1a, #444444)'},
    { name: 'Chromastone', img: 'images/slider5.png', description: 'A crystalline alien with the ability to absorb and channel energy.', background: 'linear-gradient(135deg, #220a2c, #6e1f7c)'},
    { name: 'Rath', img: 'images/slider3.png', description: 'A tiger-like alien with unmatched strength and ferocity.', background: 'linear-gradient(135deg, #2c0a0a, #ff6600)'}
  ];


  const mainSlider = document.getElementById('main-slider');
  const imgs = Array.from(document.querySelectorAll('#slider-images .alien-img'));
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const info = document.getElementById('slider-info');
  const title = document.getElementById('slider-title');
  const desc = document.getElementById('slider-desc');


  let index = 0;


  function render(){
    if (mainSlider) mainSlider.style.background = aliens[index].background;


    imgs.forEach((imgEl, i) => {
      const offset = (i - index + aliens.length) % aliens.length;
      let x = 0, y = 0, scale = 1, opacity = 1, blur = 'none', zIndex = 1;


      if (offset === 0) { x = 0; y = 0; scale = 1.4; opacity = 1; blur = 'none'; zIndex = 3; }
      else if (offset === 1) { x = 220; y = -90; scale = 0.95; opacity = 0.4; blur = 'blur(3px)'; zIndex = 2; }
      else if (offset === aliens.length - 1) { x = -290; y = 200; scale = 0.65; opacity = 0.4; blur = 'blur(6px)'; zIndex = 2; }
      else { x = 0; y = 0; scale = 0.9; opacity = 0; blur = 'blur(10px)'; zIndex = 0; }


      imgEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      imgEl.style.opacity = opacity;
      imgEl.style.filter = blur;
      imgEl.style.zIndex = zIndex;
    });


    if (info && title && desc) {
      info.style.opacity = 0;
      setTimeout(() => {
        title.textContent = aliens[index].name;
        desc.textContent = aliens[index].description;
        info.style.opacity = 1;
      }, 160);
    }
  }

  leftBtn && leftBtn.addEventListener('click', () => { index = (index - 1 + aliens.length) % aliens.length; render(); });
  rightBtn && rightBtn.addEventListener('click', () => { index = (index + 1) % aliens.length; render(); });

  render();
})();