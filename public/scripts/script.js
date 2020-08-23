const cards = document.querySelectorAll('.card');

for (const card of cards) {
    card.addEventListener("click", function() {
      const id = card.getAttribute("id");
      window.location.href = `/recipes/${id}`;
    });
}

const cardsText = document.querySelectorAll(".cardText");

for (const cardText of cardsText) {

    (cardText.querySelector("p")).addEventListener("click", function(){

      const insideText = cardText.querySelector("p").textContent;
      const changeText = insideText == "MOSTRAR" ? "ESCONDER" : "MOSTRAR";
      cardText.querySelector("p").textContent = changeText;

      (cardText.querySelector(".change-space")).classList.toggle("active");
  });
}

const ImageGallery = {
  highlight: document.querySelector('.highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
      Lightbox.target.style.opacity = 1;
      Lightbox.target.style.top = 0;
      Lightbox.target.style.bottom = 0;
      Lightbox.closeButton.style.top = 0;
  },
  close() {
      Lightbox.target.style.opacity = 0;
      Lightbox.target.style.top = "-100%";
      Lightbox.target.style.bottom = "initial";
      Lightbox.closeButton.style.top = "-80px";
  }
}





//const modalOverlay = document.querySelector('.modal-overlay');

// const modalOverlay = document.querySelector('.modal-overlay');
// const cards = document.querySelectorAll('.card');

// for (const card of cards) {
//     card.addEventListener("click", function() {
//         const fotoId = card.querySelector("img").getAttribute("src");
//         const foodTitle = card.querySelector("h3").textContent;
//         const by = card.querySelector("p").textContent;
//         modalOverlay.classList.add("active");
       
//         modalOverlay.querySelector("img").src = fotoId;
//         modalOverlay.querySelector(".nome").textContent = foodTitle;
//         modalOverlay.querySelector(".autor").textContent = by;

//     })
// }

// modalOverlay.querySelector(".modal-close").addEventListener("click", function () {
//     modalOverlay.classList.remove("active");
// })