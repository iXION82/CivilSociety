import './style.css';
import { initBeamSimulation } from './beam';

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ===== STAT COUNTER ANIMATION =====
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = parseInt(el.getAttribute('data-target') || '0');
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + '+';
          }
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

// ===== SECTION FADE-IN ANIMATIONS =====
function initSectionAnimations() {
  const sections = document.querySelectorAll('#about, #feats, footer');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).style.opacity = '1';
        (entry.target as HTMLElement).style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => {
    (section as HTMLElement).style.opacity = '0';
    (section as HTMLElement).style.transform = 'translateY(40px)';
    (section as HTMLElement).style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initBeamSimulation();
  animateCounters();
  initSectionAnimations();
});
