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

const createWorkbenchScene = (map, canvas) => {
  const ctx = canvas.getContext("2d");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const palette = {
    ink: "#1d2a26",
    green: "#28745d",
    greenDark: "#18523f",
    gold: "#b98524",
    blue: "#3c6e93",
    red: "#a74d45",
    line: "rgba(40, 116, 93, 0.24)",
    softLine: "rgba(60, 110, 147, 0.2)",
  };
  const state = {
    mode: "pangenome",
    width: 0,
    height: 0,
    dpr: 1,
    objects: [],
    edges: [],
    effects: [],
    pointer: null,
    lastTime: performance.now(),
    lastAttention: performance.now(),
    reducedMotion: reducedMotionQuery.matches,
  };

  if (!ctx) {
    return { setMode: () => {} };
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mix = (start, end, amount) => start + (end - start) * amount;
  const easeOut = (amount) => 1 - Math.pow(1 - clamp(amount, 0, 1), 3);
  const byId = (id) => state.objects.find((object) => object.id === id);

  const addObject = (object, intro) => {
    const item = {
      angle: 0,
      spin: 0,
      vx: 0,
      vy: 0,
      scale: 1,
      bumpStart: 0,
      bumpDuration: 0,
      bumpAmount: 0,
      ...object,
    };

    item.x = item.homeX;
    item.y = item.homeY;

    if (intro && !state.reducedMotion) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.max(state.width, state.height) * (0.18 + Math.random() * 0.18);
      item.x += Math.cos(angle) * distance;
      item.y += Math.sin(angle) * distance;
      item.vx = (item.homeX - item.x) * 0.035;
      item.vy = (item.homeY - item.y) * 0.035;
      item.spin = (Math.random() - 0.5) * 0.18;
    }

    state.objects.push(item);
    return item;
  };

  const rebuildScene = (intro = false) => {
    const w = state.width;
    const h = state.height;
    state.objects = [];
    state.edges = [];
    state.effects = intro ? [] : state.effects;

    if (!w || !h) {
      return;
    }

    const point = (id, x, y, color, options = {}) =>
      addObject(
        {
          id,
          kind: "node",
          homeX: w * x,
          homeY: h * y,
          radius: options.radius || 9,
          color,
          glow: options.glow || color,
          private: options.private || false,
        },
        intro
      );

    if (state.mode === "pangenome") {
      point("sample-a", 0.14, 0.32, palette.green);
      point("sample-b", 0.49, 0.23, palette.gold);
      point("sample-c", 0.83, 0.43, palette.blue);
      point("sample-d", 0.24, 0.72, palette.red);
      point("sample-e", 0.68, 0.62, palette.greenDark);
      point("private", 0.53, 0.52, palette.red, { radius: 6.5, private: true });
      state.edges = [
        ["sample-a", "sample-b", "rgba(40, 116, 93, 0.38)"],
        ["sample-b", "sample-c", "rgba(60, 110, 147, 0.34)"],
        ["sample-a", "sample-d", "rgba(167, 77, 69, 0.28)", true],
        ["sample-d", "private", "rgba(185, 133, 36, 0.38)"],
        ["private", "sample-e", "rgba(40, 116, 93, 0.38)", true],
      ];
    }

    if (state.mode === "assembly") {
      addObject(
        {
          id: "contig-a",
          kind: "contig",
          homeX: w * 0.29,
          homeY: h * 0.39,
          width: w * 0.32,
          height: 17,
          angle: -0.11,
          color: palette.green,
          accent: palette.blue,
        },
        intro
      );
      addObject(
        {
          id: "contig-b",
          kind: "contig",
          homeX: w * 0.55,
          homeY: h * 0.49,
          width: w * 0.25,
          height: 17,
          angle: 0.08,
          color: palette.gold,
          accent: palette.green,
        },
        intro
      );
      addObject(
        {
          id: "contig-c",
          kind: "contig",
          homeX: w * 0.74,
          homeY: h * 0.65,
          width: w * 0.24,
          height: 17,
          angle: -0.12,
          color: palette.blue,
          accent: palette.green,
        },
        intro
      );
      addObject(
        {
          id: "contig-d",
          kind: "contig",
          homeX: w * 0.36,
          homeY: h * 0.68,
          width: w * 0.23,
          height: 17,
          angle: 0.14,
          color: palette.red,
          accent: palette.gold,
        },
        intro
      );
      addObject(
        {
          id: "breakpoint",
          kind: "node",
          homeX: w * 0.53,
          homeY: h * 0.5,
          radius: 7,
          color: palette.red,
          private: true,
        },
        intro
      );
    }

    if (state.mode === "ai") {
      addObject(
        {
          id: "core",
          kind: "core",
          homeX: w * 0.52,
          homeY: h * 0.52,
          radius: 21,
          color: palette.green,
          glow: palette.blue,
        },
        intro
      );
      addObject({ id: "paper", kind: "card", homeX: w * 0.23, homeY: h * 0.28, width: 72, height: 34, color: palette.green }, intro);
      addObject({ id: "variant", kind: "card", homeX: w * 0.78, homeY: h * 0.32, width: 72, height: 34, color: palette.gold }, intro);
      addObject({ id: "workflow", kind: "card", homeX: w * 0.28, homeY: h * 0.72, width: 72, height: 34, color: palette.blue }, intro);
      state.edges = [
        ["paper", "core", "rgba(40, 116, 93, 0.28)"],
        ["variant", "core", "rgba(185, 133, 36, 0.28)"],
        ["workflow", "core", "rgba(60, 110, 147, 0.28)"],
      ];
    }

    if (intro && !state.reducedMotion) {
      triggerAttention(performance.now(), true);
    }
  };

  const resize = () => {
    const rect = map.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.max(1, rect.width);
    state.height = Math.max(1, rect.height);
    state.dpr = dpr;
    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildScene(false);
  };

  const roundedRect = (x, y, width, height, radius) => {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
      return;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  };

  const objectRadius = (object) => Math.max(object.radius || 0, (object.width || 0) * 0.5, (object.height || 0) * 0.5);

  const bumpScale = (object, now) => {
    if (!object.bumpStart) {
      return 1;
    }

    const amount = (now - object.bumpStart) / object.bumpDuration;

    if (amount >= 1) {
      object.bumpStart = 0;
      return 1;
    }

    return 1 + Math.sin(amount * Math.PI) * object.bumpAmount;
  };

  const spawnSparkles = (x, y, count, color = palette.gold, velocity = 2) => {
    if (state.reducedMotion) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = velocity * (0.35 + Math.random());
      state.effects.push({
        type: "spark",
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.8,
        color,
        start: performance.now(),
        duration: 600 + Math.random() * 500,
      });
    }
  };

  const triggerBump = (object, now, amount = 0.38) => {
    object.bumpStart = now;
    object.bumpDuration = 760;
    object.bumpAmount = amount;
  };

  function triggerAttention(now = performance.now(), intro = false) {
    if (state.reducedMotion) {
      return;
    }

    const favorites = {
      pangenome: byId("private") || byId("sample-b"),
      assembly: byId("breakpoint") || byId("contig-b"),
      ai: byId("core") || byId("variant"),
    };
    const focus = favorites[state.mode];

    if (focus) {
      triggerBump(focus, now, intro ? 0.46 : 0.32);
      focus.vx += (Math.random() - 0.5) * 7;
      focus.vy += intro ? -7 : (Math.random() - 0.5) * 7;
      spawnSparkles(focus.x, focus.y, intro ? 18 : 10, state.mode === "ai" ? palette.blue : palette.gold, intro ? 3.1 : 2.1);
    }

    state.effects.push({
      type: state.mode === "assembly" ? "scan" : "beam",
      mode: state.mode,
      start: now,
      duration: intro ? 1400 : 1100,
    });
    state.lastAttention = now;
  }

  const nearestObject = (x, y) =>
    state.objects.reduce(
      (nearest, object) => {
        const distance = Math.hypot(object.x - x, object.y - y) - objectRadius(object);
        return distance < nearest.distance ? { object, distance } : nearest;
      },
      { object: null, distance: Infinity }
    ).object;

  const handleTap = (x, y) => {
    const now = performance.now();
    const target = nearestObject(x, y);
    state.effects.push({ type: "ping", x, y, start: now, duration: 760 });

    if (target) {
      const dx = x - target.x;
      const dy = y - target.y;
      target.vx += dx * 0.18;
      target.vy += dy * 0.18;
      triggerBump(target, now, 0.55);
      spawnSparkles(x, y, 14, target.color || palette.gold, 2.8);
    }
  };

  const scatterFromPointer = (x, y, vx, vy, strength = 1) => {
    const radius = Math.max(100, Math.min(state.width, state.height) * 0.62);

    state.objects.forEach((object) => {
      const dx = object.x - x;
      const dy = object.y - y;
      const distance = Math.max(1, Math.hypot(dx, dy));

      if (distance > radius) {
        return;
      }

      const falloff = Math.pow(1 - distance / radius, 2);
      const awayX = dx / distance;
      const awayY = dy / distance;
      object.vx += (awayX * 16 + vx * 0.5) * falloff * strength;
      object.vy += (awayY * 16 + vy * 0.5) * falloff * strength;
      object.spin += (vx - vy) * 0.0025 * falloff * strength;
    });
  };

  const handleThrow = (x, y, vx, vy) => {
    scatterFromPointer(x, y, vx, vy, 2.4);
    spawnSparkles(x, y, 18, palette.gold, 3.8);
  };

  const pointerPoint = (event) => {
    const rect = map.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  map.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const now = performance.now();
    const point = pointerPoint(event);
    state.pointer = {
      id: event.pointerId,
      startX: point.x,
      startY: point.y,
      lastX: point.x,
      lastY: point.y,
      lastTime: now,
      vx: 0,
      vy: 0,
      dragged: false,
    };
    map.classList.add("is-dragging");
    map.setPointerCapture(event.pointerId);
  });

  map.addEventListener("pointermove", (event) => {
    const rect = map.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    workbench.style.setProperty("--mx", `${x}%`);
    workbench.style.setProperty("--my", `${y}%`);

    if (!state.pointer || state.pointer.id !== event.pointerId) {
      return;
    }

    const now = performance.now();
    const point = pointerPoint(event);
    const deltaX = point.x - state.pointer.lastX;
    const deltaY = point.y - state.pointer.lastY;
    const deltaTime = Math.max(8, now - state.pointer.lastTime);
    state.pointer.vx = (deltaX / deltaTime) * 16.67;
    state.pointer.vy = (deltaY / deltaTime) * 16.67;
    state.pointer.lastX = point.x;
    state.pointer.lastY = point.y;
    state.pointer.lastTime = now;
    state.pointer.dragged = state.pointer.dragged || Math.hypot(point.x - state.pointer.startX, point.y - state.pointer.startY) > 7;

    scatterFromPointer(point.x, point.y, state.pointer.vx, state.pointer.vy, 1.15);

    if (Math.random() > 0.58) {
      spawnSparkles(point.x, point.y, 1, palette.gold, 1.6);
    }

    event.preventDefault();
  });

  const finishPointer = (event) => {
    if (!state.pointer || state.pointer.id !== event.pointerId) {
      return;
    }

    const point = pointerPoint(event);
    const distance = Math.hypot(point.x - state.pointer.startX, point.y - state.pointer.startY);

    if (map.hasPointerCapture(event.pointerId)) {
      map.releasePointerCapture(event.pointerId);
    }

    map.classList.remove("is-dragging");

    if (!state.pointer.dragged || distance < 8) {
      handleTap(point.x, point.y);
    } else {
      handleThrow(point.x, point.y, state.pointer.vx, state.pointer.vy);
    }

    state.pointer = null;
  };

  map.addEventListener("pointerup", finishPointer);
  map.addEventListener("pointercancel", (event) => {
    if (map.hasPointerCapture(event.pointerId)) {
      map.releasePointerCapture(event.pointerId);
    }

    map.classList.remove("is-dragging");
    state.pointer = null;
  });

  map.addEventListener("pointerleave", () => {
    workbench.style.removeProperty("--mx");
    workbench.style.removeProperty("--my");
  });

  const update = (now) => {
    const delta = Math.min(34, now - state.lastTime || 16.67);
    const step = delta / 16.67;
    state.lastTime = now;

    if (!state.reducedMotion && now - state.lastAttention > 5000 && !state.pointer) {
      triggerAttention(now);
    }

    state.objects.forEach((object) => {
      const spring = state.pointer ? 0.035 : 0.06;
      object.vx += (object.homeX - object.x) * spring * step;
      object.vy += (object.homeY - object.y) * spring * step;
      object.vx *= Math.pow(0.83, step);
      object.vy *= Math.pow(0.83, step);
      object.x += object.vx * step;
      object.y += object.vy * step;
      object.angle += object.spin * step;
      object.spin *= Math.pow(0.88, step);

      const radius = objectRadius(object) + 4;
      const minX = radius;
      const maxX = state.width - radius;
      const minY = radius;
      const maxY = state.height - radius;

      if (object.x < minX || object.x > maxX) {
        object.x = clamp(object.x, minX, maxX);
        object.vx *= -0.72;
        spawnSparkles(object.x, object.y, 2, object.color || palette.gold, 1.8);
      }

      if (object.y < minY || object.y > maxY) {
        object.y = clamp(object.y, minY, maxY);
        object.vy *= -0.72;
        spawnSparkles(object.x, object.y, 2, object.color || palette.gold, 1.8);
      }
    });

    state.effects = state.effects.filter((effect) => now - effect.start < effect.duration);
  };

  const drawBackdrop = () => {
    const w = state.width;
    const h = state.height;

    ctx.save();
    ctx.globalAlpha = 0.75;

    if (state.mode === "assembly") {
      ctx.strokeStyle = "rgba(40, 116, 93, 0.28)";
      ctx.lineWidth = 4;
      ctx.setLineDash([18, 8]);
      ctx.beginPath();
      ctx.moveTo(w * 0.11, h * 0.53);
      ctx.lineTo(w * 0.89, h * 0.53);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(167, 77, 69, 0.36)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.28);
      ctx.lineTo(w * 0.5, h * 0.72);
      ctx.moveTo(w * 0.58, h * 0.28);
      ctx.lineTo(w * 0.58, h * 0.72);
      ctx.stroke();
    }

    if (state.mode === "ai") {
      ctx.strokeStyle = "rgba(60, 110, 147, 0.14)";
      ctx.lineWidth = 1.4;
      [0.26, 0.38].forEach((radius) => {
        ctx.beginPath();
        ctx.ellipse(w * 0.52, h * 0.52, w * radius, h * radius, -0.16, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    ctx.restore();
  };

  const drawEdges = () => {
    state.edges.forEach(([fromId, toId, color, dashed]) => {
      const from = byId(fromId);
      const to = byId(toId);

      if (!from || !to) {
        return;
      }

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = state.mode === "ai" ? 1.8 : 2.2;
      ctx.lineCap = "round";

      if (dashed) {
        ctx.setLineDash([7, 8]);
      }

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.restore();
    });
  };

  const drawNode = (object, now) => {
    const scale = bumpScale(object, now);
    const radius = object.radius * scale;

    ctx.save();
    ctx.shadowColor = object.glow || object.color;
    ctx.shadowBlur = object.private ? 18 : 12;
    ctx.fillStyle = object.color;
    ctx.beginPath();
    ctx.arc(object.x, object.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.stroke();

    if (object.private) {
      ctx.strokeStyle = "rgba(167, 77, 69, 0.32)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(object.x, object.y, radius + 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawContig = (object, now) => {
    const scale = bumpScale(object, now);
    const width = object.width * scale;
    const height = object.height * scale;

    ctx.save();
    ctx.translate(object.x, object.y);
    ctx.rotate(object.angle);
    ctx.shadowColor = "rgba(29, 42, 38, 0.18)";
    ctx.shadowBlur = 14;
    const gradient = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    gradient.addColorStop(0, object.color);
    gradient.addColorStop(1, object.accent);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    roundedRect(-width / 2, -height / 2, width, height, height / 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
    ctx.stroke();
    ctx.restore();
  };

  const drawCard = (object, now) => {
    const scale = bumpScale(object, now);
    const width = object.width * scale;
    const height = object.height * scale;

    ctx.save();
    ctx.translate(object.x, object.y);
    ctx.rotate(object.angle * 0.3);
    ctx.shadowColor = "rgba(29, 42, 38, 0.14)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "rgba(255, 255, 255, 0.84)";
    ctx.beginPath();
    roundedRect(-width / 2, -height / 2, width, height, 7);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = object.color;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    roundedRect(-width / 2 + 7, -height / 2 + 7, 12, height - 14, 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(219, 228, 222, 0.95)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = "rgba(40, 116, 93, 0.24)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width / 2 + 26, -height / 2 + 12);
    ctx.lineTo(width / 2 - 10, -height / 2 + 12);
    ctx.moveTo(-width / 2 + 26, -height / 2 + 21);
    ctx.lineTo(width / 2 - 18, -height / 2 + 21);
    ctx.stroke();
    ctx.restore();
  };

  const drawCore = (object, now) => {
    const scale = bumpScale(object, now);
    const radius = object.radius * scale;

    ctx.save();
    ctx.translate(object.x, object.y);
    ctx.shadowColor = "rgba(60, 110, 147, 0.42)";
    ctx.shadowBlur = 22;
    const gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, radius);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.96)");
    gradient.addColorStop(0.38, "rgba(60, 110, 147, 0.72)");
    gradient.addColorStop(1, "rgba(40, 116, 93, 0.92)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = "rgba(60, 110, 147, 0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawEffects = (now) => {
    state.effects.forEach((effect) => {
      const progress = clamp((now - effect.start) / effect.duration, 0, 1);
      const eased = easeOut(progress);

      if (effect.type === "ping") {
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = palette.gold;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 8 + eased * 48, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (effect.type === "spark") {
        const x = effect.x + effect.vx * progress * 18;
        const y = effect.y + effect.vy * progress * 18 + progress * progress * 10;
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - effect.size, y);
        ctx.lineTo(x + effect.size, y);
        ctx.moveTo(x, y - effect.size);
        ctx.lineTo(x, y + effect.size);
        ctx.stroke();
        ctx.restore();
      }

      if (effect.type === "scan") {
        const x = mix(state.width * 0.1, state.width * 0.9, eased);
        ctx.save();
        ctx.globalAlpha = Math.sin(progress * Math.PI);
        const gradient = ctx.createLinearGradient(x, state.height * 0.18, x, state.height * 0.82);
        gradient.addColorStop(0, "rgba(185, 133, 36, 0)");
        gradient.addColorStop(0.5, "rgba(185, 133, 36, 0.78)");
        gradient.addColorStop(1, "rgba(185, 133, 36, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, state.height * 0.18);
        ctx.lineTo(x, state.height * 0.82);
        ctx.stroke();
        ctx.restore();
      }

      if (effect.type === "beam") {
        const focus = state.mode === "ai" ? byId("core") : byId("private");
        const source = state.mode === "ai" ? byId(progress < 0.5 ? "paper" : "variant") : byId("sample-b");

        if (focus && source) {
          const x = mix(source.x, focus.x, eased);
          const y = mix(source.y, focus.y, eased);
          ctx.save();
          ctx.globalAlpha = Math.sin(progress * Math.PI);
          ctx.fillStyle = state.mode === "ai" ? palette.blue : palette.gold;
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    });
  };

  const draw = (now) => {
    ctx.clearRect(0, 0, state.width, state.height);
    drawBackdrop();
    drawEdges();
    drawEffects(now);

    state.objects.forEach((object) => {
      if (object.kind === "contig") {
        drawContig(object, now);
      } else if (object.kind === "card") {
        drawCard(object, now);
      } else if (object.kind === "core") {
        drawCore(object, now);
      } else {
        drawNode(object, now);
      }
    });
  };

  const animate = (now) => {
    update(now);
    draw(now);
    window.requestAnimationFrame(animate);
  };

  const setMode = (mode) => {
    state.mode = mode;
    state.lastAttention = performance.now();
    rebuildScene(true);
  };

  if (window.ResizeObserver) {
    new ResizeObserver(resize).observe(map);
  } else {
    window.addEventListener("resize", resize);
  }

  const updateReducedMotion = () => {
    state.reducedMotion = reducedMotionQuery.matches;
    rebuildScene(false);
  };

  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", updateReducedMotion);
  } else {
    reducedMotionQuery.addListener(updateReducedMotion);
  }

  window.requestAnimationFrame(() => {
    resize();
    setMode(state.mode);
    window.requestAnimationFrame(animate);
  });

  return { setMode };
};

if (workbench) {
  const title = workbench.querySelector("[data-workbench-title]");
  const copy = workbench.querySelector("[data-workbench-copy]");
  const map = workbench.querySelector("[data-workbench-map]");
  const canvas = workbench.querySelector("[data-workbench-canvas]");
  const buttons = Array.from(workbench.querySelectorAll("[data-workbench-mode]"));
  const scene = map && canvas ? createWorkbenchScene(map, canvas) : null;

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
      scene?.setMode(mode);

      buttons.forEach((modeButton) => {
        const isActive = modeButton === button;
        modeButton.classList.toggle("is-active", isActive);
        modeButton.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}
