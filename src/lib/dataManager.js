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
  return Object.keys(sets);  // Selon https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/keys la méthode Object.keys() renvoie un tableau contenant les noms des propriétés propres à un objet (qui ne sont pas héritées via la chaîne de prototypes) et qui sont énumérables. L'ordre de ce tableau est le même que celui obtenu par une boucle for...in (à la différence qu'une boucle for-in liste également les propriétés héritées).
 }

export function getWords(setName) { // Une fonction qui retourne la liste des mots pour un set donné (via le parametre setName), ou un tableau vide (via [])  si le set n'existe pas
  return sets[setName] || [];
}

export function getRandomWord(setName) {      // (Selon la documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) Une fonction qui retourne un mot aléatoire du set spécifié on utilise pour cela l'objet natif Math. .
  const words = getWords(setName); 
  return words[Math.floor(Math.random() * words.length)];// (Selon la documentation https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random) Avec la fonction Math.floor(x)  renvoie le plus grand entier qui est inférieur ou égal à un nombre x et la fonction Math.random() renvoie un nombre flottant pseudo-aléatoire compris dans l'intervalle [0, 1[
}

export async function fetchDefinitions(word) {  // (Selon  https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function) Une fonction asynchrone est une fonction précédée par le mot-clé async, et qui peut contenir le mot-clé await. async et await permettent un comportement asynchrone, basé sur une promesse (Promise), écrite de façon simple, et évitant de configurer explicitement les chaînes de promesse.
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`); // res permet la réponse serveur. L'opérateur await permet d'attendre la résolution d'une promesse (Promise). Il ne peut être utilisé qu'au sein d'une fonction asynchrone (définie avec l'instruction async function).(Selon https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/await)
    if (!res.ok) throw new Error(`No definition found for ${word}`); // Selon https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/throw l'instruction throw permet de lever une exception définie par l'utilisateur. L'exécution de la fonction courante sera stoppée (les instructions situées après l'instruction throw ne seront pas exécutées) et le contrôle sera passé au premier bloc catch de la pile d'appels. Si aucun bloc catch ne se trouve dans les fonctions de la pile d'appels, le programme sera terminé.
    const data = await res.json();
    if (!data[0]?.meanings) {
      console.error(`Pas de significations trouvées pour : ${word}`); // En cas d'erreur on affiche un message d'erreur à la console
      console.log(data);
      return []; // Si aucune signification n'est trouvée, retourne un tableau vide
    }
    return data[0]?.meanings?.flatMap(m => m.definitions.map(d => d.definition)) || []; // La méthode flatMap() permet d'appliquer une fonction à chaque élément du tableau puis d'aplatir le résultat en un tableau. 
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
  const words = getWords(setName).map(item => item.word); //  extraire les mots string
  return words.every(word => word in memory); // Selon https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/every, la méthode every() permet de tester si tous les éléments d'un tableau vérifient une condition donnée par une fonction en argument. Cette méthode renvoie un booléen pour le résultat du test.
}

export function resetMemory() {
  const keysToRemove = []; // déclaration d'un tableau vide pour la mémoire effacé

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('memory_')) { // Selon la documentation https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith , la méthode startsWith() renvoie un booléen indiquant si la chaine de caractères commence par la deuxième chaine de caractères fournie en argument.
      keysToRemove.push(key); // La méthode push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle taille du tableau.
    }
  }

  keysToRemove.forEach(key => {
    localStorage.removeItem(key); // La méthode removeItem() de l'interface Storage , lorsque vous lui passez une clé en argument, va supprimer la ressource avec le nom de clé correspondant du storage. L'interface Storage de l'API Web Storage API fournit des accès particuliers dans les domaines des stockages locaux et de sessions.
  });

  console.log("Performances supprimées :", keysToRemove);
}


