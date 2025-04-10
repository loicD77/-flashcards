<script>
  import '../styles/global.css';
  import { fetchDefinitions, resetMemory, hasSeenAllWords } from '$lib/dataManager';

  import SelectGame from '../components/SelectGame.svelte'; // Importation de SelectGame.svelte
  import Flashcard from '../components/Flashcard.svelte'; // Importation de Flashcard.svelte
  import { sets } from '$lib/dataManager'; // On importe les 3 jeux ou set

  let selectedGame = null; // Cette variable sans valeur permet de choisir les "set" ou jeux
  let flashcards = []; // tableau pour les cartes 
  let currentCard = null; // Carte récente
  let definitions = []; // Array pour les définitions
  let selectedDefinitions = []; // Array pour la sélection des définitions
  let showDefinitions = false; // L'affichage des définitions est par défaut caché

  let showPerformance = false; // Les acquis de l'utilisateur sont par défaut caché ! 
  let performanceData = []; // Array vide par défaut pour les données des acquis
  let allSeen = false;

  async function loadDefinitions(word) {  // Fonction pour le chargement des définitions
    definitions = await fetchDefinitions(word);
    selectedDefinitions = new Array(definitions.length).fill(false); // La méthode fill() remplit tous les éléments d'un tableau entre deux index avec une valeur statique. La valeur de l'index de fin n'est pas incluse. Cette méthode renvoie le tableau modifié.
    showDefinitions = false;
  }

  function drawCard() {  // Fonction pour créer les cartes avec fonctions mathématiques (.floor,.random ...)
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
    drawCard(); // On appelle la fonction drawCard()
    if (showPerformance) {
      afficherPerformances(); // on appelle cette fonction située ci-dessous
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
        const mots = Object.entries(memory).map(([mot, defs]) => ({ mot, defs })); // La méthode Object.entries() renvoie un tableau des propriétés propres énumérables d'un objet dont la clé est une chaîne de caractères, sous la forme de paires [clé, valeur], dans le même ordre qu'une boucle for...in (la boucle for-in est différente car elle parcourt la chaîne des prototypes).
        performanceData.push({ setName, mots }); // La méthode push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle taille du tableau
      }
    });
    showPerformance = true;
  }

  function retourAccueil() { // Cette fonction nous permet de retourner à l'accueil avec le choix d'un jeu parmi les 3
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

  <!-- 
Dans svelte, les structures conditionnelles sont entre accolades ! 

On a des gestions des événements avec event
-->

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


