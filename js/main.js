/* ============================================
   AI BLOG — Main JavaScript v2.0
   Quiz Engine, Theme Toggle, Sidebar, highlight.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Theme Toggle (Light/Dark) ----------
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('ai-blog-theme');

    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            const isLight = document.documentElement.classList.contains('light-theme');
            localStorage.setItem('ai-blog-theme', isLight ? 'light' : 'dark');
            themeToggle.textContent = isLight ? '🌙' : '☀️';
        });
        // Set initial icon
        const isLight = document.documentElement.classList.contains('light-theme');
        themeToggle.textContent = isLight ? '🌙' : '☀️';
    }

    // ---------- Scroll Reveal ----------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .timeline-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ---------- Mobile Menu Toggle ----------
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.navbar-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            menuToggle.innerHTML = isOpen ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------- Sidebar Active State ----------
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    const currentPage = window.location.pathname.split('/').pop();

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href ? href.split('/').pop() : '';
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ---------- Mobile Sidebar Toggle ----------
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar on link click (mobile)
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    // ---------- Back to Top ----------
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Reading Progress ----------
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, { passive: true });
    }

    // ---------- Card Mouse Glow ----------
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ---------- Stagger Cards Animation ----------
    document.querySelectorAll('.cards-grid').forEach(grid => {
        const gridCards = grid.querySelectorAll('.card');
        gridCards.forEach((card, index) => {
            card.classList.add('reveal');
            card.style.transitionDelay = `${index * 0.08}s`;
        });

        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.card').forEach(c => c.classList.add('visible'));
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        gridObserver.observe(grid);
    });

    // ---------- Interactive Quiz Engine ----------
    const quizSections = document.querySelectorAll('.quiz-section');

    quizSections.forEach(quiz => {
        const checkBtn = quiz.querySelector('.quiz-check-btn');
        const scoreDisplay = quiz.querySelector('.quiz-score');
        const quizCards = quiz.querySelectorAll('.quiz-card');

        // Handle option selection
        quizCards.forEach(card => {
            const options = card.querySelectorAll('.quiz-option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    // Don't allow changes after checking
                    if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;

                    options.forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            });
        });

        // Check answers
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                let correct = 0;
                let total = quizCards.length;

                quizCards.forEach(card => {
                    const selected = card.querySelector('.quiz-option.selected');
                    const correctAnswer = card.dataset.answer;
                    const feedback = card.querySelector('.quiz-feedback');
                    const options = card.querySelectorAll('.quiz-option');

                    // Disable all options
                    options.forEach(o => o.classList.add('disabled'));

                    if (selected) {
                        const selectedLetter = selected.dataset.option;

                        // Mark correct answer
                        options.forEach(o => {
                            if (o.dataset.option === correctAnswer) {
                                o.classList.add('correct-answer');
                            }
                        });

                        if (selectedLetter === correctAnswer) {
                            correct++;
                            card.classList.add('correct');
                            if (feedback) {
                                feedback.classList.add('correct-feedback', 'visible');
                            }
                        } else {
                            card.classList.add('incorrect');
                            selected.classList.add('wrong-answer');
                            if (feedback) {
                                feedback.classList.add('incorrect-feedback', 'visible');
                            }
                        }
                    } else {
                        // No answer selected — mark as incorrect
                        card.classList.add('incorrect');
                        options.forEach(o => {
                            if (o.dataset.option === correctAnswer) {
                                o.classList.add('correct-answer');
                            }
                        });
                        if (feedback) {
                            feedback.classList.add('incorrect-feedback', 'visible');
                            feedback.textContent = '⚠️ No seleccionaste una respuesta. ' + feedback.textContent;
                        }
                    }
                });

                // Show score
                if (scoreDisplay) {
                    scoreDisplay.innerHTML = `Resultado: <span class="score-number">${correct}/${total}</span> respuestas correctas`;
                    scoreDisplay.classList.add('visible');
                }

                // Hide check button
                checkBtn.style.display = 'none';

                // Scroll to score
                scoreDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    });

    // ---------- highlight.js Init ----------
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }

    // ---------- Smooth Scroll for Anchors ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---------- Console ----------
    console.log(
        '%c🤖 AI Blog v2.0 — Cargado correctamente',
        'color: #4f8ef7; font-size: 14px; font-weight: bold;'
    );

});
