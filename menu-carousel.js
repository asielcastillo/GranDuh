// menu-carousel.js

document.addEventListener('DOMContentLoaded', () => {
    const carouselSection = document.getElementById('carousel-menu');

    // Só inicializa o carrossel se a seção dele estiver presente e visível
    // (no caso de menu-carrossel.html, ela estará presente)
    if (carouselSection) {
        const carouselTrack = carouselSection.querySelector('.carousel-track');
        const carouselImages = Array.from(carouselTrack.querySelectorAll('.carousel-image'));
        const prevButton = carouselSection.querySelector('.carousel-button.prev');
        const nextButton = carouselSection.querySelector('.carousel-button.next');
        const dotsContainer = carouselSection.querySelector('.carousel-dots');

        if (!carouselTrack || carouselImages.length === 0) {
            return; // Sai se não encontrar elementos essenciais
        }

        let currentSlide = 0;

        // Cria os pontos de navegação
        dotsContainer.innerHTML = ''; // Limpa antes de adicionar
        carouselImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

        function showSlide() {
            if (currentSlide >= carouselImages.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = carouselImages.length - 1;
            }

            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Atualiza os pontos de navegação
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentSlide++;
            showSlide();
        }

        function prevSlide() {
            currentSlide--;
            showSlide();
        }

        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        showSlide(); // Garante que o primeiro slide seja mostrado ao carregar
    }
});