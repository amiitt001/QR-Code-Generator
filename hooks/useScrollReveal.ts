import { useEffect } from 'react';

/**
 * A lightweight hook that attaches an IntersectionObserver to all elements
 * with the class 'reveal-on-scroll' or 'reveal-scale-up'.
 * 
 * It triggers the 'is-visible' class when the element enters the viewport.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: Stop observing once revealed for performance (one-time animation)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Offset slightly so it doesn't trigger at the very bottom edge
      }
    );

    const targets = document.querySelectorAll('.reveal-on-scroll, .reveal-scale-up');
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
      observer.disconnect();
    };
  }); // Run on every render to catch new elements (simple approach for this app size)
};