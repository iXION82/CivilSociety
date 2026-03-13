import gsap from 'gsap';

// Hide the embedded loader smoothly
function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const loaderBar = loader.querySelector('.loader-bar') as HTMLElement;

  const tl = gsap.timeline();
  tl.to(loaderBar, { width: '100%', duration: 0.6, ease: 'power2.out' })
    .to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
      }
    });
}

// Intercept internal navigation links for smooth transition
function setupLinkTransitions() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      try {
        const destination = new URL(link.href, window.location.origin);
        const current = window.location;

        // Only intercept cross-page internal links (not hash anchors on same page)
        if (
          destination.origin === current.origin &&
          destination.pathname !== current.pathname
        ) {
          e.preventDefault();
          const targetUrl = link.href;

          const loader = document.getElementById('page-loader');
          if (!loader) { window.location.href = targetUrl; return; }

          const loaderBar = loader.querySelector('.loader-bar') as HTMLElement;
          const loaderText = loader.querySelector('.technical-text') as HTMLElement;

          // Reset and show
          loader.style.display = 'flex';
          gsap.set(loader, { opacity: 0 });
          gsap.set(loaderBar, { width: '0%' });
          loaderText.innerText = 'LOADING MODULE';

          const terms = ['CALCULATING LOADS', 'ANALYZING STRESSES', 'SETTING FOUNDATIONS', 'CHECKING STABILITY'];
          let i = 0;
          const interval = setInterval(() => {
            if (i < terms.length) {
              loaderText.innerText = terms[i++];
            } else {
              clearInterval(interval);
            }
          }, 350);

          const tl = gsap.timeline({
            onComplete: () => {
              clearInterval(interval);
              window.location.href = targetUrl;
            }
          });

          tl.to(loader, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
            .to(loaderBar, { width: '85%', duration: 1.2, ease: 'power1.inOut' });
        }
      } catch {
        // ignore unparseable URLs
      }
    });
  });
}

export function initPageTransitions() {
  // The loader is already embedded in the HTML, so just hide it when page is ready
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  setupLinkTransitions();
}
