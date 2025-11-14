// Check if device is mobile/tablet
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Page IDs for navigation
const pageIds = ['turn-1', 'turn-2', 'turn-3'];

// Track current page state (will be initialized later)
let currentPageIndex = -1; // -1 means profile page (page-left)
let currentPageSide = 'front'; // 'front' or 'back'

const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
    el.onclick = () => {
        // Skip 3D animation on mobile
        if(isMobile) return;

        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);
        const pageIndex = pageIds.indexOf(pageTurnId);
        const isBackButton = el.classList.contains('back');

        if(pageTurn.classList.contains('turn')){
            // Turning back to front
            pageTurn.classList.remove('turn');
            currentPageIndex = pageIndex;
            currentPageSide = 'front';

            setTimeout(() => {
                pageTurn.style.zIndex = 2 - index;
            }, 500);

        }else{
            // Turning to back
            pageTurn.classList.add('turn');
            currentPageIndex = pageIndex;
            currentPageSide = 'back';

            setTimeout(() => {
                pageTurn.style.zIndex = 2 + index;
            }, 500);
        }
    }
});


// contact me button when click
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

if(contactMeBtn) {
    contactMeBtn.onclick = (e) => {
        e.preventDefault();
        
        // On mobile, just scroll to contact section
        if(isMobile) {
            const contactPage = document.querySelector('.page-back');
            if(contactPage) {
                contactPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        pages.forEach((page, index) => {
            setTimeout(() => {
                page.classList.add('turn');
                setTimeout(() => {
                    page.style.zIndex = 20 + index;
                },500);
            }, (index + 1) * 200 + 100)
        });
    }
}


// create reverse index function
let totalPages = pages.length;
let pageNumber = 0;

function reverseIndex() {
    pageNumber--;
    if(pageNumber < 0){
        pageNumber = totalPages - 1;
    }
}


// back profile button when click
const backProfileBtn = document.querySelector('.back-profile');

if(backProfileBtn) {
    backProfileBtn.onclick = (e) => {
        e.preventDefault();
        
        // On mobile, just scroll to profile
        if(isMobile) {
            const profilePage = document.querySelector('.page-left');
            if(profilePage) {
                profilePage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        pages.forEach((_, index) => {
            setTimeout(() => {
                reverseIndex();

                pages[pageNumber].classList.remove('turn');

                setTimeout(() => {
                    reverseIndex();
                    pages[pageNumber].style.zIndex = 10 + index;
                }, 500)
            }, (index + 1) * 200 + 100)
        })
    }
}


// opening animation (only on desktop)
if(!isMobile) {
    const coverRight = document.querySelector('.cover.cover-right');
    
    if(coverRight) {
        // open animation (cover right animation)
        setTimeout(() => {
            coverRight.classList.add('turn');
        }, 2100);

        setTimeout(() => {
            coverRight.style.zIndex = -1;
        }, 2800);

        pages.forEach((_, index) => {
            setTimeout(() => {
                reverseIndex();

                pages[pageNumber].classList.remove('turn');

                setTimeout(() => {
                    reverseIndex();
                    pages[pageNumber].style.zIndex = 10 + index;
                }, 500)
            }, (index + 1) * 200 + 2100)
        })
    }
} 

// Contact form validation
const form = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

if(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const message = form.querySelector('textarea').value.trim();
        
        if(!name) {
            formMsg.textContent = 'Please enter your name.';
            formMsg.style.color = 'crimson';
            return;
        }
        if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            formMsg.textContent = 'Please enter a valid email.';
            formMsg.style.color = 'crimson';
            return;
        }
        
        formMsg.style.color = 'var(--main-color)';
        formMsg.textContent = 'Thanks — message sent (demo).';
        form.reset();
    });
}

// ========== KEYBOARD NAVIGATION ==========
// Get all turnable pages
const turnablePages = document.querySelectorAll('.book-page.page-right.turn');

// Function to turn a specific page
function turnPage(pageId, direction) {
    if(isMobile) return; // Skip on mobile
    
    const page = document.getElementById(pageId);
    if(!page) return;
    
    const isTurned = page.classList.contains('turn');
    
    if(direction === 'next') {
        // Turn to show back side
        if(!isTurned) {
            page.classList.add('turn');
            const index = pageIds.indexOf(pageId);
            setTimeout(() => {
                page.style.zIndex = 2 + index;
            }, 500);
        }
    } else if(direction === 'prev') {
        // Turn back to show front side
        if(isTurned) {
            page.classList.remove('turn');
            const index = pageIds.indexOf(pageId);
            setTimeout(() => {
                page.style.zIndex = 2 - index;
            }, 500);
        }
    }
}

// Function to navigate to next page
function goToNextPage() {
    if(isMobile) {
        // On mobile, scroll to next section
        const allPages = document.querySelectorAll('.book-page');
        const currentScroll = window.scrollY;
        let nextPage = null;
        
        allPages.forEach(page => {
            const pageTop = page.getBoundingClientRect().top + window.scrollY;
            if(pageTop > currentScroll + 100 && !nextPage) {
                nextPage = page;
            }
        });
        
        if(nextPage) {
            nextPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }
    
    if(currentPageIndex === -1) {
        // Currently on profile page, go to first page front
        // First page should show front (no turn class)
        const firstPage = document.getElementById(pageIds[0]);
        if(firstPage && firstPage.classList.contains('turn')) {
            firstPage.classList.remove('turn');
            setTimeout(() => {
                firstPage.style.zIndex = 2;
            }, 500);
        }
        currentPageIndex = 0;
        currentPageSide = 'front';
    } else if(currentPageSide === 'front') {
        // Currently on front side, turn to back side
        const currentPage = document.getElementById(pageIds[currentPageIndex]);
        if(currentPage && !currentPage.classList.contains('turn')) {
            currentPage.classList.add('turn');
            setTimeout(() => {
                currentPage.style.zIndex = 2 + currentPageIndex;
            }, 500);
        }
        currentPageSide = 'back';
    } else {
        // Currently on back side, go to next page front
        if(currentPageIndex < pageIds.length - 1) {
            currentPageIndex++;
            currentPageSide = 'front';
            const nextPage = document.getElementById(pageIds[currentPageIndex]);
            if(nextPage && nextPage.classList.contains('turn')) {
                nextPage.classList.remove('turn');
                setTimeout(() => {
                    nextPage.style.zIndex = 2 + currentPageIndex;
                }, 500);
            }
        }
    }
}

// Function to navigate to previous page
function goToPrevPage() {
    if(isMobile) {
        // On mobile, scroll to previous section
        const allPages = document.querySelectorAll('.book-page');
        const currentScroll = window.scrollY;
        let prevPage = null;
        
        for(let i = allPages.length - 1; i >= 0; i--) {
            const page = allPages[i];
            const pageTop = page.getBoundingClientRect().top + window.scrollY;
            if(pageTop < currentScroll - 100) {
                prevPage = page;
                break;
            }
        }
        
        if(prevPage) {
            prevPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
    }
    
    if(currentPageIndex === -1) {
        // Already on profile page, do nothing
        return;
    } else if(currentPageSide === 'back') {
        // Currently on back side, turn to front side
        const currentPage = document.getElementById(pageIds[currentPageIndex]);
        if(currentPage && currentPage.classList.contains('turn')) {
            currentPage.classList.remove('turn');
            setTimeout(() => {
                currentPage.style.zIndex = 2 - currentPageIndex;
            }, 500);
        }
        currentPageSide = 'front';
    } else {
        // Currently on front side, go to previous page back
        if(currentPageIndex > 0) {
            currentPageIndex--;
            currentPageSide = 'back';
            const prevPage = document.getElementById(pageIds[currentPageIndex]);
            if(prevPage && !prevPage.classList.contains('turn')) {
                prevPage.classList.add('turn');
                setTimeout(() => {
                    prevPage.style.zIndex = 2 + currentPageIndex;
                }, 500);
            }
        } else {
            // Go back to profile page - turn first page back to front
            const firstPage = document.getElementById(pageIds[0]);
            if(firstPage && firstPage.classList.contains('turn')) {
                firstPage.classList.remove('turn');
                setTimeout(() => {
                    firstPage.style.zIndex = 2;
                }, 500);
            }
            currentPageIndex = -1;
            currentPageSide = 'front';
        }
    }
}

// Keyboard event listener
document.addEventListener('keydown', function(e) {
    // Don't trigger if user is typing in an input field or textarea
    const activeElement = document.activeElement;
    if(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
    }
    
    // Handle arrow keys
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextPage();
    } else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevPage();
    }
});

