// =============================================
// 1. SLIDESHOW DO FUNDO — Crossfade suave
// =============================================
const slides = document.querySelectorAll('.bg-slide');
const dots   = document.querySelectorAll('.bg-dot');
let current  = 0;
let paused   = false;
let interval = null;

// Garante que o primeiro slide está visível imediatamente
slides[0].classList.add('active');
dots[0].classList.add('active');

function goToSlide(index) {
    // Remove active do atual
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // Atualiza o índice
    current = index;

    // Adiciona active no novo
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

function nextSlide() {
    if (!paused) {
        goToSlide((current + 1) % slides.length);
    }
}

function startSlideshow() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 7000);
}

// Inicia
startSlideshow();

// Clique nos dots
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        goToSlide(index);
        startSlideshow(); // Reinicia o timer
    });
});

// Pausa no hover do card
const card = document.querySelector('.content-card');
if (card) {
    card.addEventListener('mouseenter', () => { paused = true; });
    card.addEventListener('mouseleave', () => { paused = false; });
}