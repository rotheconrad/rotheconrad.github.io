const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const workbench = document.querySelector("[data-workbench]");

const workbenchModes = {
  pangenome: {
    title: "Target-private variation",
    copy: "Find signal present in focal lines and absent from background panels.",
  },
  assembly: {
    title: "Assembly rescue",
    copy: "Turn alignment evidence into sorted, reviewed, and validated genome structure.",
  },
  ai: {
    title: "Evidence synthesis",
    copy: "Keep claims, annotations, literature, and workflow outputs tied together.",
  },
};

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (header) {
  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

if (workbench) {
  const title = workbench.querySelector("[data-workbench-title]");
  const copy = workbench.querySelector("[data-workbench-copy]");
  const buttons = Array.from(workbench.querySelectorAll("[data-workbench-mode]"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.workbenchMode;
      const content = workbenchModes[mode];

      if (!content) {
        return;
      }

      workbench.dataset.mode = mode;
      title.textContent = content.title;
      copy.textContent = content.copy;

      buttons.forEach((modeButton) => {
        const isActive = modeButton === button;
        modeButton.classList.toggle("is-active", isActive);
        modeButton.setAttribute("aria-pressed", String(isActive));
      });
    });
  });

  workbench.addEventListener("pointermove", (event) => {
    const rect = workbench.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    workbench.style.setProperty("--mx", `${x}%`);
    workbench.style.setProperty("--my", `${y}%`);
  });

  workbench.addEventListener("pointerleave", () => {
    workbench.style.removeProperty("--mx");
    workbench.style.removeProperty("--my");
  });
}
