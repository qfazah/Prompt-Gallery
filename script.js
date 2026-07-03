/**
 * PromptGallery - Interactive Frontend Logic
 * Core Functions: Smooth Navigation, Clipboard Management, & Dynamic Gallery Filtering
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDV_sNZCbtNvh754d741ARoL0STWBIz1Ag",
    authDomain: "promptgallery-852fb.firebaseapp.com",
    projectId: "promptgallery-852fb",
    storageBucket: "promptgallery-852fb.firebasestorage.app",
    messagingSenderId: "87607576431",
    appId: "1:87607576431:web:b0d9abd5713aff417a0a9a",
    measurementId: "G-Z82L1QZYZP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initClipboard();
    initCategoryFilters();
    initWaitlistForm();
});

/**
 * 1. SMOOTH SCROLLING NAVIGATION
 */
function initSmoothScrolling() {
    const heroCta = document.getElementById('hero-cta');

    if (heroCta) {
        heroCta.addEventListener('click', (event) => {
            event.preventDefault();

            const targetId = heroCta.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

/**
 * 2. CLIPBOARD INTERACTION & TOAST NOTIFICATION
 */
function initClipboard() {

    const copyButtons = document.querySelectorAll('.btn-copy');
    const toast = document.getElementById('toast');

    let toastTimeout;

    copyButtons.forEach(button => {

        button.addEventListener('click', () => {

            const promptText = button.getAttribute('data-prompt');

            if (!promptText) return;

            navigator.clipboard.writeText(promptText)
                .then(() => {
                    clearTimeout(toastTimeout);

                    toast.textContent = "Prompt copied!";
                    toast.classList.add('show');

                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);

                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                });

        });

    });

}

/**
 * 3. CATEGORY FILTERING MANAGEMENT
 */
function initCategoryFilters() {

    const filters = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('.card');

    filters.forEach(filterButton => {

        filterButton.addEventListener('click', () => {

            if (filterButton.classList.contains('active')) return;

            filters.forEach(btn => btn.classList.remove('active'));

            filterButton.classList.add('active');

            const selectedCategory = filterButton.getAttribute('data-category');

            cards.forEach(card => {

                card.classList.add('fade-out');

            });

            setTimeout(() => {

                cards.forEach(card => {

                    const cardCategory = card.getAttribute('data-category');

                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {

                        card.style.display = 'block';

                        setTimeout(() => {

                            card.classList.remove('fade-out');

                        }, 20);

                    } else {

                        card.style.display = 'none';

                    }

                });

            }, 200);

        });

    });

}/**
 * 4. FIREBASE WAITLIST SUBMISSION
 * Saves name and email into Firestore.
 */
function initWaitlistForm() {

    const form = document.getElementById('waitlist-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name || !email) {
            return;
        }

        const toast = document.getElementById('toast');

        try {

            await addDoc(collection(db, "waitlist"), {

                name: name,
                email: email,
                createdAt: new Date()

            });

            form.reset();

            toast.textContent = "🎉 Successfully joined the waitlist!";
            toast.classList.add('show');

            setTimeout(() => {

                toast.classList.remove('show');

                setTimeout(() => {

                    toast.textContent = "Prompt copied!";

                }, 300);

            }, 3000);

            console.log("User added successfully.");

        } catch (error) {

            console.error("Firebase Error:", error);

            toast.textContent = "❌ Failed to join waitlist.";
            toast.classList.add('show');

            setTimeout(() => {

                toast.classList.remove('show');

                setTimeout(() => {

                    toast.textContent = "Prompt copied!";

                }, 300);

            }, 3000);

        }

    });

}