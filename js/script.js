// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to cards when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and features
document.querySelectorAll('.card, .feature').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Add header background on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.boxShadow = 'none';
    }
});

// Add hover effect to program cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

// Close modal when clicking the X button
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Restore scrolling
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto"; // Restore scrolling
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const openModal = document.querySelector('.modal[style*="display: block"]');
        if (openModal) {
            openModal.style.display = "none";
            document.body.style.overflow = "auto"; // Restore scrolling
        }
    }
});

// Admin login functionality
let isLoggedIn = false;

// Update button state on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn) {
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.classList.add('logged-in');
        adminBtn.querySelector('span').textContent = 'Admin Logout';
    }
});

function handleAdminAction() {
    if (isLoggedIn) {
        // Logout
        isLoggedIn = false;
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.classList.remove('logged-in');
        adminBtn.querySelector('span').textContent = 'Admin Login';
        showSuccessMessage('Logged out successfully');
        
        // Update edit buttons visibility without reloading
        updateMenuEditButtons();
    } else {
        // Open login modal
        openModal('admin-login');
    }
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.classList.add('show');
    
    // Hide message after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

document.querySelector('.admin-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username');
    const password = document.getElementById('admin-password');
    const errorMessage = document.getElementById('login-error');
    
    // Reset previous error states
    username.classList.remove('error');
    errorMessage.classList.remove('show');
    
    if (username.value === 'Admin_X7gPzQ9w' && password.value === '!V4m#zQ8pK@1dT9bX$') {
        // Success
        isLoggedIn = true;
        showSuccessMessage('Login successful');
        
        // Update button state and edit buttons visibility without reloading
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.classList.add('logged-in');
        adminBtn.querySelector('span').textContent = 'Admin Logout';
        updateMenuEditButtons();
        
        // Close the login modal
        closeModal('admin-login');
    } else {
        // Show error
        username.classList.add('error');
        errorMessage.textContent = 'Invalid credentials. Please try again.';
        errorMessage.classList.add('show');
    }
});

// Clear error message when user starts typing
document.getElementById('admin-username').addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('login-error').classList.remove('show');
});

// Menu editing functionality
let currentEditingItem = null;
let currentEditingDate = null;

// Show/hide edit buttons based on login state
function updateMenuEditButtons() {
    const editButtons = document.querySelectorAll('.edit-btn, .add-btn, .edit-date-btn, .delete-week');
    editButtons.forEach(button => {
        button.style.display = isLoggedIn ? 'flex' : 'none';
    });
}

// Update menu edit buttons when login state changes
document.addEventListener('DOMContentLoaded', function() {
    updateMenuEditButtons();
});

// Handle menu item editing
document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-btn')) {
        e.stopPropagation();
        const menuItem = e.target.closest('.menu-item');
        const editableText = menuItem.querySelector('.editable');
        currentEditingItem = editableText;
        
        // Set current text in edit modal
        document.getElementById('edit-menu-text').value = editableText.textContent;
        
        // Show edit modal
        openModal('edit-menu-modal');
    }
});

// Handle date editing
document.getElementById('edit-date').addEventListener('click', function() {
    const dateSpan = document.getElementById('menu-date');
    currentEditingDate = dateSpan;
    
    // Set current date in edit modal
    document.getElementById('edit-date-text').value = dateSpan.textContent;
    
    // Show edit modal
    openModal('edit-date-modal');
});

// Handle menu item form submission
document.getElementById('edit-menu-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (currentEditingItem) {
        const newText = document.getElementById('edit-menu-text').value;
        currentEditingItem.textContent = newText;
        
        // Save menu data to Firebase
        await saveMenuData();
        
        closeModal('edit-menu-modal');
        showSuccessMessage('Menu item updated successfully');
    }
});

// Handle date form submission
document.getElementById('edit-date-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (currentEditingDate) {
        const newDate = document.getElementById('edit-date-text').value;
        currentEditingDate.textContent = newDate;
        
        // Save menu data
        saveMenuData();
        
        closeModal('edit-date-modal');
        showSuccessMessage('Week date updated successfully');
    }
});

// Create a new week template
function createWeekTemplate(weekNumber, date = null) {
    const week = document.createElement('div');
    week.className = 'menu-week';
    week.dataset.weekNumber = weekNumber;
    
    const header = document.createElement('div');
    header.className = 'menu-week-header';
    header.innerHTML = `
        <div class="week-info">
            <h3>Week ${weekNumber}</h3>
            <span class="week-date editable-date" data-week="${weekNumber}">${date || 'Week of ' + new Date().toLocaleDateString()}</span>
            <button class="edit-date-btn" style="display: none;">
                <i class="fas fa-calendar-edit"></i>
            </button>
        </div>
        <button class="delete-week" style="display: none;">
            <i class="fas fa-trash"></i> Delete Week
        </button>
    `;
    
    // Add edit date button functionality
    const editDateBtn = header.querySelector('.edit-date-btn');
    editDateBtn.style.display = isLoggedIn ? 'flex' : 'none';
    editDateBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const dateSpan = header.querySelector('.week-date');
        currentEditingDate = dateSpan;
        
        // Set current date in edit modal
        document.getElementById('edit-date-text').value = dateSpan.textContent;
        
        // Show edit modal
        openModal('edit-date-modal');
    });
    
    // Add click handler for the date span
    const dateSpan = header.querySelector('.week-date');
    dateSpan.addEventListener('click', function(e) {
        if (isLoggedIn) {
            e.stopPropagation();
            currentEditingDate = this;
            
            // Set current date in edit modal
            document.getElementById('edit-date-text').value = this.textContent;
            
            // Show edit modal
            openModal('edit-date-modal');
        }
    });
    
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const meals = ['morning', 'lunch', 'afternoon'];
    
    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'menu-day';
        dayDiv.innerHTML = `<h3>${day}</h3>`;
        
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'menu-items';
        
        meals.forEach(meal => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            itemDiv.innerHTML = `
                <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)} Snack</h4>
                <p class="editable" data-day="${day.toLowerCase()}" data-meal="${meal}">Enter menu item</p>
                <button class="edit-btn" style="display: none;">
                    <i class="fas fa-edit"></i>
                </button>
            `;
            
            // Add edit button functionality
            const editBtn = itemDiv.querySelector('.edit-btn');
            editBtn.style.display = isLoggedIn ? 'flex' : 'none';
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const editableText = itemDiv.querySelector('.editable');
                currentEditingItem = editableText;
                
                // Set current text in edit modal
                document.getElementById('edit-menu-text').value = editableText.textContent;
                
                // Show edit modal
                openModal('edit-menu-modal');
            });
            
            itemsDiv.appendChild(itemDiv);
        });
        
        dayDiv.appendChild(itemsDiv);
        grid.appendChild(dayDiv);
    });
    
    week.appendChild(header);
    week.appendChild(grid);
    return week;
}

// Import Firebase database
import { database } from './firebase-config.js';

// Clear any existing localStorage data
localStorage.removeItem('menuData');

// Function to load menu data from Firebase
async function loadMenuData() {
    try {
        const snapshot = await database.ref('menu').once('value');
        const menuData = snapshot.val();
        
        if (menuData) {
            const menuWeeks = document.getElementById('menu-weeks');
            menuWeeks.innerHTML = ''; // Clear existing weeks
            
            // Create weeks based on Firebase data
            Object.keys(menuData).forEach((weekKey, index) => {
                const weekData = menuData[weekKey];
                const week = createWeekTemplate(index + 1, weekData.date);
                
                // Add delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-week';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.onclick = async () => {
                    if (confirm('Are you sure you want to delete this week?')) {
                        week.remove();
                        await saveMenuData(); // Save to Firebase after deletion
                        showSuccessMessage('Week deleted successfully');
                    }
                };
                week.appendChild(deleteBtn);
                
                // Set menu items from Firebase data
                Object.keys(weekData.items).forEach(day => {
                    const dayData = weekData.items[day];
                    const dayElement = week.querySelector(`[data-day="${day}"]`);
                    if (dayElement) {
                        dayElement.querySelector('[data-meal="morning"]').textContent = dayData.breakfast;
                        dayElement.querySelector('[data-meal="lunch"]').textContent = dayData.lunch;
                        dayElement.querySelector('[data-meal="afternoon"]').textContent = dayData.snack;
                    }
                });
                
                menuWeeks.appendChild(week);
            });
            
            updateMenuEditButtons();
        }
    } catch (error) {
        console.error('Error loading menu data:', error);
        showErrorMessage('Error loading menu data. Please try again.');
    }
}

// Function to save menu data to Firebase
async function saveMenuData() {
    if (!isLoggedIn) return;
    
    try {
        const menuWeeks = document.getElementById('menu-weeks');
        const weeksData = {};
        
        menuWeeks.querySelectorAll('.menu-week').forEach((week, index) => {
            const weekKey = `week${index + 1}`;
            weeksData[weekKey] = {
                date: week.querySelector('.week-date').textContent,
                items: {
                    monday: {
                        breakfast: week.querySelector('[data-day="monday"][data-meal="morning"]').textContent,
                        lunch: week.querySelector('[data-day="monday"][data-meal="lunch"]').textContent,
                        snack: week.querySelector('[data-day="monday"][data-meal="afternoon"]').textContent
                    },
                    tuesday: {
                        breakfast: week.querySelector('[data-day="tuesday"][data-meal="morning"]').textContent,
                        lunch: week.querySelector('[data-day="tuesday"][data-meal="lunch"]').textContent,
                        snack: week.querySelector('[data-day="tuesday"][data-meal="afternoon"]').textContent
                    },
                    wednesday: {
                        breakfast: week.querySelector('[data-day="wednesday"][data-meal="morning"]').textContent,
                        lunch: week.querySelector('[data-day="wednesday"][data-meal="lunch"]').textContent,
                        snack: week.querySelector('[data-day="wednesday"][data-meal="afternoon"]').textContent
                    },
                    thursday: {
                        breakfast: week.querySelector('[data-day="thursday"][data-meal="morning"]').textContent,
                        lunch: week.querySelector('[data-day="thursday"][data-meal="lunch"]').textContent,
                        snack: week.querySelector('[data-day="thursday"][data-meal="afternoon"]').textContent
                    },
                    friday: {
                        breakfast: week.querySelector('[data-day="friday"][data-meal="morning"]').textContent,
                        lunch: week.querySelector('[data-day="friday"][data-meal="lunch"]').textContent,
                        snack: week.querySelector('[data-day="friday"][data-meal="afternoon"]').textContent
                    }
                }
            };
        });
        
        // Save to Firebase
        await database.ref('menu').set(weeksData);
        
        // Show success message
        showSuccessMessage('Menu saved successfully!');
    } catch (error) {
        console.error('Error saving menu data:', error);
        showErrorMessage('Error saving menu data. Please try again.');
    }
}

// Listen for real-time updates with error handling
database.ref('menu').on('value', (snapshot) => {
    try {
        const menuData = snapshot.val();
        if (menuData) {
            loadMenuData();
        }
    } catch (error) {
        console.error('Error handling real-time update:', error);
        showErrorMessage('Error updating menu data. Please refresh the page.');
    }
}, (error) => {
    console.error('Error setting up real-time listener:', error);
    showErrorMessage('Error connecting to menu data. Please refresh the page.');
});

// Handle adding new week
document.getElementById('add-week').addEventListener('click', async () => {
    if (!isLoggedIn) return;
    
    try {
        const menuWeeks = document.getElementById('menu-weeks');
        const weekCount = menuWeeks.children.length + 1;
        const week = createWeekTemplate(weekCount, `Week ${weekCount}`);
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-week';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.onclick = async () => {
            week.remove();
            await saveMenuData(); // Save to Firebase after deletion
        };
        week.appendChild(deleteBtn);
        
        menuWeeks.appendChild(week);
        
        // Save to Firebase immediately after adding
        await saveMenuData();
        
        // Update edit buttons
        updateMenuEditButtons();
    } catch (error) {
        console.error('Error adding new week:', error);
        showErrorMessage('Error adding new week. Please try again.');
    }
});

// Load menu data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update admin button state
    if (isLoggedIn) {
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.classList.add('logged-in');
        adminBtn.querySelector('span').textContent = 'Admin Logout';
    }
    
    // Load menu data from Firebase
    loadMenuData();
});

// Gallery password protection
function checkGalleryPassword() {
    const password = document.getElementById('gallery-password').value;
    const galleryContent = document.getElementById('gallery-content');
    const galleryLogin = document.getElementById('gallery-login');
    const errorMessage = document.getElementById('gallery-error');
    
    if (password === 'hinadaycare123') {
        galleryLogin.style.display = 'none';
        galleryContent.style.display = 'block';
        errorMessage.classList.remove('show');
        document.getElementById('gallery-password').value = '';
        loadGalleryImages();
        updateGalleryAdminControls();
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
        errorMessage.classList.add('show');
    }
}

// Add Enter key support for gallery password
document.getElementById('gallery-password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkGalleryPassword();
    }
});

// Update gallery admin controls visibility
function updateGalleryAdminControls() {
    const adminControls = document.querySelector('.gallery-admin-controls');
    adminControls.style.display = isLoggedIn ? 'block' : 'none';
}

// Load gallery images from Firebase
async function loadGalleryImages() {
    try {
        const snapshot = await database.ref('gallery').once('value');
        const galleryData = snapshot.val();
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = ''; // Clear existing images
        
        if (galleryData) {
            Object.keys(galleryData).forEach(imageId => {
                const image = galleryData[imageId];
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                galleryItem.innerHTML = `
                    <div class="gallery-date-container">
                        <span class="gallery-date" data-image-id="${imageId}">${image.date}</span>
                        ${isLoggedIn ? `
                            <button class="edit-date-btn" onclick="editImageDate('${imageId}')">
                                <i class="fas fa-calendar-edit"></i>
                            </button>
                        ` : ''}
                    </div>
                    <img src="${image.src}" alt="${image.alt}" onclick="enlargeImage(this.src)">
                    ${isLoggedIn ? `
                        <button class="delete-image" onclick="deleteGalleryImage('${imageId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                `;
                
                galleryGrid.appendChild(galleryItem);
            });
        }
    } catch (error) {
        console.error('Error loading gallery images:', error);
        showErrorMessage('Error loading gallery images. Please try again.');
    }
}

// Add new image to gallery with Firebase
async function addGalleryImage(imageFile, date) {
    if (!isLoggedIn) return;
    
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            const newImage = {
                src: e.target.result,
                alt: 'Daycare Activity',
                date: date
            };
            
            // Save to Firebase
            const newImageRef = await database.ref('gallery').push(newImage);
            
            // Reload gallery
            loadGalleryImages();
            showSuccessMessage('Image added successfully');
        } catch (error) {
            showErrorMessage('Error saving image. Please try again.');
            console.error('Error saving image:', error);
        }
    };
    
    reader.onerror = function() {
        showErrorMessage('Error reading image file. Please try again.');
    };
    
    reader.readAsDataURL(imageFile);
}

// Delete image from gallery (admin only)
async function deleteGalleryImage(imageId) {
    if (!isLoggedIn) return;
    
    if (confirm('Are you sure you want to delete this image?')) {
        try {
            await database.ref(`gallery/${imageId}`).remove();
            loadGalleryImages();
            showSuccessMessage('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            showErrorMessage('Error deleting image. Please try again.');
        }
    }
}

// Edit image date
async function editImageDate(imageId) {
    if (!isLoggedIn) return;
    
    try {
        const snapshot = await database.ref(`gallery/${imageId}`).once('value');
        const image = snapshot.val();
        
        if (image) {
            const newDate = prompt('Enter new date (YYYY-MM-DD):', image.date);
            if (newDate) {
                await database.ref(`gallery/${imageId}`).update({ date: newDate });
                loadGalleryImages();
            }
        }
    } catch (error) {
        console.error('Error updating image date:', error);
        showErrorMessage('Error updating image date. Please try again.');
    }
}

// Sort gallery images
async function sortGalleryImages() {
    try {
        const sortBy = document.getElementById('gallery-sort').value;
        const snapshot = await database.ref('gallery').once('value');
        const galleryData = snapshot.val();
        
        if (galleryData) {
            const images = Object.entries(galleryData).map(([id, image]) => ({
                id,
                ...image
            }));
            
            images.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            });
            
            // Update the display order
            const galleryGrid = document.querySelector('.gallery-grid');
            galleryGrid.innerHTML = '';
            
            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                galleryItem.innerHTML = `
                    <div class="gallery-date-container">
                        <span class="gallery-date" data-image-id="${image.id}">${image.date}</span>
                        ${isLoggedIn ? `
                            <button class="edit-date-btn" onclick="editImageDate('${image.id}')">
                                <i class="fas fa-calendar-edit"></i>
                            </button>
                        ` : ''}
                    </div>
                    <img src="${image.src}" alt="${image.alt}" onclick="enlargeImage(this.src)">
                    ${isLoggedIn ? `
                        <button class="delete-image" onclick="deleteGalleryImage('${image.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                `;
                
                galleryGrid.appendChild(galleryItem);
            });
        }
    } catch (error) {
        console.error('Error sorting gallery images:', error);
        showErrorMessage('Error sorting gallery images. Please try again.');
    }
}

// Enlarge image function
function enlargeImage(src) {
    const enlargedModal = document.getElementById('enlarged-image-modal');
    const enlargedImage = enlargedModal.querySelector('.enlarged-image');
    enlargedImage.src = src;
    enlargedModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close enlarged image modal
document.querySelector('.close-enlarged').addEventListener('click', function() {
    const enlargedModal = document.getElementById('enlarged-image-modal');
    enlargedModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close enlarged image modal when clicking outside
document.getElementById('enlarged-image-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close enlarged image modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const enlargedModal = document.getElementById('enlarged-image-modal');
        if (enlargedModal.style.display === 'block') {
            enlargedModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Reset gallery view when modal is closed
document.getElementById('gallery-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        const galleryContent = document.getElementById('gallery-content');
        const galleryLogin = document.getElementById('gallery-login');
        galleryContent.style.display = 'none';
        galleryLogin.style.display = 'block';
        document.getElementById('gallery-password').value = '';
    }
});

// Update gallery admin controls when login state changes
document.addEventListener('DOMContentLoaded', function() {
    updateGalleryAdminControls();
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
