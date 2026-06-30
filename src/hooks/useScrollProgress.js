import { useEffect, useState } from 'react';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
      setShowBackToTop(scrollTop > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add the progress bar and back-to-top button to the DOM
  useEffect(() => {
    // Create progress bar if not exists
    let progressBar = document.getElementById('scrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgress';
      progressBar.className = 'fixed top-0 left-0 right-0 h-1 z-50 bg-transparent';
      const inner = document.createElement('div');
      inner.className = 'h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-150';
      inner.id = 'progressBarInner';
      progressBar.appendChild(inner);
      document.body.appendChild(progressBar);
    }

    // Create back-to-top button if not exists
    let backBtn = document.getElementById('backToTop');
    if (!backBtn) {
      backBtn = document.createElement('button');
      backBtn.id = 'backToTop';
      backBtn.className =
        'fixed bottom-6 left-6 z-50 p-3 rounded-full bg-gold-500 text-dark-950 shadow-lg transition-all duration-300';
      backBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
      backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      document.body.appendChild(backBtn);
    }

    // Update progress bar and back-to-top visibility
    const updateUI = () => {
      const inner = document.getElementById('progressBarInner');
      if (inner) inner.style.width = `${progress}%`;
      const btn = document.getElementById('backToTop');
      if (btn) {
        if (showBackToTop) {
          btn.classList.remove('opacity-0', 'translate-y-5', 'pointer-events-none');
          btn.classList.add('opacity-100', 'translate-y-0');
        } else {
          btn.classList.add('opacity-0', 'translate-y-5', 'pointer-events-none');
          btn.classList.remove('opacity-100', 'translate-y-0');
        }
      }
    };
    updateUI();
  }, [progress, showBackToTop]);

  return { progress, showBackToTop };
};