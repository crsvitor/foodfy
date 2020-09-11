const cardsText = document.querySelectorAll(".cardText");

for (const cardText of cardsText) {

    (cardText.querySelector("p")).addEventListener("click", function(){

      const insideText = cardText.querySelector("p").textContent;
      const changeText = insideText == "MOSTRAR" ? "ESCONDER" : "MOSTRAR";
      cardText.querySelector("p").textContent = changeText;

      (cardText.querySelector(".change-space")).classList.toggle("active");
  });
}