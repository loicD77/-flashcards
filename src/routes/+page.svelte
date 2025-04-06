<script>
  import '../styles/global.css';
   import { fetchDefinitions, resetMemory } from '$lib/dataManager'; 
  import SelectGame from '../components/SelectGame.svelte';
  import Flashcard from '../components/Flashcard.svelte';
  import { sets } from '$lib/dataManager';

  let selectedGame = null;
  let flashcards = [];
  let currentCard = null;
  let definitions = [];
  let selectedDefinitions = [];  // État des cases à cocher
  let showDefinitions = false;

  let showPerformance = false;
  let performanceData = [];

  // 🔁 Charge les définitions pour le mot sélectionné
  async function loadDefinitions(word) {
    definitions = await fetchDefinitions(word); 
    selectedDefinitions = new Array(definitions.length).fill(false);
    showDefinitions = false;
  }

  // 🔀 Tire une carte aléatoire du set sélectionné
  function drawCard() {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    currentCard = flashcards[randomIndex];
    loadDefinitions(currentCard.word);
  }

  // 🎮 Quand l'utilisateur choisit un set de cartes
  function onSelectGame(game) {
    selectedGame = game;
    flashcards = sets[game] || [];
    drawCard(); 
  }

  // ✅ Quand l'utilisateur clique sur "Valider"
  function handleValidation() {
  drawCard(); // Passe à la carte suivante

  // 🔁 Met à jour les performances si elles sont visibles
  if (showPerformance) {
    afficherPerformances();
  }
}

  // 🔁 Affiche les définitions
  function flipCard() {
    showDefinitions = true; 
  }

 

  // 📊 Affiche les performances enregistrées
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
}

function handleResetMemory() {
  resetMemory();
  afficherPerformances(); // recharge les performances (vides)
  alert("Performances supprimées !");
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

    <button on:click={afficherPerformances}>Afficher mes performances</button>
    <button on:click={handleResetMemory}>Réinitialiser les performances</button>
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
</style>
