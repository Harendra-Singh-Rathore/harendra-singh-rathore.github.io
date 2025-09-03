// Component Loader and Manager
class ComponentLoader {
  constructor() {
    this.components = {
      'sidebar-container': './components/sidebar.html',
      'navbar-container': './components/navbar.html',
      'about-container': './components/about.html',
      'resume-container': './components/resume.html',
      'portfolio-container': './components/portfolio.html',
      'contact-container': './components/contact.html'
    };
    
    this.loadedComponents = new Set();
    this.init();
  }

  async init() {
    try {
      // Load all components
      await this.loadAllComponents();
      
      // Wait a bit for DOM to settle
      setTimeout(() => {
        this.reinitializeScripts();
      }, 100);
      
    } catch (error) {
      console.error('Error initializing components:', error);
    }
  }

  async loadAllComponents() {
    const loadPromises = Object.entries(this.components).map(([containerId, componentPath]) => 
      this.loadComponent(containerId, componentPath)
    );
    
    await Promise.all(loadPromises);
  }

  async loadComponent(containerId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      const container = document.getElementById(containerId);
      
      if (container) {
        container.innerHTML = html;
        this.loadedComponents.add(containerId);
        console.log(`Component loaded: ${containerId}`);
      } else {
        console.error(`Container not found: ${containerId}`);
      }
      
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      // Fallback: show error message in container
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `<div style="color: red; padding: 20px;">Error loading component: ${error.message}</div>`;
      }
    }
  }

  reinitializeScripts() {
    // Re-initialize sidebar functionality
    this.initSidebar();
    
    // Re-initialize navigation functionality
    this.initNavigation();
    
    // Re-initialize portfolio filters
    this.initPortfolioFilters();
    
    console.log('All components reinitialized');
  }

  initSidebar() {
    const sidebar = document.querySelector('[data-sidebar]');
    const sidebarBtn = document.querySelector('[data-sidebar-btn]');
    
    if (sidebarBtn && sidebar) {
      sidebarBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
      });
    }
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        // Remove active class from all nav links and pages
        navLinks.forEach(link => link.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Show corresponding page
        const targetPage = this.textContent.toLowerCase();
        const page = document.querySelector(`[data-page="${targetPage}"]`);
        if (page) {
          page.classList.add('active');
        }
      });
    });
  }

  initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    const filterItems = document.querySelectorAll('[data-filter-item]');
    const selectItems = document.querySelectorAll('[data-select-item]');
    const selectValue = document.querySelector('[data-selecct-value]');
    const filterSelect = document.querySelector('[data-select]');
    const selectList = document.querySelector('.select-list');

    // Filter functionality
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Remove active class from all filter buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter items
        const filterValue = this.textContent.toLowerCase();
        this.filterItems(filterValue);
      });
    });

    // Select functionality
    selectItems.forEach(item => {
      item.addEventListener('click', function () {
        // Update select value
        selectValue.textContent = this.textContent;
        
        // Filter items
        const filterValue = this.textContent.toLowerCase();
        this.filterItems(filterValue);
        
        // Close select list
        selectList.classList.remove('active');
      });
    });

    // Toggle select list
    if (filterSelect) {
      filterSelect.addEventListener('click', function () {
        selectList.classList.toggle('active');
      });
    }

    // Close select list when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-select]')) {
        selectList.classList.remove('active');
      }
    });
  }

  filterItems(filterValue) {
    const filterItems = document.querySelectorAll('[data-filter-item]');
    
    filterItems.forEach(item => {
      const category = item.dataset.category;
      
      if (filterValue === 'all' || category === filterValue) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
      new ComponentLoader();
  });