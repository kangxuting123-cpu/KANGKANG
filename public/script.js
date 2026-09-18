
// Entry transition video overlay
(() => {
  const intro = document.querySelector("[data-entry-intro]");
  if (!intro) return;

  const hash = window.location.hash || "#top";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldPlay = !prefersReducedMotion && (hash === "#top" || hash === "#");
  const video = intro.querySelector("video");
  let isFinished = false;

  const finish = () => {
    if (isFinished) return;
    isFinished = true;
    intro.classList.remove("is-active");
    intro.classList.add("is-done");
    document.documentElement.classList.remove("entry-intro-lock");
    document.body.classList.remove("entry-intro-lock");
    window.setTimeout(() => intro.remove(), 700);
  };

  if (!shouldPlay) {
    intro.remove();
    return;
  }

  document.documentElement.classList.add("entry-intro-lock");
  document.body.classList.add("entry-intro-lock");
  intro.classList.add("is-active");

  if (video) {
    video.currentTime = 0;
    video.play().catch(() => {
      window.setTimeout(finish, 1400);
    });
    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
  }

  window.setTimeout(finish, 4200);
})();

const glow = document.querySelector(".cursor-glow");
const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const header = document.querySelector(".site-header");
const heroCover = document.querySelector(".hero-cover");
const copyButtons = document.querySelectorAll(".copy-link");
const projectVideos = document.querySelectorAll(".project-video");
const projectScroll = document.querySelector("[data-project-scroll]");
const projectRail = document.querySelector("[data-project-rail]");
const remixItems = document.querySelectorAll(".remix-item");
const remixMediaBlocks = document.querySelectorAll(".remix-media-block");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-home-door]").forEach((door) => {
  door.addEventListener("click", () => {
    const isOpen = door.classList.toggle("is-open");
    door.setAttribute("aria-pressed", String(isOpen));
    door.setAttribute("aria-label", isOpen ? "关闭小门" : "打开小门");
  });
});

if (!reducedMotion && glow) {
  window.addEventListener("pointermove", (event) => {
    glow.style.setProperty("--x", `${event.clientX}px`);
    glow.style.setProperty("--y", `${event.clientY}px`);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
  observer.observe(element);
});

if (!reducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

if (!reducedMotion && heroCover) {
  heroCover.addEventListener("pointermove", (event) => {
    const rect = heroCover.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const x = (px - 0.5).toFixed(3);
    const y = (py - 0.5).toFixed(3);

    heroCover.style.setProperty("--hero-x", x);
    heroCover.style.setProperty("--hero-y", y);
    heroCover.style.setProperty("--hero-glow-x", `${(px * 100).toFixed(1)}%`);
    heroCover.style.setProperty("--hero-glow-y", `${(py * 100).toFixed(1)}%`);
  });

  heroCover.addEventListener("pointerleave", () => {
    heroCover.style.setProperty("--hero-x", "0");
    heroCover.style.setProperty("--hero-y", "0");
    heroCover.style.setProperty("--hero-glow-x", "50%");
    heroCover.style.setProperty("--hero-glow-y", "50%");
  });

  window.addEventListener("scroll", () => {
    const offset = window.scrollY * -0.04;
    heroCover.style.transform = `translateY(${offset}px)`;
  });
}

if (header) {
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 120 && currentScrollY > lastScrollY) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
  });
}

copyButtons.forEach((button) => {
  const label = button.dataset.defaultLabel || button.textContent.trim();

  button.textContent = label;

  button.addEventListener("click", async () => {
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = button.dataset.copiedHint || "Copy";
      button.classList.add("is-copied");

      window.setTimeout(() => {
        button.textContent = label;
        button.classList.remove("is-copied");
      }, 1400);
    } catch {
      button.textContent = "Copy failed";

      window.setTimeout(() => {
        button.textContent = label;
      }, 1400);
    }
  });
});

if (!reducedMotion && projectVideos.length) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  projectVideos.forEach((video) => videoObserver.observe(video));
}

if (!reducedMotion && projectScroll && projectRail) {
  const projectCards = projectRail.querySelectorAll(".project-card");

  const updateProjectScroll = () => {
    const rect = projectScroll.getBoundingClientRect();
    const maxScroll = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));
    const maxX = Math.max(0, projectRail.scrollWidth - window.innerWidth + 64);
    const x = -maxX * progress;

    projectScroll.style.setProperty("--scroll-progress", progress.toFixed(3));
    projectRail.style.setProperty("--rail-x", `${x}px`);

    projectCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - window.innerWidth / 2);
      const visibility = Math.max(0, 1 - distance / window.innerWidth);

      card.style.setProperty("--card-visibility", visibility.toFixed(3));
    });
  };

  updateProjectScroll();
  window.addEventListener("scroll", updateProjectScroll, { passive: true });
  window.addEventListener("resize", updateProjectScroll);
}

if (remixItems.length && remixMediaBlocks.length) {
  const setActiveRemix = (target) => {
    remixItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.remixTarget === target);
    });

    remixMediaBlocks.forEach((block) => {
      block.classList.toggle("is-active", block.dataset.remixMedia === target);
    });
  };

  remixItems.forEach((item) => {
    item.addEventListener("pointerenter", () => {
      setActiveRemix(item.dataset.remixTarget);
    });

    item.addEventListener("pointerleave", () => {
      remixItems.forEach((entry) => entry.classList.remove("is-active"));
      remixMediaBlocks.forEach((block) => block.classList.remove("is-active"));
    });
  });
}


document.querySelectorAll('.doodle-video-feature video').forEach((video) => {
  video.playbackRate = 0.55;
  video.addEventListener('loadedmetadata', () => {
    video.playbackRate = 0.55;
  });
});


document.querySelectorAll("[data-portrait-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".portrait-slide")];

  if (!slides.length) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 1;

  const paintPortraitStage = () => {
    const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
    const nextIndex = (activeIndex + 1) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
      slide.classList.toggle("is-prev", index === prevIndex);
      slide.classList.toggle("is-next", index === nextIndex);
    });
  };

  slides.forEach((slide, index) => {
    slide.addEventListener("click", () => {
      activeIndex = index;
      paintPortraitStage();
    });
  });

  paintPortraitStage();

  if (!reducedMotion) {
    window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      paintPortraitStage();
    }, 2600);
  }
});


const routeCategoryNames = {
  video: "Video",
  effects: "Effects",
  "effects-archive": "Traditional Effects",
  graphic: "Graphic",
  team: "Team",
  vibecoding: "Vibe Coding",
};

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const revealActiveRoute = () => {
  document.querySelectorAll(".route-section .reveal").forEach((element) => {
    if (element.offsetParent !== null) {
      element.classList.add("is-visible");
    }
  });
};

const applyPortfolioRoute = (shouldScroll = false) => {
  const hash = window.location.hash || "#top";
  const categoryMatch = hash.match(/^#projects-(video|effects|effects-archive|graphic|team|vibecoding)$/);
  const heading = document.querySelector(".projects-section .section-heading");

  if (categoryMatch) {
    document.body.dataset.view = "project-detail";
    document.body.dataset.projectCategory = categoryMatch[1];
    if (heading) heading.dataset.activeCategory = routeCategoryNames[categoryMatch[1]];
  } else {
    delete document.body.dataset.projectCategory;

    if (hash === "#about") {
      document.body.dataset.view = "about";
    } else if (hash === "#projects") {
      document.body.dataset.view = "projects";
    } else if (hash === "#contact") {
      document.body.dataset.view = "contact";
    } else {
      document.body.dataset.view = "home";
    }
  }

  requestAnimationFrame(() => {
    revealActiveRoute();
    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  });
};

applyPortfolioRoute();
window.addEventListener("hashchange", () => {
  applyPortfolioRoute(true);
});

document.querySelectorAll(".project-hub-item").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty("--mx", `${x.toFixed(1)}%`);
    item.style.setProperty("--my", `${y.toFixed(1)}%`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--mx", "50%");
    item.style.setProperty("--my", "50%");
  });
});


document.querySelectorAll("[data-effect-viewer]").forEach((viewer) => {
  const stage = viewer.querySelector(".effect-viewer-stage");
  const result = viewer.querySelector("[data-effect-result]");
  const source = viewer.querySelector("[data-effect-source]");
  const title = viewer.querySelector("[data-effect-title]");
  const kicker = viewer.querySelector("[data-effect-kicker]");
  const desc = viewer.querySelector("[data-effect-desc]");
  const thumbs = viewer.querySelectorAll(".effect-thumb");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((entry) => entry.classList.toggle("is-active", entry === thumb));
      stage.classList.add("is-switching");

      window.setTimeout(() => {
        result.src = thumb.dataset.result;
        source.src = thumb.dataset.source;
        title.textContent = thumb.dataset.title;
        kicker.textContent = thumb.dataset.kicker;
        desc.textContent = thumb.dataset.desc;
        stage.classList.remove("is-switching");
      }, 120);
    });
  });
});


document.querySelectorAll("[data-effects-browser]").forEach((browser) => {
  const tabs = [...browser.querySelectorAll("[data-effects-tab]")];
  const panels = [...browser.querySelectorAll("[data-effects-panel]")];
  let activeIndex = Math.max(0, tabs.findIndex((tab) => tab.classList.contains("is-active")));

  const setActiveEffectsPanel = (index) => {
    activeIndex = (index + tabs.length) % tabs.length;
    const target = tabs[activeIndex].dataset.effectsTab;
    browser.dataset.activeEffectsPanel = target;

    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.effectsTab === target);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.effectsPanel === target);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      setActiveEffectsPanel(index);
    });
  });

  setActiveEffectsPanel(activeIndex);
});

document.querySelectorAll("[data-collapse-library]").forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.closest("details");
    if (!details) return;
    details.open = false;
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-home-shade]").forEach((control) => {
  const handle = control.querySelector(".airplane-window-handle");
  const windowFrame = control.querySelector(".airplane-window");
  let startY = 0;
  let startProgress = 0;
  let progress = 0;
  let dragging = false;
  let suppressClickUntil = 0;

  const getTravel = () => Math.max(1, windowFrame.clientHeight - 122);

  const applyDragPosition = (nextProgress) => {
    const travel = getTravel();
    const shadeOffset = -(windowFrame.clientHeight - 82) * (1 - nextProgress);
    control.style.setProperty("--shade-y", `${shadeOffset}px`);
    control.style.setProperty("--handle-y", `${52 + travel * nextProgress}px`);
  };

  const setShade = (closed) => {
    control.classList.toggle("is-closed", closed);
    document.body.classList.toggle("home-shade-closed", closed);
    handle.setAttribute("aria-pressed", String(closed));
    handle.setAttribute("aria-label", closed ? "推起遮光板切换白色背景" : "拉下遮光板切换黑色背景");
    progress = closed ? 1 : 0;
    control.style.removeProperty("--shade-y");
    control.style.removeProperty("--handle-y");
  };

  handle.addEventListener("click", () => {
    if (dragging || performance.now() < suppressClickUntil) return;
    setShade(!control.classList.contains("is-closed"));
  });
  handle.addEventListener("pointerdown", (event) => {
    startY = event.clientY;
    const travel = getTravel();
    const renderedTop = Number.parseFloat(getComputedStyle(handle).top);
    startProgress = Number.isFinite(renderedTop)
      ? Math.max(0, Math.min(1, (renderedTop - 52) / travel))
      : (control.classList.contains("is-closed") ? 1 : 0);
    progress = startProgress;
    dragging = false;
    // Seed the drag variables before enabling the drag rules. Without this,
    // the first pointerdown briefly resolves var() to an invalid value and
    // makes the shade jump to its untransformed position.
    applyDragPosition(progress);
    control.classList.add("is-dragging");
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener("pointermove", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    const travel = getTravel();
    progress = Math.max(0, Math.min(1, startProgress + (event.clientY - startY) / travel));
    if (Math.abs(event.clientY - startY) > 4) dragging = true;
    applyDragPosition(progress);
  });
  handle.addEventListener("pointerup", (event) => {
    handle.releasePointerCapture(event.pointerId);
    if (dragging) suppressClickUntil = performance.now() + 500;
    const shouldClose = progress > 0.5;
    // Select the destination while the shade is still held at its exact drag
    // position, then release it on the next frame so CSS animates one clean
    // segment to the nearest endpoint.
    control.classList.toggle("is-closed", shouldClose);
    document.body.classList.toggle("home-shade-closed", shouldClose);
    handle.setAttribute("aria-pressed", String(shouldClose));
    handle.setAttribute("aria-label", shouldClose ? "推起遮光板切换白色背景" : "拉下遮光板切换黑色背景");
    progress = shouldClose ? 1 : 0;
    window.requestAnimationFrame(() => {
      control.classList.remove("is-dragging");
      control.style.removeProperty("--shade-y");
      control.style.removeProperty("--handle-y");
    });
    window.setTimeout(() => { dragging = false; }, 0);
  });
  handle.addEventListener("pointercancel", () => {
    setShade(startProgress === 1);
    control.classList.remove("is-dragging");
  });

  // Always enter the page with the shade visibly raised; the handle remains
  // clickable and draggable for switching between the two states.
  setShade(false);
});

const officePluginModes = {
  chat: {
    source: "正在追踪 · 4 个飞书空间",
    title: "你离开后，4 件事变了",
    summary: "其中 2 项会影响你的工作：需要补暗色模式，并在周三前完成封面动效。",
    messages: [["群", "封面方向由 B 改为 A"], ["会", "评审提前到周四上午"], ["档", "新增暗色模式交付项"], ["任", "你的截止时间提前 1 天"]],
    actions: [["交付时间提前 1 天", "来自：产品周会 · 10:42", "影响你"], ["新增暗色模式", "来自：需求文档 v12", "影响你"], ["封面方向改为 A", "来自：项目群 · Min", "已确认"]]
  },
  meeting: {
    source: "冲突检查 · 群聊 / 会议 / 文档",
    title: "同一件事，出现了两个版本",
    summary: "上线日期存在冲突：周会记录为 9 月 12 日，需求文档仍写 9 月 15 日；目前还没有负责人确认。",
    messages: [["会", "9 月 12 日进入灰度"], ["档", "计划 9 月 15 日上线"], ["群", "素材周五才能齐"], ["任", "验收截止 9 月 11 日"]],
    actions: [["上线日期不一致", "会议 9/12 · 文档 9/15", "待确认"], ["素材时间存在风险", "素材完成晚于验收", "有风险"], ["@ 项目负责人确认", "保留两处原始出处", "可发送"]]
  },
  doc: {
    source: "智能交接 · 最近 14 天项目上下文",
    title: "这些事，交接文档里没写",
    summary: "Relay 找到 3 条隐性信息：品牌方不接受高饱和蓝、研发暂不支持实时预览，以及周五需要给海外团队预演。",
    messages: [["群", "蓝色不要再提高饱和度"], ["会", "实时预览排到下一期"], ["私", "周五先给海外团队预演"], ["档", "交接文档尚未记录"]],
    actions: [["补充品牌限制", "关联：品牌反馈群", "待写入"], ["标注能力边界", "关联：技术评审会议", "待写入"], ["加入海外预演", "关联：项目日历", "待写入"]]
  }
};

document.querySelectorAll("[data-office-plugin]").forEach((plugin) => {
  const windowPanel = plugin.querySelector(".office-plugin-window");
  const sourceLabel = plugin.querySelector("[data-plugin-source-label]");
  const messages = plugin.querySelector("[data-plugin-messages]");
  const title = plugin.querySelector("[data-plugin-title]");
  const summary = plugin.querySelector("[data-plugin-summary]");
  const actions = plugin.querySelector("[data-plugin-actions]");
  const runButton = plugin.querySelector("[data-plugin-run]");

  const renderMode = (modeName) => {
    const mode = officePluginModes[modeName];
    if (!mode) return;
    sourceLabel.textContent = mode.source;
    title.textContent = mode.title;
    summary.textContent = mode.summary;
    messages.innerHTML = mode.messages.map(([name, copy]) => `<p><b>${name}</b><span>${copy}</span></p>`).join("");
    actions.innerHTML = mode.actions.map(([task, owner, status], index) => `<article><i>0${index + 1}</i><div><strong>${task}</strong><span>${owner}</span></div><b>${status}</b></article>`).join("");
    windowPanel.classList.remove("is-running");
    window.requestAnimationFrame(() => windowPanel.classList.add("is-running"));
    window.setTimeout(() => windowPanel.classList.remove("is-running"), 1350);
  };

  plugin.querySelectorAll("[data-plugin-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      plugin.querySelectorAll("[data-plugin-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
      renderMode(button.dataset.pluginMode);
    });
  });
  runButton.addEventListener("click", () => {
    const activeMode = plugin.querySelector("[data-plugin-mode].is-active");
    renderMode(activeMode ? activeMode.dataset.pluginMode : "chat");
  });
});

const fitlabCatalog = {
  top: {
    blue: { label: "短夹克", mood: "COBALT" },
    cream: { label: "针织衫", mood: "SOFT" },
    lime: { label: "宽衬衫", mood: "FRESH" }
  },
  bottom: {
    charcoal: { label: "阔腿裤", mood: "CITY" },
    denim: { label: "牛仔裤", mood: "DAILY" },
    orange: { label: "半身裙", mood: "PLAY" }
  },
  shoes: {
    silver: { label: "运动鞋" },
    black: { label: "乐福鞋" }
  },
  accessory: {
    bag: { label: "红色小包" },
    cap: { label: "棒球帽" }
  }
};

document.querySelectorAll("[data-fitlab]").forEach((app) => {
  const preview = app.querySelector(".fitlab-preview");
  const look = app.querySelector("[data-fitlab-look]");
  const items = app.querySelector("[data-fitlab-items]");
  const shuffle = app.querySelector("[data-fitlab-shuffle]");
  const save = app.querySelector("[data-fitlab-save]");

  const renderLook = () => {
    const values = {
      top: preview.dataset.top,
      bottom: preview.dataset.bottom,
      shoes: preview.dataset.shoes,
      accessory: preview.dataset.accessory
    };
    look.textContent = `${fitlabCatalog.top[values.top].mood} / ${fitlabCatalog.bottom[values.bottom].mood}`;
    items.textContent = Object.entries(values).map(([group, value]) => fitlabCatalog[group][value].label).join(" · ");
    app.querySelectorAll("[data-fitlab-option]").forEach((button) => {
      button.classList.toggle("is-active", values[button.dataset.fitlabOption] === button.dataset.value);
    });
  };

  app.querySelectorAll("[data-fitlab-option]").forEach((button) => {
    button.addEventListener("click", () => {
      preview.dataset[button.dataset.fitlabOption] = button.dataset.value;
      save.classList.remove("is-saved");
      save.textContent = "♡";
      renderLook();
    });
  });

  shuffle.addEventListener("click", () => {
    Object.entries(fitlabCatalog).forEach(([group, options]) => {
      const values = Object.keys(options);
      preview.dataset[group] = values[Math.floor(Math.random() * values.length)];
    });
    shuffle.classList.remove("is-shuffling");
    void shuffle.offsetWidth;
    shuffle.classList.add("is-shuffling");
    save.classList.remove("is-saved");
    save.textContent = "♡";
    renderLook();
  });

  save.addEventListener("click", () => {
    const saved = save.classList.toggle("is-saved");
    save.textContent = saved ? "♥" : "♡";
    save.setAttribute("aria-label", saved ? "取消收藏当前穿搭" : "收藏当前穿搭");
  });

  renderLook();
});
