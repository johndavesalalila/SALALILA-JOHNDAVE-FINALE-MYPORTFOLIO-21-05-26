// script.js - Interactive features and functionality

// Smooth scroll to section helper
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Load HTML partials (nav, body, footer) and then initialize
async function loadPartials() {
  try {
    // Load navigation
    const navResponse = await fetch('nav.html');
    const navHtml = await navResponse.text();
    document.getElementById('nav-placeholder').innerHTML = navHtml;

    // Load body content
    const bodyResponse = await fetch('body.html');
    const bodyHtml = await bodyResponse.text();
    document.getElementById('body-placeholder').innerHTML = bodyHtml;

    // Load footer
    const footerResponse = await fetch('footer.html');
    const footerHtml = await footerResponse.text();
    document.getElementById('footer-placeholder').innerHTML = footerHtml;

    // After content is loaded, attach all event listeners and initialize features
    initializeScripts();
  } catch (error) {
    console.error('Error loading partials:', error);
    // Fallback: if fetch fails, display error message
    document.getElementById('body-placeholder').innerHTML = '<div class="container" style="text-align:center;padding:4rem;"><h2>Content could not be loaded</h2><p>Please ensure all HTML files (nav.html, body.html, footer.html) are in the same folder.</p></div>';
  }
}

// Initialize all interactive functionality
function initializeScripts() {
  // --- Contact Form Handler ---
  const form = document.getElementById('contactForm');
  if (form) {
    // Remove any existing listener to avoid duplicates when re-initializing
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const finalForm = document.getElementById('contactForm');
    
    finalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameField = finalForm.querySelector('input[placeholder="Your Name"]');
      const emailField = finalForm.querySelector('input[placeholder="Email address"]');
      const msgField = finalForm.querySelector('textarea');
      
      if (nameField && emailField && msgField) {
        if (nameField.value.trim() === "" || emailField.value.trim() === "" || msgField.value.trim() === "") {
          alert("⚠️ Please fill in all fields before sending.");
        } else {
          alert(`✨ Thanks ${nameField.value.trim()}! Your message has been received. (Demo)\nWarm regards, John Dave.`);
          finalForm.reset();
        }
      } else {
        alert("📨 Message sent (demo). Appreciate your interest!");
        finalForm.reset();
      }
    });
  }

  // --- Image fallback for broken image links ---
  document.querySelectorAll('img').forEach(img => {
    // Avoid duplicate error handlers
    if (img.hasAttribute('data-error-handled')) return;
    img.setAttribute('data-error-handled', 'true');
    
    img.addEventListener('error', function() {
      if(!this.dataset.fallbackApplied) {
        this.dataset.fallbackApplied = true;
        if(this.classList.contains('profile-img')) {
          this.src = 'https://placehold.co/140x140/5a3e2c/c0824b?text=JD';
        } else if(this.classList.contains('project-img')) {
          this.src = 'https://placehold.co/320x180/5a3e2c/c0824b?text=Preview';
        } else {
          // generic fallback
          this.src = 'https://placehold.co/300x200/5a3e2c/c0824b?text=Image';
        }
      }
    });
  });

  // --- Fix navigation links after dynamic load ---
  // Since nav is loaded dynamically, we need to re-attach any global click enhancements
  // The navigation uses hash links (#home, #about, etc.) which work with smooth scroll.
  // Additionally, we can ensure any scrollToSection calls are bound.
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Also ensure button-group buttons work correctly (Contact Me and View Projects)
  const contactBtn = document.querySelector('.btn-primary');
  const projectsBtn = document.querySelector('.btn-outline');
  if (contactBtn && contactBtn.getAttribute('onclick') === "scrollToSection('contact')") {
    // Replace inline onclick to ensure it works after dynamic load
    contactBtn.removeAttribute('onclick');
    contactBtn.addEventListener('click', () => scrollToSection('contact'));
  }
  if (projectsBtn && projectsBtn.getAttribute('onclick') === "scrollToSection('projects')") {
    projectsBtn.removeAttribute('onclick');
    projectsBtn.addEventListener('click', () => scrollToSection('projects'));
  }
  
  // Additional safety: find any remaining buttons with onclick and rebind if needed
  document.querySelectorAll('[onclick^="scrollToSection"]').forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('scrollToSection')) {
      const match = onclickAttr.match(/scrollToSection\(['"]([^'"]+)['"]\)/);
      if (match && match[1]) {
        const sectionId = match[1];
        btn.removeAttribute('onclick');
        btn.addEventListener('click', () => scrollToSection(sectionId));
      }
    }
  });
}

// Expose scrollToSection globally so inline onclick attributes can still work
window.scrollToSection = scrollToSection;

// Start loading partials when DOM is ready
document.addEventListener('DOMContentLoaded', loadPartials);