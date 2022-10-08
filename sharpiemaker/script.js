/** TODOS...
 * 1. Make sure one shoe / mouth is always selected.
 */

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
  shirt: { zIndex: 12 },
  pants: { zIndex: 11 },
  socks: { zIndex: 10 },
  // sleeves: 0,
  shoes: { zIndex: 10 },
  mouth: { zIndex: 30 },
  eyemakeup: { zIndex: 21 },
  jacket: { zIndex: 25, background: { zIndex: 5 } },
  sleeves: { zIndex: 11 },
  contacts: { zIndex: 18 },
  belts: { zIndex: 13 },
  bags: { zIndex: 21 },
  headgear: { zIndex: 31 },
  glasses: { zIndex: 30 },
};

/**
 * Clothing types that can stack, like jewelry and makeup.
 * Also attach a stacking order to these.
 */
const multiCategoryClasses = {
  jewels: { zIndex: 20 },
  facemakeup: { zIndex: 20 },
  vest: { zIndex: 25 },
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
  "contacts",
  "belts",
  "bags",
  "jewels",
  "facemakeup",
];

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
function displayRandomItem(category, numItems = 1) {
  const matches = document.querySelectorAll(
    `[data-clothing-category*="${category}"]`
  );
  for (let i = 0; i < numItems; i++) {
    const randomIndex = Math.floor(Math.random() * matches.length);
    showItemAndRemoveConflicts(matches[randomIndex]);
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

  const matchingImageElementId = buttonElement.dataset.imgUrl;
  const matchingImageElement = document.getElementById(matchingImageElementId);

  // Hide from view
  matchingImageElement.classList.add("hidden");
  // Hide from accessibility tree, too.
  matchingImageElement.setAttribute("aria-hidden", true);

  const matchingImagePairedElementId = buttonElement.dataset.imgUrlPair;
  if (matchingImagePairedElementId) {
    const matchingImagePairedElement = document.getElementById(
      matchingImagePairedElementId
    );
    matchingImagePairedElement.classList.add("hidden");
    matchingImagePairedElement.setAttribute("aria-hidden", true);
  }
}

/**
 * "Shows" the clothing item by setting the status of
 * both the button and the paired image element.
 */
function showClothingItem(buttonElement) {
  buttonElement.classList.add("checked");

  const matchingImageElementId = buttonElement.dataset.imgUrl;
  const matchingImageElement = document.getElementById(matchingImageElementId);

  matchingImageElement.classList.remove("hidden");
  // Show it in the accessibility tree, too.
  matchingImageElement.removeAttribute("aria-hidden");

  const matchingImagePairedElementId = buttonElement.dataset.imgUrlPair;
  if (matchingImagePairedElementId) {
    const matchingImagePairedElement = document.getElementById(
      matchingImagePairedElementId
    );
    matchingImagePairedElement.classList.remove("hidden");
    matchingImagePairedElement.removeAttribute("aria-hidden");
  }
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
  let clothingCategories = element.dataset.clothingCategory.split(",");
  clothingCategories = clothingCategories.filter(
    (category) => category in soloCategoryClasses
  );

  clothingCategories.forEach((category) => {
    const matches = document.querySelectorAll(
      `[data-clothing-category*="${category}"]`
    );
    matches.forEach((soloClassItem) => {
      if (!isHidden(soloClassItem) && soloClassItem !== element) {
        hideClothingItem(soloClassItem);
      }
    });
  });
}

/** Reset the options by hiding everything.
 * Then, we give the character some shoes and a mouth to start with.
 */
function reset(setDefault = true) {
  const allOptions = [...document.getElementsByClassName("option")];
  allOptions.forEach((optionButton) => hideClothingItem(optionButton));

  if (!setDefault) return;
  showClothingItem(document.querySelector(`[data-clothing-category*="mouth"]`));
  showClothingItem(document.querySelector(`[data-clothing-category*="shoes"]`));
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

    const imgUrl = item.dataset.imgUrl;
    const overrideZIndex = item.dataset.overrideZindex;
    const newImage = document.createElement("IMG");

    newImage.src = "assets/" + imgUrl;
    newImage.ariaLabel = item.textContent;
    newImage.id = imgUrl;
    newImage.classList.add("hidden");
    newImage.classList.add("rat-image");

    newImage.style.zIndex =
      overrideZIndex !== undefined && overrideZIndex !== null
        ? overrideZIndex
        : allClothingClassesDict[item.dataset.clothingCategory].zIndex;

    imagesDisplayContainer.appendChild(newImage);

    const imgUrlPair = item.dataset.imgUrlPair;
    if (imgUrlPair) {
      const pairImage = document.createElement("IMG");
      pairImage.src = "assets/" + imgUrlPair;
      pairImage.ariaLabel = item.textContent;
      pairImage.id = imgUrlPair;
      pairImage.classList.add("hidden");
      pairImage.classList.add("rat-image");
      pairImage.style.zIndex =
        allClothingClassesDict[item.dataset.clothingCategory].background.zIndex;
      imagesDisplayContainer.appendChild(pairImage);
    }
  });
}

/** Downloads the current clothing configuration as an image. */
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
    console.log(img1Z, img2Z);
    return img1Z - img2Z;
  }

  const zIndexOrdered = drawnImages.sort(compareImages);
  zIndexOrdered.forEach((img) => {
    ctx.drawImage(img, 0, 0, 700, 1000);
  });

  var linkToClick = document.createElement("A"); //hacky solution to save file
  linkToClick.setAttribute("download", "Sharpie.png");
  linkToClick.setAttribute(
    "href",
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  );
  var event = new MouseEvent("click");
  linkToClick.dispatchEvent(event);
}

window.onload = () => {
  // Start the game!
  setupGameUi();
  setupGameFiles();
  reset();
};
