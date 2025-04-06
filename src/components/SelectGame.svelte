<script>
  import { createEventDispatcher } from 'svelte';
  import { getSets } from '$lib/dataManager'; // On a importé la fonction getSets provenant de dataManager.js

  const dispatch = createEventDispatcher();
  const sets = getSets(); // Ici la fonction nous permet d'obtenir une des collections

  // Utilisation du dispatch pour émettre l'événement 'gameSelected'
  function selectSet(set) {
    dispatch('gameSelected', set);
  }
</script>

<h2>Choisis un jeu :</h2>

<div class="set-container">
  <button class="set-button" on:click={() => selectSet('animals')}>
    <img class="set-image" src="/img/animal.jpg" alt="Animals" />
    <span class="set-label">🐾 Animals</span>
  </button>

  <button class="set-button" on:click={() => selectSet('tech')}>
    <img class="set-image" src="/img/informatique.jpg" alt="Tech" />
    <span class="set-label">💻 Tech</span>
  </button>

  <button class="set-button" on:click={() => selectSet('emotions')}>
    <img class="set-image" src="/img/emoticons.png" alt="Emotions" />
    <span class="set-label">😊 Emotions</span>
  </button>
</div>
