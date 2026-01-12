(function () {
	const container = document.querySelector('.portrait-container');
	if (!container) return;

	const img = container.querySelector('.profile-img');
	if (!img) return;

	const maxTranslate = 28;
	const maxScale = 1.06; 

	let raf = null;
	let lastX = 0;
	let lastY = 0;

	function update() {
		const rect = container.getBoundingClientRect();
		const offsetX = lastX !== null ? (lastX - rect.left) / rect.width - 0.5 : 0;
		const offset = Math.max(-0.5, Math.min(0.5, offsetX));

		const translateX = -offset * 2 * maxTranslate;
		const t = Math.min(1, Math.max(0, 1 - Math.abs(offset * 2)));
		const scale = 1 + (maxScale - 1) * t;

		img.style.transform = `translateX(${translateX}px) scale(${scale})`;

		raf = null;
	}

	function scheduleUpdate(x, y) {
		lastX = x;
		lastY = y;
		if (!raf) raf = requestAnimationFrame(update);
	}

	container.addEventListener('mousemove', (e) => {
		scheduleUpdate(e.clientX, e.clientY);
	}, { passive: true });

	container.addEventListener('mouseleave', () => {
		img.style.transition = 'transform 380ms cubic-bezier(.2,.9,.3,1)';
		img.style.transform = '';
		setTimeout(() => { img.style.transition = ''; }, 400);
	});

	container.addEventListener('touchmove', (e) => {
		const t = e.touches[0];
		if (t) scheduleUpdate(t.clientX, t.clientY);
	}, { passive: true });

	container.addEventListener('touchend', () => {
		img.style.transition = 'transform 380ms cubic-bezier(.2,.9,.3,1)';
		img.style.transform = '';
		setTimeout(() => { img.style.transition = ''; }, 400);
	});

})();

const projectsData = [
  {
    id: 0,
    title: "Concessionaire",
    subtitle: "Luxury Car Dashboard",
    desc: "Interactive dashboard to manage and view details of high-end vehicles.",
    github: "https://github.com/Sev-AS/el-huesesaso-Proyecto-HTML-CSS.git",
    images: ["/Resources/consecionario0.png", "/Resources/consecionario1.png", "/Resources/consecionario2.png"]
  },
  {
    id: 1,
    title: "Fakestore",
    subtitle: "Modern E-commerce",
    desc: "E-commerce platform with responsive design and advanced features including filtering, shopping cart, and product management, plus design features such as an activatable dark mode.",
    github: "https://github.com/JuanJo-R-1/Fakestore-Proyecto.git",
    images: ["/Resources/Fakestore0.png", "/Resources/Fakestore1.png", "/Resources/Fakestore2.png", "/Resources/Fakestore3.png", "/Resources/Fakestore4.png"]
  }
];

const titleBox = document.getElementById("info-title");
const subtitleBox = document.getElementById("info-subtitle");
const descBox = document.getElementById("info-desc");
const projectLinksContainer = document.getElementById("project-links-container");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const modalImageCounter = document.getElementById("modal-image-counter");
const modalClose = document.querySelector(".modal-close");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");

let currentProjectIndex = null;
let currentImageIndex = 0;
if (typeof renderProjects === 'function') renderProjects(projectsData);
carouselHover(projectsData);

function carouselHover(projectsData) {
  const items = document.querySelectorAll(".item");
  items.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const activeIndex = Number(item.dataset.index);

    items.forEach(el => {
      const index = Number(el.dataset.index);
      const distance = index - activeIndex;

      el.style.transform = `
        rotateY(${distance * 12}deg)
        translateZ(${Math.max(0, 160 - Math.abs(distance) * 50)}px)
        scale(${1 - Math.abs(distance) * 0.05})
      `;

      el.style.filter = `
        grayscale(${Math.abs(distance) === 0 ? 0 : 1})
        brightness(${Math.max(0.3, 1 - Math.abs(distance) * 0.15)})
      `;
    });
  });
});

const itemsContainer = document.querySelector('.items');
if (itemsContainer) {
  itemsContainer.addEventListener('mouseleave', () => {
    items.forEach(el => {
      el.style.transform = 'rotateY(0) translateZ(0) scale(1)';
      el.style.filter = 'grayscale(1) brightness(0.4)';
    });
  });
}

}
function updateProjectInfo(projectIndex) {
  const project = projectsData[projectIndex];
  titleBox.textContent = project.title;
  subtitleBox.textContent = project.subtitle;
  descBox.textContent = project.desc;
  
  projectLinksContainer.innerHTML = `
    <a href="${project.github}" class="project-link" target="_blank">
      <i class="fab fa-github"></i>
      View code
    </a>
  `;
}

const carouselItems = document.querySelectorAll('.item');

carouselItems.forEach((item, index) => {
  item.addEventListener("mouseover", () => {
    updateProjectInfo(index);
  });

  item.addEventListener("click", () => {
    openModal(index);
  });
});

function openModal(projectIndex) {
  currentProjectIndex = projectIndex;
  currentImageIndex = 0;
  const project = projectsData[projectIndex];
  
  modalTitle.textContent = project.title;
  modalSubtitle.textContent = project.subtitle;
  
  showImage(0);
  
  updateModalNavigation();
  
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
  currentProjectIndex = null;
}

function showImage(imageIndex) {
  if (currentProjectIndex === null) return;
  
  const project = projectsData[currentProjectIndex];
  if (imageIndex < 0 || imageIndex >= project.images.length) return;
  
  currentImageIndex = imageIndex;
  modalImage.src = project.images[imageIndex];
  
  modalImageCounter.textContent = `Image ${currentImageIndex + 1} of ${project.images.length}`;
  
  updateModalNavigation();
}

function updateModalNavigation() {
  const project = projectsData[currentProjectIndex];
  
  modalPrev.disabled = currentImageIndex === 0;
  
  modalNext.disabled = currentImageIndex === project.images.length - 1;
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modalPrev) {
  modalPrev.addEventListener("click", () => {
    if (currentImageIndex > 0) {
      showImage(currentImageIndex - 1);
    }
  });
}

if (modalNext) {
  modalNext.addEventListener("click", () => {
    if (currentProjectIndex !== null) {
      const project = projectsData[currentProjectIndex];
      if (currentImageIndex < project.images.length - 1) {
        showImage(currentImageIndex + 1);
      }
    }
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (modal && modal.classList && modal.classList.contains("active")) {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft" && modalPrev) modalPrev.click();
    if (e.key === "ArrowRight" && modalNext) modalNext.click();
  }
});

(function enableSkillTouch(){
  const items = document.querySelectorAll('.skill-item');
  if (!items || items.length === 0) return;

  items.forEach(item => {
    let touched = false;
    if (window.innerWidth <= 768 && 'ontouchstart' in window) {
      item.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (!touched) {
          items.forEach(i => i.classList.remove('show-skill'));
          item.classList.add('show-skill');
          touched = true;
        } else {
          item.classList.remove('show-skill');
          touched = false;
        }
      }, {passive: true});
    }

    // allow click toggling on small screens (some emulators send clicks)
    item.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.stopPropagation();
        const openAlready = item.classList.contains('show-skill');
        items.forEach(i => i.classList.remove('show-skill'));
        if (!openAlready) item.classList.add('show-skill');
      }
    });

    // keyboard accessibility
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        items.forEach(i => i.classList.remove('show-skill'));
        item.classList.toggle('show-skill');
      }
    });
  });

  if (window.innerWidth <= 768 && 'ontouchstart' in window) {
    document.addEventListener('touchstart', function (e) {
      if (!e.target.closest('.skill-item')) {
        document.querySelectorAll('.skill-item.show-skill').forEach(i => i.classList.remove('show-skill'));
      }
    }, {passive: true});
  }
})();

// Mobile nav toggle
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navbar = document.querySelector('.navbar');
  const siteNav = document.getElementById('site-nav');
  if (!navToggle || !navbar || !siteNav) {
    console.warn('Mobile nav not initialized: missing elements', { navToggle, navbar, siteNav });
    return;
  }

  console.debug('Mobile nav initialized');
  let suppressNextClick = false;
  const suppressTimeoutMs = 300;
  const firstLink = siteNav.querySelector('a');
  // ensure toggle is focusable and clickable
  navToggle.setAttribute('aria-haspopup', 'true');
  navToggle.style.zIndex = navToggle.style.zIndex || '2201';

  function setOpen(open) {
    console.debug('setOpen', open);
    if (open) {
      navbar.classList.add('nav-open');
      siteNav.style.display = 'block';
      navToggle.setAttribute('aria-expanded', 'true');
      firstLink && firstLink.focus();
    } else {
      navbar.classList.remove('nav-open');
      siteNav.style.display = ''; // fallback to CSS
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  }

  navToggle.addEventListener('click', (e) => {
    if (suppressNextClick) { suppressNextClick = false; return; }
    e.stopPropagation();
    const open = !navbar.classList.contains('nav-open');
    setOpen(open);
  });

  // accept keyboard activation (Enter / Space)
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const open = !navbar.classList.contains('nav-open');
      setOpen(open);
    }
  });

  // support touch events on some devices
  navToggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    suppressNextClick = true;
    setTimeout(() => { suppressNextClick = false; }, suppressTimeoutMs);
    const open = !navbar.classList.contains('nav-open');
    setOpen(open);
  }, { passive: false });

  // make clicking the inner hamburger also toggle (some devices target the span)
  const hamburger = navToggle.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      if (suppressNextClick) { suppressNextClick = false; return; }
      e.stopPropagation();
      const open = !navbar.classList.contains('nav-open');
      setOpen(open);
    });
    hamburger.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      suppressNextClick = true;
      setTimeout(() => { suppressNextClick = false; }, suppressTimeoutMs);
      const open = !navbar.classList.contains('nav-open');
      setOpen(open);
    }, { passive: false });
  }

  // Use pointer events (unified) on the toggle; remove delegated fallback to avoid double-toggle issues
  navToggle.addEventListener('pointerup', (e) => {
    console.debug('navToggle pointerup', e.target);
    e.stopPropagation();
    suppressNextClick = true;
    setTimeout(() => { suppressNextClick = false; }, suppressTimeoutMs);
    const open = !navbar.classList.contains('nav-open');
    setOpen(open);
  });

  // handle pointer press so focus state is visible on some devices
  navToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });

  // close on Escape key and return focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
      setOpen(false);
    }
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    const within = !!e.target.closest('.navbar');
    console.debug('document click', { target: e.target, within, navOpen: navbar.classList.contains('nav-open') });
    if (!within && navbar.classList.contains('nav-open')) {
      setOpen(false);
    }
  });

  // close when a nav link is clicked
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    setOpen(false);
  }));
})();