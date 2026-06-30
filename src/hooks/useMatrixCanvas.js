import { useEffect } from 'react';

export const useMatrixCanvas = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / 20);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));
    };
    resize();
    window.addEventListener('resize', resize);

    const matrix = '0123456789ABCDEF';
    const draw = () => {
      ctx.fillStyle = 'rgba(5,5,10,0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#EAB308';
      ctx.font = '15px monospace';
      for (let i = 0; i < drops.length; i++) {
        const char = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(char, i * 20, drops[i] * 20);
        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
};