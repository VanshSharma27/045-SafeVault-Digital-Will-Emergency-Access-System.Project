/**
 * script.js - Main JavaScript for ShopEasy
 * Project: ShopEasy E-Commerce Website
 * Author: Vansh Sharma
 * Date: April 2026
 *
 * Handles:
 *  1. Add to Cart     → AJAX POST to /add-to-cart/
 *  2. Remove from Cart → AJAX POST to /remove-from-cart/
 *  3. Update Quantity  → AJAX POST to /update-cart/
 *  4. Toast notifications
 *  5. Cart badge update in navbar
 */


// ─────────────────────────────────────────────
// UTILITY: Get CSRF Token
// Django requires this token in every POST request.
// ─────────────────────────────────────────────
function getCsrfToken() {
    // First try the template-injected variable
    if (typeof CSRF_TOKEN !== 'undefined') return CSRF_TOKEN;

    // Fallback: read from browser cookie
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        const [k, v] = c.trim().split('=');
        if (k === 'csrftoken') return decodeURIComponent(v);
    }
    return '';
}


// ─────────────────────────────────────────────
// UTILITY: Show Toast Popup
// Displays a short message at the bottom of the screen.
// type: 'success' | 'error'
// ─────────────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-message');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    // Auto-dismiss after 3 seconds
    setTimeout(() => toast.classList.remove('show'), 3000);
}


// ─────────────────────────────────────────────
// UTILITY: Update Cart Badge in Navbar
// ─────────────────────────────────────────────
function updateCartBadge(count) {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';

    // Small bounce animation
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 250);
}


// ─────────────────────────────────────────────
// FUNCTION: Add to Cart
// Called from product card "Add to Cart" button.
// Uses AJAX — no page reload needed.
// ─────────────────────────────────────────────
function addToCart(productId, productName) {
    const button = document.getElementById(`btn-${productId}`);

    // Show loading state on button
    if (button) {
        button.textContent = 'Adding...';
        button.disabled = true;
    }

    fetch('/add-to-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ product_id: productId }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast(`✅ ${productName} added to cart!`, 'success');
            updateCartBadge(data.cart_count);

            if (button) {
                button.textContent = '✓ Added!';
                button.classList.add('added');

                // Reset button after 2 seconds
                setTimeout(() => {
                    button.textContent = '+ Add to Cart';
                    button.classList.remove('added');
                    button.disabled = false;
                }, 2000);
            }
        } else {
            showToast(`❌ ${data.message}`, 'error');
            if (button) { button.textContent = '+ Add to Cart'; button.disabled = false; }
        }
    })
    .catch(() => {
        showToast('❌ Something went wrong. Try again.', 'error');
        if (button) { button.textContent = '+ Add to Cart'; button.disabled = false; }
    });
}


// ─────────────────────────────────────────────
// FUNCTION: Remove from Cart
// Called from the ✕ button on each cart item.
// ─────────────────────────────────────────────
function removeFromCart(productId) {
    if (!confirm('Remove this item from your cart?')) return;

    fetch('/remove-from-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ product_id: productId }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Fade out and remove the item row from the DOM
            const el = document.getElementById(`cart-item-${productId}`);
            if (el) {
                el.style.transition = 'opacity 0.3s, transform 0.3s';
                el.style.opacity = '0';
                el.style.transform = 'translateX(-20px)';
                setTimeout(() => el.remove(), 300);
            }

            updateCartTotals(data.cart_total, data.cart_count);
            updateCartBadge(data.cart_count);
            showToast('🗑️ Item removed from cart.', 'success');

            // Reload if cart is now empty to show empty state
            if (data.cart_count === 0) setTimeout(() => location.reload(), 800);
        } else {
            showToast(`❌ ${data.message}`, 'error');
        }
    })
    .catch(() => showToast('❌ Something went wrong.', 'error'));
}


// ─────────────────────────────────────────────
// FUNCTION: Update Cart Quantity ( + / − )
// Called from the quantity buttons on cart page.
// action: 'increase' or 'decrease'
// ─────────────────────────────────────────────
function updateCart(productId, action) {
    fetch('/update-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ product_id: productId, action: action }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            if (data.removed) {
                // Quantity hit 0 → remove item row
                const el = document.getElementById(`cart-item-${productId}`);
                if (el) {
                    el.style.transition = 'opacity 0.3s';
                    el.style.opacity = '0';
                    setTimeout(() => el.remove(), 300);
                }
                showToast('🗑️ Item removed from cart.', 'success');
                if (data.cart_count === 0) setTimeout(() => location.reload(), 800);
            } else {
                // Update quantity display with bounce
                const qtyEl = document.getElementById(`qty-${productId}`);
                if (qtyEl) {
                    qtyEl.textContent = data.quantity;
                    qtyEl.style.transform = 'scale(1.4)';
                    setTimeout(() => { qtyEl.style.transform = 'scale(1)'; }, 200);
                }

                // Update item subtotal
                const totalEl = document.getElementById(`item-total-${productId}`);
                if (totalEl) totalEl.textContent = `₹${data.item_total}`;
            }

            updateCartTotals(data.cart_total, data.cart_count);
            updateCartBadge(data.cart_count);
        }
    })
    .catch(() => showToast('❌ Something went wrong.', 'error'));
}


// ─────────────────────────────────────────────
// HELPER: Update Cart Summary Totals
// Updates the total price shown in the summary box.
// ─────────────────────────────────────────────
function updateCartTotals(newTotal, itemCount) {
    const summaryTotal = document.getElementById('summary-total');
    const grandTotal   = document.getElementById('grand-total');
    const subtitle     = document.querySelector('.section-subtitle');

    if (summaryTotal) summaryTotal.textContent = `₹${newTotal}`;
    if (grandTotal)   grandTotal.textContent   = `₹${newTotal}`;
    if (subtitle && itemCount !== undefined) {
        subtitle.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`;
    }
}


// ─────────────────────────────────────────────
// PAGE LOAD: Initialise
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Hide badge if count is 0
    const badge = document.getElementById('cart-badge');
    if (badge && (badge.textContent === '0' || badge.textContent === '')) {
        badge.style.display = 'none';
    }

    console.log('✅ ShopEasy | Vansh Sharma | Experiment-7 | script.js loaded');
});
