/**
 * TravelCeleb.com - Main JavaScript
 * Follow the Journey. Not the Hype.
 */

(function() {
  'use strict';

  // ============================================================
  // Navigation
  // ============================================================
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  let lastScroll = 0;

  // Scroll handler for nav
  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // Scroll Reveal Animations
  // ============================================================
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

    if (!revealElements.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ============================================================
  // Counter Animation
  // ============================================================
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');

    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var countTo = parseInt(target.getAttribute('data-count'), 10);
          animateCount(target, 0, countTo, 2000);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      observer.observe(counter);
    });
  }

  function animateCount(element, start, end, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (end - start) * eased);

      element.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatNumber(end);
        // Add + suffix for large numbers
        if (end >= 1000) {
          element.textContent = formatNumber(end) + '+';
        }
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  // ============================================================
  // Hero Particles
  // ============================================================
  function initParticles() {
    var container = document.getElementById('heroParticles');
    if (!container) return;

    var particleCount = window.innerWidth < 768 ? 15 : 30;

    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (10 + Math.random() * 20) + 's';
      particle.style.animationDelay = (Math.random() * 15) + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.1 + Math.random() * 0.4;
      container.appendChild(particle);
    }
  }

  // ============================================================
  // Lazy Loading Images
  // ============================================================
  function initLazyLoading() {
    // Native lazy loading is used via HTML attribute
    // This is a fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) return;

    var lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if (!lazyImages.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px'
    });

    lazyImages.forEach(function(img) {
      observer.observe(img);
    });
  }

  // ============================================================
  // YouTube Video Player
  // ============================================================
  // Play video in-place (replaces thumbnail with iframe)
  window.playVideo = function(element, videoId) {
    var container = element.closest('.video-card-thumb') || element;
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    container.innerHTML = '<iframe width="' + width + '" height="' + height + '" ' +
      'src="https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0" ' +
      'title="YouTube video player" frameborder="0" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:0;"></iframe>';
  };

  // Load YouTube video in lite embed
  window.loadYouTube = function(element, videoId) {
    element.innerHTML = '<iframe style="position:absolute;inset:0;width:100%;height:100%;border:none;" ' +
      'src="https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0" ' +
      'title="YouTube video player" frameborder="0" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen></iframe>';
  };

  // ============================================================
  // Filter Bar
  // ============================================================
  function initFilters() {
    var filterBars = document.querySelectorAll('.filter-bar');

    filterBars.forEach(function(bar) {
      var buttons = bar.querySelectorAll('.filter-btn');

      buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          // Remove active from all
          buttons.forEach(function(b) { b.classList.remove('active'); });
          // Add active to clicked
          btn.classList.add('active');

          var filter = btn.getAttribute('data-filter');
          var targetGrid = bar.nextElementSibling;

          if (!targetGrid) return;

          var items = targetGrid.children;

          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (filter === 'all' || !filter) {
              item.style.display = '';
            } else {
              var categories = item.getAttribute('data-category') || '';
              if (categories.indexOf(filter) !== -1) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            }
          }
        });
      });
    });
  }

  // ============================================================
  // Smooth Scroll for Anchor Links
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================================
  // FAQ Accordion
  // ============================================================
  function initFAQ() {
    var details = document.querySelectorAll('details.faq-item');

    details.forEach(function(detail) {
      detail.addEventListener('toggle', function() {
        if (this.open) {
          details.forEach(function(d) {
            if (d !== detail && d.open) {
              d.open = false;
            }
          });
        }
      });
    });
  }

  // ============================================================
  // Newsletter Form
  // ============================================================
  function initNewsletter() {
    var forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = form.querySelector('input[type="email"]');
        if (email && email.value) {
          var btn = form.querySelector('button');
          var originalText = btn.textContent;
          btn.textContent = 'Subscribed!';
          btn.style.background = 'var(--color-teal)';
          email.value = '';

          setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 3000);
        }
      });
    });
  }

  // ============================================================
  // Parallax Effect (subtle)
  // ============================================================
  function initParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Only on desktop
    if (window.innerWidth < 768) return;

    window.addEventListener('scroll', function() {
      var scrolled = window.pageYOffset;
      var heroHeight = hero.offsetHeight;

      if (scrolled < heroHeight) {
        var content = hero.querySelector('.hero-content');
        if (content) {
          content.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
          content.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
        }
      }
    }, { passive: true });
  }

  // ============================================================
  // Trending Bar Auto-scroll
  // ============================================================
  function initTrendingScroll() {
    var bar = document.querySelector('.trending-bar');
    if (!bar) return;

    // Auto scroll on mobile
    if (window.innerWidth < 768) {
      var scrollAmount = 1;
      var scrollInterval;

      function startScroll() {
        scrollInterval = setInterval(function() {
          bar.scrollLeft += scrollAmount;
          if (bar.scrollLeft >= bar.scrollWidth - bar.clientWidth) {
            bar.scrollLeft = 0;
          }
        }, 30);
      }

      function stopScroll() {
        clearInterval(scrollInterval);
      }

      startScroll();
      bar.addEventListener('touchstart', stopScroll, { passive: true });
      bar.addEventListener('touchend', function() {
        setTimeout(startScroll, 3000);
      }, { passive: true });
    }
  }

  // ============================================================
  // Details/Summary Chevron Animation
  // ============================================================
  function initDetailsAnimation() {
    var allDetails = document.querySelectorAll('details');
    allDetails.forEach(function(d) {
      var summary = d.querySelector('summary');
      if (summary) {
        // Add chevron
        var chevron = document.createElement('span');
        chevron.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8l4 4 4-4"/></svg>';
        chevron.style.transition = 'transform 0.3s ease';
        chevron.style.flexShrink = '0';
        summary.appendChild(chevron);

        d.addEventListener('toggle', function() {
          chevron.style.transform = d.open ? 'rotate(180deg)' : 'rotate(0)';
        });
      }
    });
  }

  // ============================================================
  // Performance: Preload critical resources
  // ============================================================
  function preloadCritical() {
    // Preload first visible images
    var firstImages = document.querySelectorAll('.hero img, .creator-card-avatar img');
    firstImages.forEach(function(img) {
      if (img.loading === 'lazy') {
        img.loading = 'eager';
      }
    });
  }

  // ============================================================
  // Initialize Everything
  // ============================================================
  function init() {
    preloadCritical();
    initScrollReveal();
    animateCounters();
    initParticles();
    initLazyLoading();
    initFilters();
    initSmoothScroll();
    initFAQ();
    initNewsletter();
    initParallax();
    initTrendingScroll();
    initDetailsAnimation();

    // Mark nav as scrolled if page loaded scrolled
    handleNavScroll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
