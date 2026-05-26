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
    title: "Assembly Rescue",
    copy: "Turn alignment evidence into sorted, reviewed, and validated genome structure.",
  },
  ai: {
    title: "Evidence Synthesis",
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
  const map = workbench.querySelector("[data-workbench-map]");
  const buttons = Array.from(workbench.querySelectorAll("[data-workbench-mode]"));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  let dragStart = null;
  let dragOffset = { x: 0, y: 0 };

  const setDragOffset = (x, y) => {
    dragOffset = {
      x: clamp(x, -54, 54),
      y: clamp(y, -36, 36),
    };

    workbench.style.setProperty("--drag-x", `${dragOffset.x}px`);
    workbench.style.setProperty("--drag-y", `${dragOffset.y}px`);
  };

  const createPing = (event) => {
    if (!map) {
      return;
    }

    const rect = map.getBoundingClientRect();
    const ping = document.createElement("span");
    ping.className = "map-ping";
    ping.style.left = `${event.clientX - rect.left}px`;
    ping.style.top = `${event.clientY - rect.top}px`;

    map.append(ping);
    ping.addEventListener("animationend", () => ping.remove(), { once: true });
    window.setTimeout(() => ping.remove(), 900);
  };

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

      setDragOffset(0, 0);
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

  if (map) {
    map.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }

      dragStart = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offsetX: dragOffset.x,
        offsetY: dragOffset.y,
      };

      map.classList.add("is-dragging");
      map.setPointerCapture(event.pointerId);
    });

    map.addEventListener("pointermove", (event) => {
      if (!dragStart || dragStart.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setDragOffset(dragStart.offsetX + deltaX, dragStart.offsetY + deltaY);
      event.preventDefault();
    });

    const finishMapInteraction = (event) => {
      if (!dragStart || dragStart.pointerId !== event.pointerId) {
        return;
      }

      const distance = Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y);

      if (map.hasPointerCapture(event.pointerId)) {
        map.releasePointerCapture(event.pointerId);
      }

      map.classList.remove("is-dragging");

      if (distance < 7) {
        createPing(event);
      }

      dragStart = null;
    };

    map.addEventListener("pointerup", finishMapInteraction);
    map.addEventListener("pointercancel", (event) => {
      if (map.hasPointerCapture(event.pointerId)) {
        map.releasePointerCapture(event.pointerId);
      }

      map.classList.remove("is-dragging");
      dragStart = null;
    });
  }
}
