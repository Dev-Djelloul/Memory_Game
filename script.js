const cards = [
    "https://picsum.photos/id/237/100/100",
    "https://picsum.photos/id/238/100/100",
    "https://picsum.photos/id/239/100/100",
    "https://picsum.photos/id/240/100/100",
    "https://picsum.photos/id/241/100/100",
    "https://picsum.photos/id/242/100/100",
    "https://picsum.photos/id/243/100/100",
    "https://picsum.photos/id/244/100/100",
  ];
  

  const gameBoard = document.getElementById("game-board");
  let selectedCards = [];
  let startTime;
  let timerInterval;
  let gameStarted = false;
  let gameLocked = false;
  let scores = [];
  
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById("timer").textContent = elapsedTime;
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const score = { time: totalTime };
    scores.push(score);
    updateScores();
    alert(`Temps total écoulé : ${totalTime} secondes. Bravo, vous avez remporté la partie !`);
  }
  
  function updateScores() {
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';
    let totalScore = 0;
    let bestScore = Infinity; // Initialiser le meilleur score à une valeur très élevée
    scores.forEach((score, index) => {
      totalScore += score.time;
      bestScore = Math.min(bestScore, score.time); // Mettre à jour le meilleur score si nécessaire
      const listItem = document.createElement('li');
      listItem.textContent = `Partie ${index + 1}: ${score.time} seconde`;
      scoreList.appendChild(listItem);
    });
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
    const statsList = document.getElementById('stats-list');
    statsList.innerHTML = `
      <li>Meilleur score : ${bestScore === Infinity ? '0' : bestScore} seconde</li>
      <li>Moyenne des scores : ${averageScore.toFixed(2)} seconde</li>
    `;
  }
  
  function createCard(cardUrl) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = cardUrl;
  
    const cardContent = document.createElement("img");
    cardContent.classList.add("card-content");
    cardContent.src = cardUrl;
    card.appendChild(cardContent);
    card.addEventListener("click", onCardClick);
    return card;
  }
  
  function duplicateArray(arraySimple) {
    return [...arraySimple, ...arraySimple];
  }
  
  function shuffleArray(arrayToShuffle) {
    return arrayToShuffle.sort(() => 0.5 - Math.random());
  }
  
  function onCardClick(e) {
    if (gameLocked) return;
    if (!gameStarted) {
      startTimer();
      gameStarted = true;
    }
    const card = e.target.closest('.card');
    if (!card.classList.contains("flip")) {
      card.classList.add("flip");
      selectedCards.push(card);
    }
  
    if (selectedCards.length == 2) {
      gameLocked = true;
      setTimeout(() => {
        if (selectedCards[0].dataset.value === selectedCards[1].dataset.value) {
          selectedCards[0].classList.add("matched");
          selectedCards[1].classList.add("matched");
          selectedCards[0].removeEventListener("click", onCardClick);
          selectedCards[1].removeEventListener("click", onCardClick);
          const allCardsNotMatched = document.querySelectorAll(".card:not(.matched)");
          if (allCardsNotMatched.length === 0) {
            stopTimer();
          }
        } else {
          selectedCards[0].classList.remove("flip");
          selectedCards[1].classList.remove("flip");
        }
        selectedCards = [];
        gameLocked = false;
      }, 1000);
    }
  }
  
  function initializeGame() {
    gameStarted = false;
    gameLocked = false;
    selectedCards = [];
    gameBoard.innerHTML = '';
    let allCards = duplicateArray(cards);
    allCards = shuffleArray(allCards);
    allCards.forEach((card) => {
      const cardHtml = createCard(card);
      gameBoard.appendChild(cardHtml);
    });
    document.getElementById("timer").textContent = '0';
    clearInterval(timerInterval);
    updateScores(); // Mettre à jour les scores et les statistiques au début de chaque partie
  }
  
  document.getElementById("restart-button").addEventListener("click", initializeGame);
  
  // Initialize game on load
  initializeGame();
  