// Enhanced UX for Sheet Exporter

// File upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const uploadForm = document.getElementById('uploadForm');
    const uploadText = document.getElementById('uploadText');
    const uploadSpinner = document.getElementById('uploadSpinner');

    if (fileInput) {
        // File selection
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = file.name;
                uploadArea.style.display = 'none';
                fileInfo.style.display = 'block';
            }
        });

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
            uploadArea.style.backgroundColor = '#eff6ff';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#e2e8f0';
            uploadArea.style.backgroundColor = '#fafbfc';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#e2e8f0';
            uploadArea.style.backgroundColor = '#fafbfc';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });

        // Form submission
        if (uploadForm) {
            uploadForm.addEventListener('submit', function(e) {
                if (uploadText && uploadSpinner) {
                    uploadText.style.display = 'none';
                    uploadSpinner.style.display = 'inline-block';
                }
            });
        }
    }

    // Export form functionality
    const exportForm = document.getElementById('exportForm');
    if (exportForm) {
        exportForm.addEventListener('submit', function(e) {
            const checkedBoxes = document.querySelectorAll('input[name="cols"]:checked');
            if (checkedBoxes.length === 0) {
                e.preventDefault();
                alert('Please select at least one column to export.');
                return false;
            }
        });

        // Update selected count
        const updateSelectedCount = function() {
            const total = document.querySelectorAll('input[name="cols"]').length;
            const selected = document.querySelectorAll('input[name="cols"]:checked').length;
            const button = exportForm.querySelector('button[type="submit"]');
            if (button) {
                button.textContent = `Export ${selected} of ${total} Columns`;
            }
        };

        // Add event listeners to checkboxes
        document.querySelectorAll('input[name="cols"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedCount);
        });

        // Initial count
        updateSelectedCount();
    }

    // Add smooth scrolling
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

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + A to select all columns
        if ((e.ctrlKey || e.metaKey) && e.key === 'a' && document.querySelectorAll('input[name="cols"]').length > 0) {
            e.preventDefault();
            document.querySelectorAll('input[name="cols"]').forEach(cb => cb.checked = true);
            if (typeof updateSelectedCount === 'function') {
                updateSelectedCount();
            }
        }
        
        // Ctrl/Cmd + D to deselect all columns
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && document.querySelectorAll('input[name="cols"]').length > 0) {
            e.preventDefault();
            document.querySelectorAll('input[name="cols"]').forEach(cb => cb.checked = false);
            if (typeof updateSelectedCount === 'function') {
                updateSelectedCount();
            }
        }
    });
});