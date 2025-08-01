// This file contains the main JavaScript logic for the portfolio, including event listeners and DOM manipulation.

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-theme', savedTheme === 'dark');
    }

    // Event listener for theme toggle button
    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    // Additional JavaScript logic can be added here
});