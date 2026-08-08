// ==========================================
// GLOBAL SPA NAVIGATION FUNCTIONS
// ==========================================
window.hideAllSpaViews = function() {
    const smp = document.getElementById('spa-view-smp');
    const takhassus = document.getElementById('spa-view-takhassus');
    const sanlat = document.getElementById('spa-view-sanlat');
    if (smp) smp.style.display = 'none';
    if (takhassus) takhassus.style.display = 'none';
    if (sanlat) sanlat.style.display = 'none';
};

window.showSmpDetailPage = function() {
    const landing = document.getElementById('landing-view');
    const smp = document.getElementById('spa-view-smp');
    if (landing) landing.style.display = 'none';
    window.hideAllSpaViews();
    if (smp) smp.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.location.hash !== '#detail-smp-kqc') {
        history.pushState({ view: 'smp-detail' }, 'Detail SMP KQC', '#detail-smp-kqc');
    }
};

window.showTakhassusDetailPage = function() {
    const landing = document.getElementById('landing-view');
    const takhassus = document.getElementById('spa-view-takhassus');
    if (landing) landing.style.display = 'none';
    window.hideAllSpaViews();
    if (takhassus) takhassus.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.location.hash !== '#detail-takhassus') {
        history.pushState({ view: 'takhassus-detail' }, 'Detail Takhassus Tahfidz', '#detail-takhassus');
    }
};

window.showSanlatDetailPage = function() {
    const landing = document.getElementById('landing-view');
    const sanlat = document.getElementById('spa-view-sanlat');
    if (landing) landing.style.display = 'none';
    window.hideAllSpaViews();
    if (sanlat) sanlat.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.location.hash !== '#detail-sanlat') {
        history.pushState({ view: 'sanlat-detail' }, 'Detail Sanlat Liburan', '#detail-sanlat');
    }
};

window.showLandingPage = function(targetSectionId = 'program') {
    const landing = document.getElementById('landing-view');
    window.hideAllSpaViews();
    if (landing) landing.style.display = 'block';

    if (targetSectionId === 'program') {
        const programsGrid = document.querySelector('#program .programs-grid');
        if (programsGrid) {
            setTimeout(() => {
                programsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 60);
        }
    } else if (targetSectionId && targetSectionId !== 'beranda') {
        const el = document.getElementById(targetSectionId);
        if (el) {
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }, 60);
        }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    history.pushState({ view: 'landing' }, 'Kampoeng Quran Cendekia', `#${targetSectionId}`);
};

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SYSTEM TEMA GELAP / TERANG (DARK MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Ambil preferensi tema dari localStorage jika ada, atau default ke light
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        let theme = body.getAttribute('data-theme');
        let newTheme = 'light';
        
        if (theme === 'light') {
            newTheme = 'dark';
        }
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showToast('Tema Diubah', `Tema telah dialihkan ke mode ${newTheme === 'dark' ? 'gelap' : 'terang'}.`);
    });


    // ==========================================
    // 2. TOGGLE MENU MOBILE RESPONSIVE
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Ubah simbol burger ke X
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '&times;';
        } else {
            menuToggle.innerHTML = '&#9776;';
        }
    });

    // Menutup menu mobile saat salah satu link navigasi diklik & handling scroll center program
    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '&#9776;';
            
            // Ubah link aktif
            navLinksList.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            const href = link.getAttribute('href');
            if (href === '#program') {
                e.preventDefault();
                // Jika sedang di halaman SPA, kembali ke landing view
                const spaViewSmpEl = document.getElementById('spa-view-smp');
                const landingViewEl = document.getElementById('landing-view');
                if (spaViewSmpEl && landingViewEl && spaViewSmpEl.style.display !== 'none') {
                    spaViewSmpEl.style.display = 'none';
                    landingViewEl.style.display = 'block';
                }

                const programsGrid = document.querySelector('#program .programs-grid');
                if (programsGrid) {
                    programsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    history.pushState(null, '', '#program');
                }
            } else if (href && href.startsWith('#') && href !== '#') {
                const spaViewSmpEl = document.getElementById('spa-view-smp');
                const landingViewEl = document.getElementById('landing-view');
                if (spaViewSmpEl && landingViewEl && spaViewSmpEl.style.display !== 'none') {
                    spaViewSmpEl.style.display = 'none';
                    landingViewEl.style.display = 'block';
                }
            }
        });
    });


    // ==========================================
    // 3. ANIMASI SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Berhenti mengamati jika sudah di-reveal agar tidak animasi berulang (opsional)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Element terpicu ketika 10% masuk layar
        rootMargin: '0px 0px -50px 0px' // Offset bawah sedikit agar terpicu sebelum benar-benar di bawah screen
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 4. SCROLL ACTIVE NAV LINK HIGHLIGHTING
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = 'beranda';
        const scrollPosition = window.scrollY + 200; // offset navigasi
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 5. FILTER & PAGINASI GALERI KEGIATAN (MAX 6 FOTO PER HALAMAN)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const galleryPaginationContainer = document.getElementById('gallery-pagination');

    const ITEMS_PER_PAGE = 6;
    let currentGalleryFilter = 'all';
    let currentGalleryPage = 1;
    let currentFilteredItems = [];

    const applyGalleryFilterAndPagination = (page = 1, shouldScroll = false) => {
        // 1. Saring item yang sesuai dengan kategori aktif
        currentFilteredItems = galleryItems.filter(item => {
            const category = item.getAttribute('data-category');
            return currentGalleryFilter === 'all' || category === currentGalleryFilter;
        });

        const totalPages = Math.ceil(currentFilteredItems.length / ITEMS_PER_PAGE) || 1;
        currentGalleryPage = Math.max(1, Math.min(page, totalPages));

        const startIndex = (currentGalleryPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // 2. Tampilkan/Sembunyikan item
        galleryItems.forEach(item => {
            const isInCategory = (currentGalleryFilter === 'all' || item.getAttribute('data-category') === currentGalleryFilter);
            const indexInFiltered = currentFilteredItems.indexOf(item);

            if (isInCategory && indexInFiltered >= startIndex && indexInFiltered < endIndex) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 40);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                item.style.display = 'none';
            }
        });

        // 3. Render Kontrol Paginasi
        renderPaginationControls(totalPages);

        // 4. Update data galeri untuk Lightbox Slider
        updateGalleryData();

        // 5. Scroll halus ke awal galeri jika di-klik dari tombol paginasi
        if (shouldScroll) {
            const gallerySection = document.getElementById('galeri');
            if (gallerySection) {
                const headerOffset = 80;
                const elementPosition = gallerySection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    };

    const renderPaginationControls = (totalPages) => {
        if (!galleryPaginationContainer) return;
        galleryPaginationContainer.innerHTML = '';

        if (totalPages <= 1) {
            galleryPaginationContainer.style.display = 'none';
            return;
        }

        galleryPaginationContainer.style.display = 'flex';

        // Tombol Sebelumnya (Prev)
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'page-btn page-nav-btn';
        prevBtn.disabled = currentGalleryPage === 1;
        prevBtn.setAttribute('aria-label', 'Halaman Sebelumnya');
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" class="nav-prev">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            <span>Prev</span>
        `;
        prevBtn.addEventListener('click', () => {
            if (currentGalleryPage > 1) {
                applyGalleryFilterAndPagination(currentGalleryPage - 1, true);
            }
        });
        galleryPaginationContainer.appendChild(prevBtn);

        // Tombol Angka Halaman (1, 2, 3, ...)
        for (let i = 1; i <= totalPages; i++) {
            const numBtn = document.createElement('button');
            numBtn.type = 'button';
            numBtn.className = `page-btn ${i === currentGalleryPage ? 'active' : ''}`;
            numBtn.textContent = i;
            numBtn.setAttribute('aria-label', `Halaman ${i}`);
            numBtn.addEventListener('click', () => {
                if (i !== currentGalleryPage) {
                    applyGalleryFilterAndPagination(i, true);
                }
            });
            galleryPaginationContainer.appendChild(numBtn);
        }

        // Tombol Selanjutnya (Next)
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'page-btn page-nav-btn';
        nextBtn.disabled = currentGalleryPage === totalPages;
        nextBtn.setAttribute('aria-label', 'Halaman Selanjutnya');
        nextBtn.innerHTML = `
            <span>Next</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" class="nav-next">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        `;
        nextBtn.addEventListener('click', () => {
            if (currentGalleryPage < totalPages) {
                applyGalleryFilterAndPagination(currentGalleryPage + 1, true);
            }
        });
        galleryPaginationContainer.appendChild(nextBtn);
    };

    // Filter Button Click Handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentGalleryFilter = button.getAttribute('data-filter') || 'all';
            currentGalleryPage = 1;
            applyGalleryFilterAndPagination(1, false);
        });
    });

    // Inisialisasi awal
    applyGalleryFilterAndPagination(1, false);


    // ==========================================
    // 6. POPUP LIGHTBOX SLIDER (GALERI GAMBAR)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxThumbsContainer = document.getElementById('lightbox-thumbs');

    let currentGalleryIndex = 0;
    let galleryData = [];

    // Parse all active/filtered gallery items data
    function updateGalleryData() {
        galleryData = [];
        const activeItems = (currentFilteredItems && currentFilteredItems.length > 0) ? currentFilteredItems : galleryItems;
        activeItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption') || '';
            const category = item.getAttribute('data-category') || 'Galeri';
            const title = item.querySelector('.gallery-title')?.textContent || `Foto ${index + 1}`;
            galleryData.push({
                src: img ? img.src : '',
                alt: img ? img.alt : '',
                caption: caption,
                category: category.toUpperCase(),
                title: title,
                itemRef: item
            });
        });
    }

    updateGalleryData();

    // Render thumbnail strip
    const renderLightboxThumbs = () => {
        if (!lightboxThumbsContainer) return;
        lightboxThumbsContainer.innerHTML = '';
        galleryData.forEach((data, idx) => {
            const thumbBtn = document.createElement('div');
            thumbBtn.className = `lightbox-thumb ${idx === currentGalleryIndex ? 'active' : ''}`;
            thumbBtn.setAttribute('data-index', idx);
            thumbBtn.setAttribute('title', data.title);
            thumbBtn.innerHTML = `<img src="${data.src}" alt="${data.alt}">`;
            
            thumbBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showGallerySlide(idx);
            });
            
            lightboxThumbsContainer.appendChild(thumbBtn);
        });
    };

    const showGallerySlide = (index) => {
        if (galleryData.length === 0) return;
        
        // Wrap around index
        if (index < 0) {
            currentGalleryIndex = galleryData.length - 1;
        } else if (index >= galleryData.length) {
            currentGalleryIndex = 0;
        } else {
            currentGalleryIndex = index;
        }

        const data = galleryData[currentGalleryIndex];
        if (!data) return;

        // Smooth transition effect
        if (lightboxImg) {
            lightboxImg.classList.add('fade-out');
            setTimeout(() => {
                lightboxImg.src = data.src;
                lightboxImg.alt = data.alt;
                lightboxImg.classList.remove('fade-out');
            }, 120);
        }

        if (lightboxCaption) {
            lightboxCaption.textContent = data.caption;
        }

        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
        }

        if (lightboxCategory) {
            lightboxCategory.textContent = data.category;
        }

        // Update active thumbnail
        const allThumbs = document.querySelectorAll('.lightbox-thumb');
        allThumbs.forEach((th, idx) => {
            if (idx === currentGalleryIndex) {
                th.classList.add('active');
                th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                th.classList.remove('active');
            }
        });
    };

    // Attach click to each gallery item
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            updateGalleryData();
            renderLightboxThumbs();
            const activeItems = (currentFilteredItems && currentFilteredItems.length > 0) ? currentFilteredItems : galleryItems;
            const targetIdx = activeItems.indexOf(item);
            showGallerySlide(targetIdx >= 0 ? targetIdx : 0);
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Kunci scroll halaman
        });
    });

    const closeLightboxFunc = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Aktifkan scroll kembali
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightboxFunc);
    }

    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightboxFunc);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showGallerySlide(currentGalleryIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showGallerySlide(currentGalleryIndex + 1);
        });
    }

    // Keyboard Navigation (Panah Kiri, Kanan, & ESC)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightboxFunc();
        } else if (e.key === 'ArrowLeft') {
            showGallerySlide(currentGalleryIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showGallerySlide(currentGalleryIndex + 1);
        }
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    // Geser ke kanan -> Foto Sebelumnya
                    showGallerySlide(currentGalleryIndex - 1);
                } else {
                    // Geser ke kiri -> Foto Selanjutnya
                    showGallerySlide(currentGalleryIndex + 1);
                }
            }
        }, { passive: true });
    }


    // ==========================================
    // 7. CAROUSEL TESTIMONI (SLIDER AUTOMATIS & KLIK)
    // ==========================================
    const track = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    const slidesCount = indicators.length;
    let autoSlideInterval;

    const moveToSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[index].classList.add('active');
        currentIndex = index;
    };

    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            moveToSlide(slideIndex);
            resetAutoSlide(); // Reset timer saat diklik manual
        });
    });

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % slidesCount;
            moveToSlide(nextIndex);
        }, 6000); // Slide setiap 6 detik
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide(); // Mulai auto slide


    // ==========================================
    // 8. DYNAMIC FORM SUBMIT & ALERT TOAST
    // ==========================================
    const regForm = document.getElementById('registration-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const alertPopup = document.getElementById('alert-popup');
    const alertTitle = document.getElementById('alert-title');
    const alertDesc = document.getElementById('alert-desc');

    const showToast = (title, description, isSuccess = true) => {
        alertTitle.textContent = title;
        alertDesc.textContent = description;
        
        if (isSuccess) {
            alertPopup.classList.add('alert-popup-success');
        } else {
            alertPopup.classList.remove('alert-popup-success');
        }
        
        alertPopup.classList.add('show');
        
        // Sembunyikan setelah 4 detik
        setTimeout(() => {
            alertPopup.classList.remove('show');
        }, 4000);
    };

    // Handler Form PSB (Terintegrasi Langsung ke Google Spreadsheet)
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = regForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Kirim Pendaftaran Awal';

            // Ambil data input
            const nameInput = document.getElementById('reg-name');
            const pobInput = document.getElementById('reg-pob');
            const dobInput = document.getElementById('reg-dob');
            const genderSelect = document.getElementById('reg-gender');
            const programSelect = document.getElementById('reg-program');
            const parentInput = document.getElementById('reg-parent');
            const phoneInput = document.getElementById('reg-phone');

            const payload = {
                nama: nameInput ? nameInput.value.trim() : '',
                tempatLahir: pobInput ? pobInput.value.trim() : '',
                tanggalLahir: dobInput ? dobInput.value : '',
                jenisKelamin: genderSelect && genderSelect.selectedIndex >= 0 ? genderSelect.options[genderSelect.selectedIndex].text : '',
                program: programSelect && programSelect.selectedIndex >= 0 ? programSelect.options[programSelect.selectedIndex].text : '',
                namaWali: parentInput ? parentInput.value.trim() : '',
                whatsapp: phoneInput ? phoneInput.value.trim() : ''
            };

            // Loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Mengirim Data...';
            }

            const scriptUrl = 'https://script.google.com/macros/s/AKfycbzHbSUNa8F_9Y-fEu7Pbelcdte6W3O57bUVvkVLjgmc67BeEWfi2tSBcmZJ6BDGPFxN/exec';

            try {
                const formData = new FormData(regForm);

                // Kirim data ke Google Apps Script
                await fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                // Tampilkan notifikasi sukses
                showToast(
                    'Pendaftaran Berhasil Dikirim!',
                    `Jazakumullah Khairan, data ananda ${payload.nama} (${payload.program}) telah berhasil tersimpan di sistem kami. Tim PSB akan segera menghubungi via WhatsApp (${payload.whatsapp}).`
                );
                
                regForm.reset();
            } catch (err) {
                console.error('Spreadsheet submission error:', err);
                showToast(
                    'Pendaftaran Berhasil Dikirim!',
                    `Jazakumullah Khairan, data pendaftaran ananda ${payload.nama} telah kami terima. Tim PSB akan segera menghubungi Anda.`
                );
                regForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }

    // Handler Form Newsletter Buletin (Terintegrasi Langsung ke Brevo)
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email') || newsletterForm.querySelector('input[type="email"]');
            const submitBtn = document.getElementById('newsletter-btn') || newsletterForm.querySelector('button[type="submit"]');
            const emailValue = emailInput ? emailInput.value.trim() : '';

            if (!emailValue) return;

            const originalBtnText = submitBtn ? submitBtn.textContent : 'Langganan';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            try {
                const formData = new FormData(newsletterForm);
                const actionUrl = newsletterForm.getAttribute('action');

                // Kirim data ke Brevo secara asinkron (mode: no-cors untuk kompatibilitas form cross-origin)
                await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });

                showToast(
                    'Langganan Berhasil!',
                    `Alhamdulillah, email ${emailValue} telah tersimpan di daftar Buletin KQC.`
                );
                newsletterForm.reset();
            } catch (err) {
                console.error('Brevo form submission error:', err);
                showToast(
                    'Langganan Berhasil!',
                    `Terima kasih! Buletin Kampoeng Quran Cendekia akan dikirimkan ke: ${emailValue}`
                );
                newsletterForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }


    // ==========================================
    // 9. WHATSAPP FLOATING WIDGET & POPUP CHAT
    // ==========================================
    const waFloatBtn = document.getElementById('wa-float-btn');
    const waPopup = document.getElementById('wa-popup');
    const waCloseBtn = document.getElementById('wa-close-btn');
    const waChatForm = document.getElementById('wa-chat-form');
    const waInputMsg = document.getElementById('wa-input-message');
    const waChips = document.querySelectorAll('.wa-chip');
    const waBadge = document.getElementById('wa-badge');
    const WA_PHONE_NUMBER = '6281214880408'; // Nomor WhatsApp Resmi KQC

    const openWhatsAppDirectly = (customMessage) => {
        const text = customMessage || waInputMsg.value.trim() || 'Assalamualaikum Admin Kampoeng Quran Cendekia, saya ingin bertanya info seputar pendaftaran.';
        const waUrl = `https://api.whatsapp.com/send?phone=${WA_PHONE_NUMBER}&text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    if (waFloatBtn && waPopup) {
        waFloatBtn.addEventListener('click', () => {
            const isOpen = waPopup.classList.toggle('show');
            waFloatBtn.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
                // Sembunyikan badge notifikasi setelah dibuka
                if (waBadge) waBadge.style.display = 'none';
                setTimeout(() => {
                    waInputMsg.focus();
                }, 300);
            }
        });

        if (waCloseBtn) {
            waCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                waPopup.classList.remove('show');
                waFloatBtn.setAttribute('aria-expanded', 'false');
            });
        }

        // Klik tombol preset langsung buka WhatsApp dengan pesan template
        waChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const messageText = chip.getAttribute('data-msg');
                openWhatsAppDirectly(messageText);
            });
        });

        // Submit form input pesan bebas
        if (waChatForm) {
            waChatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                openWhatsAppDirectly();
                waInputMsg.value = '';
                waPopup.classList.remove('show');
            });
        }

        // Tutup popup jika user mengklik di luar area widget WhatsApp
        document.addEventListener('click', (e) => {
            const waContainer = document.getElementById('wa-widget-container');
            if (waContainer && !waContainer.contains(e.target) && waPopup.classList.contains('show')) {
                waPopup.classList.remove('show');
                waFloatBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================
    // ==========================================
    // 10. SPA ROUTING (SMP KQC, TAKHASSUS TAHFIDZ, & SANLAT LIBURAN)
    // ==========================================
    const hideAllSpaViews = () => {
        const smp = document.getElementById('spa-view-smp');
        const takhassus = document.getElementById('spa-view-takhassus');
        const sanlat = document.getElementById('spa-view-sanlat');
        if (smp) smp.style.display = 'none';
        if (takhassus) takhassus.style.display = 'none';
        if (sanlat) sanlat.style.display = 'none';
    };

    window.showSmpDetailPage = () => {
        const landing = document.getElementById('landing-view');
        const smp = document.getElementById('spa-view-smp');
        if (landing) landing.style.display = 'none';
        hideAllSpaViews();
        if (smp) smp.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (window.location.hash !== '#detail-smp-kqc') {
            history.pushState({ view: 'smp-detail' }, 'Detail Program SMP KQC', '#detail-smp-kqc');
        }
    };

    window.showTakhassusDetailPage = () => {
        const landing = document.getElementById('landing-view');
        const takhassus = document.getElementById('spa-view-takhassus');
        if (landing) landing.style.display = 'none';
        hideAllSpaViews();
        if (takhassus) takhassus.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (window.location.hash !== '#detail-takhassus') {
            history.pushState({ view: 'takhassus-detail' }, 'Detail Program Takhassus Tahfidz', '#detail-takhassus');
        }
    };

    window.showSanlatDetailPage = () => {
        const landing = document.getElementById('landing-view');
        const sanlat = document.getElementById('spa-view-sanlat');
        if (landing) landing.style.display = 'none';
        hideAllSpaViews();
        if (sanlat) sanlat.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (window.location.hash !== '#detail-sanlat') {
            history.pushState({ view: 'sanlat-detail' }, 'Detail Program Sanlat Liburan', '#detail-sanlat');
        }
    };

    window.showLandingPage = (targetSectionId = 'program') => {
        const landing = document.getElementById('landing-view');
        hideAllSpaViews();
        if (landing) landing.style.display = 'block';
        
        if (targetSectionId === 'program') {
            const programsGrid = document.querySelector('#program .programs-grid');
            if (programsGrid) {
                setTimeout(() => {
                    programsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 60);
            }
        } else if (targetSectionId && targetSectionId !== 'beranda') {
            const el = document.getElementById(targetSectionId);
            if (el) {
                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }, 60);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        history.pushState({ view: 'landing' }, 'Kampoeng Quran Cendekia', `#${targetSectionId}`);
    };

    // Global Click Delegation untuk semua tombol & link SPA
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a, button');
        if (!link) return;

        const href = link.getAttribute('href') || '';
        const id = link.id || '';
        const dataTarget = link.getAttribute('data-spa-target') || '';

        if (href === '#detail-smp-kqc' || id === 'btn-open-smp-detail' || dataTarget === 'smp') {
            e.preventDefault();
            window.showSmpDetailPage();
        } else if (href === '#detail-takhassus' || id === 'btn-open-takhassus-detail' || dataTarget === 'takhassus') {
            e.preventDefault();
            window.showTakhassusDetailPage();
        } else if (href === '#detail-sanlat' || id === 'btn-open-sanlat-detail' || dataTarget === 'sanlat') {
            e.preventDefault();
            window.showSanlatDetailPage();
        } else if (link.classList.contains('btn-spa-back') || id.startsWith('btn-back-from-') || id.startsWith('btn-back-bottom-')) {
            e.preventDefault();
            window.showLandingPage('program');
        } else if (id.startsWith('crumb-home-')) {
            e.preventDefault();
            window.showLandingPage('beranda');
        } else if (id.startsWith('crumb-program-')) {
            e.preventDefault();
            window.showLandingPage('program');
        }
    });

    // Handle Route dari Hash URL
    const handleUrlHash = () => {
        const hash = window.location.hash;
        if (hash === '#detail-smp-kqc') {
            window.showSmpDetailPage();
        } else if (hash === '#detail-takhassus') {
            window.showTakhassusDetailPage();
        } else if (hash === '#detail-sanlat') {
            window.showSanlatDetailPage();
        }
    };

    window.addEventListener('popstate', handleUrlHash);
    window.addEventListener('hashchange', handleUrlHash);

    // Cek rute saat halaman pertama kali dimuat
    handleUrlHash();

    // ==========================================
    // 11. SPA ACCORDION INTERACTION (EXCLUSIVE OPEN & PLUS/MINUS TOGGLE)
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.spa-accordion .accordion-header');
    const plusIconSvg = '<svg viewBox="0 0 24 24" class="icon-svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
    const minusIconSvg = '<svg viewBox="0 0 24 24" class="icon-svg"><path d="M19 13H5v-2h14v2z"/></svg>';

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const currentCollapse = currentItem.querySelector('.accordion-collapse');
            const currentIcon = header.querySelector('.accordion-icon');
            const isAlreadyActive = currentItem.classList.contains('active');

            // Tutup semua accordion yang sedang terbuka (Exclusive Accordion)
            const parentAccordion = header.closest('.spa-accordion');
            if (parentAccordion) {
                const allItems = parentAccordion.querySelectorAll('.accordion-item');
                allItems.forEach(item => {
                    item.classList.remove('active');
                    const collapse = item.querySelector('.accordion-collapse');
                    const btn = item.querySelector('.accordion-header');
                    const icon = item.querySelector('.accordion-icon');
                    if (collapse) collapse.style.maxHeight = null;
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                    if (icon) icon.innerHTML = plusIconSvg;
                });
            }

            // Jika sebelumnya belum aktif, buka item yang diklik
            if (!isAlreadyActive) {
                currentItem.classList.add('active');
                if (currentCollapse) {
                    currentCollapse.style.maxHeight = (currentCollapse.scrollHeight + 30) + 'px';
                }
                header.setAttribute('aria-expanded', 'true');
                if (currentIcon) {
                    currentIcon.innerHTML = minusIconSvg;
                }
            }
        });
    });
});
