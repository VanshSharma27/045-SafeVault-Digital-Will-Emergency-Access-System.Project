// ============================================================
// main.js — Flask To-Do Application
// Assignment 4 | SEC035 | B.Tech CSE | SOET
// Student Name  : Aayush
// Enrollment No.: 2401010042
// Date          : April 2026
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // Auto-dismiss flash messages after 3 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 500);
        }, 3000);
    });
});
