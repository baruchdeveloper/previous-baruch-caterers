/* ==========================================================
   Baruch Caterers - dish card builder

   WHAT IT DOES
   Every dish row (<li>) in the Sweets popup and in the category popup
   gets a photo added at the top. The existing code in script.js keeps
   handling clicks, selection, QR and WhatsApp - we do not touch it.

   HOW IT FINDS A DISH'S PHOTO
   1. Turn the dish name into a "slug":  "Kaju Katli" -> "kaju-katli"
   2. If that slug is listed in js/dish-images.js, the photo is
      assets/images/dishes/kaju-katli.webp
   3. If not, the category photo is shown instead (a safe fallback),
      so no card is ever empty or broken.

   LOAD ORDER (in menu.html): script.js first, then dish-images.js,
   then this file.
   ========================================================== */
(function () {
  "use strict";

  var IMAGE_FOLDER = "assets/images/dishes/";
  var IMAGE_EXTENSION = ".webp";
  var SWEETS_FALLBACK = "assets/images/cuisine-items/sweets-varieties.webp";

  // Set of dish slugs that really have a photo (from js/dish-images.js).
  var available = new Set(Array.isArray(window.BARUCH_DISH_IMAGES) ? window.BARUCH_DISH_IMAGES : []);

  // "Chicken 65 & Rice!" -> "chicken-65-and-rice"
  function slugify(name) {
    return String(name)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // The dish name is the LAST <span> in the row - the same rule script.js uses.
  function getLabel(row) {
    var span = row.querySelector("span:last-child");
    return span ? span.textContent.trim() : "";
  }

  function buildImage(label, fallbackSrc) {
    var slug = slugify(label);
    var hasOwnPhoto = available.has(slug);
    var img = document.createElement("img");
    img.className = "dish-card-img" + (hasOwnPhoto ? "" : " is-fallback");
    img.src = hasOwnPhoto ? IMAGE_FOLDER + slug + IMAGE_EXTENSION : fallbackSrc;
    img.alt = hasOwnPhoto ? label : label + " (photo coming soon)";
    img.width = 400;
    img.height = 300;
    img.loading = "lazy";
    img.decoding = "async";
    // If a listed photo file is missing on the server, swap to the fallback once.
    img.addEventListener("error", function onError() {
      img.removeEventListener("error", onError);
      if (img.src.indexOf(fallbackSrc) === -1) {
        img.classList.add("is-fallback");
        img.src = fallbackSrc;
      }
    });
    return img;
  }

  // Add a photo to every row of a list that does not have one yet.
  function decorate(list, fallbackSrc) {
    if (!list) return;
    list.classList.add("dish-cards");
    list.querySelectorAll(":scope > li").forEach(function (row) {
      if (row.querySelector(".dish-card-img")) return; // already done
      var label = getLabel(row);
      if (!label) return;
      row.prepend(buildImage(label, fallbackSrc));
    });
  }

  // ---- 1. Sweets popup: rows are written directly in menu.html, so run once.
  document
    .querySelectorAll("#sweets-varieties-dialog [data-sweets-item-list]")
    .forEach(function (list) {
      decorate(list, SWEETS_FALLBACK);
    });

  // ---- 2. Every other category: script.js rebuilds the rows each time a
  //         popup opens or the search box changes, so we watch for that.
  var categoryList = document.querySelector("[data-category-menu-list]");
  if (categoryList) {
    var categoryImage = document.querySelector("[data-category-menu-image]");
    var run = function () {
      var fallback = (categoryImage && categoryImage.getAttribute("src")) || SWEETS_FALLBACK;
      decorate(categoryList, fallback);
    };
    new MutationObserver(run).observe(categoryList, { childList: true });
    run();
  }
})();
