(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle?.addEventListener("click", () => {
    const open = links?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  const showReveal = (el) => el.classList.add("is-in");

  // Hero / above-the-fold copy must never stay invisible
  document.querySelectorAll(".hero .reveal").forEach(showReveal);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    reveals.forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });
  } else {
    reveals.forEach(showReveal);
  }

  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const slides = [...carousel.querySelectorAll(".slide")];
    const dotsWrap = carousel.querySelector("[data-dots]");
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `שקופית ${i + 1}`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => go(i));
      dotsWrap?.appendChild(dot);
    });

    const dots = [...(dotsWrap?.querySelectorAll("button") || [])];

    const go = (next) => {
      slides[index].classList.remove("is-active");
      dots[index]?.classList.remove("is-active");
      index = (next + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dots[index]?.classList.add("is-active");
      restart();
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 5200);
    };

    carousel.querySelector("[data-prev]")?.addEventListener("click", () => go(index - 1));
    carousel.querySelector("[data-next]")?.addEventListener("click", () => go(index + 1));
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", restart);
    restart();
  }

  const form = document.getElementById("bookForm");
  const note = document.getElementById("formNote");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const eventType = String(data.get("event") || "").trim();
    const details = String(data.get("details") || "").trim();

    if (!name || !phone || !email || !eventType) {
      if (note) note.textContent = "נא למלא את כל השדות החובה.";
      return;
    }

    const subject = encodeURIComponent(`הזמנת מופע — ${name}`);
    const body = encodeURIComponent(
      [
        `שם: ${name}`,
        `טלפון: ${phone}`,
        `אימייל: ${email}`,
        `סוג אירוע: ${eventType}`,
        "",
        "פרטים נוספים:",
        details || "—",
      ].join("\n")
    );

    if (note) {
      note.textContent = "פותחים את המייל לשליחה... תודה! נחזור אליכם בהקדם.";
    }
    window.location.href = `mailto:annkaniel@gmail.com?subject=${subject}&body=${body}`;
  });
})();
