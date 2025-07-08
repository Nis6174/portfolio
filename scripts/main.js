/**
 * Portfolio Window Management System
 * Retro Portfolio 3.1
 */

// Window management variables
let zIndexCounter = 10;
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };

/**
 * Open a window by ID
 * @param {string} id - Window ID to open
 */
function openWindow(id) {
  const window = document.getElementById(id);
  if (!window) {
    console.error(`Window with id "${id}" not found`);
    return;
  }
  
  window.style.display = 'block';
  window.style.zIndex = ++zIndexCounter;
  
  // Add focus class for visual feedback
  window.classList.add('window-focused');
  
  // Remove focus from other windows
  const allWindows = document.querySelectorAll('.window');
  allWindows.forEach(w => {
    if (w.id !== id) {
      w.classList.remove('window-focused');
    }
  });
  
  // Initialize drag functionality if not already done
  if (!window.dataset.dragInitialized) {
    initializeDrag(window);
    window.dataset.dragInitialized = 'true';
  }
  
  console.log(`Opened window: ${id}`);
}

/**
 * Close a window by ID
 * @param {string} id - Window ID to close
 */
function closeWindow(id) {
  const window = document.getElementById(id);
  if (!window) {
    console.error(`Window with id "${id}" not found`);
    return;
  }
  
  window.style.display = 'none';
  window.classList.remove('window-focused');
  
  console.log(`Closed window: ${id}`);
}

/**
 * Open a project detail window
 * @param {string} projectId - Project ID to open detail for
 */
function openProjectDetail(projectId) {
  const detailId = projectId + '-detail';
  const detailWindow = document.getElementById(detailId);
  
  if (!detailWindow) {
    console.error(`Project detail window with id "${detailId}" not found`);
    return;
  }
  
  // Position detail window slightly offset from projects window
  const projectsWindow = document.getElementById('projects');
  if (projectsWindow && projectsWindow.style.display !== 'none') {
    const projectsRect = projectsWindow.getBoundingClientRect();
    detailWindow.style.left = (projectsRect.left + 50) + 'px';
    detailWindow.style.top = (projectsRect.top + 50) + 'px';
  }
  
  detailWindow.style.display = 'block';
  detailWindow.style.zIndex = ++zIndexCounter;
  
  // Add focus class
  detailWindow.classList.add('window-focused');
  
  // Remove focus from other windows
  const allWindows = document.querySelectorAll('.window');
  allWindows.forEach(w => {
    if (w.id !== detailId) {
      w.classList.remove('window-focused');
    }
  });
  
  // Initialize drag functionality if not already done
  if (!detailWindow.dataset.dragInitialized) {
    initializeDrag(detailWindow);
    detailWindow.dataset.dragInitialized = 'true';
  }
  
  console.log(`Opened project detail: ${projectId}`);
}

/**
 * Initialize drag functionality for a window
 * @param {HTMLElement} windowElement - Window element to make draggable
 */
function initializeDrag(windowElement) {
  const titleBar = windowElement.querySelector('.title-bar');
  if (!titleBar) return;
  
  titleBar.style.cursor = 'move';
  
  titleBar.addEventListener('mousedown', (e) => {
    // Don't drag if clicking on close button
    if (e.target.tagName === 'BUTTON') return;
    
    draggedElement = windowElement;
    const rect = windowElement.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    // Bring window to front
    windowElement.style.zIndex = ++zIndexCounter;
    
    e.preventDefault();
  });
}

/**
 * Handle mouse move for dragging
 */
document.addEventListener('mousemove', (e) => {
  if (!draggedElement) return;
  
  const x = e.clientX - dragOffset.x;
  const y = e.clientY - dragOffset.y;
  
  // Keep window within viewport bounds
  const maxX = window.innerWidth - draggedElement.offsetWidth;
  const maxY = window.innerHeight - draggedElement.offsetHeight;
  
  draggedElement.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
  draggedElement.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
});

/**
 * Handle mouse up to stop dragging
 */
document.addEventListener('mouseup', () => {
  draggedElement = null;
});

/**
 * Add keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
  // ESC to close focused window
  if (e.key === 'Escape') {
    const focusedWindow = document.querySelector('.window.window-focused');
    if (focusedWindow && focusedWindow.style.display !== 'none') {
      closeWindow(focusedWindow.id);
    }
  }
  
  // Alt + number keys to open windows
  if (e.altKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        openWindow('about');
        break;
      case '2':
        e.preventDefault();
        openWindow('projects');
        break;
      case '3':
        e.preventDefault();
        openWindow('links');
        break;
      case '4':
        e.preventDefault();
        openWindow('resume');
        break;
    }
  }
});

/**
 * Add window focus management
 */
document.addEventListener('click', (e) => {
  const window = e.target.closest('.window');
  if (window && window.style.display !== 'none') {
    // Bring clicked window to front
    window.style.zIndex = ++zIndexCounter;
    
    // Update focus classes
    document.querySelectorAll('.window').forEach(w => {
      w.classList.remove('window-focused');
    });
    window.classList.add('window-focused');
  }
});

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio 3.1 initialized');
  
  // Add some visual enhancements
  const style = document.createElement('style');
  style.textContent = `
    .window-focused {
      box-shadow: 0 0 20px rgba(255, 255, 0, 0.3) !important;
    }
    
    .title-bar {
      user-select: none;
    }
    
    .icon {
      user-select: none;
    }
  `;
  document.head.appendChild(style);
  
  // Add welcome message to console
  console.log(`
    🖥️ Welcome to Retro Portfolio 3.1
    
    Keyboard shortcuts:
    • Alt + 1: Open About
    • Alt + 2: Open Projects  
    • Alt + 3: Open Links
    • Alt + 4: Open Resume
    • ESC: Close focused window
    
    Features:
    • Draggable windows
    • Responsive design
    • Retro 98.css styling
  `);
});