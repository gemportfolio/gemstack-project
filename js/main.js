document.addEventListener("DOMContentLoaded", async () => {

  // Loads sections components
  await loadComponents();

  // AOS Animation
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true
    });
  }

  // Year
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile Menu
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileNav = document.getElementById("mobileNav");
  const menuIcon = document.getElementById("menuIcon");

  if (mobileMenuButton && mobileNav && menuIcon) {

    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";

      mobileMenuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("hidden", isOpen);

      menuIcon.classList.toggle("bi-list", isOpen);
      menuIcon.classList.toggle("bi-x-lg", !isOpen);
    });

    const mobileNavLinks = mobileNav.querySelectorAll(".mobile-nav-link");

    mobileNavLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileNav.classList.add("hidden");

        menuIcon.classList.remove("bi-x-lg");
        menuIcon.classList.add("bi-list");
      });
    });
  }

  // Testimonials
  initTestimonials();

  // Package selector
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-package]");
    if (!button) return;

    const packageName = button.dataset.package;
    const radio = document.querySelector(
      `input[name="package"][value="${packageName}"]`
    );

    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  // WhatsApp Onboarding
  const WHATSAPP_NUMBER = "2348084634310";

  const onboardingForm = document.getElementById("whatsapp-onboarding-form");
  const onboardingError = document.getElementById("onboarding-error");

  if (onboardingForm) {
    onboardingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(onboardingForm);

      const packageName = formData.get("package");
      const name = formData.get("name");
      const email = formData.get("email");
      const whatsapp = formData.get("whatsapp");
      const business = formData.get("business");

      if (!packageName || !name || !whatsapp) {
        onboardingError.textContent = "Please fill in the required fields.";
        onboardingError.classList.remove("hidden");
        return;
      }

      onboardingError.classList.add("hidden");

      const message = [
        `Hi! I'd like to get started with the GemStack ${packageName} Package.`,
        "",
        `Name: ${name}`,
        business ? `Business: ${business}` : null,
        email ? `Email: ${email}` : null,
        `WhatsApp: ${whatsapp}`
      ]
        .filter(Boolean)
        .join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

});

function initTestimonials() {
  const track = document.getElementById("testimonial-track");
  const slides = track?.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");

  if (!track || !slides.length || !dots.length) return;

  let activeIndex = 0;
  let autoplay;
  let scrollTimeout;

  function goToSlide(index) {
    const slide = slides[index];

    if (!slide) return;

    track.scrollTo({
      left: slide.offsetLeft,
      behavior: "smooth"
    });

    setActiveDot(index);
  }

  function setActiveDot(index) {
    activeIndex = index;

    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-[var(--color-primary)]", i === index);
      dot.classList.toggle("bg-[var(--color-primary)]/30", i !== index);
    });
  }

  function updateActiveSlide() {
    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - track.scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveDot(closestIndex);
  }

  function startAutoplay() {
    clearInterval(autoplay);

    autoplay = setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 4500);
  }

  function pauseAutoplay() {
    clearInterval(autoplay);
  }

  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(updateActiveSlide, 100);
  });

  track.addEventListener("mouseenter", pauseAutoplay);
  track.addEventListener("mouseleave", startAutoplay);

  track.addEventListener("touchstart", pauseAutoplay);
  track.addEventListener("touchend", startAutoplay);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoplay();
    });
  });

  startAutoplay();
}