
const musicTree = {
  "Pop": {
    "Romantic": ["Perfect", "All of Me", "Thinking Out Loud", "Never Be the Same", "Senorita"],
    "Energetic": ["Shape of You", "Bad Guy", "Havana", "Rolling in the Deep"],
    "Sad": ["Someone Like You", "Lovely"]
  },
  "Rock": {
    "Energetic": ["Believer", "Thunder"]
  },
  "Electronic": {
    "Sad": ["Faded"],
    "Energetic": ["Alone"]
  },
  "Funk": {
    "Romantic": ["24K Magic"],
    "Energetic": ["Uptown Funk"]
  },
  "Soul": {
    "Romantic": ["All of Me"],
    "Sad": ["Ordinary People"]
  },
  "Synthwave": {
    "Energetic": ["Blinding Lights"],
    "Sad": ["Save Your Tears"]
  }
};


let recentStack = [];


async function loadSongs() {
  const response = await fetch("songs.json");
  return await response.json();
}


function displayResults(list) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  if (list.length === 0) {
    results.innerHTML = "<p>No songs found. Try different filters!</p>";
    return;
  }

  list.forEach(song => {
    const div = document.createElement("div");
    div.className = "song-card";
    div.innerHTML = `
      <h3>${song.name}</h3>
      <p>🎤 Artist: ${song.artist}</p>
      <p>🎶 Genre: ${song.genre} | 💫 Mood: ${song.mood}</p>
      <a href="${song.link}" target="_blank">▶ Play Preview</a>
    `;
    results.appendChild(div);

    
    recentStack.push(song.name);
    if (recentStack.length > 10) recentStack.shift(); 
  });
}


async function recommendSongs() {
  const artist = document.getElementById("artistInput").value.toLowerCase();
  const genre = document.getElementById("genreSelect").value;
  const mood = document.getElementById("moodSelect").value;

  const songs = await loadSongs();
  let filtered = [];

  
  let queue = [];
  if (genre && musicTree[genre]) {
    if (mood && musicTree[genre][mood]) queue = [...musicTree[genre][mood]];
    else {
      for (let m in musicTree[genre]) queue.push(...musicTree[genre][m]);
    }
  } else {
    for (let g in musicTree) for (let m in musicTree[g]) queue.push(...musicTree[g][m]);
  }

  filtered = songs.filter(song => {
    return (
      (!artist || song.artist.toLowerCase().includes(artist)) &&
      queue.includes(song.name)
    );
  });

  displayResults(filtered);
}


async function surpriseMe() {
  const songs = await loadSongs();

 
  let allSongs = [];
  for (let g in musicTree) {
    for (let m in musicTree[g]) {
      allSongs.push(...musicTree[g][m]);
    }
  }

  const randomSongName = allSongs[Math.floor(Math.random() * allSongs.length)];

  
  const mainSong = songs.filter(song => song.name === randomSongName);


  let relatedQueue = [];
  for (let g in musicTree) {
    for (let m in musicTree[g]) {
      if (musicTree[g][m].includes(randomSongName)) {
        relatedQueue.push(...musicTree[g][m]);
      }
    }
  }

 
  let relatedSongs = songs.filter(song => relatedQueue.includes(song.name));

  displayResults(relatedSongs);
}
