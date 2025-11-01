// main.js — portrait interaction (cursor / touch driven)
(function () {
	const container = document.querySelector('.portrait-container');
	if (!container) return;

	const img = container.querySelector('.profile-img');
	if (!img) return;

	const maxTranslate = 28; // px maximum translate on extremes
	const maxScale = 1.06; // max scale at center

	let raf = null;
	let lastX = 0;
	let lastY = 0;

	function update() {
		// normalized offset: -0.5..0.5 (center 0)
		const rect = container.getBoundingClientRect();
		const offsetX = lastX !== null ? (lastX - rect.left) / rect.width - 0.5 : 0;
		// offsetX -0.5..0.5 -> we want image to move opposite direction
		const offset = Math.max(-0.5, Math.min(0.5, offsetX));

		// translate opposite direction and scale more at center
		const translateX = -offset * 2 * maxTranslate; // -max..+max
		const t = Math.min(1, Math.max(0, 1 - Math.abs(offset * 2))); // 0..1, 1=center
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
		// allow pointer events even when children have pointer-events none
		scheduleUpdate(e.clientX, e.clientY);
	}, { passive: true });

	container.addEventListener('mouseleave', () => {
		// reset smoothly
		img.style.transition = 'transform 380ms cubic-bezier(.2,.9,.3,1)';
		img.style.transform = '';
		// remove temporary transition after it finishes
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

