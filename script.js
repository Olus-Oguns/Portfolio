const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const progressBar = document.getElementById('scroll-progress');
const revealItems = [...document.querySelectorAll('.reveal')];

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function setActiveNav() {
  const scrollPosition = window.scrollY + 140;

  let activeSection = sections[0]?.id || '';

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPosition >= top && scrollPosition < bottom) {
      activeSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeSection}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function formatNaira(value) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
}

function updateBudgetResults(income) {
  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  document.getElementById('needs-amount').textContent = formatNaira(needs);
  document.getElementById('wants-amount').textContent = formatNaira(wants);
  document.getElementById('savings-amount').textContent = formatNaira(savings);
}

function validateIncome() {
  const input = document.getElementById('income-input');
  const errorText = document.getElementById('budget-error');
  const value = Number(input.value);

  if (input.value.trim() === '' || !Number.isFinite(value) || value <= 0) {
    errorText.textContent = 'Enter a valid monthly income greater than zero.';
    input.setAttribute('aria-invalid', 'true');
    return null;
  }

  errorText.textContent = '';
  input.removeAttribute('aria-invalid');
  return value;
}

function calculateBudget() {
  const income = validateIncome();
  if (income === null) {
    return;
  }

  updateBudgetResults(income);

  const summary = `Updated budget results for ${formatNaira(income)}.`;
  const liveRegion = document.getElementById('budget-results');
  liveRegion.setAttribute('data-summary', summary);
  liveRegion.setAttribute('aria-label', summary);
}

window.addEventListener('scroll', () => {
  updateScrollProgress();
  setActiveNav();
}, { passive: true });

window.addEventListener('load', () => {
  updateScrollProgress();
  setActiveNav();
  initRevealObserver();
  updateBudgetResults(250000);
});

document.getElementById('calculate-budget').addEventListener('click', calculateBudget);

document.getElementById('income-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    calculateBudget();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveNav();
  });
});
