import React, { useEffect, useRef } from 'react';

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const ParticleText = React.memo(({ text, isDark }) => {
  const canvasRef = useRef(null);
  // Cache rect to avoid calling getBoundingClientRect on every mousemove
  const canvasRectRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    const mouse = { x: -1000, y: -1000, radius: 150 };

    let firstLoad = true;
    let loadTimer;

    const updateCanvasRect = () => {
      if (canvas) {
        canvasRectRef.current = canvas.getBoundingClientRect();
      }
    };

    // Update rect on scroll and resize
    window.addEventListener('scroll', updateCanvasRect, { passive: true });

    // Initial rect
    updateCanvasRect();

    const handleMouseMove = (event) => {
      // Use cached rect if available, fallback to getBoundingClientRect if needed (though it should be cached)
      let rect = canvasRectRef.current;
      if (!rect) {
        rect = canvas.getBoundingClientRect();
        canvasRectRef.current = rect;
      }
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ✅ Added touch support for mobile bounce
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      let rect = canvasRectRef.current;
      if (!rect) {
        rect = canvas.getBoundingClientRect();
        canvasRectRef.current = rect;
      }
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // ✅ Responsive canvas height and width based on container
    const setDimensions = () => {
      const parentWidth = canvas.parentNode.clientWidth;
      canvas.width = parentWidth;

      if (window.innerWidth < 640) {
        canvas.height = 200; // tighter on mobile
      } else {
        canvas.height = 300; // default for tablet/desktop
      }
      updateCanvasRect();
    };

    setDimensions();

    class Particle {
      constructor(x, y, color) {
        this.x = x + Math.random() * 10 - 5; // Slight jitter on init
        this.y = y + Math.random() * 10 - 5;
        this.color = color;
        this.size = 2.5;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 40) + 5;
        this.opacity = 1;
      }

      draw() {
        ctx.fillStyle = `rgba(${isDark ? "255,255,255" : "15,23,42"},${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        if (firstLoad) {
          // Just settle into position safely
          let dx = this.baseX - this.x;
          let dy = this.baseY - this.y;
          this.x += dx / 20;
          this.y += dy / 20;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = (forceDirectionX * force * this.density);
        let directionY = (forceDirectionY * force * this.density);

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }

        // Twinkle effect - optimized math
        if (Math.random() < 0.002) {
          this.opacity = 0.2;
        } else if (this.opacity < 1) {
          this.opacity += 0.05;
        }
      }
    }

    const init = () => {
      particlesArray = [];
      const textColor = isDark ? 'rgba(255,255,255,1)' : 'rgba(15, 23, 42, 1)';

      // ✅ Responsive font size
      let fontSize = 100; // desktop default
      const width = window.innerWidth;

      if (width < 400) {
        fontSize = 40; // small mobile
      } else if (width < 640) {
        fontSize = 50; // mobile
      } else if (width < 1024) {
        fontSize = 80; // tablet
      }

      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px Poppins`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // Don't clear rect immediately if we want to debug, but here it's fine
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < textCoordinates.height; y += 6) {
        for (let x = 0; x < textCoordinates.width; x += 6) {
          // Optimized loop: += 6 instead of check % 6 inside
          if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
            particlesArray.push(new Particle(x, y, textColor));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    loadTimer = setTimeout(() => {
      firstLoad = false;
    }, 1000);

    const handleResize = debounce(() => {
      setDimensions();
      init();
    }, 200); // 200ms debounce

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', updateCanvasRect);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(loadTimer);
    };
  }, [text, isDark]);

  return <canvas ref={canvasRef} style={{ width: '100%' }}></canvas>;
});

export default ParticleText;
