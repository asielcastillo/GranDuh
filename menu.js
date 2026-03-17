 document.addEventListener('DOMContentLoaded', () => {

        // ============================================
        // 1. ELEMENTOS PRINCIPAIS
        // ============================================
        const header           = document.getElementById('menuHeader');
        const navBebidasInner  = document.getElementById('navBebidasInner');
        const navComesInner    = document.getElementById('navComesInner');
        const catBtnsBebi      = document.querySelectorAll('.cat-btn-bebi');
        const catBtnsComes     = document.querySelectorAll('.cat-btn-comes');
        const sections         = document.querySelectorAll('.menu-section');
        const allCards         = document.querySelectorAll('.menu-card, .compact-card');

        const HEADER_H     = 64;
        const NAV_H        = 104; // 52px cada barra × 2
        const OFFSET       = HEADER_H + NAV_H + 16;


        // ============================================
        // 2. HEADER — efeito scrolled ao rolar
        // ============================================
        function handleHeaderScroll() {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleHeaderScroll, { passive: true });


        // ============================================
        // 3. INTERSECTION OBSERVER — destaca automaticamente
        //    a categoria ativa conforme o usuário rola a página
        // ============================================
        let isClickScrolling = false;
        let clickScrollTimer = null;

        const observerOptions = {
            root: null,
            rootMargin: `-${OFFSET}px 0px -55% 0px`,
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            if (isClickScrolling) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    setActiveCategory(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));


        // ============================================
        // 4. BOTÕES DE CATEGORIA — BEBIDAS
        // ============================================
        catBtnsBebi.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const target   = document.getElementById(targetId);
                if (!target) return;

                isClickScrolling = true;
                clearTimeout(clickScrollTimer);

                setActiveCategory(targetId);

                const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
                window.scrollTo({ top, behavior: 'smooth' });

                clickScrollTimer = setTimeout(() => {
                    isClickScrolling = false;
                }, 800);
            });
        });


        // ============================================
        // 5. BOTÕES DE CATEGORIA — COMESTÍVEIS
        // ============================================
        catBtnsComes.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const target   = document.getElementById(targetId);
                if (!target) return;

                isClickScrolling = true;
                clearTimeout(clickScrollTimer);

                setActiveCategory(targetId);

                const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
                window.scrollTo({ top, behavior: 'smooth' });

                clickScrollTimer = setTimeout(() => {
                    isClickScrolling = false;
                }, 800);
            });
        });


        // ============================================
        // 6. ATUALIZA BOTÃO ATIVO + CENTRALIZA NA BARRA
        // ============================================
        function setActiveCategory(id) {
            // Remove active de todos
            catBtnsBebi.forEach(btn => btn.classList.remove('active'));
            catBtnsComes.forEach(btn => btn.classList.remove('active'));

            // Adiciona active no botão correto
            const activeBtn = document.querySelector(
                `.cat-btn-bebi[data-target="${id}"], .cat-btn-comes[data-target="${id}"]`
            );

            if (activeBtn) {
                activeBtn.classList.add('active');

                // Descobre qual barra o botão pertence
                const isBebi = activeBtn.classList.contains('cat-btn-bebi');
                const navInner = isBebi ? navBebidasInner : navComesInner;

                // Centraliza o botão na barra
                const btnLeft    = activeBtn.offsetLeft;
                const btnWidth   = activeBtn.offsetWidth;
                const navWidth   = navInner.offsetWidth;
                const scrollTo   = btnLeft - (navWidth / 2) + (btnWidth / 2);

                navInner.scrollTo({ left: scrollTo, behavior: 'smooth' });
            }
        }


        // ============================================
        // 7. EXPANDIR/COLAPSAR DESCRIÇÃO DOS PRODUTOS
        // ============================================
        const expandBtns = document.querySelectorAll('.expand-btn');

        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const card = btn.closest('.menu-card');
                const shortDesc = card.querySelector('.card-description-short');
                const fullDesc = card.querySelector('.card-description-full');
                
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    // COLAPSAR
                    fullDesc.classList.remove('visible');
                    shortDesc.style.display = '-webkit-box';
                    btn.textContent = 'Ler mais';
                    btn.classList.remove('expanded');
                    card.classList.remove('expanded');
                } else {
                    // EXPANDIR
                    shortDesc.style.display = 'none';
                    fullDesc.classList.add('visible');
                    btn.textContent = 'Ler menos';
                    btn.classList.add('expanded');
                    card.classList.add('expanded');
                }
            });
        });


        // ============================================
        // 8. ANIMAÇÃO DOS CARDS AO ENTRAR NA TELA
        // ============================================
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const delay = (entry.target.dataset.delay || 0);
                    setTimeout(() => {
                        entry.target.classList.add('card-visible');
                    }, delay);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.08
        });

        document.querySelectorAll('.cards-grid, .compact-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.menu-card, .compact-card');
            cards.forEach((card, index) => {
                card.dataset.delay = index * 60;
                cardObserver.observe(card);
            });
        });


        // ============================================
        // 9. SUPORTE A SWIPE NA BARRA DE CATEGORIAS
        // ============================================
        function setupSwipe(navInner) {
            let touchStartX  = 0;
            let touchStartSL = 0;

            navInner.addEventListener('touchstart', (e) => {
                touchStartX  = e.touches[0].clientX;
                touchStartSL = navInner.scrollLeft;
            }, { passive: true });

            navInner.addEventListener('touchmove', (e) => {
                const dx = touchStartX - e.touches[0].clientX;
                navInner.scrollLeft = touchStartSL + dx;
            }, { passive: true });
        }

        setupSwipe(navBebidasInner);
        setupSwipe(navComesInner);


        // ============================================
        // 10. DRAG TO SCROLL NA BARRA DE CATEGORIAS
        // ============================================
        function setupDrag(navInner) {
            let isDragging   = false;
            let dragStartX   = 0;
            let dragScrollL  = 0;

            navInner.addEventListener('mousedown', (e) => {
                isDragging  = true;
                dragStartX  = e.pageX - navInner.offsetLeft;
                dragScrollL = navInner.scrollLeft;
                navInner.style.cursor = 'grabbing';
            });

            navInner.addEventListener('mouseleave', () => {
                isDragging = false;
                navInner.style.cursor = '';
            });

            navInner.addEventListener('mouseup', () => {
                isDragging = false;
                navInner.style.cursor = '';
            });

            navInner.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x    = e.pageX - navInner.offsetLeft;
                const walk = (x - dragStartX) * 1.5;
                navInner.scrollLeft = dragScrollL - walk;
            });
        }

        setupDrag(navBebidasInner);
        setupDrag(navComesInner);


        // ============================================
        // 11. TOAST DE NOTIFICAÇÃO
        // ============================================
        function showToast(message, duration = 3000) {
            const existing = document.querySelector('.menu-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className   = 'menu-toast';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(16px);
                background: linear-gradient(135deg, #B57E42, #8C5E2A);
                color: #fff;
                padding: 12px 24px;
                border-radius: 30px;
                font-size: 0.85rem;
                font-weight: 600;
                font-family: 'Open Sans', sans-serif;
                box-shadow: 0 8px 25px rgba(0,0,0,0.35);
                z-index: 9999;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                white-space: nowrap;
                pointer-events: none;
            `;

            document.body.appendChild(toast);

            requestAnimationFrame(() => requestAnimationFrame(() => {
                toast.style.opacity   = '1';
                toast.style.transform = 'translateX(-50%) translateY(0)';
            }));

            setTimeout(() => {
                toast.style.opacity   = '0';
                toast.style.transform = 'translateX(-50%) translateY(16px)';
                setTimeout(() => toast.remove(), 450);
            }, duration);
        }


        // ============================================
        // 12. EASTER EGG NO LOGO
        // ============================================
        const headerLogo = document.querySelector('.header-logo img');
        let logoClicks   = 0;
        let logoTimer    = null;

        if (headerLogo) {
            headerLogo.style.cursor = 'pointer';

            headerLogo.addEventListener('click', () => {
                logoClicks++;
                clearTimeout(logoTimer);
                logoTimer = setTimeout(() => { logoClicks = 0; }, 2500);

                if (logoClicks >= 5) {
                    logoClicks = 0;
                    showToast('☕ Feito com carinho para o Granduh!');
                }
            });
        }


        // ============================================
        // 13. CARROSSEL — FUNCIONALIDADE COMPLETA
        // ============================================

        // Inicializar carrossel ao clicar em imagens
        function initCarousel() {
            const clickableImages = document.querySelectorAll('.card-photo-clickable');

            clickableImages.forEach(image => {
                image.addEventListener('click', function(e) {
                    e.preventDefault();
                    openCarousel(this);
                });
            });
        }

        // Abrir carrossel
        function openCarousel(clickedImage) {
            const card = clickedImage.closest('.menu-card');
            if (!card) return;

            const carousel = card.querySelector('.card-carousel');
            if (!carousel) return;

            carousel.classList.add('active');
            document.body.style.overflow = 'hidden';

            const closeBtn = carousel.querySelector('.carousel-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    closeCarousel(carousel);
                });
            }

            carousel.addEventListener('click', function(e) {
                if (e.target === carousel) {
                    closeCarousel(carousel);
                }
            });

            document.addEventListener('keydown', function handleEsc(e) {
                if (e.key === 'Escape') {
                    closeCarousel(carousel);
                    document.removeEventListener('keydown', handleEsc);
                }
            });
        }

        // Fechar carrossel
        function closeCarousel(carousel) {
            if (!carousel) return;
            carousel.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Suporte a touch/swipe no carrossel
        function initTouchSupport() {
            let touchStartX = 0;
            let touchEndX = 0;

            document.addEventListener('touchstart', function(e) {
                const carousel = document.querySelector('.card-carousel.active');
                if (carousel) {
                    touchStartX = e.changedTouches[0].screenX;
                }
            }, false);

            document.addEventListener('touchend', function(e) {
                const carousel = document.querySelector('.card-carousel.active');
                if (carousel) {
                    touchEndX = e.changedTouches[0].screenX;
                    
                    if (touchStartX - touchEndX > 50 || touchEndX - touchStartX > 50) {
                        closeCarousel(carousel);
                    }
                }
            }, false);
        }

        // Inicializar carrossel
        initCarousel();
        initTouchSupport();


        // ============================================
        // 14. INICIALIZAÇÃO FINAL
        // ============================================
        if (sections.length > 0) {
            setActiveCategory(sections[0].id);
        }

        console.log('✅ menu.js carregado — Granduh Café Bistrô com carrossel + expandir/colapsar');

    });