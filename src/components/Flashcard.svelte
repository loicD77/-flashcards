<script>

  // Les variables ci-dessous sont visible depuis un composant parent
  export let word;
  export let definitions = []; // On crée un array pour les différentes définitions des mots
  export let selectedDefinitions = []; // État des cases à cocher pour les différentes définitions
  export let onValidate;
  export let setName; // Nom du jeu (ex: "animals", "tech", etc.)

  let previousDefs = [];

  // Charger les définitions déjà trouvées par l’utilisateur
  $: if (definitions.length && setName && word) {
    const storedMemory = localStorage.getItem(`memory_${setName}`); // On récupère les items de la  base de données du navigateur
    const memory = storedMemory ? JSON.parse(storedMemory) : {};   // Si quelque chose est présent, on le transforme en objet avec JSON.parse, sinon on mets un objet vide. Avec un opérateur ternaire
    previousDefs = memory[word] || [];  // On regarde si y'a déjà des définitions que j’avais cochées pour ce mot
    selectedDefinitions = definitions.map(def => previousDefs.includes(def)); // On a une fonctionné fléché à l'aide de map qui créé un nouveau tableau pour les définitions
  }

  // 💾 Sauvegarde dans localStorage
  function saveToMemory() {
    const selectedDefs = definitions.filter((_, index) => selectedDefinitions[index]); // Ici la méthpde filter crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine (ici les définitions) qui remplissent une conditon déterminée par la fonction callback.
    const storedMemory = localStorage.getItem(`memory_${setName}`);
    const memory = storedMemory ? JSON.parse(storedMemory) : {};
    memory[word] = selectedDefs;
    localStorage.setItem(`memory_${setName}`, JSON.stringify(memory));
    console.log("Données enregistrées dans la mémoire", memory);
  }

  // ✅ Quand l’utilisateur clique sur “Valider”
  function handleValidation() {
    saveToMemory();
    onValidate(); // Signal au parent pour passer à la carte suivante
  }

  // 🧼 Réinitialisation complète de toutes les performances
  function resetMemory() {
    Object.keys(localStorage).forEach((key) => { // Avec la boucle forEach on parcours chaque cas !
      if (key.startsWith('memory_')) {
        localStorage.removeItem(key);
      }
    });
    alert("Toutes les performances ont été réinitialisées !");
  }
</script>

<!-- Contenu de la carte -->
<div class="flashcard-card">
  <h3>Définitions pour le mot : {word}</h3>

  {#if previousDefs.length > 0}
  <div class="previous-highlight">
    🧠 <strong>Tu avais trouvé :</strong> {previousDefs.join(', ')}
  </div>
{/if}


  <div class="definitions-list">
    {#each definitions as def, index}
      <div class="definition-item">
        <input
          type="checkbox"
          id={"def-" + index}
          bind:checked={selectedDefinitions[index]}
        />
        <label for={"def-" + index}>{def}</label>
      </div>
    {/each}
  </div>

  <div class="flashcard-footer">
    <button on:click={handleValidation}>Valider</button>
  </div>
</div>
