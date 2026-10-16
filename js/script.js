const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

requestAnimationFrame(() => document.body.classList.add("is-loaded"));

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const quoteForm = document.querySelector("[data-quote-form]");
quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quoteForm);
  const message = [
    "Hi Baruch Caterers, I would like to get a quote for my event.",
    `Name: ${formData.get("name") || ""}`,
    `Phone: ${formData.get("phone") || ""}`,
    `Event Type: ${formData.get("event") || ""}`,
    `Guests: ${formData.get("guests") || ""}`,
    `Message: ${formData.get("message") || ""}`
  ].join("\n");

  window.open(`https://wa.me/919087618761?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

const menuPage = document.querySelector(".menu-page");

if (menuPage) {
  const filterButtons = document.querySelectorAll("[data-menu-filter] button");
  const filterItems = document.querySelectorAll(".package-card[data-type], .signature-card[data-type]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      filterItems.forEach((item) => {
        const type = item.dataset.type;
        const visible = filter === "all" || type === filter || type === "all";
        item.classList.toggle("is-hidden", !visible);
      });
      window.ScrollTrigger?.refresh();
    });
  });

  const mealMenu = document.querySelector("[data-meal-menu]");
  const mealButtons = mealMenu?.querySelectorAll("[data-meal-filter]");
  const mealBlocks = mealMenu?.querySelectorAll("[data-meal]");
  const showMeal = (meal) => {
    mealButtons?.forEach((button) => button.classList.toggle("active", button.dataset.mealFilter === meal));
    mealBlocks?.forEach((block) => {
      const visible = block.dataset.meal === meal;
      block.classList.toggle("is-hidden", !visible);
      if (visible && window.gsap) {
        gsap.fromTo(block, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" });
      }
    });
    window.ScrollTrigger?.refresh();
  };

  if (mealButtons?.length && mealBlocks?.length) {
    mealButtons.forEach((button) => {
      button.addEventListener("click", () => showMeal(button.dataset.mealFilter));
    });
    showMeal("morning");
  }

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = lightbox?.querySelector("img");
  const closeLightbox = () => lightbox?.classList.remove("is-open");
  document.querySelectorAll("[data-lightbox-gallery] .gallery-shot").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = button.dataset.src;
      lightboxImage.alt = button.querySelector("img")?.alt || "Baruch Caterers gallery image";
      lightbox.classList.add("is-open");
    });
  });
  document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  const testimonials = [...document.querySelectorAll(".menu-testimonial")];
  const dotsWrap = document.querySelector("[data-slider-dots]");
  let activeTestimonial = 0;
  const showTestimonial = (index) => {
    activeTestimonial = index;
    testimonials.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
    dotsWrap?.querySelectorAll("button").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
    const active = testimonials[index];
    if (window.gsap && active) {
      gsap.fromTo(active, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" });
    }
  };

  if (testimonials.length && dotsWrap) {
    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
      dot.addEventListener("click", () => showTestimonial(index));
      dotsWrap.appendChild(dot);
    });
    showTestimonial(0);
    window.setInterval(() => showTestimonial((activeTestimonial + 1) % testimonials.length), 5000);
  }

  const builder = document.querySelector("[data-menu-builder]");
  const builderForm = builder?.querySelector(".builder-form");
  const summaryValues = builder?.querySelectorAll("[data-builder-summary] dd");
  const emailQuote = builder?.querySelector("[data-email-quote]");
  const getBuilderData = () => {
    if (!builderForm) return null;
    const data = new FormData(builderForm);
    return {
      event: data.get("event") || "Not specified",
      food: data.get("food") || "Not specified",
      guests: data.get("guests") || "Not specified",
      cuisine: data.get("cuisine") || "Not specified",
      packageName: data.get("package") || "Not specified",
      items: data.getAll("items"),
      requirements: data.get("requirements") || "Not specified"
    };
  };

  const updateSummary = () => {
    if (!builderForm || !summaryValues?.length) return;
    const data = getBuilderData();
    if (!data) return;
    const values = [
      data.event,
      data.food,
      data.guests,
      data.cuisine,
      data.packageName,
      data.items.length ? data.items.join(", ") : "Select preferred items",
      data.requirements
    ];
    summaryValues.forEach((item, index) => {
      item.textContent = values[index];
    });
  };

  const updateEmailQuote = () => {
    if (!emailQuote) return;
    const data = getBuilderData();
    if (!data) return;
    const body = [
      "Hi Baruch Caterers,",
      "",
      "I would like to request a personalized quotation for my event.",
      "",
      `Event Type: ${data.event}`,
      `Food Type: ${data.food}`,
      `Guest Count: ${data.guests}`,
      `Preferred Cuisine: ${data.cuisine}`,
      `Selected Package: ${data.packageName}`,
      `Preferred Menu Items: ${data.items.length ? data.items.join(", ") : "Not specified"}`,
      `Special Requirements: ${data.requirements}`,
      "",
      "Please contact me with the quotation.",
      "",
      "Thank you."
    ].join("\n");
    const subject = `Baruch Caterers Quote Request - ${data.packageName}`;
    emailQuote.href = `mailto:info@baruchcaterers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  builderForm?.addEventListener("input", updateSummary);
  builderForm?.addEventListener("change", updateSummary);
  builderForm?.addEventListener("input", updateEmailQuote);
  builderForm?.addEventListener("change", updateEmailQuote);
  updateSummary();
  updateEmailQuote();
}

(() => {
  const prefersReducedMotion = false;
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const motionSelector = [
    ".reveal",
    ".section-heading",
    ".section-copy",
    ".rich-text",
    ".service-card",
    ".why-card",
    ".testimonial",
    ".announcement-card",
    ".contact-card",
    ".contact-details",
    ".process-step",
    ".food-card",
    ".gallery-grid img",
    ".event-tile",
    ".menu-package-card",
    ".day-menu-block",
    ".package-card",
    ".cuisine-card",
    ".flow-step",
    ".signature-card",
    ".live-card",
    ".gallery-shot",
    ".stat-menu",
    ".menu-faq details",
    ".builder-form",
    ".builder-summary",
    ".founder-photo",
    ".quote-form"
  ].join(",");

  const motionItems = [...document.querySelectorAll(motionSelector)];
  motionItems.forEach((item) => {
    if (!item.classList.contains("reveal")) item.classList.add("motion-reveal");
  });

  const animateCountersFallback = () => {
    const counters = document.querySelectorAll("[data-counter]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = Number(counter.dataset.countTo || 0);
        counter.textContent = `${target}${counter.dataset.countSuffix || ""}`;
        observer.unobserve(counter);
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => observer.observe(counter));
  };

  if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
    document.body.classList.add("is-loaded");
    progress.style.transform = "scaleX(1)";
    motionItems.forEach((item) => item.classList.add("is-visible"));
    animateCountersFallback();
  } else {
    gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  gsap.to(progress, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2
    }
  });

  motionItems.forEach((item) => item.classList.add("is-visible"));

  document.querySelectorAll("[data-counter]").forEach((counter) => {
    const target = Number(counter.dataset.countTo || 0);
    const suffix = counter.dataset.countSuffix || "";
    const value = { amount: 0 };
    ScrollTrigger.create({
      trigger: counter,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(value, {
          amount: target,
          duration: 1.25,
          ease: "power3.out",
          onUpdate: () => {
            counter.textContent = `${Math.round(value.amount)}${suffix}`;
          }
        });
      }
    });
  });

  gsap.to(".hero-bg img", {
    yPercent: 8,
    scale: 1.06,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".hero-card", {
    yPercent: -7,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  const heroSlides = gsap.utils.toArray(".hero-showcase-slide");
  if (heroSlides.length > 1) {
    const captionLabel = document.querySelector("[data-hero-caption-label]");
    const captionTitle = document.querySelector("[data-hero-caption-title]");
    const setHeroCaption = (slide) => {
      if (!captionLabel || !captionTitle || !slide) return;
      gsap.to([captionLabel, captionTitle], {
        y: 8,
        autoAlpha: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          captionLabel.textContent = slide.dataset.captionLabel || "";
          captionTitle.textContent = slide.dataset.captionTitle || "";
          gsap.fromTo([captionLabel, captionTitle], { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.04, ease: "power3.out" });
        }
      });
    };

    gsap.set(heroSlides, { autoAlpha: 0, scale: 1.04, zIndex: 1 });
    gsap.set(heroSlides[0], { autoAlpha: 1, scale: 1, zIndex: 2 });
    const heroSlider = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });
    heroSlides.forEach((slide, index) => {
      const next = heroSlides[(index + 1) % heroSlides.length];
      heroSlider
        .to(slide, { scale: 1.035, duration: 3.4, ease: "none" })
        .set(next, { zIndex: 3, scale: 1.045 }, "<")
        .call(() => setHeroCaption(next), null, ">-0.62")
        .to(next, { autoAlpha: 1, scale: 1, duration: 0.9 }, ">-0.45")
        .set(slide, { autoAlpha: 0, zIndex: 1 })
        .set(next, { zIndex: 2 });
    });
  }

  gsap.to(".menu-hero-media", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: ".menu-hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  document.querySelectorAll(".service-card, .why-card, .testimonial, .package-card, .event-tile, .signature-card, .live-card, .stat-menu, .food-card, .cuisine-card, .contact-card").forEach((card) => {
    card.addEventListener("pointerenter", () => gsap.to(card, { y: -10, scale: 1.012, duration: 0.28, ease: "power2.out" }));
    card.addEventListener("pointerleave", () => gsap.to(card, { y: 0, scale: 1, duration: 0.32, ease: "power2.out" }));
  });
  }

  const sweetsDialog = document.querySelector("#sweets-varieties-dialog");
  const sweetsTrigger = document.querySelector("[data-open-sweets]");
  const sweetsClose = document.querySelector("[data-close-sweets]");
  const sweetsBack = document.querySelector("[data-back-to-sweets]");
  const sweetsSearch = document.querySelector("[data-sweets-search]");
  const sweetsSearchClear = document.querySelector("[data-sweets-search-clear]");
  const sweetsEmpty = document.querySelector("[data-sweets-empty]");
  if (sweetsDialog && sweetsTrigger) {
    const sweetsSections = sweetsDialog.querySelectorAll("[data-sweets-section]");
    const filterSweetItems = () => {
      if (!sweetsSearch) return;
      const query = sweetsSearch.value.toLocaleLowerCase().trim();
      let visibleRows = 0;
      sweetsSections.forEach((section) => {
        let sectionMatches = 0;
        section.querySelectorAll("[data-sweets-item-list] li").forEach((row) => {
          const matches = row.textContent.toLocaleLowerCase().includes(query);
          row.hidden = !matches;
          if (matches) {
            sectionMatches += 1;
            visibleRows += 1;
          }
        });
        section.hidden = sectionMatches === 0;
      });
      if (sweetsSearchClear) sweetsSearchClear.hidden = !query;
      if (sweetsEmpty) sweetsEmpty.hidden = visibleRows > 0;
    };
    const resetSweetsCatalogue = () => {
      if (sweetsSearch) sweetsSearch.value = "";
      if (sweetsEmpty) sweetsEmpty.hidden = true;
      if (sweetsSearchClear) sweetsSearchClear.hidden = true;
      filterSweetItems();
    };
    const openSweetsDialog = () => {
      resetSweetsCatalogue();
      sweetsDialog.showModal();
      document.body.classList.add("dialog-open");
      sweetsSearch?.focus();
    };
    const closeSweetsDialog = () => {
      sweetsDialog.close();
      document.body.classList.remove("dialog-open");
      sweetsTrigger.focus();
    };

    sweetsTrigger.addEventListener("click", openSweetsDialog);
    sweetsTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSweetsDialog();
      }
    });
    sweetsClose?.addEventListener("click", closeSweetsDialog);
    sweetsBack?.addEventListener("click", closeSweetsDialog);
    sweetsSearch?.addEventListener("input", filterSweetItems);
    sweetsSearchClear?.addEventListener("click", () => {
      sweetsSearch.value = "";
      sweetsSearch.focus();
      filterSweetItems();
    });
    sweetsDialog.addEventListener("click", (event) => {
      if (event.target === sweetsDialog) closeSweetsDialog();
    });
    sweetsDialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });
  }

  const dietTabs = document.querySelectorAll("[data-menu-diet-tab]");
  const dietPanels = document.querySelectorAll("[data-menu-diet-panel]");
  const selectDietPanel = (diet) => {
    dietTabs.forEach((tab) => {
      const selected = tab.dataset.menuDietTab === diet;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    dietPanels.forEach((panel) => {
      panel.hidden = panel.dataset.menuDietPanel !== diet;
    });
  };
  dietTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectDietPanel(tab.dataset.menuDietTab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = dietTabs[(index + direction + dietTabs.length) % dietTabs.length];
      selectDietPanel(next.dataset.menuDietTab);
      next.focus();
    });
  });

  const categoryMenuDialog = document.querySelector("#category-menu-dialog");
  const vegetarianMenuData = Array.isArray(window.BARUCH_MENU_DATA) ? window.BARUCH_MENU_DATA : [];
  const nonVegetarianMenuData = Array.isArray(window.BARUCH_NON_VEG_MENU_DATA) ? window.BARUCH_NON_VEG_MENU_DATA : [];
  const categoryMenuData = [...vegetarianMenuData, ...nonVegetarianMenuData];
  const categoryMenuTriggers = document.querySelectorAll("[data-menu-category]");
  if (categoryMenuDialog && categoryMenuData.length && categoryMenuTriggers.length) {
    const categoryTitle = categoryMenuDialog.querySelector("[data-category-menu-title]");
    const categoryPeriod = categoryMenuDialog.querySelector("[data-category-menu-period]");
    const categoryCount = categoryMenuDialog.querySelector("[data-category-menu-count]");
    const categoryImage = categoryMenuDialog.querySelector("[data-category-menu-image]");
    const categoryList = categoryMenuDialog.querySelector("[data-category-menu-list]");
    const categorySearch = categoryMenuDialog.querySelector("[data-category-menu-search]");
    const categoryClear = categoryMenuDialog.querySelector("[data-category-menu-clear]");
    const categoryEmpty = categoryMenuDialog.querySelector("[data-category-menu-empty]");
    const categoryBack = categoryMenuDialog.querySelector("[data-category-menu-back]");
    const categoryClose = categoryMenuDialog.querySelector("[data-category-menu-close]");
    let activeCategory = null;
    let activeCategoryTrigger = null;

    const renderCategoryItems = () => {
      const query = (categorySearch.value || "").toLocaleLowerCase().trim();
      const items = activeCategory
        ? activeCategory.items.filter((item) => item.toLocaleLowerCase().includes(query))
        : [];
      categoryList.replaceChildren();
      items.forEach((item, index) => {
        const li = document.createElement("li");
        const number = document.createElement("span");
        const label = document.createElement("span");
        number.className = "category-menu-item-number";
        number.textContent = String(index + 1).padStart(2, "0");
        label.textContent = item;
        li.append(number, label);
        categoryList.append(li);
      });
      categoryList.hidden = items.length === 0;
      categoryEmpty.hidden = items.length > 0;
      categoryClear.hidden = !query;
    };

    const closeCategoryMenu = () => {
      categoryMenuDialog.close();
      document.body.classList.remove("dialog-open");
      activeCategoryTrigger?.focus();
    };

    const openCategoryMenu = (trigger) => {
      const requestedTitle = trigger.dataset.menuCategory;
      activeCategory = categoryMenuData.find((section) => section.title === requestedTitle);
      if (!activeCategory) return;
      activeCategoryTrigger = trigger;
      const triggerImage = trigger.querySelector("img");
      categoryTitle.textContent = activeCategory.title;
      categoryPeriod.textContent = activeCategory.period;
      categoryCount.textContent = activeCategory.items.length;
      categoryMenuDialog.dataset.activeMenuDiet = activeCategory.diet || trigger.dataset.menuDiet || "Veg";
      categoryImage.src = triggerImage?.currentSrc || triggerImage?.src || "";
      categoryImage.alt = `${activeCategory.title} menu`;
      categorySearch.value = "";
      renderCategoryItems();
      categoryMenuDialog.showModal();
      document.body.classList.add("dialog-open");
      const panel = categoryMenuDialog.querySelector(".category-menu-panel");
      if (panel) panel.scrollTop = 0;
    };

    categoryMenuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openCategoryMenu(trigger));
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCategoryMenu(trigger);
        }
      });
    });
    categorySearch.addEventListener("input", renderCategoryItems);
    categoryClear.addEventListener("click", () => {
      categorySearch.value = "";
      categorySearch.focus();
      renderCategoryItems();
    });
    categoryBack.addEventListener("click", closeCategoryMenu);
    categoryClose.addEventListener("click", closeCategoryMenu);
    categoryMenuDialog.addEventListener("click", (event) => {
      if (event.target === categoryMenuDialog) closeCategoryMenu();
    });
    categoryMenuDialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });
  }

})();

/* Custom menu selector and QR sharing */
(() => {
  if (!document.body.classList.contains("menu-page")) return;

  const selections = new Map();
  const selector = "#sweets-varieties-dialog [data-sweets-item-list] li, #category-menu-dialog [data-category-menu-list] li";

  const selectionBar = document.createElement("div");
  selectionBar.className = "custom-menu-bar";
  selectionBar.innerHTML = `
    <div>
      <span class="custom-menu-count" data-custom-menu-count>0</span>
      <span>items selected</span>
    </div>
    <button type="button" class="btn btn-primary" data-open-custom-menu disabled>Click to Get Customised Menu</button>
  `;
  document.body.append(selectionBar);

  const addDialogSelectionBar = (dialogSelector) => {
    const panel = document.querySelector(`${dialogSelector} > div`);
    if (!panel) return;
    const bar = document.createElement("div");
    bar.className = "custom-menu-dialog-bar";
    bar.innerHTML = `
      <div><strong data-dialog-selection-count>0</strong> items selected</div>
      <div class="custom-menu-dialog-bar-actions">
        <button type="button" class="btn btn-secondary" data-continue-menu-selection>
          <i class="fa-solid fa-arrow-left"></i> Continue Selecting Other Categories
        </button>
        <button type="button" class="btn btn-primary" data-review-custom-menu disabled>
          Review Complete List & Generate QR
        </button>
      </div>
    `;
    panel.append(bar);
  };
  addDialogSelectionBar("#sweets-varieties-dialog");
  addDialogSelectionBar("#category-menu-dialog");

  const customDialog = document.createElement("dialog");
  customDialog.className = "custom-menu-dialog";
  customDialog.setAttribute("aria-labelledby", "custom-menu-dialog-title");
  customDialog.innerHTML = `
    <div class="custom-menu-dialog-panel">
      <div class="custom-menu-dialog-topbar">
        <div>
          <span class="eyebrow">Your Selection</span>
          <h2 id="custom-menu-dialog-title">Customised Menu</h2>
        </div>
        <button type="button" class="custom-menu-dialog-close" data-close-custom-menu aria-label="Close customised menu">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
      <div class="custom-menu-output">
        <div class="custom-menu-summary" data-custom-menu-summary></div>
        <div class="custom-menu-qr-wrap">
          <div class="custom-menu-qr" data-custom-menu-qr></div>
          <p>Save and Share this QR code to  WhatsApp Number <strong>9087618761</strong> to receive your customised menu quotation.</p>
          <p class="custom-menu-qr-error" data-custom-menu-qr-error hidden></p>
        </div>
      </div>
      <div class="custom-menu-actions">
               <button type="button" class="btn btn-secondary" data-share-menu-qr><i class="fa-solid fa-share-nodes"></i> Share QR</button>
        <button type="button" class="custom-menu-clear" data-clear-custom-menu>Clear Selection</button>
      </div>
    </div>
  `;
  document.body.append(customDialog);

  const countOutput = selectionBar.querySelector("[data-custom-menu-count]");
  const openButton = selectionBar.querySelector("[data-open-custom-menu]");
  const summaryOutput = customDialog.querySelector("[data-custom-menu-summary]");
  const qrOutput = customDialog.querySelector("[data-custom-menu-qr]");
  const qrError = customDialog.querySelector("[data-custom-menu-qr-error]");
  const overview = document.querySelector("[data-selected-menu-overview]");
  const overviewCount = document.querySelector("[data-selected-overview-count]");
  const overviewGroups = document.querySelector("[data-selected-overview-groups]");

  const getRowData = (row) => {
    const label = row.querySelector("span:last-child")?.textContent.trim() || row.textContent.trim();
    const sweetsSection = row.closest("[data-sweets-section]");
    const category = sweetsSection
      ? sweetsSection.querySelector(".sweets-category-heading h3")?.textContent.trim()
      : document.querySelector("[data-category-menu-title]")?.textContent.trim();
    const diet = sweetsSection
      ? "Veg"
      : document.querySelector("#category-menu-dialog")?.dataset.activeMenuDiet || "Veg";
    return category && label ? { diet, category, label, key: `${diet}|||${category}|||${label}` } : null;
  };

  const syncRows = () => {
    document.querySelectorAll(selector).forEach((row) => {
      const data = getRowData(row);
      const selected = data ? selections.has(data.key) : false;
      row.classList.toggle("is-menu-selected", selected);
      row.setAttribute("role", "checkbox");
      row.setAttribute("tabindex", "0");
      row.setAttribute("aria-checked", String(selected));
    });
  };

  const renderSelectionOverview = () => {
    if (!overview || !overviewGroups || !overviewCount) return;
    overview.hidden = selections.size === 0;
    overviewCount.textContent = `${selections.size} item${selections.size === 1 ? "" : "s"}`;
    overviewGroups.replaceChildren();
    const grouped = new Map();
    selections.forEach((item) => {
      const groupKey = `${item.diet}|||${item.category}`;
      if (!grouped.has(groupKey)) grouped.set(groupKey, { diet: item.diet, category: item.category, items: [] });
      grouped.get(groupKey).items.push(item);
    });
    grouped.forEach(({ diet, category, items }) => {
      const section = document.createElement("section");
      const heading = document.createElement("h4");
      const list = document.createElement("div");
      heading.innerHTML = `<span class="menu-diet-label ${diet === "Non-Veg" ? "is-non-veg" : "is-veg"}">${diet}</span> ${category}`;
      list.className = "selected-menu-overview-items";
      items.forEach((item) => {
        const chip = document.createElement("span");
        const label = document.createElement("span");
        const remove = document.createElement("button");
        label.textContent = item.label;
        remove.type = "button";
        remove.dataset.removeMenuSelection = item.key;
        remove.setAttribute("aria-label", `Remove ${item.label}`);
        remove.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
        chip.append(label, remove);
        list.append(chip);
      });
      section.append(heading, list);
      overviewGroups.append(section);
    });
  };

  const updateBar = () => {
    const count = selections.size;
    countOutput.textContent = String(count);
    openButton.disabled = count === 0;
    selectionBar.classList.toggle("is-active", count > 0);
    document.querySelectorAll("[data-dialog-selection-count]").forEach((output) => {
      output.textContent = String(count);
    });
    document.querySelectorAll("[data-review-custom-menu]").forEach((button) => {
      button.disabled = count === 0;
    });
    renderSelectionOverview();
  };

  const toggleRow = (row) => {
    const data = getRowData(row);
    if (!data) return;
    if (selections.has(data.key)) selections.delete(data.key);
    else selections.set(data.key, data);
    syncRows();
    updateBar();
  };

  document.addEventListener("click", (event) => {
    const row = event.target.closest(selector);
    if (row) toggleRow(row);
    const removeButton = event.target.closest("[data-remove-menu-selection]");
    if (removeButton) {
      selections.delete(removeButton.dataset.removeMenuSelection);
      syncRows();
      updateBar();
    }
  });

  document.querySelectorAll("[data-continue-menu-selection]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("dialog")?.close();
      document.querySelector("#cuisines")?.scrollIntoView({ block: "start" });
    });
  });

  document.addEventListener("keydown", (event) => {
    const row = event.target.closest?.(selector);
    if (row && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      toggleRow(row);
    }
  });

  const categoryList = document.querySelector("[data-category-menu-list]");
  if (categoryList) new MutationObserver(syncRows).observe(categoryList, { childList: true });
  syncRows();
  updateBar();

  const buildMenuListText = () => {
    const grouped = new Map();
    selections.forEach(({ diet, category, label }) => {
      const groupKey = `${diet}|||${category}`;
      if (!grouped.has(groupKey)) grouped.set(groupKey, { diet, category, items: [] });
      grouped.get(groupKey).items.push(label);
    });
    const lines = ["BARUCH CATERERS", "CUSTOMISED SELECTED MENU", ""];
    grouped.forEach(({ diet, category, items }) => {
      lines.push(`[${diet}] ${category}:`);
      items.forEach((item) => lines.push(`• ${item}`));
      lines.push("");
    });
    lines.push(`Total selected items: ${selections.size}`);
    return lines.join("\n");
  };

  const buildMessage = () => [
    "Hi Baruch Caterers,",
    "",
    "I would like a customised menu quotation for these selections:",
    "",
    buildMenuListText()
  ].join("\n");

  const renderSummary = () => {
    const grouped = new Map();
    selections.forEach(({ diet, category, label }) => {
      const groupKey = `${diet}|||${category}`;
      if (!grouped.has(groupKey)) grouped.set(groupKey, { diet, category, items: [] });
      grouped.get(groupKey).items.push(label);
    });
    summaryOutput.replaceChildren();
    grouped.forEach(({ diet, category, items }) => {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      const list = document.createElement("ul");
      heading.innerHTML = `<span class="menu-diet-label ${diet === "Non-Veg" ? "is-non-veg" : "is-veg"}">${diet}</span> ${category}`;
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.append(li);
      });
      section.append(heading, list);
      summaryOutput.append(section);
    });
  };

  const getMasterCatalogue = () => {
    const catalogue = [];
    document.querySelectorAll("#sweets-varieties-dialog [data-sweets-section]").forEach((section) => {
      const category = section.querySelector(".sweets-category-heading h3")?.textContent.trim();
      section.querySelectorAll("[data-sweets-item-list] li").forEach((row) => {
        const label = row.querySelector("span:last-child")?.textContent.trim();
        if (category && label) catalogue.push({ diet: "Veg", category, label, key: `Veg|||${category}|||${label}` });
      });
    });
    const menuData = [
      ...(Array.isArray(window.BARUCH_MENU_DATA) ? window.BARUCH_MENU_DATA : []),
      ...(Array.isArray(window.BARUCH_NON_VEG_MENU_DATA) ? window.BARUCH_NON_VEG_MENU_DATA : [])
    ];
    menuData.forEach(({ title, items, diet = "Veg" }) => {
      (items || []).forEach((label) => {
        catalogue.push({ diet, category: title, label, key: `${diet}|||${title}|||${label}` });
      });
    });
    return catalogue;
  };

  const getStableItemCode = (key) => {
    let hash = 2166136261;
    for (let index = 0; index < key.length; index += 1) {
      hash ^= key.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  };

  const encodeSelectedMenu = () => {
    const grouped = new Map();
    selections.forEach(({ diet, category, label }) => {
      const labelledCategory = `[${diet}] ${category}`;
      if (!grouped.has(labelledCategory)) grouped.set(labelledCategory, []);
      grouped.get(labelledCategory).push(label);
    });
    const json = JSON.stringify([...grouped.entries()]);
    const bytes = new TextEncoder().encode(json);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  };

  const renderQr = () => {
    qrOutput.replaceChildren();
    qrError.hidden = true;
    if (!window.QRCode) {
      qrError.textContent = "QR generator could not load. Please refresh the page and try again.";
      qrError.hidden = false;
      return;
    }
    try {
      const shareUrl = new URL("https://www.baruchcaterers.com/selected-menu.html");
      shareUrl.searchParams.set("menu", encodeSelectedMenu());
      new QRCode(qrOutput, {
        text: shareUrl.toString(),
        width: 260,
        height: 260,
        colorDark: "#11185e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
      });
    } catch {
      qrError.textContent = "The QR could not be generated. Please reduce the selection and try again.";
      qrError.hidden = false;
    }
  };

  const getQrBlob = async () => {
    const canvas = qrOutput.querySelector("canvas");
    if (canvas) return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const image = qrOutput.querySelector("img");
    if (!image) return null;
    const response = await fetch(image.src);
    return await response.blob();
  };

  const openCustomMenu = () => {
    document.querySelectorAll("#sweets-varieties-dialog[open], #category-menu-dialog[open]").forEach((dialog) => dialog.close());
    renderSummary();
    renderQr();
    customDialog.showModal();
    document.body.classList.add("dialog-open");
  };

  openButton.addEventListener("click", openCustomMenu);
  document.querySelector("[data-overview-review]")?.addEventListener("click", openCustomMenu);
  document.querySelectorAll("[data-review-custom-menu]").forEach((button) => {
    button.addEventListener("click", openCustomMenu);
  });

  customDialog.querySelector("[data-close-custom-menu]").addEventListener("click", () => customDialog.close());
  customDialog.addEventListener("click", (event) => {
    if (event.target === customDialog) customDialog.close();
  });
  customDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

  customDialog.querySelector("[data-download-menu-qr]").addEventListener("click", async () => {
    const blob = await getQrBlob();
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "baruch-caterers-custom-menu-qr.png";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  customDialog.querySelector("[data-share-menu-qr]").addEventListener("click", async () => {
    const blob = await getQrBlob();
    if (!blob) return;
    const file = new File([blob], "baruch-caterers-custom-menu-qr.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Baruch Caterers Customised Menu",
        text: "My customised Baruch Caterers menu selection",
        files: [file]
      });
    } else {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
  });

  customDialog.querySelector("[data-clear-custom-menu]").addEventListener("click", () => {
    selections.clear();
    syncRows();
    updateBar();
    customDialog.close();
  });

  const sharedCodes = new URLSearchParams(window.location.search).get("customMenu");
  if (sharedCodes) {
    const catalogue = getMasterCatalogue();
    const codes = sharedCodes.split(".");
    if (codes[0] === "v2") {
      const catalogueByCode = new Map(catalogue.map((item) => [getStableItemCode(item.key), item]));
      codes.slice(1).forEach((code) => {
        const item = catalogueByCode.get(code);
        if (item) selections.set(item.key, item);
      });
    } else {
      codes.forEach((code) => {
        const item = catalogue[Number.parseInt(code, 36)];
        if (item) selections.set(item.key, item);
      });
    }
    if (selections.size) {
      syncRows();
      updateBar();
      setTimeout(openCustomMenu, 0);
    }
  }
})();
