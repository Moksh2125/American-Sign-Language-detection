// // main_scripts.js - Combined JavaScript for ASL Detection Application

// // ==================== GLOBAL VARIABLES ====================
// let allSigns = [];
// let currentFilter = 'all';

// // ==================== HOME PAGE FUNCTIONS ====================

// /**
//  * Start the camera for ASL detection
//  */
// function startCamera() {
//   const camera = document.getElementById("camera");
//   const startBtn = document.getElementById("startBtn");
//   const statusIndicator = document.getElementById("statusIndicator");
  
//   if (!camera || !startBtn) return;
  
//   // Update button state
//   startBtn.textContent = "📹 Camera Active";
//   startBtn.style.background = "#ff9800";
//   startBtn.disabled = true;
//   startBtn.style.cursor = "not-allowed";
  
//   // Show camera with animation
//   camera.src = camera.dataset.videoUrl || ""; // Set from Django template
//   camera.classList.add("show");
  
//   // Update status indicator
//   if (statusIndicator) {
//     statusIndicator.classList.add("active");
//   }
  
//   // Add a small delay to ensure smooth transition
//   setTimeout(() => {
//     camera.style.display = "block";
//   }, 100);
// }

// /**
//  * Update detected text from backend (for main detection page)
//  */
// async function updateText() {
//   try {
//     // This should be set from Django template
//     const updateUrl = window.ASL_CONFIG?.updateTextUrl;
//     if (!updateUrl) return;
    
//     const response = await fetch(updateUrl);
//     const data = await response.json();
//     const detectedElement = document.getElementById("detectedText") || document.getElementById("output-text");
    
//     if (detectedElement) {
//       detectedElement.classList.remove("loading");
//       detectedElement.textContent = data.text || "No text detected";
//     }
    
//   } catch (err) {
//     console.error("Error fetching text:", err);
//     const detectedElement = document.getElementById("detectedText") || document.getElementById("output-text");
//     if (detectedElement) {
//       detectedElement.textContent = "Connection error";
//       detectedElement.classList.remove("loading");
//     }
//   }
// }

// /**
//  * Text-to-speech functionality
//  */
// function speak() {
//   const textElement = document.getElementById("detectedText") || 
//                       document.getElementById("output-text");
  
//   if (!textElement) return;
  
//   const text = textElement.textContent;
  
//   if (!text || text === "Loading..." || text === "No text detected" || text === "Connection error") {
//     const msg = new SpeechSynthesisUtterance();
//     msg.text = "No text available to read";
//     window.speechSynthesis.speak(msg);
//     return;
//   }
  
//   const msg = new SpeechSynthesisUtterance();
//   msg.text = text;
//   msg.rate = 0.8; // Slightly slower for clarity
//   msg.pitch = 1;
//   msg.volume = 1;
  
//   // Visual feedback for speaking
//   const button = event?.target;
//   if (button) {
//     const originalText = button.textContent;
//     const originalBackground = button.style.background;
    
//     button.style.background = "#FF5722";
//     button.textContent = "🔊 Speaking...";
    
//     msg.onend = () => {
//       button.textContent = originalText;
//       button.style.background = originalBackground || "";
//     };
    
//     msg.onerror = () => {
//       button.textContent = originalText;
//       button.style.background = originalBackground || "";
//     };
//   }
  
//   window.speechSynthesis.speak(msg);
// }

// // ==================== GUIDE PAGE FUNCTIONS ====================

// /**
//  * Load ASL signs from Django backend
//  */
// async function loadSigns() {
//   try {
//     const signsUrl = window.ASL_CONFIG?.signsUrl;
//     if (!signsUrl) {
//       throw new Error("Signs URL not configured");
//     }
    
//     const response = await fetch(signsUrl);
//     const data = await response.json();
//     console.log("Signs loaded:", data);
//     allSigns = data.signs || [];
    
//     // Hide loading state
//     const loadingState = document.getElementById('loadingState');
//     if (loadingState) {
//       loadingState.style.display = 'none';
//     }
    
//     // Display signs
//     displaySigns(allSigns);
    
//   } catch (err) {
//     console.error("Error loading signs:", err);
//     const loadingState = document.getElementById('loadingState');
//     if (loadingState) {
//       loadingState.innerHTML = '<p>Error loading signs. Please try again later.</p>';
//     }
//   }
// }

// /**
//  * Display signs in the grid
//  */
// function displaySigns(signs) {
//   const grid = document.getElementById('signsGrid');
//   if (!grid) return;
  
//   if (signs.length === 0) {
//     grid.innerHTML = '<div class="loading"><p>No signs found matching your criteria.</p></div>';
//     return;
//   }
  
//   grid.innerHTML = signs.map(sign => `
//     <div class="sign-card" data-category="${sign.category}" data-label="${sign.label.toLowerCase()}">
//       <img src="${sign.image_url}" alt="${sign.label}" class="sign-image" 
//            onerror="this.onerror=null; this.src='${getPlaceholderImage()}';">
//       <div class="sign-label">${escapeHtml(sign.label)}</div>
//     </div>
//   `).join('');
// }

// /**
//  * Filter signs based on search and category
//  */
// function filterSigns() {
//   const searchBox = document.getElementById('searchBox');
//   if (!searchBox) return;
  
//   const searchTerm = searchBox.value.toLowerCase();
//   const filteredSigns = allSigns.filter(sign => {
//     const matchesSearch = sign.label.toLowerCase().includes(searchTerm);
//     const matchesCategory = currentFilter === 'all' || sign.category === currentFilter;
//     return matchesSearch && matchesCategory;
//   });
  
//   displaySigns(filteredSigns);
// }

// /**
//  * Filter signs by category
//  */
// function filterByCategory(category) {
//   currentFilter = category;
  
//   // Update active filter button
//   document.querySelectorAll('.filter-btn').forEach(btn => {
//     btn.classList.remove('active');
//   });
  
//   // Find and activate the clicked button
//   const clickedButton = event?.target;
//   if (clickedButton) {
//     clickedButton.classList.add('active');
//   }
  
//   // Apply filters
//   filterSigns();
// }

// // ==================== UTILITY FUNCTIONS ====================

// /**
//  * Escape HTML to prevent XSS
//  */
// function escapeHtml(unsafe) {
//   return unsafe
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// /**
//  * Get placeholder image URL
//  */
// function getPlaceholderImage() {
//   // This should be set from Django template
//   return window.ASL_CONFIG?.placeholderImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDIwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSIxMDAiIHk9IjkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
// }

// /**
//  * Initialize the appropriate page functionality
//  */
// function initializePage() {
//   const currentPage = document.body.dataset.page;

//   switch(currentPage) {
//     case 'home': // The home page is the ASL Guide
//       initializeHomePage();
//       break;
//     case 'detection': // The live detection page
//       initializeDetectionPage();
//       break;
//     default:
//       // Fallback logic can remain
//       if (document.getElementById('signsGrid')) {
//         initializeHomePage();
//       } else if (document.getElementById('camera')) {
//         initializeDetectionPage();
//       }
//   }
// }

// /**
//  * Initialize home page specific functionality
//  */
// function initializeDetectionPage() {
//   // Set up periodic text updates if update URL is available
//   if (window.ASL_CONFIG?.updateTextUrl) {
//     // Initial update
//     updateText();
//     // Update every 2 seconds
//     setInterval(updateText, 2000);
//   }
  
//   // Set video URL for camera if available
//   const camera = document.getElementById('camera');
//   if (camera && window.ASL_CONFIG?.videoFeedUrl) {
//     camera.dataset.videoUrl = window.ASL_CONFIG.videoFeedUrl;
//   }
// }

// /**
//  * Initialize guide page specific functionality
//  */
// function initializeHomePage() {
//   // Load signs from backend
//   loadSigns();
  
//   // Set up search functionality
//   const searchBox = document.getElementById('searchBox');
//   if (searchBox) {
//     searchBox.addEventListener('input', filterSigns);
//     searchBox.addEventListener('keyup', filterSigns);
//   }
// }

// /**
//  * Set configuration from Django template
//  */
// function setConfig(config) {
//   window.ASL_CONFIG = config;
// }

// // ==================== EVENT LISTENERS ====================

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//   initializePage();
// });

// // Handle page visibility changes (pause/resume updates)
// document.addEventListener('visibilitychange', function() {
//   if (document.hidden) {
//     // Page is hidden, could pause updates
//     console.log('Page hidden - consider pausing updates');
//   } else {
//     // Page is visible, resume updates
//     console.log('Page visible - resuming updates');
//   }
// });

// // ==================== EXPORT FOR MODULE USAGE ====================
// // If using as a module, export the main functions
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = {
//     startCamera,
//     updateText,
//     speak,
//     loadSigns,
//     filterSigns,
//     filterByCategory,
//     setConfig,
//     initializePage
//   };
// }

// main_scripts.js - Combined JavaScript for ASL Detection Application

// ==================== GLOBAL VARIABLES ====================
let allSigns = [];
let currentFilter = 'all';

// ==================== HOME PAGE FUNCTIONS ====================

/**
 * Start the camera for ASL detection
 */
function startCamera() {
  const camera = document.getElementById("camera");
  const startBtn = document.getElementById("startBtn");
  const statusIndicator = document.getElementById("statusIndicator");
  
  if (!camera || !startBtn) return;
  
  // Update button state
  startBtn.textContent = "📹 Camera Active";
  startBtn.style.background = "#ff9800";
  startBtn.disabled = true;
  startBtn.style.cursor = "not-allowed";
  
  // Show camera with animation
  camera.src = camera.dataset.videoUrl || ""; // Set from Django template
  camera.classList.add("show");
  
  // Update status indicator
  if (statusIndicator) {
    statusIndicator.classList.add("active");
  }
  
  // Add a small delay to ensure smooth transition
  setTimeout(() => {
    camera.style.display = "block";
  }, 100);
}

/**
 * Update detected text from backend (for main detection page)
 */
async function updateText() {
  try {
    // This should be set from Django template
    const updateUrl = window.ASL_CONFIG?.updateTextUrl;
    if (!updateUrl) return;
    
    const response = await fetch(updateUrl);
    const data = await response.json();
    const detectedElement = document.getElementById("detectedText") || document.getElementById("output-text");
    
    if (detectedElement) {
      detectedElement.classList.remove("loading");
      detectedElement.textContent = data.text || "No text detected";
    }
    
  } catch (err) {
    console.error("Error fetching text:", err);
    const detectedElement = document.getElementById("detectedText") || document.getElementById("output-text");
    if (detectedElement) {
      detectedElement.textContent = "Connection error";
      detectedElement.classList.remove("loading");
    }
  }
}

/**
 * Text-to-speech functionality
 */
function speak() {
  const textElement = document.getElementById("detectedText") || 
                      document.getElementById("output-text");
  
  if (!textElement) return;
  
  const text = textElement.textContent;
  
  if (!text || text === "Loading..." || text === "No text detected" || text === "Connection error") {
    const msg = new SpeechSynthesisUtterance();
    msg.text = "No text available to read";
    window.speechSynthesis.speak(msg);
    return;
  }
  
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.rate = 0.8; // Slightly slower for clarity
  msg.pitch = 1;
  msg.volume = 1;
  
  // Visual feedback for speaking
  const button = event?.target;
  if (button) {
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    
    button.style.background = "#FF5722";
    button.textContent = "🔊 Speaking...";
    
    msg.onend = () => {
      button.textContent = originalText;
      button.style.background = originalBackground || "";
    };
    
    msg.onerror = () => {
      button.textContent = originalText;
      button.style.background = originalBackground || "";
    };
  }
  
  window.speechSynthesis.speak(msg);
}

// ==================== GUIDE PAGE FUNCTIONS ====================

/**
 * Load ASL signs from Django backend
 */
async function loadSigns() {
  try {
    const signsUrl = window.ASL_CONFIG?.signsUrl;
    if (!signsUrl) {
      throw new Error("Signs URL not configured");
    }
    
    console.log("Fetching signs from:", signsUrl); // Debug log
    
    const response = await fetch(signsUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Signs data received:", data); // Debug log
    
    allSigns = data.signs || [];
    
    // Hide loading state
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
      loadingState.style.display = 'none';
    }
    
    // Display signs
    if (allSigns.length > 0) {
      displaySigns(allSigns);
    } else {
      const grid = document.getElementById('signsGrid');
      if (grid) {
        grid.innerHTML = '<div class="loading"><p>No ASL signs found in the database. Please add some signs through the Django admin.</p></div>';
      }
    }
    
  } catch (err) {
    console.error("Error loading signs:", err);
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
      loadingState.innerHTML = `<p>Error loading signs: ${err.message}. Please check the console for details.</p>`;
    }
  }
}

/**
 * Display signs in the grid
 */
function displaySigns(signs) {
  const grid = document.getElementById('signsGrid');
  if (!grid) return;
  
  if (signs.length === 0) {
    grid.innerHTML = '<div class="loading"><p>No signs found matching your criteria.</p></div>';
    return;
  }
  
  console.log("Displaying signs:", signs); // Debug log
  
  grid.innerHTML = signs.map(sign => {
    // Handle image URL properly
    const imageUrl = sign.image_url || getPlaceholderImage();
    
    return `
      <div class="sign-card" data-category="${sign.category}" data-label="${sign.label.toLowerCase()}">
        <img src="${imageUrl}" alt="${escapeHtml(sign.label)}" class="sign-image" 
             onerror="this.onerror=null; this.src='${getPlaceholderImage()}';"
             onload="console.log('Image loaded:', '${imageUrl}');">
        <div class="sign-label">${escapeHtml(sign.label)}</div>
      </div>
    `;
  }).join('');
}

/**
 * Filter signs based on search and category
 */
function filterSigns() {
  const searchBox = document.getElementById('searchBox');
  if (!searchBox) return;
  
  const searchTerm = searchBox.value.toLowerCase();
  const filteredSigns = allSigns.filter(sign => {
    const matchesSearch = sign.label.toLowerCase().includes(searchTerm);
    const matchesCategory = currentFilter === 'all' || sign.category === currentFilter;
    return matchesSearch && matchesCategory;
  });
  
  displaySigns(filteredSigns);
}

/**
 * Filter signs by category
 */
function filterByCategory(category) {
  currentFilter = category;
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Find and activate the clicked button
  const clickedButton = event?.target;
  if (clickedButton) {
    clickedButton.classList.add('active');
  }
  
  // Apply filters
  filterSigns();
}

/**
 * Clear detected text (for detection page)
 */
function clearText() {
  // Send request to backend to clear the detected_text array
  fetch('/clear_text/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') // Add CSRF token if needed
    }
  }).then(() => {
    const textElement = document.getElementById("detectedText") || document.getElementById("output-text");
    if (textElement) {
      textElement.textContent = "No text detected";
    }
  }).catch(err => {
    console.error("Error clearing text:", err);
  });
}

/**
 * Get CSRF cookie for POST requests
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Get placeholder image URL
 */
function getPlaceholderImage() {
  // This should be set from Django template
  return window.ASL_CONFIG?.placeholderImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDIwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSIxMDAiIHk9IjkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
}

/**
 * Initialize the appropriate page functionality
 */
function initializePage() {
  const currentPage = document.body.dataset.page;

  console.log("Initializing page:", currentPage); // Debug log

  switch(currentPage) {
    case 'home': // The home page is the ASL Guide (shows hand gesture images)
      initializeGuidePage();
      break;
    case 'detection': // The detection/feature page (live camera detection)
      initializeDetectionPage();
      break;
    default:
      // Fallback logic
      if (document.getElementById('signsGrid')) {
        initializeGuidePage();
      } else if (document.getElementById('camera')) {
        initializeDetectionPage();
      }
  }
}

/**
 * Initialize detection/feature page specific functionality (live camera detection)
 */
function initializeDetectionPage() {
  console.log("Initializing detection/feature page - live camera detection"); // Debug log
  
  // Set up periodic text updates if update URL is available
  if (window.ASL_CONFIG?.updateTextUrl) {
    // Initial update
    updateText();
    // Update every 2 seconds
    setInterval(updateText, 2000);
  }
  
  // Set video URL for camera if available
  const camera = document.getElementById('camera');
  if (camera && window.ASL_CONFIG?.videoFeedUrl) {
    camera.dataset.videoUrl = window.ASL_CONFIG.videoFeedUrl;
  }
}

/**
 * Initialize guide page specific functionality (home page - shows ASL sign images)
 */
function initializeGuidePage() {
  console.log("Initializing guide page (home) - loading ASL sign images"); // Debug log
  
  // Load signs from backend to display hand gesture images
  loadSigns();
  
  // Set up search functionality
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('input', filterSigns);
    searchBox.addEventListener('keyup', filterSigns);
  }
}

/**
 * Set configuration from Django template
 */
function setConfig(config) {
  console.log("Setting config:", config); // Debug log
  window.ASL_CONFIG = config;
}

// ==================== EVENT LISTENERS ====================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing page"); // Debug log
  initializePage();
});

// Handle page visibility changes (pause/resume updates)
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is hidden, could pause updates
    console.log('Page hidden - consider pausing updates');
  } else {
    // Page is visible, resume updates
    console.log('Page visible - resuming updates');
  }
});

// ==================== EXPORT FOR MODULE USAGE ====================
// If using as a module, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    startCamera,
    updateText,
    speak,
    loadSigns,
    filterSigns,
    filterByCategory,
    setConfig,
    initializePage
  };
}