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
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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
        localStorage.removeItem('isLoggedIn');
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
        localStorage.setItem('isLoggedIn', 'true');
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
document.getElementById('edit-menu-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (currentEditingItem) {
        const newText = document.getElementById('edit-menu-text').value;
        currentEditingItem.textContent = newText;
        
        // Save all weeks to localStorage
        saveMenuToStorage();
        
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
        
        // Save all weeks to localStorage
        saveMenuToStorage();
        
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

// Load menu data from localStorage
function loadMenuData() {
    const weeksData = JSON.parse(localStorage.getItem('menuWeeks') || '[]');
    const menuWeeks = document.getElementById('menu-weeks');
    menuWeeks.innerHTML = ''; // Clear existing weeks
    
    if (weeksData.length === 0) {
        // If no data, create default week with original menu
        const defaultWeek = createWeekTemplate(1, 'Week of January 1, 2024');
        
        // Set default menu items
        const defaultMenu = {
            monday: {
                morning: 'Oatmeal with fresh fruits',
                lunch: 'Chicken soup with vegetables',
                afternoon: 'Yogurt with granola'
            },
            tuesday: {
                morning: 'Whole grain toast with peanut butter',
                lunch: 'Pasta with tomato sauce',
                afternoon: 'Fresh fruit salad'
            },
            wednesday: {
                morning: 'Scrambled eggs with toast',
                lunch: 'Fish with rice and vegetables',
                afternoon: 'Cheese and crackers'
            },
            thursday: {
                morning: 'Pancakes with maple syrup',
                lunch: 'Beef stew with bread',
                afternoon: 'Mixed nuts and dried fruits'
            },
            friday: {
                morning: 'Cereal with milk',
                lunch: 'Pizza with salad',
                afternoon: 'Ice cream with toppings'
            }
        };
        
        // Apply default menu items
        Object.keys(defaultMenu).forEach(day => {
            Object.keys(defaultMenu[day]).forEach(meal => {
                const element = defaultWeek.querySelector(`[data-day="${day}"][data-meal="${meal}"]`);
                if (element) {
                    element.textContent = defaultMenu[day][meal];
                }
            });
        });
        
        menuWeeks.appendChild(defaultWeek);
        
        // Save default menu to localStorage
        const defaultWeekData = {
            weekNumber: 1,
            date: 'Week of January 1, 2024',
            menuItems: defaultMenu
        };
        localStorage.setItem('menuWeeks', JSON.stringify([defaultWeekData]));
    } else {
        // Load saved weeks
        weeksData.forEach(weekData => {
            const week = createWeekTemplate(weekData.weekNumber, weekData.date);
            
            // Set menu items
            Object.keys(weekData.menuItems).forEach(day => {
                Object.keys(weekData.menuItems[day]).forEach(meal => {
                    const element = week.querySelector(`[data-day="${day}"][data-meal="${meal}"]`);
                    if (element) {
                        element.textContent = weekData.menuItems[day][meal];
                    }
                });
            });
            
            menuWeeks.appendChild(week);
            
            // Add delete functionality
            const deleteBtn = week.querySelector('.delete-week');
            deleteBtn.style.display = isLoggedIn ? 'flex' : 'none';
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this week?')) {
                    week.remove();
                    renumberWeeks();
                    saveMenuToStorage(); // Save after deletion
                    showSuccessMessage('Week deleted successfully');
                }
            });
        });
    }
    
    updateMenuEditButtons();
}

// Handle adding new week
document.getElementById('add-week').addEventListener('click', function() {
    const menuWeeks = document.getElementById('menu-weeks');
    const weekCount = menuWeeks.children.length;
    const newWeek = createWeekTemplate(weekCount + 1);
    
    // Insert at the beginning
    menuWeeks.insertBefore(newWeek, menuWeeks.firstChild);
    
    // Update edit buttons visibility
    updateMenuEditButtons();
    
    // Add delete functionality
    const deleteBtn = newWeek.querySelector('.delete-week');
    deleteBtn.style.display = isLoggedIn ? 'flex' : 'none';
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this week?')) {
            newWeek.remove();
            renumberWeeks();
            saveMenuToStorage(); // Save after deletion
            showSuccessMessage('Week deleted successfully');
        }
    });
    
    // Save after adding new week
    saveMenuToStorage();
    showSuccessMessage('New week added successfully');
});

// Renumber weeks after deletion
function renumberWeeks() {
    const menuWeeks = document.getElementById('menu-weeks');
    const weeks = menuWeeks.querySelectorAll('.menu-week');
    
    weeks.forEach((week, index) => {
        const weekNumber = index + 1;
        week.dataset.weekNumber = weekNumber;
        week.querySelector('.week-info h3').textContent = `Week ${weekNumber}`;
    });
}

// Save menu data to localStorage
function saveMenuToStorage() {
    const menuWeeks = document.getElementById('menu-weeks');
    const weeksData = [];
    
    menuWeeks.querySelectorAll('.menu-week').forEach(week => {
        const weekData = {
            weekNumber: week.dataset.weekNumber,
            date: week.querySelector('.week-date').textContent,
            menuItems: {}
        };
        
        week.querySelectorAll('.editable').forEach(item => {
            const day = item.dataset.day;
            const meal = item.dataset.meal;
            if (!weekData.menuItems[day]) {
                weekData.menuItems[day] = {};
            }
            weekData.menuItems[day][meal] = item.textContent;
        });
        
        weeksData.push(weekData);
    });
    
    localStorage.setItem('menuWeeks', JSON.stringify(weeksData));
}

// Update menu item form submission to save all weeks
document.getElementById('edit-menu-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (currentEditingItem) {
        const newText = document.getElementById('edit-menu-text').value;
        currentEditingItem.textContent = newText;
        
        // Save all weeks to localStorage
        saveMenuToStorage();
        
        closeModal('edit-menu-modal');
        showSuccessMessage('Menu item updated successfully');
    }
});

// Update edit buttons when opening the menu modal
document.querySelector('.menu-link').addEventListener('click', function() {
    setTimeout(updateMenuEditButtons, 100);
});

// Load menu data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update admin button state
    if (isLoggedIn) {
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.classList.add('logged-in');
        adminBtn.querySelector('span').textContent = 'Admin Logout';
    }
    
    // Load menu data
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

// Load gallery stories from localStorage
function loadGalleryImages() {
    const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
    const storiesContainer = document.querySelector('.gallery-grid');
    storiesContainer.innerHTML = '';
    
    savedStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.innerHTML = `
            <img src="${story.image}" alt="${story.title}" class="story-image">
            <div class="story-content">
                <h3 class="story-title">${story.title}</h3>
                <p class="story-description">${story.description}</p>
                <div class="story-date">${story.date}</div>
            </div>
            ${isLoggedIn ? `
                <div class="story-admin-controls">
                    <button class="edit" onclick="editStory('${story.id}')">Edit</button>
                    <button class="delete" onclick="deleteStory('${story.id}')">Delete</button>
                </div>
            ` : ''}
        `;
        storiesContainer.appendChild(storyCard);
    });
}

// Sort gallery stories
function sortGalleryImages() {
    const sortBy = document.getElementById('gallery-sort').value;
    const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
    
    savedStories.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    localStorage.setItem('galleryStories', JSON.stringify(savedStories));
    loadGalleryImages();
}

// Edit story date
function editStoryDate(storyId) {
    const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
    const story = savedStories.find(s => s.id === storyId);
    
    if (story) {
        const newDate = prompt('Enter new date (YYYY-MM-DD):', story.date);
        if (newDate) {
            story.date = newDate;
            localStorage.setItem('galleryStories', JSON.stringify(savedStories));
            loadGalleryImages();
        }
    }
}

// Edit story content
function editStory(storyId) {
    const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
    const story = savedStories.find(s => s.id === storyId);
    
    if (story) {
        const newTitle = prompt('Enter new title:', story.title);
        if (newTitle) {
            story.title = newTitle;
            const newDescription = prompt('Enter new description:', story.description);
            if (newDescription) {
                story.description = newDescription;
                localStorage.setItem('galleryStories', JSON.stringify(savedStories));
                loadGalleryImages();
            }
        }
    }
}

// Handle story upload
function addStory(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('gallery-upload');
    const titleInput = document.getElementById('story-title');
    const descriptionInput = document.getElementById('story-description');
    
    if (!fileInput.files[0] || !titleInput.value || !descriptionInput.value) {
        alert("Please fill in all fields and select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
        const newStory = {
            id: Date.now().toString(),
            image: e.target.result,
            title: titleInput.value,
            description: descriptionInput.value,
            date: new Date().toISOString().split('T')[0]
        };
        
        savedStories.push(newStory);
        localStorage.setItem('galleryStories', JSON.stringify(savedStories));
        
        // Clear form
        fileInput.value = '';
        titleInput.value = '';
        descriptionInput.value = '';
        
        // Reload stories
        loadGalleryImages();
        alert("Story added successfully!");
    };
    
    reader.readAsDataURL(fileInput.files[0]);
}

// Delete story
function deleteStory(storyId) {
    if (!confirm("Are you sure you want to delete this story?")) {
        return;
    }

    const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
    const updatedStories = savedStories.filter(story => story.id !== storyId);
    localStorage.setItem('galleryStories', JSON.stringify(updatedStories));
    loadGalleryImages();
    alert("Story deleted successfully!");
}

// Initialize with a default story
function initializeDefaultStory() {
    const savedStories = JSON.parse(localStorage.getItem('galleryStories')) || [];
    
    if (savedStories.length === 0) {
        const defaultStory = {
            id: Date.now().toString(),
            title: 'Chilli Milli',
            description: 'Today we had a special visitor in our daycare - a cute little candy wrapper named Chilli Milli! The children were fascinated by its bright colors and learned about the importance of proper waste disposal and recycling. This sparked a wonderful discussion about taking care of our environment and making sure we clean up after ourselves.',
            image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEkKSM4Mjc1MjM3QkFINz5BQTY0RkNCUjdOT1FVVk1DWUJLR1JVWlH/2wBDAR',
            date: new Date().toISOString().split('T')[0]
        };
        
        savedStories.push(defaultStory);
        localStorage.setItem('galleryStories', JSON.stringify(savedStories));
    }
}

// Call initializeDefaultStory when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultStory();
    loadGalleryImages();
});

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

// Story Management Functions
function loadStories() {
    const storiesRef = ref(database, 'stories');
    onValue(storiesRef, (snapshot) => {
        const storiesData = snapshot.val() || {};
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = '';

        Object.entries(storiesData).forEach(([key, story]) => {
            const storyCard = createStoryCard(key, story);
            galleryGrid.appendChild(storyCard);
        });
    });
}

function createStoryCard(storyId, story) {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
        <img src="${story.imageUrl}" alt="${story.title}" class="story-image">
        <div class="story-content">
            <h3 class="story-title">${story.title}</h3>
            <p class="story-description">${story.description}</p>
            <p class="story-date">${new Date(story.date).toLocaleDateString()}</p>
            ${isAdmin() ? `
                <div class="story-controls">
                    <button class="edit-story" onclick="editStory('${storyId}')">Edit</button>
                    <button class="delete-story" onclick="deleteStory('${storyId}')">Delete</button>
                </div>
            ` : ''}
        </div>
    `;
    return card;
}

async function uploadStory(event) {
    event.preventDefault();
    const form = event.target;
    const imageFile = form.querySelector('#storyImage').files[0];
    const title = form.querySelector('#storyTitle').value;
    const description = form.querySelector('#storyDescription').value;

    if (!imageFile || !title || !description) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `stories/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Save story data to Firebase Database
        const storiesRef = ref(database, 'stories');
        const newStoryRef = push(storiesRef);
        await set(newStoryRef, {
            imageUrl,
            title,
            description,
            date: new Date().toISOString()
        });

        form.reset();
        alert('Story uploaded successfully!');
    } catch (error) {
        console.error('Error uploading story:', error);
        alert('Error uploading story. Please try again.');
    }
}

async function deleteStory(storyId) {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
        const storyRef = ref(database, `stories/${storyId}`);
        await remove(storyRef);
        alert('Story deleted successfully!');
    } catch (error) {
        console.error('Error deleting story:', error);
        alert('Error deleting story. Please try again.');
    }
}

async function editStory(storyId) {
    const storyRef = ref(database, `stories/${storyId}`);
    const snapshot = await get(storyRef);
    const story = snapshot.val();

    if (!story) {
        alert('Story not found');
        return;
    }

    const newTitle = prompt('Enter new title:', story.title);
    const newDescription = prompt('Enter new description:', story.description);

    if (newTitle === null || newDescription === null) return;

    try {
        await update(storyRef, {
            title: newTitle,
            description: newDescription
        });
        alert('Story updated successfully!');
    } catch (error) {
        console.error('Error updating story:', error);
        alert('Error updating story. Please try again.');
    }
}

// Initialize story functionality when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const storyForm = document.querySelector('#storyUploadForm');
    if (storyForm) {
        storyForm.addEventListener('submit', uploadStory);
        loadStories();
    }
});
