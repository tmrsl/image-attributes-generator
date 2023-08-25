function imageAttributesGenerator() {
  let input = null;
  let imageEl = null;

  function addImageClickListener() {
    document.addEventListener("click", handleImageClick);
  }

  function inputHandler(e) {
    const newName = e.target.value;

    imageEl.alt = newName;
  }

  function handleImageClick(e) {
    if (e.target.tagName !== "IMG") {
      const elementPath = e.composedPath();

      const isInput = elementPath.some((el) => el === input);

      if (!isInput && input) {
        input.remove();
        input = null;
      }

      return;
    }

    e.preventDefault();

    imageEl = e.target;

    if (!input) {
      input = document.createElement("input");
      document.body.appendChild(input);
    }

    updateInputPosition();

    input.value = imageEl.alt;
    input.focus();

    input.addEventListener("input", inputHandler);
  }

  function updateInputPosition() {
    if (!input || !imageEl) {
      return;
    }

    const { x, y, width, height } = imageEl.getBoundingClientRect();

    input.style.position = "fixed";
    input.style.top = `${y + height}px`;
    input.style.left = `${x}px`;
    input.style.width = `${width}px`;

    requestAnimationFrame(updateInputPosition);
  }

  async function parseDOM() {
    const allImages = Array.from(document.getElementsByTagName("img"));

    decorateImages(allImages);
  }

  async function decorateImages(imagesArray) {
    for (const img of imagesArray) {
      const altName = await fetch("https://random-word-api.herokuapp.com/word")
        .then((r) => r.json())
        .then((r) => r[0] ?? "Random");

      img.alt = altName;
      img.style.border = "2px solid #FFFF00";
      img.style.borderRadius = "12px";
      img.style.boxShadow = "0 0 8px #FFFF66";
      img.style.mozBoxShadow = "0 0 8px #FFFF66";
    }
  }

  const startObserving = (domNode) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const images = Array.from(mutation.addedNodes).filter(
          (el) => el.tagName === "IMG"
        );

        if (images.length) {
          decorateImages(images);
        }
      });
    });

    observer.observe(domNode, {
      childList: true,
    });

    return observer;
  };

  parseDOM();
  addImageClickListener();
  startObserving(document.body);
}
