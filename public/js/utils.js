// Global utility helpers

// 1. Toast Notification System
const Toast = {
  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  },

  show(message, type = 'info') {
    const container = this.createContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Add close listener
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.dismiss(toast);
    });
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      this.dismiss(toast);
    }, 4000);
  },
  
  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error'); },
  info(message) { this.show(message, 'info'); },

  dismiss(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }
};

// 2. Loading Spinner Controller
const Loader = {
  show() {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  },
  hide() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
};

// 3. Password Strength Checker
function checkPasswordStrength(password) {
  let score = 0;
  if (!password) return { score, text: 'Empty', color: 'var(--danger)' };

  // Length criteria
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Variety criteria
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Map score to feedback
  let text = 'Weak';
  let color = 'var(--danger)';

  if (score >= 5) {
    text = 'Very Strong';
    color = 'var(--success)';
  } else if (score >= 4) {
    text = 'Strong';
    color = 'var(--success)';
  } else if (score >= 3) {
    text = 'Medium';
    color = 'var(--warning)';
  }

  return {
    score: Math.min(score, 4), // Cap at 4 for bar representation
    text,
    color
  };
}

// Export functions to window scope for easy global access
window.Toast = Toast;
window.Loader = Loader;
window.checkPasswordStrength = checkPasswordStrength;
