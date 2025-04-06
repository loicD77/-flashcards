<script>
  import { createEventDispatcher } from 'svelte';
  import { getSets } from '$lib/dataManager';

  const dispatch = createEventDispatcher();
  const sets = getSets();

  // Utilisation du dispatch pour émettre l'événement 'gameSelected'
  function selectSet(set) {
    dispatch('gameSelected', set);
  }
</script>

<h2 class="text-xl font-bold mb-2">Choose a set:</h2>
<ul class="space-y-2">
  {#each sets as set}
    <li>
      <button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={() => selectSet(set)}>
        {set}
      </button>
    </li>
  {/each}
</ul>
