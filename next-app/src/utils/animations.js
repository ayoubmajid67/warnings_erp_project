	// Animate numbers
     function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 15);
        });
    }

    // Intersection Observer for animations

    export const addOnScrollObserver = ()=>{
        const animationObserver =  new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    if (entry.target.classList.contains('Stat_card_component_class')) {
                        animateNumbers();
                    }
                }
            });
        }
        );

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
		
		// Observe all elements
		animatedElements.forEach((el) => animationObserver.observe(el));

        return [animatedElements,animationObserver];
    }
    export  const cleanOnScrollObserver= (observer,animationObserver) =>{
        observer.forEach((el) => animationObserver.unobserve(el));

    }