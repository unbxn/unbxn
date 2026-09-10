document.addEventListener('DOMContentLoaded', () => {
    initBackgroundCanvas();
    initCustomCursor();
    initNavigation();
    initTypewriter();
    initInteractiveCard();
    initScrollObserver();
    initVideoModal();
    initRippleEffect();
    initContactForm();
    initBackToTop();
});

function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.floor((width * height) / 18000);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 100)})`;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    createParticles();
    animate();
}

function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function renderFollower() {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;

        follower.style.left = `${posX}px`;
        follower.style.top = `${posY}px`;

        requestAnimationFrame(renderFollower);
    }
    renderFollower();

    const interactiveElements = document.querySelectorAll('a, button, .video-card, input, textarea');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

function initNavigation() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function initTypewriter() {
    const target = document.getElementById('typewriter');
    if (!target) return;

    const roles = ['Programmer', 'Video Editor', 'Motion Designer', 'Full-Stack Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            target.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function initInteractiveCard() {
    const btnCode = document.getElementById('btn-code-mode');
    const btnTimeline = document.getElementById('btn-timeline-mode');
    const viewCode = document.getElementById('view-code');
    const viewTimeline = document.getElementById('view-timeline');

    if (!btnCode || !btnTimeline) return;

    btnCode.addEventListener('click', () => {
        btnCode.classList.add('active');
        btnTimeline.classList.remove('active');
        viewCode.classList.add('active');
        viewTimeline.classList.remove('active');
    });

    btnTimeline.addEventListener('click', () => {
        btnTimeline.classList.add('active');
        btnCode.classList.remove('active');
        viewTimeline.classList.add('active');
        viewCode.classList.remove('active');
    });
}

function initScrollObserver() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = `${progress}%`;
                });
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const wrapper = document.getElementById('modal-video-wrapper');
    const player = document.getElementById('modal-video-player');
    const closeBtn = document.getElementById('modal-close-btn');
    const videoCards = document.querySelectorAll('.video-card');

    if (!modal || !player) return;

    function openModal(src, aspect) {
        player.src = src;
        
        wrapper.className = 'modal-video-wrapper';
        if (aspect === 'portrait') {
            wrapper.classList.add('aspect-portrait');
        } else {
            wrapper.classList.add('aspect-landscape');
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        player.play();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        player.pause();
        player.src = '';
    }

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const src = card.getAttribute('data-video-src');
            const aspect = card.getAttribute('data-aspect');
            openModal(src, aspect);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-effect');

            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            this.appendChild(circle);
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        status.style.color = 'var(--primary-blue)';
        status.textContent = 'Transmitting message...';

        setTimeout(() => {
            status.style.color = '#34d399';
            status.textContent = 'Message sent successfully! I will get back to you soon.';
            form.reset();
        }, 1500);
    });
}

function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');

    if (!backBtn) return;

    backBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}