export const sets = {
  animals: [ // Premier jeu ou set, c'est un array avec un système de "clé : valeur, où la variable word va attraper 10 animaux"
    { word: 'cat' },
    { word: 'dog' },
    { word: 'lion' },
    { word: 'tiger' },
    { word: 'elephant' },
    { word: 'giraffe' },
    { word: 'zebra' },
    { word: 'horse' },
    { word: 'bear' },
    { word: 'monkey' }
  ],
  tech: [ // Deuxième jeu ou set, c'est un array avec un système de "clé : valeur, où la variable word va attraper 10 éléments de tech"
    { word: 'computer' },
    { word: 'internet' },
    { word: 'software' },
    { word: 'hardware' },
    { word: 'keyboard' },
    { word: 'screen' },
    { word: 'mouse' },
    { word: 'server' },
    { word: 'network' },
    { word: 'code' }
  ],
  emotions: [ // Troisième jeu ou set, c'est un array avec un système de "clé : valeur, où la variable word va attraper 10 éléments d'émotions"
    { word: 'happy' },
    { word: 'sad' },
    { word: 'angry' },
    { word: 'excited' },
    { word: 'fearful' },
    { word: 'love' },
    { word: 'hate' },
    { word: 'joy' },
    { word: 'bored' },
    { word: 'surprised' }
  ]
};

export function getSets() { // Une fonction qui retourne la liste des noms des sets comme par exemple "animals", "tech" ou encore "emotions"
  return Object.keys(sets);  
 }

export function getWords(setName) { // Une fonction qui retourne la liste des mots pour un set donné (via le parametre setName), ou un tableau vide (via [])  si le set n'existe pas
  return sets[setName] || [];
}

export function getRandomWord(setName) {      // Une fonction qui retourne un mot aléatoire du set spécifié on utilise pour cela l'objet natif Math. .
  const words = getWords(setName); 
  return words[Math.floor(Math.random() * words.length)];// Avec la fonction Math.floor(x) (Selon la documentation https://developer.mozilla.org/) renvoie le plus grand entier qui est inférieur ou égal à un nombre x et la fonction Math.random() renvoie un nombre flottant pseudo-aléatoire compris dans l'intervalle [0, 1[
}

export async function fetchDefinitions(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error(`No definition found for ${word}`);
    const data = await res.json();
    if (!data[0]?.meanings) {
      console.error(`Pas de significations trouvées pour : ${word}`);
      console.log(data);
      return []; // Si aucune signification n'est trouvée, retourne un tableau vide
    }
    return data[0]?.meanings?.flatMap(m => m.definitions.map(d => d.definition)) || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des définitions :', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Gestion mémoire dans localStorage
export function getMemory(setName) {
  const memory = localStorage.getItem(`memory_${setName}`);
  return memory ? JSON.parse(memory) : {}; // Si memory est null, retourne un objet vide
}

export function updateMemory(setName, word, correctDefinitions) {
  const memory = getMemory(setName);
  memory[word] = correctDefinitions;
  localStorage.setItem(`memory_${setName}`, JSON.stringify(memory));
}

export function hasSeenAllWords(setName) {
  const memory = getMemory(setName);
  const words = getWords(setName).map(item => item.word); // ✅ extraire les mots string
  return words.every(word => word in memory);
}

export function resetMemory() {
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('memory_')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log("Performances supprimées :", keysToRemove);
}


