import './style.css';
import { initBeamSimulation } from './beam';
import { initBackgroundAnimations } from './backgroundAnimations';
import { initPageTransitions } from './transition';

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ===== SECTION FADE-IN ANIMATIONS =====
function initSectionAnimations() {
  const sections = document.querySelectorAll('#about, #events-timeline, footer');
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
  initBackgroundAnimations();
  initPageTransitions();
  initSectionAnimations();
});
