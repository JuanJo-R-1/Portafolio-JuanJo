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

	// mouse
	container.addEventListener('mousemove', (e) => {
		scheduleUpdate(e.clientX, e.clientY);
	}, { passive: true });

	container.addEventListener('mouseleave', () => {
		img.style.transition = 'transform 380ms cubic-bezier(.2,.9,.3,1)';
		img.style.transform = '';
		setTimeout(() => { img.style.transition = ''; }, 400);
	});

	// touch support
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

// Projects data with multiple images per project
const projectsData = [
  {
    id: 0,
    title: "Concessionaire",
    subtitle: "Luxury Car Dashboard",
    desc: "Interactive dashboard to manage and view details of high-end vehicles.",
    github: "https://github.com/Sev-AS/el-huesesaso-Proyecto-HTML-CSS.git",
    images: ["/Resources/consecionario0.png","/Resources/consecionario1.png","/Resources/consecionario2.png"]
  },
  {
    id: 1,
    title: "Fakestore",
    subtitle: "Modern E-commerce",
    desc: "E-commerce platform with responsive design and advanced features including filtering, shopping cart, and product management, plus design features such as an activatable dark mode.",
    github: "https://github.com/JuanJo-R-1/Fakestore-Proyecto.git",
    images: ["/Resources/Fakestore0.png","/Resources/Fakestore1.png","/Resources/Fakestore2.png","/Resources/Fakestore3.png","/Resources/Fakestore4.png"]
  }
];

const items = document.querySelectorAll(".item");
const titleBox = document.getElementById("info-title");
const subtitleBox = document.getElementById("info-subtitle");
const descBox = document.getElementById("info-desc");
const projectLinksContainer = document.getElementById("project-links-container");

// Modal elements
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

// Update project info and buttons
function updateProjectInfo(projectIndex) {
  const project = projectsData[projectIndex];
  titleBox.textContent = project.title;
  subtitleBox.textContent = project.subtitle;
  descBox.textContent = project.desc;
  
  // Update View Code button
  projectLinksContainer.innerHTML = `
    <a href="${project.github}" class="project-link" target="_blank">
      <i class="fab fa-github"></i>
      View code
    </a>
  `;
}

// Project hover listener
items.forEach((item, index) => {
  item.addEventListener("mouseover", () => {
    updateProjectInfo(index);
  });

  // Click to open modal
  item.addEventListener("click", () => {
    openModal(index);
  });
});

// Modal functions
function openModal(projectIndex) {
  currentProjectIndex = projectIndex;
  currentImageIndex = 0;
  const project = projectsData[projectIndex];
  
  // Update modal info
  modalTitle.textContent = project.title;
  modalSubtitle.textContent = project.subtitle;
  
  // Show first image
  showImage(0);
  
  // Update navigation buttons
  updateModalNavigation();
  
  // Show modal
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
  
  // Update counter
  modalImageCounter.textContent = `Image ${currentImageIndex + 1} of ${project.images.length}`;
  
  // Update navigation
  updateModalNavigation();
}

function updateModalNavigation() {
  const project = projectsData[currentProjectIndex];
  
  // Disable/enable prev button
  modalPrev.disabled = currentImageIndex === 0;
  
  // Disable/enable next button
  modalNext.disabled = currentImageIndex === project.images.length - 1;
}

// Modal event listeners
modalClose.addEventListener("click", closeModal);

modalPrev.addEventListener("click", () => {
  if (currentImageIndex > 0) {
    showImage(currentImageIndex - 1);
  }
});

modalNext.addEventListener("click", () => {
  if (currentProjectIndex !== null) {
    const project = projectsData[currentProjectIndex];
    if (currentImageIndex < project.images.length - 1) {
      showImage(currentImageIndex + 1);
    }
  }
});

// Close modal on background click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (modal.classList.contains("active")) {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") modalPrev.click();
    if (e.key === "ArrowRight") modalNext.click();
  }
});
