const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    // Відкрити меню
    nav.classList.toggle('nav-active');
    // Анімувати кнопку
    burger.classList.toggle('toggle');
});

// Закривати меню при кліку на посилання
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    });
});