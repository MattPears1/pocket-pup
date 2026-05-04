(function () {
  const config = window.POCKET_PUP_CONFIG;
  const app = document.getElementById("app");
  const pet = document.getElementById("pet");
  const sprite = document.getElementById("petSprite");
  const dockRail = document.getElementById("dockRail");
  const resetButton = document.getElementById("resetButton");
  const smallerButton = document.getElementById("smallerButton");
  const largerButton = document.getElementById("largerButton");
  const sleepButton = document.getElementById("sleepButton");

  const storageKey = "pocket-pup-state-v1";
  const pointers = new Map();

  let state = {
    x: 0,
    y: 0,
    scale: config.startScale,
    docked: false,
    dockSide: "right",
    sleeping: false
  };

  let drag = null;
  let pinch = null;
  let animation = "idle";
  let frameIndex = 0;
  let lastFrameTime = 0;
  let idleTimer = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        state = { ...state, ...saved };
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function setInitialPosition() {
    const rect = app.getBoundingClientRect();
    if (state.x === 0 && state.y === 0) {
      state.x = rect.width * 0.5;
      state.y = rect.height * 0.62;
    }
  }

  function applySpriteConfig() {
    sprite.style.width = `${config.frameWidth}px`;
    sprite.style.height = `${config.frameHeight}px`;
    sprite.style.backgroundImage = `url("${config.spriteSheet}")`;
    sprite.style.backgroundSize = `${config.frameWidth * config.columns}px auto`;
    pet.style.width = `${config.frameWidth}px`;
    pet.style.height = `${config.frameHeight}px`;
  }

  function setAnimation(next) {
    if (animation === next) return;
    animation = next;
    frameIndex = 0;
    lastFrameTime = 0;
  }

  function render() {
    const rect = app.getBoundingClientRect();
    const halfWidth = (config.frameWidth * state.scale) / 2;
    const halfHeight = (config.frameHeight * state.scale) / 2;
    state.x = clamp(state.x, halfWidth * 0.55, rect.width - halfWidth * 0.55);
    state.y = clamp(state.y, halfHeight * 0.55, rect.height - halfHeight * 0.2);

    pet.classList.toggle("pet--docked", state.docked);
    pet.classList.toggle("pet--sleeping", state.sleeping);
    app.dataset.dockSide = state.dockSide;
    app.dataset.docked = String(state.docked);

    const dockOffset = state.dockSide === "right" ? rect.width - 23 : 23;
    const x = state.docked ? dockOffset : state.x;
    const rotate = state.docked ? (state.dockSide === "right" ? -9 : 9) : 0;
    pet.style.transform = `translate3d(${x}px, ${state.y}px, 0) translate(-50%, -50%) scale(${state.scale}) rotate(${rotate}deg)`;
  }

  function renderFrame(now) {
    const frames = config.animations[animation] || config.animations.idle;
    const fps = config.fps[animation] || config.fps.idle || 6;
    if (!lastFrameTime || now - lastFrameTime > 1000 / fps) {
      frameIndex = (frameIndex + 1) % frames.length;
      const frame = frames[frameIndex];
      const column = frame % config.columns;
      const row = Math.floor(frame / config.columns);
      sprite.style.backgroundPosition = `${-column * config.frameWidth}px ${-row * config.frameHeight}px`;
      lastFrameTime = now;
    }
    requestAnimationFrame(renderFrame);
  }

  function distance(a, b) {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function averagePoint(a, b) {
    return {
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2
    };
  }

  function beginDrag(pointer) {
    const now = performance.now();
    drag = {
      id: pointer.pointerId,
      startX: pointer.clientX,
      startY: pointer.clientY,
      baseX: state.x,
      baseY: state.y,
      lastX: pointer.clientX,
      lastY: pointer.clientY,
      lastTime: now,
      velocityX: 0,
      velocityY: 0
    };
    state.docked = false;
    state.sleeping = false;
    setAnimation("walk");
    render();
  }

  function updateDrag(pointer) {
    if (!drag || drag.id !== pointer.pointerId || pinch) return;
    const now = performance.now();
    const elapsed = Math.max(now - drag.lastTime, 16);
    const nextX = drag.baseX + pointer.clientX - drag.startX;
    const nextY = drag.baseY + pointer.clientY - drag.startY;
    drag.velocityX = ((pointer.clientX - drag.lastX) / elapsed) * 1000;
    drag.velocityY = ((pointer.clientY - drag.lastY) / elapsed) * 1000;
    drag.lastX = pointer.clientX;
    drag.lastY = pointer.clientY;
    drag.lastTime = now;
    state.x = nextX;
    state.y = nextY;
    render();
  }

  function finishDrag() {
    if (!drag) return;
    const rect = app.getBoundingClientRect();
    const fastSideSwipe = Math.abs(drag.velocityX) > 760 && Math.abs(drag.velocityY) < 520;
    const nearEdge = state.x < 54 || state.x > rect.width - 54;
    if (fastSideSwipe || nearEdge) {
      state.docked = true;
      state.dockSide = state.x < rect.width / 2 || drag.velocityX < -760 ? "left" : "right";
    }
    drag = null;
    setAnimation(state.sleeping ? "sleep" : "idle");
    render();
    saveState();
  }

  function beginPinch() {
    const active = Array.from(pointers.values());
    if (active.length < 2) return;
    const [a, b] = active;
    const center = averagePoint(a, b);
    pinch = {
      startDistance: distance(a, b),
      startScale: state.scale,
      startX: state.x,
      startY: state.y,
      centerX: center.x,
      centerY: center.y
    };
    state.docked = false;
    state.sleeping = false;
    setAnimation("walk");
  }

  function updatePinch() {
    const active = Array.from(pointers.values());
    if (!pinch || active.length < 2) return;
    const [a, b] = active;
    const center = averagePoint(a, b);
    const nextScale = clamp(
      pinch.startScale * (distance(a, b) / Math.max(pinch.startDistance, 1)),
      config.minScale,
      config.maxScale
    );
    state.scale = nextScale;
    state.x = pinch.startX + center.x - pinch.centerX;
    state.y = pinch.startY + center.y - pinch.centerY;
    render();
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    pet.setPointerCapture?.(event.pointerId);
    pointers.set(event.pointerId, event);
    if (pointers.size === 1) beginDrag(event);
    if (pointers.size === 2) beginPinch();
  }

  function onPointerMove(event) {
    if (!pointers.has(event.pointerId)) return;
    event.preventDefault();
    pointers.set(event.pointerId, event);
    updatePinch();
    updateDrag(event);
  }

  function onPointerUp(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 0) finishDrag();
  }

  function nudgeScale(delta) {
    state.docked = false;
    state.scale = clamp(state.scale + delta, config.minScale, config.maxScale);
    render();
    saveState();
  }

  function reset() {
    localStorage.removeItem(storageKey);
    state = {
      x: 0,
      y: 0,
      scale: config.startScale,
      docked: false,
      dockSide: "right",
      sleeping: false
    };
    setInitialPosition();
    setAnimation("idle");
    render();
  }

  function installServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  function bindControls() {
    pet.addEventListener("pointerdown", onPointerDown);
    pet.addEventListener("pointermove", onPointerMove);
    pet.addEventListener("pointerup", onPointerUp);
    pet.addEventListener("pointercancel", onPointerUp);

    dockRail.addEventListener("click", () => {
      state.docked = false;
      state.x = state.dockSide === "right" ? app.clientWidth - 96 : 96;
      render();
      saveState();
    });

    resetButton.addEventListener("click", reset);
    smallerButton.addEventListener("click", () => nudgeScale(-0.12));
    largerButton.addEventListener("click", () => nudgeScale(0.12));
    sleepButton.addEventListener("click", () => {
      state.sleeping = !state.sleeping;
      state.docked = false;
      setAnimation(state.sleeping ? "sleep" : "idle");
      render();
      saveState();
    });

    window.addEventListener("resize", () => {
      render();
      saveState();
    });

    window.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
  }

  function boot() {
    applySpriteConfig();
    loadState();
    setInitialPosition();
    bindControls();
    render();
    requestAnimationFrame(renderFrame);
    installServiceWorker();

    idleTimer = window.setInterval(() => {
      if (!drag && !pinch && !state.sleeping && !state.docked) {
        pet.classList.add("pet--blink");
        window.setTimeout(() => pet.classList.remove("pet--blink"), 320);
      }
    }, 4300);
  }

  window.addEventListener("beforeunload", () => {
    clearInterval(idleTimer);
    saveState();
  });

  boot();
})();
