<script>
  import '../styles/global.css';
  import { fetchDefinitions, resetMemory, hasSeenAllWords } from '$lib/dataManager';

  import SelectGame from '../components/SelectGame.svelte';
  import Flashcard from '../components/Flashcard.svelte';
  import { sets } from '$lib/dataManager';

  let selectedGame = null;
  let flashcards = [];
  let currentCard = null;
  let definitions = [];
  let selectedDefinitions = [];
  let showDefinitions = false;

  let showPerformance = false;
  let performanceData = [];
  let allSeen = false;

  async function loadDefinitions(word) {
    definitions = await fetchDefinitions(word);
    selectedDefinitions = new Array(definitions.length).fill(false);
    showDefinitions = false;
  }

  function drawCard() {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    currentCard = flashcards[randomIndex];
    loadDefinitions(currentCard.word);
  }

  function onSelectGame(game) {
    selectedGame = game;
    flashcards = sets[game] || [];
    drawCard();
    checkIfAllSeen(); // vérifie dès qu'on change de set
  }

  function handleValidation() {
    drawCard();
    if (showPerformance) {
      afficherPerformances();
    }
    checkIfAllSeen();
  }

  function checkIfAllSeen() {
    if (selectedGame) {
      allSeen = hasSeenAllWords(selectedGame);
    }
  }

  function flipCard() {
    showDefinitions = true;
  }

  function afficherPerformances() {
    performanceData = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("memory_")) {
        const setName = key.replace("memory_", "");
        const memory = JSON.parse(localStorage.getItem(key));
        const mots = Object.entries(memory).map(([mot, defs]) => ({ mot, defs }));
        performanceData.push({ setName, mots });
      }
    });
    showPerformance = true;
  }

  function retourAccueil() {
    selectedGame = null;
    flashcards = [];
    currentCard = null;
    definitions = [];
    selectedDefinitions = [];
    showDefinitions = false;
    showPerformance = false;
    allSeen = false;
  }

  function handleResetMemory() {
    resetMemory(); // supprime tous les memory_
    afficherPerformances();
    alert("Tous les acquis ont été réinitialisés !");
  }

  function handleResetSetOnly() {
    if (selectedGame) {
      localStorage.removeItem(`memory_${selectedGame}`);
      afficherPerformances();
      alert(`Les acquis du set "${selectedGame}" ont été réinitialisés.`);
      checkIfAllSeen(); // recheck
    }
  }
</script>

<div class="page">
  <h1>Flashcards App</h1>

  {#if !selectedGame}
    <SelectGame on:gameSelected={event => onSelectGame(event.detail)} />
  {:else}
    <div class="card-container">
      {#if currentCard}
        <div>
          <h2>{currentCard.word}</h2>
          {#if !showDefinitions}
            <button on:click={flipCard}>Retourner la carte</button>
          {:else}
            <Flashcard 
              word={currentCard.word} 
              definitions={definitions} 
              selectedDefinitions={selectedDefinitions}
              setName={selectedGame}
              onValidate={handleValidation} 
            />
          {/if}
        </div>
      {:else}
        <p>Chargement de la carte...</p>
      {/if}
    </div>

    <button on:click={afficherPerformances}>Afficher mes acquis</button>

    {#if allSeen}
      <button on:click={handleResetSetOnly}>Réinitialiser les acquis du set actuel</button>
    {/if}

    <button on:click={handleResetMemory}>Réinitialiser tous les acquis</button>
    <button on:click={retourAccueil}>🏠 Retour à l'accueil</button>
  {/if}

  {#if showPerformance}
    <div class="performance">
      <h2>Performances enregistrées</h2>
      {#if performanceData.length === 0}
        <p>Aucune performance enregistrée.</p>
      {:else}
        {#each performanceData as setPerf}
          <div>
            <h3>📘 Set : {setPerf.setName}</h3>
            <ul>
              {#each setPerf.mots as mot}
                <li>
                  <strong>{mot.mot}</strong> :
                  {#if mot.defs.length > 0}
                    {mot.defs.join(', ')}
                  {:else}
                    Aucune définition validée
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .performance {
    margin-top: 2rem;
    padding: 1rem;
    border-top: 1px solid #ccc;
  }

  button {
    margin: 0.5rem;
  }
</style>
