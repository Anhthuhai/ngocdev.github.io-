// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

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

// Modal functionality
const modals = {
    app: document.getElementById('addAppModal'),
    content: document.getElementById('addContentModal'),
    post: document.getElementById('addPostModal')
};

// Open modal functions
function openAddAppModal() {
    modals.app.style.display = 'block';
}

function openAddContentModal() {
    modals.content.style.display = 'block';
}

function openAddPostModal() {
    modals.post.style.display = 'block';
}

// Close modal when clicking on close button or outside modal
Object.values(modals).forEach(modal => {
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Local storage keys
const STORAGE_KEYS = {
    apps: 'ngoc_mobile_apps',
    content: 'ngoc_medical_content',
    posts: 'ngoc_blog_posts'
};

// Initialize data storage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.apps)) {
        localStorage.setItem(STORAGE_KEYS.apps, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.content)) {
        localStorage.setItem(STORAGE_KEYS.content, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.posts)) {
        localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify([]));
    }
}

// Add new app functionality
document.getElementById('addAppForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const appData = {
        id: Date.now(),
        name: document.getElementById('appName').value,
        description: document.getElementById('appDescription').value,
        technology: document.getElementById('appTechnology').value,
        category: document.getElementById('appCategory').value,
        dateAdded: new Date().toLocaleDateString()
    };
    
    const apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.apps));
    apps.push(appData);
    localStorage.setItem(STORAGE_KEYS.apps, JSON.stringify(apps));
    
    addAppToGrid(appData);
    modals.app.style.display = 'none';
    this.reset();
    
    showNotification('App added successfully!', 'success');
});

// Add new content functionality
document.getElementById('addContentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const contentData = {
        id: Date.now(),
        title: document.getElementById('contentTitle').value,
        text: document.getElementById('contentText').value,
        tags: document.getElementById('contentTags').value.split(',').map(tag => tag.trim()),
        dateAdded: new Date().toLocaleDateString()
    };
    
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.content));
    content.push(contentData);
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(content));
    
    addContentToGrid(contentData);
    modals.content.style.display = 'none';
    this.reset();
    
    showNotification('Medical content added successfully!', 'success');
});

// Add new blog post functionality
document.getElementById('addPostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const postData = {
        id: Date.now(),
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()),
        dateAdded: new Date().toLocaleDateString()
    };
    
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts));
    posts.push(postData);
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
    
    addPostToGrid(postData);
    modals.post.style.display = 'none';
    this.reset();
    
    showNotification('Blog post added successfully!', 'success');
});

// Function to add app to grid
function addAppToGrid(appData) {
    const appsGrid = document.querySelector('.apps-grid');
    const addAppCard = appsGrid.querySelector('.add-app');
    
    const appCard = document.createElement('div');
    appCard.className = 'app-card';
    appCard.innerHTML = `
        <div class="app-icon">
            <i class="fas fa-mobile-alt"></i>
        </div>
        <h3 class="app-title">${appData.name}</h3>
        <p class="app-description">${appData.description}</p>
        <div class="app-features">
            ${appData.category ? `<span class="feature-tag">${appData.category}</span>` : ''}
            ${appData.technology ? `<span class="feature-tag">${appData.technology}</span>` : ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="#" class="app-link">View Details</a>
            <button class="btn btn-danger btn-small" onclick="deleteApp(${appData.id})">Delete</button>
        </div>
    `;
    
    appsGrid.insertBefore(appCard, addAppCard);
}

// Function to add content to grid
function addContentToGrid(contentData) {
    const contentGrid = document.querySelector('.content-grid');
    const addContentCard = contentGrid.querySelector('.add-content');
    
    const contentCard = document.createElement('div');
    contentCard.className = 'content-card';
    contentCard.innerHTML = `
        <div class="content-header">
            <h3>${contentData.title}</h3>
            <span class="content-date">${contentData.dateAdded}</span>
        </div>
        <p class="content-excerpt">${contentData.text.substring(0, 150)}...</p>
        <div class="content-tags">
            ${contentData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="#" class="content-link">Read More</a>
            <button class="btn btn-danger btn-small" onclick="deleteContent(${contentData.id})">Delete</button>
        </div>
    `;
    
    contentGrid.insertBefore(contentCard, addContentCard);
}

// Function to add post to grid
function addPostToGrid(postData) {
    const blogGrid = document.querySelector('.blog-grid');
    const addPostCard = blogGrid.querySelector('.add-post');
    
    const postCard = document.createElement('article');
    postCard.className = 'blog-card';
    postCard.innerHTML = `
        <div class="blog-header">
            <h3>${postData.title}</h3>
            <span class="blog-date">${postData.dateAdded}</span>
        </div>
        <p class="blog-excerpt">${postData.content.substring(0, 150)}...</p>
        <div class="blog-tags">
            ${postData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="#" class="blog-link">Read More</a>
            <button class="btn btn-danger btn-small" onclick="deletePost(${postData.id})">Delete</button>
        </div>
    `;
    
    blogGrid.insertBefore(postCard, addPostCard);
}

// Delete functions
function deleteApp(id) {
    if (confirm('Are you sure you want to delete this app?')) {
        const apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.apps));
        const updatedApps = apps.filter(app => app.id !== id);
        localStorage.setItem(STORAGE_KEYS.apps, JSON.stringify(updatedApps));
        loadStoredData();
        showNotification('App deleted successfully!', 'success');
    }
}

function deleteContent(id) {
    if (confirm('Are you sure you want to delete this content?')) {
        const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.content));
        const updatedContent = content.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(updatedContent));
        loadStoredData();
        showNotification('Content deleted successfully!', 'success');
    }
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts));
        const updatedPosts = posts.filter(post => post.id !== id);
        localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(updatedPosts));
        loadStoredData();
        showNotification('Post deleted successfully!', 'success');
    }
}

// Load stored data on page load
function loadStoredData() {
    // Clear existing user-added items
    document.querySelectorAll('.app-card:not(.add-app)').forEach(card => {
        if (card.querySelector('button[onclick*="deleteApp"]')) {
            card.remove();
        }
    });
    
    document.querySelectorAll('.content-card:not(.add-content)').forEach(card => {
        if (card.querySelector('button[onclick*="deleteContent"]')) {
            card.remove();
        }
    });
    
    document.querySelectorAll('.blog-card:not(.add-post)').forEach(card => {
        if (card.querySelector('button[onclick*="deletePost"]')) {
            card.remove();
        }
    });
    
    // Load apps
    const apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.apps));
    apps.forEach(app => addAppToGrid(app));
    
    // Load content
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.content));
    content.forEach(item => addContentToGrid(item));
    
    // Load posts
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts));
    posts.forEach(post => addPostToGrid(post));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already in CSS
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add slide animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .btn-danger {
        background-color: #ef4444;
        color: white;
        font-size: 0.75rem;
        padding: 6px 12px;
    }
    
    .btn-danger:hover {
        background-color: #dc2626;
    }
    
    .btn-small {
        font-size: 0.75rem;
        padding: 6px 12px;
    }
`;
document.head.appendChild(style);

// Search functionality
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search apps, content, or posts...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        margin: 20px auto;
        display: block;
        padding: 12px 20px;
        border: 1px solid #d1d5db;
        border-radius: 25px;
        width: 100%;
        max-width: 400px;
        font-size: 1rem;
    `;
    
    // Add search to each section
    const sections = ['#apps', '#medical', '#blog'];
    sections.forEach(sectionId => {
        const section = document.querySelector(sectionId);
        const container = section.querySelector('.container');
        const sectionTitle = container.querySelector('.section-title');
        const searchContainer = document.createElement('div');
        searchContainer.style.textAlign = 'center';
        searchContainer.appendChild(searchInput.cloneNode(true));
        container.insertBefore(searchContainer, sectionTitle.nextElementSibling.nextElementSibling);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    loadStoredData();
    
    // Add some sample data if storage is empty
    if (JSON.parse(localStorage.getItem(STORAGE_KEYS.apps)).length === 0) {
        // Already have sample apps in HTML
    }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.app-card, .content-card, .blog-card');
    cards.forEach(card => observer.observe(card));
});

// Export functions for global access
window.openAddAppModal = openAddAppModal;
window.openAddContentModal = openAddContentModal;
window.openAddPostModal = openAddPostModal;
window.deleteApp = deleteApp;
window.deleteContent = deleteContent;
window.deletePost = deletePost;