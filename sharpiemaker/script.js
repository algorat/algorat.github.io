// Global image container to stack images onto.
const imagesDisplayContainer = document.querySelector(".big-ratitude");
// TODO
const tabContainer = document.querySelector(".rat-tab-container");

const allPages = document.querySelectorAll(".page");

/**
 * All of the clothing types that should NOT stack.
 * i.e. Sharpie should only be able to wear one shirt at a time.
 * Attach a stacking order to them.
 * Higher numbers will draw ABOVE lower numbers.
 */
const soloCategoryClasses = {
  shirt: { zIndex: 13, background: { zIndex: 6 } },
  pants: { zIndex: 12 },
  socks: { zIndex: 9 },
  shoes: {
    zIndex: 10,
    matchCategory: "socks",
    defaultMatch: "socks/bare",
    matches: {
      flat: "-feet.png",
      pumps: "-pumps-feet.png",
    },
  },
  stockings: { zIndex: 8 },
  mouth: { zIndex: 30 },
  eyemakeup: { zIndex: 21 },
  jacket: { zIndex: 25, background: { zIndex: 5 } },
  sleeves: { zIndex: 11 },
  contacts: { zIndex: 18 },
  belts: { zIndex: 14 },
  suspenders: { zIndex: 14 },
  bags: { zIndex: 31 },
  headgear: { zIndex: 31 },
  glasses: { zIndex: 30 },
  nails: { zIndex: 10 },
};

// TODO
let matchState = {};

/**
 * Clothing types that can stack, like jewelry and makeup.
 * Also attach a stacking order to these.
 */
const multiCategoryClasses = {
  jewels: { zIndex: 20 },
  facemakeup: { zIndex: 20 },
  vest: { zIndex: 25 },
  backattachments: { zIndex: 5 },
};

/** All of the clothing classes, as a dict. */
const allClothingClassesDict = {
  ...soloCategoryClasses,
  ...multiCategoryClasses,
};

/** All of the clothing classes shown in randomize, as an array of keys. */
const clothingCategoriesForRandomize = [
  "shirt",
  "pants",
  "shoes",
  "mouth",
  "eyemakeup",
  "sleeves",
  "bags",
  "jewels",
  "facemakeup",
  "nails",
];

// TODO
const loadedUrls = new Set();

/** Randomizes the clothing shown. */
function randomize() {
  reset(false);
  // Display one random item from each category type.
  clothingCategoriesForRandomize.forEach((clothingCategory) => {
    displayRandomItem(clothingCategory);
  });
}

/**
 * Displays a random item from the clothing category.
 * @param category Clothing cateogry to show a random item from.
 * @param numItems Number of random items to show for that category.
 *                 Defaults to 1. Does not overrule the "solo" effect
 *                 of some of the classes.
 */
function displayRandomItem(category) {
  let query = `.option:not(.costume)[data-clothing-category="${category}"]`;
  if (isHalloween) {
    query = `.option[data-clothing-category="${category}"]`;
  }
  const matches = document.querySelectorAll(query);

  const randomIndex = Math.floor(Math.random() * matches.length);
  showItemAndRemoveConflicts(matches[randomIndex]);
}

/** TODO */
function toggleImage(img, visible) {
  if (!visible) {
    img.classList.add("hidden");
    img.setAttribute("aria-hidden", true);
  } else {
    img.classList.remove("hidden");
    img.removeAttribute("aria-hidden");
  }
}

/** Checks if the element is hidden already. */
function isHidden(element) {
  return !element.classList.contains("checked");
}

/** Toggles the "shown" status of the element. */
function toggleFade(element) {
  if (isHidden(element)) {
    showClothingItem(element);
  } else {
    hideClothingItem(element);
  }
}

/**
 * "Hides" the clothing item by setting the status of
 * both the button and the paired image element.
 */
function hideClothingItem(buttonElement) {
  buttonElement.classList.remove("checked");

  const matchingImages = getGameImage(buttonElement);

  matchingImages.forEach((image) => toggleImage(image, false));

  const { matchPrefix, matchPostfix, clothingCategory } = buttonElement.dataset;

  if (matchPrefix !== null && matchPrefix !== undefined) {
    if (matchState[clothingCategory].prefix === matchPrefix) {
      matchState[clothingCategory].prefix =
        matchState[clothingCategory].defaultValue;
    }
  }

  if (matchPostfix !== null && matchPostfix !== undefined) {
    const { matchCategory } = allClothingClassesDict[clothingCategory];
    if (matchState[matchCategory].postfix === matchPostfix) {
      matchState[matchCategory].postfix = Object.keys(
        matchState[matchCategory].filePaths
      )[0];
    }
  }

  updateMatchedState();
}

/**
 * "Shows" the clothing item by setting the status of
 * both the button and the paired image element.
 */
function showClothingItem(buttonElement) {
  buttonElement.classList.add("checked");

  const matchingImages = getGameImage(buttonElement);

  matchingImages.forEach((image) => toggleImage(image, true));

  const { clothingCategory, matchPostfix, matchPrefix } = buttonElement.dataset;

  if (matchPostfix !== undefined && matchPostfix !== null) {
    const { matchCategory } = allClothingClassesDict[clothingCategory];
    matchState[matchCategory].postfix = matchPostfix;
  }

  if (matchPrefix !== undefined && matchPrefix !== null) {
    matchState[clothingCategory].prefix = matchPrefix;
  }

  updateMatchedState();
}

/** TODO */
function updateMatchedState() {
  Object.keys(matchState).forEach((matchKey) => {
    const matchClass = `match-${matchKey}`;
    const matches = document.querySelectorAll(`.${matchClass}:not(.hidden)`);
    matches.forEach((img) => toggleImage(img, false));

    const { prefix, postfix, filePaths } = matchState[matchKey];

    // If postfix is "" then we don't show the match.
    if (postfix.length > 0) {
      const imgUrl = `${prefix}${filePaths[postfix]}`;
      const image = getGameImageWithUrl(imgUrl, matchKey)[0];
      image.classList.add(matchClass);
      toggleImage(image, true);
    }
  });
}

/**
 * Toggles the clothing item on/off and handles clothing conflicts
 * by hiding the others.
 */
function toggleItem(evt) {
  const element = evt.target || evt.srcElement;
  hideConflictingItems(element);
  toggleFade(element);
}

/** Shows the item, but also clears any conflicting items beforehand. */
function showItemAndRemoveConflicts(element) {
  hideConflictingItems(element);
  showClothingItem(element);
}

/** Hides all items that conflict with the current one. */
function hideConflictingItems(element) {
  // Hide all conflicting elements.
  let clothingCategory = element.dataset.clothingCategory;

  if (!(clothingCategory in soloCategoryClasses)) {
    return;
  }

  const matches = document.querySelectorAll(
    `.option[data-clothing-category="${clothingCategory}"]`
  );
  matches.forEach((soloClassItem) => {
    if (!isHidden(soloClassItem) && soloClassItem !== element) {
      hideClothingItem(soloClassItem);
    }
  });
}

/** Reset the options by hiding everything.
 * Then, we give the character some shoes and a mouth to start with.
 */
function reset(setDefault = true) {
  const allOptions = [...document.querySelectorAll(".option.checked")];
  allOptions.forEach((optionButton) => hideClothingItem(optionButton));

  processGameMatchesMetadata();

  if (!setDefault) return;
  showClothingItem(
    document.querySelector(`.option[data-clothing-category="mouth"]`)
  );
}

function switchToTab(evt) {
  document
    .querySelectorAll(`[data-tab-name]`)
    .forEach((item) => item.classList.remove("selected"));

  const target = evt.target || evt.srcElement;
  const targetPage = document.querySelector(
    `.page[data-tab-name="${target.dataset.tabName}"]`
  );

  target.classList.add("selected");
  targetPage.classList.add("selected");
}

function setupGameUi() {
  allPages.forEach((page) => {
    const newTabButton = document.createElement("BUTTON");
    newTabButton.innerHTML = page.dataset.tabName;
    newTabButton.dataset.tabName = page.dataset.tabName;
    newTabButton.addEventListener("click", switchToTab);
    newTabButton.classList.add("rat-tab");
    tabContainer.appendChild(newTabButton);

    if (page.classList.contains("selected")) {
      newTabButton.classList.add("selected");
    }
  });
}

function processGameMatchesMetadata() {
  matchState = {};
  const keys = Object.keys(allClothingClassesDict);
  const clothingWithMatches = keys.filter(
    (key) => !!allClothingClassesDict[key].matchCategory
  );
  clothingWithMatches.forEach((key) => {
    const val = allClothingClassesDict[key];
    matchState[val.matchCategory] = {
      prefix: val.defaultMatch,
      postfix: Object.keys(val.matches)[0],
      filePaths: val.matches,
      defaultValue: val.defaultMatch,
    };
  });

  updateMatchedState();
}

function getGameImage(item) {
  return getGameImageWithUrl(
    item.dataset.imgUrl,
    item.dataset.clothingCategory,
    item.dataset.overrideZindex,
    item.textContent.trim(),
    item.dataset.imgUrlPair
  );
}

function getGameImageWithUrl(
  imgUrl,
  clothingCategory,
  overrideZindex = undefined,
  altText = "",
  imgUrlPair = undefined
) {
  const imageElements = [];

  if (!loadedUrls.has(imgUrl)) {
    const newImage = document.createElement("IMG");

    newImage.src = "assets/" + imgUrl;
    newImage.alt = `${clothingCategory} item with the style of ${altText}`;
    newImage.id = imgUrl;
    newImage.classList.add("hidden");
    newImage.classList.add("rat-image");

    newImage.style.zIndex =
      overrideZindex !== undefined && overrideZindex !== null
        ? overrideZindex
        : allClothingClassesDict[clothingCategory].zIndex;

    imagesDisplayContainer.appendChild(newImage);

    imageElements.push(newImage);
    loadedUrls.add(imgUrl);

    if (imgUrlPair) {
      const pairImage = document.createElement("IMG");
      pairImage.src = "assets/" + imgUrlPair;
      newImage.alt = "";
      pairImage.id = imgUrlPair;
      pairImage.classList.add("hidden");
      pairImage.classList.add("rat-image");
      pairImage.style.zIndex =
        allClothingClassesDict[clothingCategory].background.zIndex;
      imagesDisplayContainer.appendChild(pairImage);
      imageElements.push(pairImage);
    }
  } else {
    imageElements.push(document.getElementById(imgUrl));
    imgUrlPair && imageElements.push(document.getElementById(imgUrlPair));
  }
  return imageElements;
}

/** Sets up the game by loading all of the image files needed. */
function setupGameFiles() {
  document.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", toggleItem);
    // Make keyboard accessible
    item.setAttribute("tabIndex", 0);
    item.setAttribute("role", "button");
    item.addEventListener("keydown", (evt) => {
      evt.key === "Enter" && toggleItem(evt);
    });

    preloadImage("assets/" + item.dataset.imgUrl);
  });
}

/** Opens a new tab with the current clothing configuration as an image. */
function saveImage() {
  var canvas = document.createElement("CANVAS");
  var canWid = 700;
  var canHei = 1000;

  canvas.width = canWid;
  canvas.height = canHei;
  canvas.style.width = canWid + "px";
  canvas.style.height = canHei + "px";

  var ctx = canvas.getContext("2d");

  const allImages = [...document.getElementsByClassName("rat-image")];
  const drawnImages = allImages.filter(
    (img) => !img.classList.contains("hidden")
  );

  function compareImages(img1, img2) {
    const img1Z = parseInt(img1.style.zIndex) || 0;
    const img2Z = parseInt(img2.style.zIndex) || 0;
    return img1Z - img2Z;
  }

  const zIndexOrdered = drawnImages.sort(compareImages);
  zIndexOrdered.forEach((img) => {
    ctx.drawImage(img, 0, 0, 700, 1000);
  });

  const url = canvas.toDataURL("image/png");
  const newTab = window.open("", "_blank");
  newTab.document.body.innerHTML = `<img src=${url} style="width: 700px; max-width: 100vw;">`;
}

// preloads the image into the cache
function preloadImage(url) {
  let img = new Image();
  img.src = url;
}

// Halloween mode, start with all off
let isHalloween = false;
document
  .querySelectorAll(".costume")
  .forEach((c) => (c.style.display = "none"));
document
  .querySelectorAll(".halloween-msg")
  .forEach((ele) => (ele.style.visibility = "hidden"));

function toggleIsHalloween() {
  isHalloween = !isHalloween;
  document
    .querySelectorAll(".costume")
    .forEach((c) => (c.style.display = isHalloween ? "" : "none"));
  document
    .querySelectorAll(".halloween-msg")
    .forEach((ele) => (ele.style.visibility = isHalloween ? "" : "hidden"));
}

window.onload = () => {
  // Start the game!
  setupGameUi();
  setupGameFiles();
  reset();
};
