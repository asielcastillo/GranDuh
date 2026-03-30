// ============================================
// MENU INTERATIVO - JAVASCRIPT COMPLETO v4.2
// FINAL: Com scroll automático do menu + botão voltar
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initExpandButtons();
    initCategoryNavigation();
    initHeaderScroll();
    animateCardsOnLoad();
    updateActiveCategoryOnScroll();
    initBackButton(); // 🎯 NOVO
    console.log('✅ Menu interativo v4.2 carregado com sucesso!');
});

// ============================================
// UTILIDADES — Throttle e Debounce
// ============================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// ============================================
// 1. CARROSSEL (Ao clicar na imagem)
// ============================================

function initCarousel() {
    const carouselImages = document.querySelectorAll('.card-image-wrapper img');
    
    carouselImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.menu-card');
            if (!card) {
                console.warn('❌ Card não encontrado para carrossel');
                return;
            }
            
            const carousel = card.querySelector('.card-carousel');
            if (carousel) {
                openCarousel(carousel);
            }
        });
        
        img.style.cursor = 'pointer';
    });
}

function openCarousel(carousel) {
    if (!carousel) return;
    
    carousel.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const closeBtn = carousel.querySelector('.carousel-close');
    if (closeBtn) {
        const handleClose = function(e) {
            e.stopPropagation();
            closeCarousel(carousel);
            closeBtn.removeEventListener('click', handleClose);
        };
        closeBtn.addEventListener('click', handleClose);
    }
    
    const handleClickOutside = function(e) {
        if (e.target === carousel) {
            closeCarousel(carousel);
            carousel.removeEventListener('click', handleClickOutside);
        }
    };
    carousel.addEventListener('click', handleClickOutside);
}

function closeCarousel(carousel) {
    if (!carousel) return;
    
    carousel.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// 2. EXPANDIR/COLAPSAR DESCRIÇÃO COM ALTURA DINÂMICA
// ============================================

function initExpandButtons() {
    const expandBtns = document.querySelectorAll('.expand-btn');
    
    expandBtns.forEach(btn => {
        let isAnimating = false;
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isAnimating) {
                console.warn('⏳ Animação em progresso, aguarde...');
                return;
            }
            isAnimating = true;
            
            const contentWrapper = this.closest('.card-content-wrapper');
            if (!contentWrapper) {
                console.warn('❌ card-content-wrapper não encontrado');
                isAnimating = false;
                return;
            }
            
            const shortDesc = contentWrapper.querySelector('.card-description-short');
            const fullDesc = contentWrapper.querySelector('.card-description-full');
            
            if (!shortDesc || !fullDesc) {
                console.warn('❌ Descrições não encontradas');
                isAnimating = false;
                return;
            }
            
            const isExpanded = fullDesc.classList.contains('visible');
            
            if (isExpanded) {
                console.log('📖 Colapsando descrição...');
                
                const currentHeight = contentWrapper.offsetHeight;
                
                contentWrapper.style.maxHeight = currentHeight + 'px';
                contentWrapper.style.overflow = 'hidden';
                contentWrapper.style.transition = 'max-height 0.35s ease-out';
                
                fullDesc.classList.remove('visible');
                shortDesc.style.display = '-webkit-box';
                
                contentWrapper.offsetHeight;
                
                const newHeight = contentWrapper.offsetHeight;
                
                setTimeout(() => {
                    contentWrapper.style.maxHeight = newHeight + 'px';
                }, 10);
                
                setTimeout(() => {
                    contentWrapper.style.maxHeight = 'none';
                    contentWrapper.style.overflow = 'visible';
                    contentWrapper.style.transition = 'none';
                }, 350);
                
                this.textContent = 'Ler mais';
                this.classList.remove('expanded');
                
            } else {
                console.log('📖 Expandindo descrição...');
                
                const currentHeight = contentWrapper.offsetHeight;
                
                fullDesc.classList.add('visible');
                shortDesc.style.display = 'none';
                
                contentWrapper.offsetHeight;
                
                const newHeight = contentWrapper.offsetHeight;
                
                contentWrapper.style.maxHeight = currentHeight + 'px';
                contentWrapper.style.overflow = 'hidden';
                contentWrapper.style.transition = 'max-height 0.35s ease-out';
                
                setTimeout(() => {
                    contentWrapper.style.maxHeight = newHeight + 'px';
                }, 10);
                
                setTimeout(() => {
                    contentWrapper.style.maxHeight = 'none';
                    contentWrapper.style.overflow = 'visible';
                    contentWrapper.style.transition = 'none';
                }, 350);
                
                this.textContent = 'Ler menos';
                this.classList.add('expanded');
            }
            
            setTimeout(() => {
                isAnimating = false;
                console.log('✅ Animação concluída');
            }, 360);
        });
    });
}

// ============================================
// 3. NAVEGAÇÃO POR CATEGORIAS
// ============================================

function initCategoryNavigation() {
    const bebidasBtns = document.querySelectorAll('.cat-btn-bebi');
    const comesBtns = document.querySelectorAll('.cat-btn-comes');
    
    const setupCategoryButtons = (buttons) => {
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = this.getAttribute('data-target');
                if (!target) {
                    console.warn('❌ data-target não encontrado');
                    return;
                }
                
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                scrollToSection(target);
            });
        });
    };
    
    setupCategoryButtons(bebidasBtns);
    setupCategoryButtons(comesBtns);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.warn(`❌ Seção "${sectionId}" não encontrada`);
        return;
    }
    
    const header = document.querySelector('.menu-header');
    const navs = document.querySelectorAll('.category-nav');
    
    const headerHeight = header ? header.offsetHeight : 64;
    const navsHeight = navs.length * 52;
    
    let additionalOffset = 16;
    if (window.innerWidth < 375) {
        additionalOffset = 8;
    } else if (window.innerWidth < 600) {
        additionalOffset = 12;
    }
    
    const totalOffset = headerHeight + navsHeight + additionalOffset;
    const sectionTop = section.offsetTop - totalOffset;
    
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
}

// ============================================
// 4. HEADER FIXO COM SCROLL DETECTION
// ============================================

function initHeaderScroll() {
    const header = document.querySelector('.menu-header');
    if (!header) return;
    
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================
// 5. ANIMAÇÃO DE CARDS AO CARREGAR
// ============================================

function animateCardsOnLoad() {
    const cards = document.querySelectorAll('.menu-card, .compact-card');
    
    if (cards.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('card-visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ============================================
// 6. ATUALIZAR CATEGORIA ATIVA AO SCROLL
// ============================================

function updateActiveCategoryOnScroll() {
    const sections = document.querySelectorAll('.menu-section');
    const bebidasBtns = document.querySelectorAll('.cat-btn-bebi');
    const comesBtns = document.querySelectorAll('.cat-btn-comes');
    const categoryNavBebi = document.getElementById('categoryNavBebi');
    const categoryNavComes = document.getElementById('categoryNavComes');
    
    if (sections.length === 0) return;
    
    const handleScroll = throttle(function() {
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const header = document.querySelector('.menu-header');
            const navs = document.querySelectorAll('.category-nav');
            
            const headerHeight = header ? header.offsetHeight : 64;
            const navsHeight = navs.length * 52;
            const triggerPoint = headerHeight + navsHeight + 100;
            
            if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
                currentSection = section.id;
            }
        });
        
        if (currentSection) {
            bebidasBtns.forEach(btn => {
                if (btn.getAttribute('data-target') === currentSection) {
                    bebidasBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    scrollMenuToButton(btn, categoryNavBebi);
                }
            });
            
            comesBtns.forEach(btn => {
                if (btn.getAttribute('data-target') === currentSection) {
                    comesBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    scrollMenuToButton(btn, categoryNavComes);
                }
            });
        }
    }, 150);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================
// 6.1 FUNÇÃO PARA CENTRALIZAR BOTÃO NO MENU
// ============================================

function scrollMenuToButton(button, navContainer) {
    if (!button || !navContainer) return;
    
    const navInner = navContainer.querySelector('.category-nav-inner');
    if (!navInner) return;
    
    const buttonLeft = button.offsetLeft;
    const buttonWidth = button.offsetWidth;
    const navWidth = navInner.offsetWidth;
    const currentScroll = navInner.scrollLeft;
    
    const targetScroll = buttonLeft - (navWidth / 2) + (buttonWidth / 2);
    
    navInner.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
    
    console.log(`📍 Menu scrollando para: ${button.textContent}`);
}

// ============================================
// 7. SUPORTE A TECLADO
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeCarousel = document.querySelector('.card-carousel.active');
        if (activeCarousel) {
            closeCarousel(activeCarousel);
        }
    }
});

// ============================================
// 8. DETECÇÃO DE ORIENTAÇÃO
// ============================================

window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        const activeBtn = document.querySelector('.cat-btn-bebi.active, .cat-btn-comes.active');
        if (activeBtn) {
            const target = activeBtn.getAttribute('data-target');
            if (target) scrollToSection(target);
        }
    }, 500);
});

// ============================================
// 9. BOTÃO VOLTAR 🎯 NOVO
// ============================================

function initBackButton() {
    const backBtn = document.querySelector('.header-back');
    
    if (!backBtn) {
        console.warn('❌ Botão voltar não encontrado');
        return;
    }
    
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Verifica se veio do index (histórico anterior)
        if (window.history.length > 1) {
            window.history.back();
            console.log('✅ Voltando para página anterior');
        } else {
            // Se não houver histórico, redireciona para o index
            window.location.href = '/GranDuh/index.html';
            console.log('⚠️ Redirecionando para index.html');
        }
    });
}

// ============================================
// 10. LIMPEZA DE ESTILOS INLINE
// ============================================

document.querySelectorAll('.card-description-full').forEach(el => {
    el.removeAttribute('style');
});

console.log('✅ Estilos inline removidos!');

// ============================================
// 11. INICIALIZAÇÃO FINAL
// ============================================

console.log('✅ Menu interativo v4.2 carregado!');
console.log('📊 Cards:', document.querySelectorAll('.menu-card, .compact-card').length);
console.log('🔘 Botões "Ler mais":', document.querySelectorAll('.expand-btn').length);
console.log('📍 Categorias de Bebidas:', document.querySelectorAll('.cat-btn-bebi').length);
console.log('📍 Categorias de Comidas:', document.querySelectorAll('.cat-btn-comes').length);
console.log('⬅️ Botão voltar:', document.querySelector('.header-back') ? 'Ativo' : 'Não encontrado');