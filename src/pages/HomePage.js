import React, { useState, useEffect, useRef, useCallback } from 'react';

const HomePage = () => {
  // ---------- state ----------
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWeekPage, setIsWeekPage] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [progress, setProgress] = useState(0);
  const [navbarBg, setNavbarBg] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({});
  const [typingText, setTypingText] = useState('');
  const [statCounters, setStatCounters] = useState({});

  // refs
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);
  const backToTopRef = useRef(null);
  const typingPhrases = ['الإبداع', 'الاحتراف', 'ECPC'];

  // ---------- data ----------
  const weeksData = [
    {
      num: 1,
      title: 'Introduction to Programming & Problem Solving',
      titleAr: 'مقدمة في البرمجة وحل المشكلات',
      topics: [
        'What is Programming?',
        'What is Problem Solving?',
        'How Programmers Think',
        'Problem Solving Strategy: Read → Analyze → Plan → Code → Test',
        'Development Environment: VS Code, C++ Compiler',
        'C++ Fundamentals: Variables, Data Types, Constants, Operators',
        'Competitive Programming Setup: Codeforces, VJudge'
      ],
      practice: 'Beginner Problems — Level A-B-C',
      challenge: ['Problem A — قريباً', 'Problem B — قريباً', 'Problem C — قريباً']
    },
    {
      num: 2,
      title: 'Decision Making & Repetition',
      titleAr: 'اتخاذ القرارات والتكرار',
      topics: [
        'Conditions: if, else if, else, switch',
        'Loops: for, while, do while',
        'Functions: Definition, Parameters, Return Values, Recursion',
        'Scope: Local vs Global Variables',
        'Passing Parameters: Pass by Value, Pass by Reference',
        'Basic Debugging: Error Messages, cout Debugging, Testing'
      ],
      practice: 'Conditions, Loops & Functions Practice',
      challenge: ['Problem A — قريباً', 'Problem B — قريباً', 'Problem C — قريباً']
    },
    {
      num: 3,
      title: 'Arrays, Strings & Memory',
      titleAr: 'المصفوفات والنصوص والذاكرة',
      topics: [
        'Arrays: Declaration, Traversal, Update, Linear Search',
        'Strings: Length, Access, Compare, Basic Operations',
        'Vector: Declaration, Push Back, Size, Traversal',
        'Memory Basics: Variables in Memory, Address Operator, Pointers'
      ],
      practice: 'Array & String Problems',
      challenge: ['Problem A — قريباً', 'Problem B — قريباً', 'Problem C — قريباً']
    },
    {
      num: 4,
      title: 'STL & Data Structures',
      titleAr: 'المكتبة القياسية وهياكل البيانات',
      topics: [
        'Data Structures: Array, Vector, Stack, Queue, Set, Map, etc.',
        'STL Containers: Vector, Pair, Stack, Queue, Set, Map',
        'STL Algorithms: sort, reverse, min_element, max_element, binary_search',
        'Choosing the Right Data Structure'
      ],
      practice: 'STL Problems & Data Structure Contest',
      challenge: ['Problem A — قريباً', 'Problem B — قريباً', 'Problem C — قريباً']
    },
    {
      num: 5,
      title: 'Problem Solving Techniques',
      titleAr: 'تقنيات حل المشكلات',
      topics: [
        'Complexity Analysis: Big O Notation, O(1), O(log n), O(n), O(n²)',
        'Binary Search: When to Use, Implementation',
        'Prefix Sum',
        'Two Pointers',
        'Tree Introduction: Nodes, Root, Parent, Leaf, Binary Tree'
      ],
      practice: 'Binary Search & Two Pointers Problems',
      challenge: ['Problem A — قريباً', 'Problem B — قريباً', 'Problem C — قريباً']
    }
  ];

  // ---------- helpers ----------
  const toggleAccordion = (index) => {
    setAccordionOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const showWeek = (weekNum) => {
    const week = weeksData.find(w => w.num === weekNum);
    setCurrentWeek(week);
    setIsWeekPage(true);
    window.scrollTo(0, 0);
  };

  const showMain = () => {
    setIsWeekPage(false);
    setCurrentWeek(null);
    window.scrollTo(0, 0);
  };

  // ---------- effects ----------

  // Matrix canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops, fontSize = 14;

    const resize = () => {
      const parent = canvas.parentElement;
      width = window.innerWidth;
      height = parent ? parent.offsetHeight : window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };
    resize();

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#EAB308';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '0' : '1';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    window.addEventListener('resize', resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Typing effect
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const currentPhrase = typingPhrases[phraseIndex];
      if (isDeleting) {
        setTypingText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypingText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;
      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        speed = 500;
      }
      timeout = setTimeout(type, speed);
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setNavbarBg(scrolled > 50);

      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progressVal = (scrolled / height) * 100;
      setProgress(progressVal);

      if (backToTopRef.current) {
        if (scrolled > 500) {
          backToTopRef.current.classList.add('visible');
        } else {
          backToTopRef.current.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for reveal and stat counters
  useEffect(() => {
    // Reveal
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));

    // Stat counters
    const statEls = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          let current = 0;
          const increment = target / 30;
          const update = () => {
            if (current < target) {
              current += increment;
              entry.target.textContent = Math.ceil(current);
              requestAnimationFrame(update);
            } else {
              entry.target.textContent = target;
            }
          };
          update();
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      statObserver.disconnect();
    };
  }, []);

  // Active nav link (simplified - we'll add a scroll listener to update active class)
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleNav = () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleNav);
    return () => window.removeEventListener('scroll', handleNav);
  }, []);

  // ---------- render ----------

  if (isWeekPage && currentWeek) {
    // Week detail page
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-950" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <button onClick={showMain} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold-500 transition-colors">
            <iconify-icon icon="lucide:arrow-right"></iconify-icon>
            العودة للرئيسية
          </button>
          <div className="glow-card p-6 sm:p-10 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <span className="text-2xl font-black gradient-text-gold font-mono">{currentWeek.num}</span>
              </div>
              <div>
                <div className="text-xs text-gold-500 font-mono font-bold mb-1">WEEK {currentWeek.num}</div>
                <h1 className="text-2xl sm:text-3xl font-black">{currentWeek.titleAr}</h1>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-xl p-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:book-open" className="text-gold-500"></iconify-icon>
                  المواضيع
                </h3>
                <ul className="space-y-2">
                  {currentWeek.topics.map((t, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-dark-800 rounded-xl p-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:code" className="text-gold-500"></iconify-icon>
                  الممارسة والتحدي
                </h3>
                <p className="text-sm text-gray-400 mb-4">{currentWeek.practice}</p>
                <h4 className="text-xs font-bold text-gray-500 mb-2">التحديات:</h4>
                <ul className="space-y-2">
                  {currentWeek.challenge.map((c, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                      <iconify-icon icon="lucide:swords" className="text-gold-500 text-xs"></iconify-icon>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main page
  return (
    <div className="min-h-screen bg-dark-950 text-white font-cairo" dir="rtl">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', sans-serif; background: #05050A; color: #fff; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #05050A; }
        ::-webkit-scrollbar-thumb { background: #EAB308; border-radius: 3px; }
        html { scroll-behavior: smooth; }
        #scrollProgress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 9999; }
        #scrollProgress .bar { height: 100%; width: 0; background: linear-gradient(90deg, #EAB308, #FDE047); transition: width .1s linear; border-radius: 0 2px 2px 0; }
        #matrixCanvas { position: absolute; inset: 0; z-index: 0; opacity: .05; }
        @media (max-width:768px) { #matrixCanvas { display: none; } }
        .reveal { opacity: 0; transform: translateY(30px); transition: all .8s cubic-bezier(.16, 1, .3, 1); }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: .1s; }
        .reveal-d2 { transition-delay: .2s; }
        .reveal-d3 { transition-delay: .3s; }
        .reveal-d4 { transition-delay: .4s; }
        .reveal-d5 { transition-delay: .5s; }
        .typing-cursor { display: inline-block; width: 3px; height: 1em; background: #EAB308; margin-right: 4px; animation: blink .8s infinite; vertical-align: text-bottom; }
        @keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .gradient-text { background: linear-gradient(135deg, #fff 0%, #EAB308 50%, #FDE047 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gradient-text-gold { background: linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #CA8A04 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glow-card { position: relative; background: #0A0A10; border: 1px solid rgba(255, 255, 255, .06); border-radius: 16px; transition: all .5s cubic-bezier(.16, 1, .3, 1); }
        .glow-card:hover { transform: translateY(-4px); border-color: rgba(234, 179, 8, .2); box-shadow: 0 20px 40px -15px rgba(234, 179, 8, .12); }
        .particle { position: absolute; width: 3px; height: 3px; background: #EAB308; border-radius: 50%; opacity: 0; animation: fp 20s infinite ease-in-out; }
        @keyframes fp { 0% { opacity: 0; transform: translateY(0) translateX(0); } 10% { opacity: .3; } 90% { opacity: .3; } 100% { opacity: 0; transform: translateY(-400px) translateX(80px); } }
        .scroll-ind { animation: sb 2s infinite; }
        @keyframes sb { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; right: 0; left: 0; height: 2px; background: #EAB308; transform: scaleX(0); transition: transform .3s; transform-origin: right; }
        .nav-link.active::after { transform: scaleX(1); }
        .mobile-menu { transform: translateX(100%); transition: transform .4s cubic-bezier(.16, 1, .3, 1); }
        .mobile-menu.open { transform: translateX(0); }
        .stat-number { font-variant-numeric: tabular-nums; }
        .badge-pulse { animation: pg 2s infinite; }
        @keyframes pg { 0%,100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, .4); } 50% { box-shadow: 0 0 0 8px rgba(234, 179, 8, 0); } }
        .accordion-content { max-height: 0; overflow: hidden; transition: max-height .5s cubic-bezier(.16, 1, .3, 1); }
        .accordion-content.open { max-height: 800px; }
        .accordion-icon { transition: transform .3s; }
        .accordion-icon.rotated { transform: rotate(180deg); }
        .gallery-item { overflow: hidden; border-radius: 12px; position: relative; }
        .gallery-item img { transition: transform .7s cubic-bezier(.16, 1, .3, 1); }
        .gallery-item:hover img { transform: scale(1.08); }
        #backToTop { opacity: 0; transform: translateY(20px); transition: all .3s; pointer-events: none; }
        #backToTop.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .hero-content>* { opacity: 0; transform: translateY(25px); animation: hi .8s forwards; }
        .hero-content>*:nth-child(1) { animation-delay: .2s; }
        .hero-content>*:nth-child(2) { animation-delay: .4s; }
        .hero-content>*:nth-child(3) { animation-delay: .6s; }
        .hero-content>*:nth-child(4) { animation-delay: .8s; }
        @keyframes hi { to { opacity: 1; transform: translateY(0); } }
        .section-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(234, 179, 8, .15), transparent); }
        .rank-card { border-radius: 16px; padding: 20px; transition: all .4s; position: relative; overflow: hidden; }
        .rank-card::before { content: ''; position: absolute; inset: 0; border-radius: 16px; padding: 1px; background: linear-gradient(135deg, rgba(234, 179, 8, .2), transparent, rgba(234, 179, 8, .1)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
        .rank-card:hover { transform: translateX(-4px); }
        .resource-icon { transition: all .3s; }
        .glow-card:hover .resource-icon { color: #EAB308; transform: scale(1.1); }
        .empty-float { animation: ef 3s ease-in-out infinite; }
        @keyframes ef { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .hamburger-line { display: block; width: 22px; height: 2px; background: #fff; border-radius: 1px; transition: all .3s cubic-bezier(.16, 1, .3, 1); }
        .hamburger.active .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.active .hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .journey-node { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; z-index: 2; flex-shrink: 0; transition: all .3s; }
        @media (min-width:640px) { .journey-node { width: 56px; height: 56px; font-size: 22px; } }
        .journey-done { background: #EAB308; color: #05050A; box-shadow: 0 0 15px rgba(234, 179, 8, .3); }
        .journey-current { background: #0A0A10; border: 2px solid #EAB308; color: #EAB308; animation: pg 2s infinite; }
        .journey-locked { background: #18181F; border: 1px solid rgba(255, 255, 255, .05); color: #3F3F46; }
        .journey-line { flex: 1; height: 4px; background: rgba(255, 255, 255, .08); position: relative; border-radius: 2px; }
        .journey-line .fill { position: absolute; inset: 0; background: #EAB308; border-radius: 2px; width: 100%; }
        .journey-line.locked .fill { width: 0; }
        .topic-tag { transition: all .2s; }
        .topic-tag:hover { background: rgba(234, 179, 8, .15); color: #FDE047; }
      `}</style>

      {/* Scroll Progress */}
      <div id="scrollProgress">
        <div className="bar" ref={progressBarRef} style={{ width: `${progress}%` }}></div>
      </div>

      {/* Navigation */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navbarBg ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="#" onClick={showMain} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-dark-950 font-bold text-sm font-mono group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-shadow">PS</div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold tracking-wider text-gold-500">ICPC OTU</div>
                <div className="text-[10px] text-gray-500 tracking-wide">SUMMER CAMP</div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8" id="desktopNav">
              <a href="#about" className="nav-link text-sm text-gray-400 hover:text-white transition-colors">عن المعسكر</a>
              <a href="#progress" className="nav-link text-sm text-gray-400 hover:text-white transition-colors">الرحلة</a>
              <a href="#roadmap" className="nav-link text-sm text-gray-400 hover:text-white transition-colors">المسار</a>
              <a href="#leaderboard" className="nav-link text-sm text-gray-400 hover:text-white transition-colors">المتصدرين</a>
              <a href="#gamification" className="nav-link text-sm text-gray-400 hover:text-white transition-colors">التقييم</a>
              <a href="#resources" className="nav-link text-sm text-gray-400 hover:text-white transition-colors">الموارد</a>
              <a href="online-compiler.html" className="nav-link text-sm text-gold-400 hover:text-gold-300 transition-colors font-semibold flex items-center gap-1.5">
                <iconify-icon icon="lucide:code-2" className="text-base"></iconify-icon>
                المترجم
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              id="menuToggle"
              className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="القائمة"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu fixed inset-0 z-40 bg-dark-950/98 backdrop-blur-xl lg:hidden ${isMobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <div className="flex flex-col items-center justify-center h-full gap-7">
          <a href="#about" className="mobile-nav-link text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>عن المعسكر</a>
          <a href="#progress" className="mobile-nav-link text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>الرحلة</a>
          <a href="#roadmap" className="mobile-nav-link text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>المسار</a>
          <a href="#leaderboard" className="mobile-nav-link text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>المتصدرين</a>
          <a href="#gamification" className="mobile-nav-link text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>التقييم</a>
          <a href="#resources" className="mobile-nav-link text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>الموارد</a>
          <a href="online-compiler.html" className="mobile-nav-link text-2xl font-bold text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <iconify-icon icon="lucide:code-2"></iconify-icon>
            المترجم
          </a>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <canvas id="matrixCanvas" ref={canvasRef}></canvas>
        <div className="particle" style={{ left: '10%', top: '80%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '30%', top: '90%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ left: '55%', top: '85%', animationDelay: '8s' }}></div>
        <div className="particle" style={{ left: '80%', top: '75%', animationDelay: '12s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-[100px]"></div>

        <div className="hero-content relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/20 bg-gold-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-500 badge-pulse"></span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-gold-400">Powered by ICPC OTU Community</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-4">
            <span className="block gradient-text">Problem Solving</span>
            <span className="block text-white mt-2">Summer Camp <span className="gradient-text-gold">2026</span></span>
          </h1>
          <div className="text-base sm:text-xl md:text-2xl text-gray-400 mb-10 h-8 flex items-center justify-center">
            <span>رحلتك نحو</span>
            <span className="text-gold-400 font-bold mx-2" id="typingText">{typingText}</span>
            <span className="typing-cursor"></span>
          </div>
          <a href="#about" className="group inline-flex items-center gap-2 border border-white/10 hover:border-white/25 text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-full transition-all hover:bg-white/5">
            <span>اكتشف المعسكر</span>
            <iconify-icon icon="lucide:chevron-down" className="group-hover:translate-y-0.5 transition-transform"></iconify-icon>
          </a>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-20 sm:py-28 relative">
        <div className="section-divider mb-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">About The Camp</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">ما هو <span className="gradient-text-gold">المعسكر</span>؟</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              بيئة تعليمية تفاعلية خلال الإجازة الصيفية لتطوير مهارات البرمجة وحل المشكلات، يعتمد على التعلم العملي والتفاعل والمنافسة لإعداد المشاركين للمسابقات البرمجية وعلى رأسها <span className="text-gold-400 font-bold">ECPC</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto mb-12">
            <div className="glow-card p-6 sm:p-8 text-center reveal reveal-d1">
              <div className="text-3xl sm:text-5xl font-black gradient-text-gold stat-number" data-target="5">0</div>
              <div className="text-sm text-gray-400 mt-2 font-medium">أسابيع</div>
            </div>
            <div className="glow-card p-6 sm:p-8 text-center reveal reveal-d2">
              <div className="text-3xl sm:text-5xl font-black gradient-text-gold stat-number" data-target="10">0</div>
              <div className="text-sm text-gray-400 mt-2 font-medium">جلسة</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="glow-card p-6 reveal reveal-d2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center"><iconify-icon icon="lucide:users" className="text-gold-500 text-lg"></iconify-icon></div>
                <h3 className="font-bold">الفئة المستهدفة</h3>
              </div>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><iconify-icon icon="lucide:check" className="text-gold-500 text-xs flex-shrink-0"></iconify-icon>جميع طلاب الجامعة المهتمين بالبرمجة</li>
                <li className="flex items-center gap-2"><iconify-icon icon="lucide:check" className="text-gold-500 text-xs flex-shrink-0"></iconify-icon>المبتدئون في البرمجة</li>
                <li className="flex items-center gap-2"><iconify-icon icon="lucide:check" className="text-gold-500 text-xs flex-shrink-0"></iconify-icon>الراغبون في دخول مسابقات البرمجة</li>
                <li className="flex items-center gap-2"><iconify-icon icon="lucide:check" className="text-gold-500 text-xs flex-shrink-0"></iconify-icon>الفرق المشاركة في ECPC</li>
              </ul>
            </div>
            <div className="glow-card p-6 reveal reveal-d3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center"><iconify-icon icon="lucide:calendar" className="text-gold-500 text-lg"></iconify-icon></div>
                <h3 className="font-bold">هيكل البرنامج</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-gold-500 font-mono font-bold text-xs mt-0.5 flex-shrink-0">الاثنين</span>
                  <div><div className="text-white font-semibold">Workshop Day</div><div className="text-gray-500 text-xs">2 ساعة</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold-500 font-mono font-bold text-xs mt-0.5 flex-shrink-0">الأربعاء</span>
                  <div><div className="text-white font-semibold">Problem Solving Lab</div><div className="text-gray-500 text-xs">2 ساعة</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold-500 font-mono font-bold text-xs mt-0.5 flex-shrink-0">التوقيت</span>
                  <div><div className="text-white font-semibold">12:00 PM</div><div className="text-gray-500 text-xs">لقاءان أسبوعياً</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROGRESS ===== */}
      <section id="progress" className="py-16 sm:py-24 relative bg-dark-900/50">
        <div className="section-divider mb-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Camp Progress</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">رحلة <span className="gradient-text-gold">المعسكر</span></h2>
            <p className="text-gray-400 text-sm">المعسكر لم يبدأ بعد - تابع معنا</p>
          </div>

          <div className="glow-card p-6 sm:p-10 reveal">
            <div className="flex items-center justify-between gap-1 sm:gap-2 relative">
              {[1,2,3,4,5].map((w) => (
                <React.Fragment key={w}>
                  <div className="flex flex-col items-center gap-3 w-1/5">
                    <div className="journey-node journey-locked">
                      <iconify-icon icon="lucide:lock"></iconify-icon>
                    </div>
                    <span className="text-[10px] sm:text-sm font-bold text-gray-600">الأسبوع {w}</span>
                  </div>
                  {w < 5 && <div className="journey-line locked"><div className="fill"></div></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section id="roadmap" className="py-20 sm:py-28 relative">
        <div className="section-divider mb-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Learning Path</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">المسار <span className="gradient-text-gold">التعليمي</span></h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">اضغط على أي أسبوع لعرض الموارد والتفاصيل الكاملة</p>
          </div>
          <div className="space-y-4" id="roadmapCards">
            {weeksData.map((week, idx) => (
              <div key={week.num} className={`glow-card overflow-hidden reveal`} style={{ transitionDelay: `${idx * 0.1}s` }}>
                <button
                  className="w-full p-5 sm:p-6 flex items-center gap-4 text-right"
                  onClick={() => toggleAccordion(idx)}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold-500/5 border border-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-black gradient-text-gold font-mono">{week.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gold-500 font-mono font-bold mb-1">WEEK {week.num}</div>
                    <h3 className="font-bold text-sm sm:text-lg truncate">{week.titleAr}</h3>
                  </div>
                  <iconify-icon
                    icon="lucide:chevron-down"
                    className={`accordion-icon text-gold-500 text-xl transition-transform ${accordionOpen[idx] ? 'rotated' : ''}`}
                  ></iconify-icon>
                </button>
                <div className={`accordion-content ${accordionOpen[idx] ? 'open' : ''}`}>
                  <div className="p-5 sm:p-6 pt-0 border-t border-white/5 mt-2">
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                          <iconify-icon icon="lucide:book-open" className="text-gold-500"></iconify-icon>
                          المواضيع
                        </h4>
                        <ul className="space-y-1.5">
                          {week.topics.map((t, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                              <span className="w-1 h-1 bg-gold-500 rounded-full"></span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                          <iconify-icon icon="lucide:code" className="text-gold-500"></iconify-icon>
                          الممارسة
                        </h4>
                        <p className="text-xs text-gray-400 mb-3">{week.practice}</p>
                        <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                          <iconify-icon icon="lucide:swords" className="text-gold-500"></iconify-icon>
                          التحدي
                        </h4>
                        <ul className="space-y-1.5">
                          {week.challenge.map((c, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                              <span className="w-1 h-1 bg-gold-500 rounded-full"></span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADVANCED TRACK ===== */}
      <section className="py-20 sm:py-28 relative bg-dark-900/50">
        <div className="section-divider mb-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-xs font-semibold text-gold-400 mb-4">
              <iconify-icon icon="lucide:trophy"></iconify-icon>ECPC TEAMS TRACK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">برنامج دعم فرق <span className="gradient-text-gold">ECPC</span></h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">جلسة إضافية ساعة بعد كل Workshop مخصصة للفرق المشاركة</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="glow-card p-4 text-center reveal reveal-d1">
              <div className="text-xs font-mono text-gold-500 font-bold mb-1">W1</div>
              <h4 className="text-xs sm:text-sm font-bold mb-1">ICPC &amp; Contest Env</h4>
              <p className="text-[10px] text-gray-500">Rules, Penalty, Workflow</p>
            </div>
            <div className="glow-card p-4 text-center reveal reveal-d2">
              <div className="text-xs font-mono text-gold-500 font-bold mb-1">W2</div>
              <h4 className="text-xs sm:text-sm font-bold mb-1">Debugging &amp; Edge Cases</h4>
              <p className="text-[10px] text-gray-500">Common Mistakes, Testing</p>
            </div>
            <div className="glow-card p-4 text-center reveal reveal-d3">
              <div className="text-xs font-mono text-gold-500 font-bold mb-1">W3</div>
              <h4 className="text-xs sm:text-sm font-bold mb-1">Graph Intro</h4>
              <p className="text-[10px] text-gray-500">BFS, DFS Basics</p>
            </div>
            <div className="glow-card p-4 text-center reveal reveal-d4">
              <div className="text-xs font-mono text-gold-500 font-bold mb-1">W4</div>
              <h4 className="text-xs sm:text-sm font-bold mb-1">Greedy &amp; Math</h4>
              <p className="text-[10px] text-gray-500">Sorting, GCD, Sieve</p>
            </div>
            <div className="glow-card p-4 text-center reveal reveal-d5 col-span-2 sm:col-span-1">
              <div className="text-xs font-mono text-gold-500 font-bold mb-1">W5</div>
              <h4 className="text-xs sm:text-sm font-bold mb-1">DP &amp; Backtracking</h4>
              <p className="text-[10px] text-gray-500">States, Memoization</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MENTORS ===== */}
      <section id="mentors" className="py-20 sm:py-28 relative">
        <div className="section-divider mb-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Meet Your Mentors</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { name: 'حسام محمود', img: 'hossam-mahmoud.png', linkedin: 'https://www.linkedin.com/in/hosam-mahmoud-452583322?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
              { name: 'أحمد سامح', img: 'ahmed-sameh-osama.png', linkedin: 'https://www.linkedin.com/in/ahmed-gad-b798033a1?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
              { name: 'ندى صفوت', img: 'nada-mohamed-safwat.png', linkedin: 'https://www.linkedin.com/in/nada-mohammad-safwat-482201260?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
              { name: 'ادم محمد', img: 'adam-mohamed-mahmoud.png', linkedin: 'https://www.linkedin.com/in/adam-mohamed-91450b192?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
            ].map((mentor, idx) => (
              <div key={idx} className={`glow-card p-5 sm:p-6 text-center reveal reveal-d${idx+1} group`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 bg-dark-700 border-2 border-gold-500/15 flex items-center justify-center group-hover:border-gold-500/40 transition-colors overflow-hidden">
                  <img src={mentor.img} alt="" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm sm:text-base">{mentor.name}</h4>
                <a href={mentor.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold-500 transition-colors">
                  <iconify-icon icon="lucide:linkedin" className="text-sm"></iconify-icon>LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEADERBOARD ===== */}
      <section id="leaderboard" className="py-20 sm:py-28 relative bg-dark-900/50">
        <div className="section-divider mb-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Leaderboard</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">لوحة <span className="gradient-text-gold">المتصدرين</span></h2>
            <p className="text-gray-400 text-sm">سيتم التحديث أسبوعياً مع بدء المعسكر — كن أنت البطل!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal reveal-d1">
              <div className="flex items-center gap-3 mb-5">
                <iconify-icon icon="lucide:star" className="text-gold-500 text-xl"></iconify-icon>
                <h3 className="font-bold text-lg">أعلى 5 في النقاط</h3>
              </div>
              <div className="space-y-3">
                {[1,2,3,4,5].map((rank) => (
                  <div key={rank} className={`rank-card bg-dark-800 flex items-center gap-4`} style={{ borderRight: rank <= 3 ? (rank === 1 ? '3px solid #EAB308' : rank === 2 ? '3px solid #9CA3AF' : '3px solid #B45309') : '3px solid rgba(255,255,255,.1)' }}>
                    <div className={`text-xl sm:text-2xl font-black ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-700' : 'text-gray-600'} font-mono w-8 text-center flex-shrink-0`}>{rank}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base truncate">—</div>
                      <div className="text-[11px] text-gray-500 truncate">— &bull; الفرقة —</div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className={`text-base sm:text-lg font-black ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-700' : 'text-gray-600'} font-mono`}>0</div>
                      <div className="text-[9px] text-gray-600 text-left">نقطة</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal reveal-d2">
              <div className="flex items-center gap-3 mb-5">
                <iconify-icon icon="lucide:swords" className="text-gold-500 text-xl"></iconify-icon>
                <h3 className="font-bold text-lg">مسابقة الأسبوع <span className="text-xs text-gray-500 font-normal">(يوم الممارسة)</span></h3>
              </div>
              <div className="space-y-3">
                {[1,2,3].map((rank) => (
                  <div key={rank} className={`rank-card bg-dark-800 flex items-center gap-4`} style={{ borderRight: rank === 1 ? '3px solid #EAB308' : rank === 2 ? '3px solid #9CA3AF' : '3px solid #B45309' }}>
                    <div className={`text-xl sm:text-2xl font-black ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : 'text-amber-700'} font-mono w-8 text-center flex-shrink-0`}>{rank}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base truncate">—</div>
                      <div className="text-[11px] text-gray-500 truncate">— &bull; الفرقة —</div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className={`text-base sm:text-lg font-bold ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : 'text-amber-700'} font-mono`}>0</div>
                      <div className="text-[9px] text-gray-600 text-left">مسألة</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 glow-card p-5 text-center"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GAMIFICATION ===== */}
      <section id="gamification" className="py-20 sm:py-28 relative">
        <div className="section-divider mb-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Assessment System</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">نظام <span className="gradient-text-gold">التقييم والنقاط</span></h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">كل نشاط بيساعدك تكسب نقاط — اتعلم، تنافس، واصعد في الترتيب</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="glow-card p-6 reveal reveal-d1">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <iconify-icon icon="lucide:award" className="text-gold-500 text-xl"></iconify-icon>
                نقاط الأنشطة
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'حضور الـ Workshop', points: 15 },
                  { label: 'حضور Practice', points: 15 },
                  { label: 'كويز الجلسة', points: 10 },
                  { label: 'حل مسائل الجلسة', points: 25 },
                  { label: 'التحدي الأسبوعي', points: 50 },
                  { label: 'المشاركة في المسابقة', points: 30 }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <iconify-icon icon="lucide:presentation" className="text-gold-600"></iconify-icon>
                      {item.label}
                    </span>
                    <span className="text-gold-500 font-bold font-mono">{item.points} نقطة</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glow-card p-6 reveal reveal-d2">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <iconify-icon icon="lucide:trophy" className="text-gold-500 text-xl"></iconify-icon>
                مكافآت الترتيب في المسابقة
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'المركز الأول', sub: 'على المسابقة الأسبوعية', points: '+10', color: 'gold-500', border: 'gold-500' },
                  { label: 'المركز الثاني', sub: 'على المسابقة الأسبوعية', points: '+7', color: 'gray-400', border: 'gray-400' },
                  { label: 'المركز الثالث', sub: 'على المسابقة الأسبوعية', points: '+5', color: 'amber-700', border: 'amber-700' }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl bg-dark-800 border-r-2 border-${item.border}`}>
                    <div className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                    <div className="flex-1">
                      <div className={`font-bold text-${item.color}`}>{item.label}</div>
                      <div className="text-xs text-gray-500">{item.sub}</div>
                    </div>
                    <div className={`text-xl font-black text-${item.color} font-mono`}>{item.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="py-20 sm:py-28 relative bg-dark-900/50">
        <div className="section-divider mb-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Activities</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">معرض <span className="gradient-text-gold">الأنشطة</span></h2>
            <p className="text-gray-400 text-sm">لحظات من الورش والمسابقات والأنشطة المختلفة</p>
          </div>

          <div className="glow-card p-10 sm:p-16 text-center reveal">
            <div className="empty-float mb-5">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gold-500/5 border border-gold-500/10 flex items-center justify-center">
                <iconify-icon icon="lucide:image" className="text-gold-500/25 text-3xl"></iconify-icon>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">الصور قريباً</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">هنبدأ نرفع صور الأنشطة والورش والمسابقات مع بداية المعسكر — تابعونا</p>
          </div>
        </div>
      </section>

      {/* ===== RESOURCES ===== */}
      <section id="resources" className="py-20 sm:py-28 relative">
        <div className="section-divider mb-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Weekly Content</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">محتوى <span className="gradient-text-gold">كل أسبوع</span></h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">اضغط على أي أسبوع لعرض الموارد والتحديات والصور</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" id="resourceCards">
            {weeksData.map((week, idx) => (
              <div key={week.num} className={`glow-card p-6 cursor-pointer group reveal`} style={{ transitionDelay: `${idx * 0.1}s` }} onClick={() => showWeek(week.num)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <span className="text-lg font-black gradient-text-gold font-mono">{week.num}</span>
                  </div>
                  <iconify-icon icon="lucide:arrow-left-circle" className="text-gray-600 group-hover:text-gold-500 transition-colors text-xl resource-icon"></iconify-icon>
                </div>
                <div className="text-[10px] text-gold-500 font-mono font-bold mb-1">WEEK {week.num}</div>
                <h3 className="font-bold text-sm sm:text-base mb-3">{week.titleAr}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {week.topics.slice(0, 3).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">{t.split(' ')[0]}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section id="events" className="py-20 sm:py-28 relative bg-dark-900/50">
        <div className="section-divider mb-20"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-3 block">Upcoming</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">الجلسة <span className="gradient-text-gold">القادمة</span></h2>
          </div>
          <div className="glow-card p-6 sm:p-8 reveal">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-700/5 border border-gold-500/15 flex flex-col items-center justify-center">
                <div className="text-3xl font-black gradient-text-gold leading-none font-mono">01</div>
                <div className="text-[10px] text-gold-500 font-semibold mt-1">الأسبوع الأول</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500 badge-pulse"></span>
                  <span className="text-[11px] text-gold-500 font-semibold">الجلسة الافتتاحية</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">Introduction to Programming &amp; Problem Solving</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><iconify-icon icon="lucide:calendar" className="text-gold-600"></iconify-icon>الاثنين — قريباً</div>
                  <div className="flex items-center gap-1.5"><iconify-icon icon="lucide:clock" className="text-gold-600"></iconify-icon>12:00 PM</div>
                  <div className="flex items-center gap-1.5"><iconify-icon icon="lucide:map-pin" className="text-gold-600"></iconify-icon>يتم التحديد</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">C++ Basics</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">I/O</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">Conditions</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">Loops</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">Live Coding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-dark-950 font-bold text-sm font-mono">PS</div>
                <div>
                  <div className="text-sm font-bold">Problem Solving Camp</div>
                  <div className="text-[10px] text-gray-500">ICPC OTU Community — 2026</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-3">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-xs text-gray-500 hover:text-gold-500 transition-colors">عن المعسكر</a></li>
                <li><a href="#roadmap" className="text-xs text-gray-500 hover:text-gold-500 transition-colors">المسار التعليمي</a></li>
                <li><a href="#leaderboard" className="text-xs text-gray-500 hover:text-gold-500 transition-colors">المتصدرين</a></li>
                <li><a href="#resources" className="text-xs text-gray-500 hover:text-gold-500 transition-colors">الموارد</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-3">تواصل معنا</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-500 hover:text-gold-500 transition-colors flex items-center gap-1.5"><iconify-icon icon="lucide:instagram"></iconify-icon>Instagram</a></li>
                <li><a href="#" className="text-xs text-gray-500 hover:text-gold-500 transition-colors flex items-center gap-1.5"><iconify-icon icon="lucide:facebook"></iconify-icon>Facebook</a></li>
                <li><a href="#" className="text-xs text-gray-500 hover:text-gold-500 transition-colors flex items-center gap-1.5"><iconify-icon icon="lucide:github"></iconify-icon>GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-gray-600">© 2026 ICPC OTU Community</p>
            <p className="text-[10px] text-gray-600">Made with <span className="text-gold-500">♥</span> for the community</p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        id="backToTop"
        ref={backToTopRef}
        className="fixed bottom-5 left-5 z-50 w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center hover:bg-gold-500/20 transition-all"
        aria-label="أعلى"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <iconify-icon icon="lucide:chevron-up" className="text-gold-500"></iconify-icon>
      </button>
    </div>
  );
};

export default HomePage;