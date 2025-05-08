let trackList = [
  {
    musicName: "Humrazzi OST",
    path: "./musics/Humraazi.mp3",
    image: "./assets/Humrazzi_OST.jpeg",
    singer: "Wajhi Farooki",
  },
  {
    musicName: "Maahi Ve",
    path: "./musics/Maahi_Ve_.mp3",
    image: "./assets/Maahi_Ve.jpg",
    singer: "Neha_Kakkar, Sana, Sharman, Gurmeet Vishal Pandya",
  },
  {
    musicName: "Beete Lamhein",
    path: "./musics/Beete_Lamhein_Lyrics.mp3",
    image: "./assets/Beete_Lamhein.jpg",
    singer: "Kshitij Tarey",
  },
  {
    musicName: "Aakhon Ko Teri",
    path: "./musics/Aakhon_Ko_Teri_Aadat_Hai.mp3",
    image: "./assets/ankhonko.jpg",
    singer: "Armaan Malik and Neeti Mohan",
  },
  {
    musicName: "Zara Zara Behekta Hai",
    path: "./musics/Zara_Zara_Behekta_Hai.mp3",
    image: "./assets/ZaraZaraBehektaHai.jpeg",
    singer: "Omkar ft.Aditya Bhardwaj",
  },
  {
    musicName: "Yaad",
    path: "./musics/YAAD_-_Asim_Azhar.mp3",
    image: "./assets/Yaad.jpg",
    singer: "Asim Azhar",
  },
  {
    musicName: "Suit",
    path: "./musics/Suit_Full_Video_Song.mp3",
    image: "./assets/Suit.jpg",
    singer: "GURU RANDHAWA",
  },
  {
    musicName: "Ae Dil Hai Mushkil",
    path: "./musics/Ae_Dil_Hai_Mushkil.mp3",
    image: "./assets/AeDilHaiMushkil.jpg",
    singer: "Pritam and Arijit Singh",
  },
  {
    musicName: "TUM MERE",
    path: "./musics/TUM_MERE_-_FUKRA_INSAAN.mp3",
    image: "./assets/TUMMERE.jpg",
    singer: "Fukra Insan",
  },
  {
    musicName: "Tarasti Hai Nigahen",
    path: "./musics/Tarasti_Hai_Nigahen.mp3",
    image: "./assets/TarastiHaiNigahen.jpg",
    singer: "Asim Azhar",
  },
  {
    musicName: "Ek Rat",
    path: "./musics/Ek_Rat.mp3",
    image: "./assets/EkRat.jpeg",
    singer: "Vilen",
  },
  {
    musicName: "Aashiqui 2 Mashup",
    path: "./musics/AASHIQUI_2_MASHUP_FULL_SONG.mp3",
    image: "./assets/aashique2.jpg",
    singer: "Arijit Singh and Ankit Tiwari",
  },
];

//control Buttons
const playBtn = document.querySelector(".play-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

const heroImg = document.querySelector("#hero-img");
const musicTitle = document.querySelector(".music-title");
const Singer = document.querySelector("#singer");

//Time
const trackCurrentTime = document.querySelector(".current-time");
const trackDurationTime = document.querySelector(".duration-time");

//Change Duration Slider Position

//Duration Slider
const durationSlider = document.querySelector(".duration-slider");

//Volume
const displayVolume = document.querySelector("#display-volume");
const volumeIcon = document.querySelector("#volume-icon");
const volumeSlider = document.querySelector("#volume-slider");

//Auto play
const autoPlayBtn = document.querySelector(".play-all");

const hamBurger = document.querySelector(".fa-bars");
const closeIcon = document.querySelector(".fa-times");

//PlayList
const playlist = document.querySelector(".playlist");
const playlistIndex = document.querySelector(".playlist-index");
const playListContainer = document.querySelector(".playlist-container");

const searchBar = document.querySelector("#search-bar");
const categoryFilter = document.querySelector("#category-filter");
const skipForwardBtn = document.querySelector(".skip-forward");
const skipBackwardBtn = document.querySelector(".skip-backward");

const waves = document.getElementById("music-waves");

//Variables
let timer;
let auto_play = 0;
let indexTrack = 0;
let songIsPlaying = false;
let track = document.createElement("audio");

//Event Listeners
playBtn.addEventListener("click", playPauseSong);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPreviousSong);
autoPlayBtn.addEventListener("click", playAllSong);
volumeIcon.addEventListener("click", muteVolume);
volumeSlider.addEventListener("input", changeVolume);
durationSlider.addEventListener("change", changeDuration);
track.addEventListener("timeupdate", updateMusicTime);
hamBurger.addEventListener("click", showPlayList);
closeIcon.addEventListener("click", hidePlayList);

searchBar.addEventListener("input", filterTracks);
categoryFilter.addEventListener("change", filterTracks);

skipForwardBtn.addEventListener("click", skipForward);
skipBackwardBtn.addEventListener("click", skipBackward);

//Load Tracks
function loadTracks(indexTrack) {
  clearInterval(timer);
  resetSlider();

  track.src = trackList[indexTrack].path;
  heroImg.src = trackList[indexTrack].image;
  musicTitle.innerHTML = trackList[indexTrack].musicName;
  Singer.innerHTML = trackList[indexTrack].singer;
  track.load();

  //Change Duration Slider Position
  timer = setInterval(updateSliderPosition, 1000);
}
loadTracks(indexTrack);

//Play Pause Control
function playPauseSong() {
  if (songIsPlaying == false) {
    playMusics();
  } else {
    pauseMusics();
  }
}

//Play Musics
function playMusics() {
  track.play();
  songIsPlaying = true;
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  waves.classList.add("playing");
}

//Pause Musics
function pauseMusics() {
  track.pause();
  songIsPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  waves.classList.remove("playing");
}

//next song
function playNextSong() {
  if (indexTrack < trackList.length - 1) {
    indexTrack++;
    loadTracks(indexTrack);
    playMusics();
  } else {
    indexTrack = 0;
    loadTracks(indexTrack);
    playMusics();
  }
}

//Previous song
function playPreviousSong() {
  if (indexTrack > 0) {
    indexTrack--;
    loadTracks(indexTrack);
    playMusics();
  } else {
    indexTrack = trackList.length - 1;
    loadTracks(indexTrack);
    playMusics();
  }
}

//Mute Volume
function muteVolume() {
  track.volume = 0;
  displayVolume.innerHTML = 0;
  volumeSlider.value = 0;
}

//Change Volume
function changeVolume() {
  displayVolume.innerHTML = volumeSlider.value;
  track.volume = volumeSlider.value / 100;
}

//Change Duration
function changeDuration() {
  let sliderPosition = track.duration * (durationSlider.value / 100);
  track.currentTime = sliderPosition;
}

//AutopLay
function playAllSong() {
  if (auto_play == 0) {
    auto_play = 1;
    autoPlayBtn.style.background = "plum";
  } else {
    auto_play = 0;
    autoPlayBtn.style.background = "white";
  }
}

// Reset Slider
function resetSlider() {
  durationSlider.value = 0;
}

//Upadting Slider Position
function updateSliderPosition() {
  let position = 0;

  if (!isNaN(track.duration)) {
    position = track.currentTime * (100 / track.duration);
    durationSlider.value = position;
  }

  if (track.ended) {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    if (auto_play == 1 && indexTrack < trackList.length - 1) {
      indexTrack++;
      loadTracks(indexTrack);
      playMusics();
    } else if (auto_play == 1 && indexTrack == trackList.length - 1) {
      indexTrack = 0;
      loadTracks(indexTrack);
      playMusics();
    }
  }
}

//Update Current Music Time
function updateMusicTime() {
  if (track.duration) {
    let currentMinutes = Math.floor(track.currentTime / 60);
    let currentSeconds = Math.floor(track.currentTime - currentMinutes * 60);

    let durationMinutes = Math.floor(track.duration / 60);
    let durationSeconds = Math.floor(track.duration - durationMinutes * 60);

    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }

    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }

    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }

    trackCurrentTime.innerHTML = currentMinutes + ":" + currentSeconds;
    trackDurationTime.innerHTML = durationMinutes + ":" + durationSeconds;
  } else {
    trackCurrentTime.innerHTML = "00" + ":" + "00";
    trackDurationTime.innerHTML = "00" + ":" + "00";
  }
}

//Show Playlist
function showPlayList() {
  playlist.style.transform = "translateX(0)";
}

//Hide Playlist
function hidePlayList() {
  playlist.style.transform = "translateX(-100%)";
}

//Show musics on playlist
let counter = 1;
function displayMusics(filteredList = trackList) {
  playListContainer.innerHTML = ""; // clear existing list
  let counter = 1;

  filteredList.forEach((track) => {
    let div = document.createElement("div");
    div.classList.add("playlist-index");
    div.innerHTML = `
      <span class="song-index">${counter++}.</span>
      <p class="single-song">${track.musicName}</p>
    `;
    playListContainer.appendChild(div);
  });

  playFromPlayList();
}

displayMusics();

// categorize songs
function filterTracks() {
  const searchTerm = searchBar.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = trackList.filter((track) => {
    const matchSearch = track.musicName.toLowerCase().includes(searchTerm);
    const matchCategory =
      selectedCategory === "all" || track.singer.includes(selectedCategory);
    return matchSearch && matchCategory;
  });

  displayMusics(filtered);
}

//Play Musics From  PlayList
function playFromPlayList() {
  playListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("single-song")) {
      const indexNumber = trackList.findIndex((item, index) => {
        if (item.musicName === e.target.innerHTML) {
          return true;
        }
      });
      loadTracks(indexNumber);
      playMusics();
      hidePlayList();
    }
  });
}

// Skip Songs
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") skipForward();
  if (e.key === "ArrowLeft") skipBackward();
});

function skipForward() {
  if (track.currentTime + 10 < track.duration) {
    track.currentTime += 10;
  } else {
    track.currentTime = track.duration;
  }
}

function skipBackward() {
  if (track.currentTime - 10 > 0) {
    track.currentTime -= 10;
  } else {
    track.currentTime = 0;
  }
}

// Waves Am=nimation
function playMusics() {
  track.play();
  songIsPlaying = true;
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  waves.classList.add("playing"); // start wave animation
}

function pauseMusics() {
  track.pause();
  songIsPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  waves.classList.remove("playing"); // stop wave animation
}
