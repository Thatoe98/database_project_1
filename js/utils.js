// =====================================================
// UTILITY FUNCTIONS
// =====================================================
// Helper functions for validation, formatting, and UI interactions

// ===== VALIDATION FUNCTIONS =====

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic format)
 */
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate date is not in future
 */
function validatePastDate(date) {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
}

/**
 * Validate age range (18-65 for donors)
 */
function validateAge(dateOfBirth, minAge = 18, maxAge = 65) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= minAge && age <= maxAge;
}

/**
 * Validate weight (minimum 50kg for donors)
 */
function validateWeight(weight, minWeight = 50) {
    return weight >= minWeight;
}

/**
 * Check donor eligibility based on last donation date
 * (Must be at least 90 days since last donation)
 */
function checkDonorEligibility(lastDonationDate) {
    if (!lastDonationDate) return true;
    
    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
    
    return daysSinceLastDonation >= 90;
}

// ===== FORMATTING FUNCTIONS =====

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format date to readable format (e.g., "Oct 25, 2024")
 */
function formatDateReadable(date) {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Format datetime to readable format
 */
function formatDateTime(datetime) {
    if (!datetime) return 'N/A';
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(datetime).toLocaleString('en-US', options);
}

/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Calculate days since last donation
 */
function daysSinceLastDonation(lastDonationDate) {
    if (!lastDonationDate) return null;
    
    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const daysSince = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
    
    return daysSince;
}

// ===== UI HELPER FUNCTIONS =====

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Toast icon
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show loading overlay
 */
function showLoading() {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading"></div>';
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Show confirmation dialog
 */
function showConfirmDialog(message, onConfirm, onCancel) {
    const confirmed = confirm(message);
    if (confirmed && onConfirm) {
        onConfirm();
    } else if (!confirmed && onCancel) {
        onCancel();
    }
}

/**
 * Toggle modal visibility
 */
function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (show) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

/**
 * Close modal on overlay click
 */
function setupModalClose() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

/**
 * Toggle mobile sidebar
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// ===== TABLE UTILITY FUNCTIONS =====

/**
 * Sort table by column
 */
function sortTable(tableId, columnIndex, ascending = true) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as number
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }
        
        // Sort as string
        return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Filter table rows based on search term
 */
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

/**
 * Create pagination controls
 */
function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let html = '<div class="pagination">';
    html += `<div class="pagination-info">Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items</div>`;
    html += '<div class="pagination-controls">';
    
    // Previous button
    html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})">Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span>...</span>';
        }
    }
    
    // Next button
    html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})">Next</button>`;
    
    html += '</div></div>';
    return html;
}

// ===== DATA EXPORT FUNCTIONS =====

/**
 * Export table data to CSV
 */
function exportToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => {
        headers.push(th.textContent.trim());
    });
    csv.push(headers.join(','));
    
    // Get rows
    table.querySelectorAll('tbody tr').forEach(row => {
        if (row.style.display !== 'none') {
            const rowData = [];
            row.querySelectorAll('td').forEach(td => {
                let text = td.textContent.trim();
                // Escape quotes and wrap in quotes if contains comma
                if (text.includes(',') || text.includes('"')) {
                    text = '"' + text.replace(/"/g, '""') + '"';
                }
                rowData.push(text);
            });
            csv.push(rowData.join(','));
        }
    });
    
    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Data exported successfully', 'success');
}

/**
 * Print current page
 */
function printPage() {
    window.print();
}

// ===== DEBOUNCE FUNCTION =====

/**
 * Debounce function to limit API calls during search
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== STATUS BADGE HELPER =====

/**
 * Get badge class based on status
 */
function getStatusBadgeClass(status) {
    const statusMap = {
        'Active': 'badge-success',
        'Available': 'badge-success',
        'Completed': 'badge-success',
        'Fulfilled': 'badge-success',
        'Approved': 'badge-success',
        'Pending': 'badge-warning',
        'Scheduled': 'badge-info',
        'Ongoing': 'badge-info',
        'Urgent': 'badge-warning',
        'Emergency': 'badge-danger',
        'Rejected': 'badge-danger',
        'Cancelled': 'badge-secondary',
        'Expired': 'badge-danger',
        'Used': 'badge-secondary',
        'Inactive': 'badge-secondary'
    };
    
    return statusMap[status] || 'badge-secondary';
}

/**
 * Get urgency badge class
 */
function getUrgencyBadgeClass(urgency) {
    const urgencyMap = {
        'Emergency': 'badge-danger',
        'Urgent': 'badge-warning',
        'Normal': 'badge-success'
    };
    
    return urgencyMap[urgency] || 'badge-info';
}

// ===== BLOOD TYPE UTILITIES =====

/**
 * Get all blood types
 */
function getBloodTypes() {
    return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
}

/**
 * Get stock level class based on units
 */
function getStockLevelClass(units, threshold = 10) {
    if (units < 5) return 'danger';
    if (units < threshold) return 'warning';
    return 'success';
}

/**
 * Get stock level text
 */
function getStockLevelText(units, threshold = 10) {
    if (units < 5) return 'Critical';
    if (units < threshold) return 'Low';
    return 'Good';
}

// ===== INITIALIZE ON PAGE LOAD =====

document.addEventListener('DOMContentLoaded', () => {
    // Setup modal close on overlay click
    setupModalClose();
    
    // Setup mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar on overlay click (mobile)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target === sidebar && window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    }
    
    // Highlight active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// ===== EXPORT FUNCTIONS FOR USE IN OTHER SCRIPTS =====
// All functions are globally available
