import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // ---------- state ----------
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWeekPage, setIsWeekPage] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(null);
    const [progress, setProgress] = useState(0);
    const [navbarBg, setNavbarBg] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState({});
    const [typingText, setTypingText] = useState('');

    // refs
    const canvasRef = useRef(null);
    const progressBarRef = useRef(null);
    const backToTopRef = useRef(null);
    const typingPhrases = ['الإبداع', 'الاحتراف', 'ECPC'];

    // ---------- data ----------
    const weeksData = [{
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }];

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

    // Active nav link
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

    // Close mobile menu on route change
    useEffect(() => {
        const handleRouteChange = () => setIsMobileMenuOpen(false);
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    // ---------- render ----------

    if (isWeekPage && currentWeek) {
        // Week detail page — fully responsive
        return (
            <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-dark-950" dir="rtl">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={showMain}
                        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-gold-500 transition-colors touch-manipulation py-2 px-3 -mx-2 rounded-lg hover:bg-white/5"
                    >
                        <iconify-icon icon="lucide:arrow-right" className="text-base sm:text-lg"></iconify-icon>
                        العودة للرئيسية
                    </button>

                    <div className="glow-card p-5 sm:p-8 md:p-10 mb-6">
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 mb-5 sm:mb-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl sm:text-2xl font-black gradient-text-gold font-mono">{currentWeek.num}</span>
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-xs text-gold-500 font-mono font-bold mb-0.5">WEEK {currentWeek.num}</div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">{currentWeek.titleAr}</h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-dark-800 rounded-xl p-4 sm:p-5">
                                <h3 className="text-xs sm:text-sm font-bold mb-3 flex items-center gap-2">
                                    <iconify-icon icon="lucide:book-open" className="text-gold-500 text-base sm:text-lg"></iconify-icon>
                                    المواضيع
                                </h3>
                                <ul className="space-y-2">
                                    {currentWeek.topics.map((t, idx) => (
                                        <li key={idx} className="text-xs sm:text-sm text-gray-400 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{t}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-dark-800 rounded-xl p-4 sm:p-5">
                                <h3 className="text-xs sm:text-sm font-bold mb-3 flex items-center gap-2">
                                    <iconify-icon icon="lucide:code" className="text-gold-500 text-base sm:text-lg"></iconify-icon>
                                    الممارسة والتحدي
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">{currentWeek.practice}</p>
                                <h4 className="text-[10px] sm:text-xs font-bold text-gray-500 mb-2">التحديات:</h4>
                                <ul className="space-y-2">
                                    {currentWeek.challenge.map((c, idx) => (
                                        <li key={idx} className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                                            <iconify-icon icon="lucide:swords" className="text-gold-500 text-xs sm:text-sm flex-shrink-0"></iconify-icon>
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
                /* ── Reset & Base ── */
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Cairo', sans-serif; background: #05050A; color: #fff; overflow-x: hidden; }

                /* ── Scrollbar ── */
                ::-webkit-scrollbar { width: 4px; }
                @media (min-width: 768px) { ::-webkit-scrollbar { width: 5px; } }
                ::-webkit-scrollbar-track { background: #05050A; }
                ::-webkit-scrollbar-thumb { background: #EAB308; border-radius: 3px; }

                html { scroll-behavior: smooth; }

                /* ── Scroll Progress ── */
                #scrollProgress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 9999; }
                #scrollProgress .bar { height: 100%; width: 0; background: linear-gradient(90deg, #EAB308, #FDE047); transition: width .1s linear; border-radius: 0 2px 2px 0; }

                /* ── Matrix Canvas ── */
                #matrixCanvas { position: absolute; inset: 0; z-index: 0; opacity: .04; }
                @media (max-width: 640px) { #matrixCanvas { opacity: .02; } }
                @media (max-width: 480px) { #matrixCanvas { display: none; } }

                /* ── Reveal Animations ── */
                .reveal { opacity: 0; transform: translateY(30px); transition: all .8s cubic-bezier(.16, 1, .3, 1); }
                .reveal.revealed { opacity: 1; transform: translateY(0); }
                .reveal-d1 { transition-delay: .1s; }
                .reveal-d2 { transition-delay: .2s; }
                .reveal-d3 { transition-delay: .3s; }
                .reveal-d4 { transition-delay: .4s; }
                .reveal-d5 { transition-delay: .5s; }

                /* ── Typing Cursor ── */
                .typing-cursor { display: inline-block; width: 2px; height: 1em; background: #EAB308; margin-right: 4px; animation: blink .8s infinite; vertical-align: text-bottom; }
                @media (min-width: 640px) { .typing-cursor { width: 3px; } }
                @keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }

                /* ── Gradients ── */
                .gradient-text { background: linear-gradient(135deg, #fff 0%, #EAB308 50%, #FDE047 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .gradient-text-gold { background: linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #CA8A04 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

                /* ── Glow Card ── */
                .glow-card { position: relative; background: #0A0A10; border: 1px solid rgba(255, 255, 255, .06); border-radius: 16px; transition: all .5s cubic-bezier(.16, 1, .3, 1); }
                @media (hover: hover) { .glow-card:hover { transform: translateY(-4px); border-color: rgba(234, 179, 8, .2); box-shadow: 0 20px 40px -15px rgba(234, 179, 8, .12); } }

                /* ── Particles ── */
                .particle { position: absolute; width: 3px; height: 3px; background: #EAB308; border-radius: 50%; opacity: 0; animation: fp 20s infinite ease-in-out; }
                @keyframes fp { 0% { opacity: 0; transform: translateY(0) translateX(0); } 10% { opacity: .3; } 90% { opacity: .3; } 100% { opacity: 0; transform: translateY(-400px) translateX(80px); } }

                /* ── Scroll Indicator ── */
                .scroll-ind { animation: sb 2s infinite; }
                @keyframes sb { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }

                /* ── Nav Links ── */
                .nav-link { position: relative; padding: 4px 0; }
                .nav-link::after { content: ''; position: absolute; bottom: -4px; right: 0; left: 0; height: 2px; background: #EAB308; transform: scaleX(0); transition: transform .3s; transform-origin: right; }
                .nav-link.active::after { transform: scaleX(1); }
                .nav-link:focus-visible { outline: 2px solid #EAB308; outline-offset: 4px; border-radius: 2px; }

                /* ── Mobile Menu ── */
                .mobile-menu { transform: translateX(100%); transition: transform .4s cubic-bezier(.16, 1, .3, 1); }
                .mobile-menu.open { transform: translateX(0); }

                /* ── Stat Numbers ── */
                .stat-number { font-variant-numeric: tabular-nums; }

                /* ── Badge Pulse ── */
                .badge-pulse { animation: pg 2s infinite; }
                @keyframes pg { 0%,100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, .4); } 50% { box-shadow: 0 0 0 8px rgba(234, 179, 8, 0); } }

                /* ── Accordion ── */
                .accordion-content { max-height: 0; overflow: hidden; transition: max-height .5s cubic-bezier(.16, 1, .3, 1); }
                .accordion-content.open { max-height: 1200px; }
                .accordion-icon { transition: transform .3s; }
                .accordion-icon.rotated { transform: rotate(180deg); }

                /* ── Gallery ── */
                .gallery-item { overflow: hidden; border-radius: 12px; position: relative; }
                .gallery-item img { transition: transform .7s cubic-bezier(.16, 1, .3, 1); }
                @media (hover: hover) { .gallery-item:hover img { transform: scale(1.08); } }

                /* ── Back to Top ── */
                #backToTop { opacity: 0; transform: translateY(20px); transition: all .3s; pointer-events: none; }
                #backToTop.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
                #backToTop:focus-visible { outline: 2px solid #EAB308; outline-offset: 2px; }

                /* ── Hero Entrance ── */
                .hero-content>* { opacity: 0; transform: translateY(25px); animation: hi .8s forwards; }
                .hero-content>*:nth-child(1) { animation-delay: .2s; }
                .hero-content>*:nth-child(2) { animation-delay: .4s; }
                .hero-content>*:nth-child(3) { animation-delay: .6s; }
                .hero-content>*:nth-child(4) { animation-delay: .8s; }
                @keyframes hi { to { opacity: 1; transform: translateY(0); } }

                /* ── Section Divider ── */
                .section-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(234, 179, 8, .15), transparent); }

                /* ── Rank Cards ── */
                .rank-card { border-radius: 16px; padding: 14px 16px; transition: all .4s; position: relative; overflow: hidden; }
                @media (min-width: 640px) { .rank-card { padding: 18px 20px; } }
                .rank-card::before { content: ''; position: absolute; inset: 0; border-radius: 16px; padding: 1px; background: linear-gradient(135deg, rgba(234, 179, 8, .2), transparent, rgba(234, 179, 8, .1)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
                @media (hover: hover) { .rank-card:hover { transform: translateX(-4px); } }

                /* ── Resource Icon ── */
                .resource-icon { transition: all .3s; }
                @media (hover: hover) { .glow-card:hover .resource-icon { color: #EAB308; transform: scale(1.1); } }

                /* ── Float Animation ── */
                .empty-float { animation: ef 3s ease-in-out infinite; }
                @keyframes ef { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

                /* ── Hamburger ── */
                .hamburger-line { display: block; width: 22px; height: 2px; background: #fff; border-radius: 1px; transition: all .3s cubic-bezier(.16, 1, .3, 1); }
                .hamburger.active .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
                .hamburger.active .hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .hamburger.active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

                /* ── Journey Nodes ── */
                .journey-node { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; z-index: 2; flex-shrink: 0; transition: all .3s; }
                @media (min-width: 480px) { .journey-node { width: 44px; height: 44px; font-size: 16px; } }
                @media (min-width: 640px) { .journey-node { width: 48px; height: 48px; font-size: 18px; } }
                @media (min-width: 768px) { .journey-node { width: 56px; height: 56px; font-size: 22px; } }

                .journey-done { background: #EAB308; color: #05050A; box-shadow: 0 0 15px rgba(234, 179, 8, .3); }
                .journey-current { background: #0A0A10; border: 2px solid #EAB308; color: #EAB308; animation: pg 2s infinite; }
                .journey-locked { background: #18181F; border: 1px solid rgba(255, 255, 255, .05); color: #3F3F46; }

                .journey-line { flex: 1; height: 3px; background: rgba(255, 255, 255, .08); position: relative; border-radius: 2px; min-width: 8px; }
                @media (min-width: 640px) { .journey-line { height: 4px; } }
                .journey-line .fill { position: absolute; inset: 0; background: #EAB308; border-radius: 2px; width: 100%; }
                .journey-line.locked .fill { width: 0; }

                /* ── Topic Tags ── */
                .topic-tag { transition: all .2s; cursor: default; }
                @media (hover: hover) { .topic-tag:hover { background: rgba(234, 179, 8, .15); color: #FDE047; } }

                /* ── Mobile Nav Link touch target ── */
                .mobile-nav-link { padding: 8px 16px; border-radius: 8px; transition: all .2s; min-height: 44px; display: flex; align-items: center; justify-content: center; }
                .mobile-nav-link:active { background: rgba(234, 179, 8, .1); }

                /* ── Button touch target ── */
                .touch-manipulation { touch-action: manipulation; }

                /* ── Responsive helper ── */
                .xs\:flex-row { flex-direction: row; }
                @media (min-width: 480px) { .xs\:flex-row { flex-direction: row; } }
                .xs\:items-center { align-items: stretch; }
                @media (min-width: 480px) { .xs\:items-center { align-items: center; } }
                .xs\:gap-4 { gap: 0.75rem; }
                @media (min-width: 480px) { .xs\:gap-4 { gap: 1rem; } }
            `}</style>

            {/* ── Scroll Progress ── */}
            <div id="scrollProgress">
                <div className="bar" ref={progressBarRef} style={{ width: `${progress}%` }}></div>
            </div>

            {/* ── Navigation ── */}
            <nav
                id="navbar"
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    navbarBg ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5' : ''
                }`}
                role="navigation"
                aria-label="الرئيسية"
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
                        {/* Logo */}
                        <a
                            href="#"
                            onClick={showMain}
                            className="flex items-center gap-2 sm:gap-3 group touch-manipulation"
                            aria-label="الرئيسية"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-dark-950 font-bold text-[10px] sm:text-sm font-mono group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-shadow flex-shrink-0">
                                PS
                            </div>
                            <div className="hidden xs:block">
                                <div className="text-[10px] sm:text-xs font-bold tracking-wider text-gold-500 leading-tight">ICPC OTU</div>
                                <div className="text-[8px] sm:text-[10px] text-gray-500 tracking-wide leading-tight">SUMMER CAMP</div>
                            </div>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-4 xl:gap-8" id="desktopNav">
                            <a href="#about" className="nav-link text-xs xl:text-sm text-gray-400 hover:text-white transition-colors">عن المعسكر</a>
                            <a href="#progress" className="nav-link text-xs xl:text-sm text-gray-400 hover:text-white transition-colors">الرحلة</a>
                            <a href="#roadmap" className="nav-link text-xs xl:text-sm text-gray-400 hover:text-white transition-colors">المسار</a>
                            <a href="#leaderboard" className="nav-link text-xs xl:text-sm text-gray-400 hover:text-white transition-colors">المتصدرين</a>
                            <a href="#gamification" className="nav-link text-xs xl:text-sm text-gray-400 hover:text-white transition-colors">التقييم</a>
                            <a href="#resources" className="nav-link text-xs xl:text-sm text-gray-400 hover:text-white transition-colors">الموارد</a>
                            <Link
                                to="/compiler"
                                className="nav-link text-xs xl:text-sm text-gold-400 hover:text-gold-300 transition-colors font-semibold flex items-center gap-1.5"
                            >
                                <iconify-icon icon="lucide:code-2" className="text-sm xl:text-base"></iconify-icon>
                                المترجم
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            id="menuToggle"
                            className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] hamburger touch-manipulation ${
                                isMobileMenuOpen ? 'active' : ''
                            }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobileMenu"
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu ── */}
            <div
                className={`mobile-menu fixed inset-0 z-40 bg-dark-950/98 backdrop-blur-xl lg:hidden ${
                    isMobileMenuOpen ? 'open' : ''
                }`}
                id="mobileMenu"
                role="dialog"
                aria-modal="true"
                aria-label="القائمة"
            >
                <div className="flex flex-col items-center justify-center h-full gap-4 sm:gap-7 px-4">
                    <a
                        href="#about"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors w-full max-w-xs text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        عن المعسكر
                    </a>
                    <a
                        href="#progress"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors w-full max-w-xs text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        الرحلة
                    </a>
                    <a
                        href="#roadmap"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors w-full max-w-xs text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        المسار
                    </a>
                    <a
                        href="#leaderboard"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors w-full max-w-xs text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        المتصدرين
                    </a>
                    <a
                        href="#gamification"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors w-full max-w-xs text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        التقييم
                    </a>
                    <a
                        href="#resources"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gray-300 hover:text-gold-500 transition-colors w-full max-w-xs text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        الموارد
                    </a>
                    <Link
                        to="/compiler"
                        className="mobile-nav-link text-xl sm:text-2xl font-bold text-gold-400 hover:text-gold-300 transition-colors w-full max-w-xs text-center flex items-center justify-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <iconify-icon icon="lucide:code-2"></iconify-icon>
                        المترجم
                    </Link>
                </div>
            </div>

            {/* ── HERO ── */}
            <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
                <canvas id="matrixCanvas" ref={canvasRef}></canvas>
                <div className="particle" style={{ left: '10%', top: '80%', animationDelay: '0s' }}></div>
                <div className="particle" style={{ left: '30%', top: '90%', animationDelay: '4s' }}></div>
                <div className="particle" style={{ left: '55%', top: '85%', animationDelay: '8s' }}></div>
                <div className="particle" style={{ left: '80%', top: '75%', animationDelay: '12s' }}></div>
                <div className="absolute top-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gold-500/5 rounded-full blur-[80px] sm:blur-[120px]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-40 sm:w-64 md:w-80 h-40 sm:h-64 md:h-80 bg-gold-600/5 rounded-full blur-[70px] sm:blur-[100px]"></div>

                <div className="hero-content relative z-10 text-center px-4 max-w-5xl mx-auto py-12 sm:py-16">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold-500/20 bg-gold-500/5 mb-4 sm:mb-6 md:mb-8">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gold-500 badge-pulse"></span>
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-gold-400">
                            Powered by ICPC OTU Community
                        </span>
                    </div>

                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-2 sm:mb-4">
                        <span className="block gradient-text">Problem Solving</span>
                        <span className="block text-white mt-1 sm:mt-2">
                            Summer Camp <span className="gradient-text-gold">2026</span>
                        </span>
                    </h1>

                    <div className="text-sm xs:text-base sm:text-xl md:text-2xl text-gray-400 mb-6 sm:mb-8 md:mb-10 h-7 sm:h-8 md:h-10 flex items-center justify-center flex-wrap gap-1">
                        <span>رحلتك نحو</span>
                        <span className="text-gold-400 font-bold mx-1 sm:mx-2" id="typingText">{typingText}</span>
                        <span className="typing-cursor"></span>
                    </div>

                    <a
                        href="#about"
                        className="group inline-flex items-center gap-2 border border-white/10 hover:border-white/25 text-white font-bold text-[10px] xs:text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full transition-all hover:bg-white/5 touch-manipulation"
                    >
                        <span>اكتشف المعسكر</span>
                        <iconify-icon icon="lucide:chevron-down" className="group-hover:translate-y-0.5 transition-transform text-sm sm:text-base"></iconify-icon>
                    </a>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section id="about" className="py-14 sm:py-20 md:py-28 relative">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            About The Camp
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            ما هو <span className="gradient-text-gold">المعسكر</span>؟
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed px-2">
                            بيئة تعليمية تفاعلية خلال الإجازة الصيفية لتطوير مهارات البرمجة وحل المشكلات، يعتمد على
                            التعلم العملي والتفاعل والمنافسة لإعداد المشاركين للمسابقات البرمجية وعلى رأسها{' '}
                            <span className="text-gold-400 font-bold">ECPC</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-xs sm:max-w-sm md:max-w-lg mx-auto mb-10 sm:mb-12">
                        <div className="glow-card p-4 sm:p-6 md:p-8 text-center reveal reveal-d1">
                            <div className="text-2xl sm:text-3xl md:text-5xl font-black gradient-text-gold stat-number" data-target="5">
                                0
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 font-medium">أسابيع</div>
                        </div>
                        <div className="glow-card p-4 sm:p-6 md:p-8 text-center reveal reveal-d2">
                            <div className="text-2xl sm:text-3xl md:text-5xl font-black gradient-text-gold stat-number" data-target="10">
                                0
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 font-medium">جلسة</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div className="glow-card p-5 sm:p-6 reveal reveal-d2">
                            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="lucide:users" className="text-gold-500 text-base sm:text-lg"></iconify-icon>
                                </div>
                                <h3 className="font-bold text-sm sm:text-base">الفئة المستهدفة</h3>
                            </div>
                            <ul className="space-y-2 sm:space-y-2.5 text-gray-400 text-xs sm:text-sm">
                                <li className="flex items-center gap-2">
                                    <iconify-icon icon="lucide:check" className="text-gold-500 text-[10px] sm:text-xs flex-shrink-0"></iconify-icon>
                                    جميع طلاب الجامعة المهتمين بالبرمجة
                                </li>
                                <li className="flex items-center gap-2">
                                    <iconify-icon icon="lucide:check" className="text-gold-500 text-[10px] sm:text-xs flex-shrink-0"></iconify-icon>
                                    المبتدئون في البرمجة
                                </li>
                                <li className="flex items-center gap-2">
                                    <iconify-icon icon="lucide:check" className="text-gold-500 text-[10px] sm:text-xs flex-shrink-0"></iconify-icon>
                                    الراغبون في دخول مسابقات البرمجة
                                </li>
                                <li className="flex items-center gap-2">
                                    <iconify-icon icon="lucide:check" className="text-gold-500 text-[10px] sm:text-xs flex-shrink-0"></iconify-icon>
                                    الفرق المشاركة في ECPC
                                </li>
                            </ul>
                        </div>

                        <div className="glow-card p-5 sm:p-6 reveal reveal-d3">
                            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="lucide:calendar" className="text-gold-500 text-base sm:text-lg"></iconify-icon>
                                </div>
                                <h3 className="font-bold text-sm sm:text-base">هيكل البرنامج</h3>
                            </div>
                            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-gold-500 font-mono font-bold text-[10px] sm:text-xs mt-0.5 flex-shrink-0">
                                        الاثنين
                                    </span>
                                    <div>
                                        <div className="text-white font-semibold text-xs sm:text-sm">Workshop Day</div>
                                        <div className="text-gray-500 text-[10px] sm:text-xs">2 ساعة</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-gold-500 font-mono font-bold text-[10px] sm:text-xs mt-0.5 flex-shrink-0">
                                        الأربعاء
                                    </span>
                                    <div>
                                        <div className="text-white font-semibold text-xs sm:text-sm">Problem Solving Lab</div>
                                        <div className="text-gray-500 text-[10px] sm:text-xs">2 ساعة</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-gold-500 font-mono font-bold text-[10px] sm:text-xs mt-0.5 flex-shrink-0">
                                        التوقيت
                                    </span>
                                    <div>
                                        <div className="text-white font-semibold text-xs sm:text-sm">12:00 PM</div>
                                        <div className="text-gray-500 text-[10px] sm:text-xs">لقاءان أسبوعياً</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROGRESS ── */}
            <section id="progress" className="py-14 sm:py-20 md:py-24 relative bg-dark-900/50">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Camp Progress
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            رحلة <span className="gradient-text-gold">المعسكر</span>
                        </h2>
                        <p className="text-sm text-gray-400">المعسكر لم يبدأ بعد - تابع معنا</p>
                    </div>

                    <div className="glow-card p-4 sm:p-6 md:p-10 reveal">
                        <div className="flex items-center justify-between gap-1 sm:gap-2 relative">
                            {[1, 2, 3, 4, 5].map((w) => (
                                <React.Fragment key={w}>
                                    <div className="flex flex-col items-center gap-2 sm:gap-3 w-1/5">
                                        <div className="journey-node journey-locked">
                                            <iconify-icon icon="lucide:lock" className="text-xs sm:text-sm"></iconify-icon>
                                        </div>
                                        <span className="text-[8px] xs:text-[10px] sm:text-sm font-bold text-gray-600 text-center leading-tight">
                                            الأسبوع {w}
                                        </span>
                                    </div>
                                    {w < 5 && <div className="journey-line locked"><div className="fill"></div></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ROADMAP ── */}
            <section id="roadmap" className="py-14 sm:py-20 md:py-28 relative">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Learning Path
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            المسار <span className="gradient-text-gold">التعليمي</span>
                        </h2>
                        <p className="text-sm text-gray-400 max-w-2xl mx-auto px-2">
                            اضغط على أي أسبوع لعرض الموارد والتفاصيل الكاملة
                        </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4" id="roadmapCards">
                        {weeksData.map((week, idx) => (
                            <div
                                key={week.num}
                                className={`glow-card overflow-hidden reveal`}
                                style={{ transitionDelay: `${idx * 0.1}s` }}
                            >
                                <button
                                    className="w-full p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 text-right touch-manipulation"
                                    onClick={() => toggleAccordion(idx)}
                                    aria-expanded={accordionOpen[idx]}
                                    aria-controls={`accordion-content-${idx}`}
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gold-500/5 border border-gold-500/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-base sm:text-xl md:text-2xl font-black gradient-text-gold font-mono">
                                            {week.num}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 text-right">
                                        <div className="text-[8px] sm:text-[10px] text-gold-500 font-mono font-bold mb-0.5">
                                            WEEK {week.num}
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">{week.titleAr}</h3>
                                    </div>
                                    <iconify-icon
                                        icon="lucide:chevron-down"
                                        className={`accordion-icon text-gold-500 text-lg sm:text-xl transition-transform flex-shrink-0 ${
                                            accordionOpen[idx] ? 'rotated' : ''
                                        }`}
                                    ></iconify-icon>
                                </button>

                                <div
                                    id={`accordion-content-${idx}`}
                                    className={`accordion-content ${accordionOpen[idx] ? 'open' : ''}`}
                                >
                                    <div className="p-4 sm:p-5 md:p-6 pt-0 border-t border-white/5 mt-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                                            <div>
                                                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                                                    <iconify-icon icon="lucide:book-open" className="text-gold-500 text-sm sm:text-base"></iconify-icon>
                                                    المواضيع
                                                </h4>
                                                <ul className="space-y-1.5 sm:space-y-2">
                                                    {week.topics.map((t, i) => (
                                                        <li key={i} className="text-[11px] sm:text-xs text-gray-400 flex items-start gap-2">
                                                            <span className="w-1 h-1 bg-gold-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                                            <span className="leading-relaxed">{t}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                                                    <iconify-icon icon="lucide:code" className="text-gold-500 text-sm sm:text-base"></iconify-icon>
                                                    الممارسة
                                                </h4>
                                                <p className="text-[11px] sm:text-xs text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                                                    {week.practice}
                                                </p>
                                                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                                                    <iconify-icon icon="lucide:swords" className="text-gold-500 text-sm sm:text-base"></iconify-icon>
                                                    التحدي
                                                </h4>
                                                <ul className="space-y-1.5 sm:space-y-2">
                                                    {week.challenge.map((c, i) => (
                                                        <li key={i} className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-2">
                                                            <span className="w-1 h-1 bg-gold-500 rounded-full flex-shrink-0"></span>
                                                            {c}
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

            {/* ── ADVANCED TRACK ── */}
            <section className="py-14 sm:py-20 md:py-28 relative bg-dark-900/50">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[10px] sm:text-xs font-semibold text-gold-400 mb-3 sm:mb-4">
                            <iconify-icon icon="lucide:trophy" className="text-sm sm:text-base"></iconify-icon>
                            ECPC TEAMS TRACK
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            برنامج دعم فرق <span className="gradient-text-gold">ECPC</span>
                        </h2>
                        <p className="text-sm text-gray-400 max-w-2xl mx-auto px-2">
                            جلسة إضافية ساعة بعد كل Workshop مخصصة للفرق المشاركة
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                        <div className="glow-card p-3 sm:p-4 text-center reveal reveal-d1">
                            <div className="text-[10px] sm:text-xs font-mono text-gold-500 font-bold mb-0.5">W1</div>
                            <h4 className="text-[10px] sm:text-sm font-bold mb-0.5 leading-tight">ICPC &amp; Contest Env</h4>
                            <p className="text-[8px] sm:text-[10px] text-gray-500">Rules, Penalty, Workflow</p>
                        </div>
                        <div className="glow-card p-3 sm:p-4 text-center reveal reveal-d2">
                            <div className="text-[10px] sm:text-xs font-mono text-gold-500 font-bold mb-0.5">W2</div>
                            <h4 className="text-[10px] sm:text-sm font-bold mb-0.5 leading-tight">Debugging &amp; Edge Cases</h4>
                            <p className="text-[8px] sm:text-[10px] text-gray-500">Common Mistakes, Testing</p>
                        </div>
                        <div className="glow-card p-3 sm:p-4 text-center reveal reveal-d3">
                            <div className="text-[10px] sm:text-xs font-mono text-gold-500 font-bold mb-0.5">W3</div>
                            <h4 className="text-[10px] sm:text-sm font-bold mb-0.5 leading-tight">Graph Intro</h4>
                            <p className="text-[8px] sm:text-[10px] text-gray-500">BFS, DFS Basics</p>
                        </div>
                        <div className="glow-card p-3 sm:p-4 text-center reveal reveal-d4">
                            <div className="text-[10px] sm:text-xs font-mono text-gold-500 font-bold mb-0.5">W4</div>
                            <h4 className="text-[10px] sm:text-sm font-bold mb-0.5 leading-tight">Greedy &amp; Math</h4>
                            <p className="text-[8px] sm:text-[10px] text-gray-500">Sorting, GCD, Sieve</p>
                        </div>
                        <div className="glow-card p-3 sm:p-4 text-center reveal reveal-d5 col-span-2 sm:col-span-1">
                            <div className="text-[10px] sm:text-xs font-mono text-gold-500 font-bold mb-0.5">W5</div>
                            <h4 className="text-[10px] sm:text-sm font-bold mb-0.5 leading-tight">DP &amp; Backtracking</h4>
                            <p className="text-[8px] sm:text-[10px] text-gray-500">States, Memoization</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MENTORS ── */}
            <section id="mentors" className="py-14 sm:py-20 md:py-28 relative">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Meet Your Mentors
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            <span className="gradient-text-gold">المدربون</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {[
                            { name: 'حسام محمود', img: `${process.env.PUBLIC_URL}/images/hossam-mahmoud.png`, linkedin: 'https://www.linkedin.com/in/hosam-mahmoud-452583322?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
                            { name: 'أحمد سامح', img: `${process.env.PUBLIC_URL}/images/ahmed-sameh-osama.png`, linkedin: 'https://www.linkedin.com/in/ahmed-gad-b798033a1?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
                            { name: 'ندى صفوت', img: `${process.env.PUBLIC_URL}/images/nada-mohamed-safwat.png`, linkedin: 'https://www.linkedin.com/in/nada-mohammad-safwat-482201260?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
                            { name: 'ادم محمد', img: `${process.env.PUBLIC_URL}/images/adam-mohamed-mahmoud.png`, linkedin: 'https://www.linkedin.com/in/adam-mohamed-91450b192?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
                        ].map((mentor, idx) => (
                            <div key={idx} className={`glow-card p-4 sm:p-5 md:p-6 text-center reveal reveal-d${idx+1} group`}>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto mb-3 sm:mb-4 bg-dark-700 border-2 border-gold-500/15 flex items-center justify-center group-hover:border-gold-500/40 transition-colors overflow-hidden">
                                    <img src={mentor.img} alt={mentor.name} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <h4 className="font-bold text-xs sm:text-sm md:text-base">{mentor.name}</h4>
                                <a
                                    href={mentor.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors touch-manipulation"
                                >
                                    <iconify-icon icon="lucide:linkedin" className="text-xs sm:text-sm"></iconify-icon>
                                    LinkedIn
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LEADERBOARD ── */}
            <section id="leaderboard" className="py-14 sm:py-20 md:py-28 relative bg-dark-900/50">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Leaderboard
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            لوحة <span className="gradient-text-gold">المتصدرين</span>
                        </h2>
                        <p className="text-sm text-gray-400 px-2">سيتم التحديث أسبوعياً مع بدء المعسكر — كن أنت البطل!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Top 5 Points */}
                        <div className="reveal reveal-d1">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                                <iconify-icon icon="lucide:star" className="text-gold-500 text-lg sm:text-xl"></iconify-icon>
                                <h3 className="font-bold text-base sm:text-lg">أعلى 5 في النقاط</h3>
                            </div>
                            <div className="space-y-2.5 sm:space-y-3">
                                {[1, 2, 3, 4, 5].map((rank) => (
                                    <div
                                        key={rank}
                                        className={`rank-card bg-dark-800 flex items-center gap-3 sm:gap-4`}
                                        style={{
                                            borderRight: rank <= 3
                                                ? (rank === 1 ? '3px solid #EAB308' : rank === 2 ? '3px solid #9CA3AF' : '3px solid #B45309')
                                                : '3px solid rgba(255,255,255,.1)'
                                        }}
                                    >
                                        <div className={`text-lg sm:text-xl md:text-2xl font-black ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-700' : 'text-gray-600'} font-mono w-6 sm:w-8 text-center flex-shrink-0`}>
                                            {rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-xs sm:text-sm md:text-base truncate">—</div>
                                            <div className="text-[9px] sm:text-[11px] text-gray-500 truncate">— &bull; الفرقة —</div>
                                        </div>
                                        <div className="text-left flex-shrink-0">
                                            <div className={`text-sm sm:text-base md:text-lg font-black ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-700' : 'text-gray-600'} font-mono`}>
                                                0
                                            </div>
                                            <div className="text-[7px] sm:text-[9px] text-gray-600 text-left">نقطة</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Contest */}
                        <div className="reveal reveal-d2">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                                <iconify-icon icon="lucide:swords" className="text-gold-500 text-lg sm:text-xl"></iconify-icon>
                                <h3 className="font-bold text-base sm:text-lg">
                                    مسابقة الأسبوع{' '}
                                    <span className="text-[10px] sm:text-xs text-gray-500 font-normal">(يوم الممارسة)</span>
                                </h3>
                            </div>
                            <div className="space-y-2.5 sm:space-y-3">
                                {[1, 2, 3].map((rank) => (
                                    <div
                                        key={rank}
                                        className={`rank-card bg-dark-800 flex items-center gap-3 sm:gap-4`}
                                        style={{
                                            borderRight: rank === 1 ? '3px solid #EAB308' : rank === 2 ? '3px solid #9CA3AF' : '3px solid #B45309'
                                        }}
                                    >
                                        <div className={`text-lg sm:text-xl md:text-2xl font-black ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : 'text-amber-700'} font-mono w-6 sm:w-8 text-center flex-shrink-0`}>
                                            {rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-xs sm:text-sm md:text-base truncate">—</div>
                                            <div className="text-[9px] sm:text-[11px] text-gray-500 truncate">— &bull; الفرقة —</div>
                                        </div>
                                        <div className="text-left flex-shrink-0">
                                            <div className={`text-sm sm:text-base md:text-lg font-bold ${rank === 1 ? 'gradient-text-gold' : rank === 2 ? 'text-gray-400' : 'text-amber-700'} font-mono`}>
                                                0
                                            </div>
                                            <div className="text-[7px] sm:text-[9px] text-gray-600 text-left">مسألة</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 sm:mt-6 glow-card p-4 sm:p-5 text-center">
                                <p className="text-[10px] sm:text-xs text-gray-500">التحدي الأسبوعي يبدأ مع انطلاق المعسكر</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GAMIFICATION ── */}
            <section id="gamification" className="py-14 sm:py-20 md:py-28 relative">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Assessment System
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            نظام <span className="gradient-text-gold">التقييم والنقاط</span>
                        </h2>
                        <p className="text-sm text-gray-400 max-w-2xl mx-auto px-2">
                            كل نشاط بيساعدك تكسب نقاط — اتعلم، تنافس، واصعد في الترتيب
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="glow-card p-5 sm:p-6 reveal reveal-d1">
                            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 flex items-center gap-2">
                                <iconify-icon icon="lucide:award" className="text-gold-500 text-lg sm:text-xl"></iconify-icon>
                                نقاط الأنشطة
                            </h3>
                            <div className="space-y-2.5 sm:space-y-3">
                                {[
                                    { label: 'حضور الـ Workshop', points: 15 },
                                    { label: 'حضور Practice', points: 15 },
                                    { label: 'كويز الجلسة', points: 10 },
                                    { label: 'حل مسائل الجلسة', points: 25 },
                                    { label: 'التحدي الأسبوعي', points: 50 },
                                    { label: 'المشاركة في المسابقة', points: 30 }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center pb-2.5 sm:pb-3 border-b border-white/5">
                                        <span className="text-[11px] sm:text-sm text-gray-400 flex items-center gap-2">
                                            <iconify-icon icon="lucide:presentation" className="text-gold-600 text-sm sm:text-base"></iconify-icon>
                                            {item.label}
                                        </span>
                                        <span className="text-gold-500 font-bold font-mono text-xs sm:text-sm">{item.points} نقطة</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glow-card p-5 sm:p-6 reveal reveal-d2">
                            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 flex items-center gap-2">
                                <iconify-icon icon="lucide:trophy" className="text-gold-500 text-lg sm:text-xl"></iconify-icon>
                                مكافآت الترتيب في المسابقة
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    { label: 'المركز الأول', sub: 'على المسابقة الأسبوعية', points: '+10', color: 'gold-500', border: 'gold-500' },
                                    { label: 'المركز الثاني', sub: 'على المسابقة الأسبوعية', points: '+7', color: 'gray-400', border: 'gray-400' },
                                    { label: 'المركز الثالث', sub: 'على المسابقة الأسبوعية', points: '+5', color: 'amber-700', border: 'amber-700' }
                                ].map((item, idx) => (
                                    <div key={idx} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-dark-800 border-r-2 border-${item.border}`}>
                                        <div className="text-xl sm:text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                                        <div className="flex-1">
                                            <div className={`font-bold text-xs sm:text-sm text-${item.color}`}>{item.label}</div>
                                            <div className="text-[9px] sm:text-xs text-gray-500">{item.sub}</div>
                                        </div>
                                        <div className={`text-base sm:text-xl font-black text-${item.color} font-mono`}>{item.points}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GALLERY ── */}
            <section id="gallery" className="py-14 sm:py-20 md:py-28 relative bg-dark-900/50">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Activities
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            معرض <span className="gradient-text-gold">الأنشطة</span>
                        </h2>
                        <p className="text-sm text-gray-400 px-2">لحظات من الورش والمسابقات والأنشطة المختلفة</p>
                    </div>

                    <div className="glow-card p-8 sm:p-10 md:p-16 text-center reveal">
                        <div className="empty-float mb-4 sm:mb-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gold-500/5 border border-gold-500/10 flex items-center justify-center">
                                <iconify-icon icon="lucide:image" className="text-gold-500/25 text-2xl sm:text-3xl"></iconify-icon>
                            </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-2">الصور قريباً</h3>
                        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto px-2">
                            هنبدأ نرفع صور الأنشطة والورش والمسابقات مع بداية المعسكر — تابعونا
                        </p>
                    </div>
                </div>
            </section>

            {/* ── RESOURCES ── */}
            <section id="resources" className="py-14 sm:py-20 md:py-28 relative">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Weekly Content
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            محتوى <span className="gradient-text-gold">كل أسبوع</span>
                        </h2>
                        <p className="text-sm text-gray-400 max-w-2xl mx-auto px-2">
                            اضغط على أي أسبوع لعرض الموارد والتحديات والصور
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" id="resourceCards">
                        {weeksData.map((week, idx) => (
                            <div
                                key={week.num}
                                className={`glow-card p-4 sm:p-5 md:p-6 cursor-pointer group reveal touch-manipulation`}
                                style={{ transitionDelay: `${idx * 0.1}s` }}
                                onClick={() => showWeek(week.num)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { showWeek(week.num); } }}
                                aria-label={`عرض تفاصيل الأسبوع ${week.num}`}
                            >
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                                        <span className="text-base sm:text-lg font-black gradient-text-gold font-mono">{week.num}</span>
                                    </div>
                                    <iconify-icon
                                        icon="lucide:arrow-left-circle"
                                        className="text-gray-600 group-hover:text-gold-500 transition-colors text-lg sm:text-xl resource-icon"
                                    ></iconify-icon>
                                </div>
                                <div className="text-[8px] sm:text-[10px] text-gold-500 font-mono font-bold mb-0.5">WEEK {week.num}</div>
                                <h3 className="font-bold text-xs sm:text-sm md:text-base mb-2 sm:mb-3 leading-tight">{week.titleAr}</h3>
                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                    {week.topics.slice(0, 3).map((t, i) => (
                                        <span key={i} className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/5 text-[8px] sm:text-[10px] text-gray-400 topic-tag">
                                            {t.split(' ').slice(0, 2).join(' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EVENTS ── */}
            <section id="events" className="py-14 sm:py-20 md:py-28 relative bg-dark-900/50">
                <div className="section-divider mb-14 sm:mb-20"></div>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14 reveal">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[.2em] uppercase text-gold-500 mb-2 sm:mb-3 block">
                            Upcoming
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-5">
                            الجلسة <span className="gradient-text-gold">القادمة</span>
                        </h2>
                    </div>

                    <div className="glow-card p-5 sm:p-6 md:p-8 reveal">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-700/5 border border-gold-500/15 flex flex-col items-center justify-center mx-auto sm:mx-0">
                                <div className="text-2xl sm:text-3xl font-black gradient-text-gold leading-none font-mono">01</div>
                                <div className="text-[8px] sm:text-[10px] text-gold-500 font-semibold mt-0.5">الأسبوع الأول</div>
                            </div>
                            <div className="flex-1 text-center sm:text-right">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gold-500 badge-pulse"></span>
                                    <span className="text-[10px] sm:text-[11px] text-gold-500 font-semibold">الجلسة الافتتاحية</span>
                                </div>
                                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 leading-tight">
                                    Introduction to Programming &amp; Problem Solving
                                </h3>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <iconify-icon icon="lucide:calendar" className="text-gold-600 text-sm sm:text-base"></iconify-icon>
                                        الاثنين — قريباً
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <iconify-icon icon="lucide:clock" className="text-gold-600 text-sm sm:text-base"></iconify-icon>
                                        12:00 PM
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <iconify-icon icon="lucide:map-pin" className="text-gold-600 text-sm sm:text-base"></iconify-icon>
                                        يتم التحديد
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-1.5 mt-3">
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] sm:text-[10px] text-gray-400">C++ Basics</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] sm:text-[10px] text-gray-400">I/O</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] sm:text-[10px] text-gray-400">Conditions</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] sm:text-[10px] text-gray-400">Loops</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] sm:text-[10px] text-gray-400">Live Coding</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
                        <div className="sm:col-span-2 md:col-span-2 text-center sm:text-right">
                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-dark-950 font-bold text-[10px] sm:text-sm font-mono flex-shrink-0">
                                    PS
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold">Problem Solving Camp</div>
                                    <div className="text-[8px] sm:text-[10px] text-gray-500">ICPC OTU Community — 2026</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center sm:text-right">
                            <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3">روابط سريعة</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                <li><a href="#about" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors">عن المعسكر</a></li>
                                <li><a href="#roadmap" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors">المسار التعليمي</a></li>
                                <li><a href="#leaderboard" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors">المتصدرين</a></li>
                                <li><a href="#resources" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors">الموارد</a></li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-right">
                            <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3">تواصل معنا</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                <li>
                                    <a href="#" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                                        <iconify-icon icon="lucide:instagram"></iconify-icon>
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                                        <iconify-icon icon="lucide:facebook"></iconify-icon>
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-500 transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                                        <iconify-icon icon="lucide:github"></iconify-icon>
                                        GitHub
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[8px] sm:text-[10px] text-gray-600 text-center sm:text-right">
                            © 2026 ICPC OTU Community
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-600 text-center sm:text-left">
                            Made with <span className="text-gold-500">♥</span> for the community
                        </p>
                    </div>
                </div>
            </footer>

            {/* ── Back to Top ── */}
            <button
                id="backToTop"
                ref={backToTopRef}
                className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50 w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center hover:bg-gold-500/20 transition-all touch-manipulation"
                aria-label="أعلى"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <iconify-icon icon="lucide:chevron-up" className="text-gold-500 text-base sm:text-lg"></iconify-icon>
            </button>
        </div>
    );
};

export default HomePage;