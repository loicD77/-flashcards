<script>
  export let word;
  export let definitions = [];
  export let selectedDefinitions = []; // État des cases à cocher
  export let onValidate;
  export let setName; // Nom du jeu (ex: "animals", "tech", etc.)

  let previousDefs = [];

  // 🔁 Charger les définitions déjà trouvées par l’utilisateur
  $: if (definitions.length && setName && word) {
    const storedMemory = localStorage.getItem(`memory_${setName}`);
    const memory = storedMemory ? JSON.parse(storedMemory) : {};
    previousDefs = memory[word] || [];
    selectedDefinitions = definitions.map(def => previousDefs.includes(def));
  }

  // 💾 Sauvegarde dans localStorage
  function saveToMemory() {
    const selectedDefs = definitions.filter((_, index) => selectedDefinitions[index]);
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
    Object.keys(localStorage).forEach((key) => {
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
    <p class="previous">Tu avais trouvé : {previousDefs.join(', ')}</p>
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
