// Elementos DOM para a transição inicial
const initialPage = document.getElementById('initialPage');
const loveButton = document.getElementById('loveButton');
const mainContent = document.getElementById('mainContent');

// Adiciona evento de clique ao botão
loveButton.addEventListener('click', function() {
    // Esconde a página inicial
    initialPage.classList.add('hidden');
    
    // Mostra o conteúdo principal após um pequeno atraso
    setTimeout(function() {
        mainContent.classList.add('show');
    }, 500);
    
    // Inicializa o player do YouTube
    loadYouTubePlayer();
});

// Variáveis globais do player
let player;
let isPlaying = false;
let updateInterval;
let currentVolume = 80;

// Carrega o player do YouTube
function loadYouTubePlayer() {
    // 1. Carrega a API do YouTube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Quando a API do YouTube estiver pronta
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'KvMY1uzSC1E',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Quando o player estiver pronto
function onPlayerReady(event) {
    // Configura volume inicial
    player.setVolume(currentVolume);
    updateVolumeDisplay();
    
    // Atualiza a duração da música
    updateDurationDisplay();
    
    // Tenta reproduzir automaticamente (pode ser bloqueado pelo navegador)
    const playPromise = player.playVideo();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay não permitido. O usuário precisa interagir primeiro.');
        });
    }
}

// Controles do player
function onPlayerStateChange(event) {
    const playIcon = document.getElementById('playPauseBtn').querySelector('i');
    
    switch(event.data) {
        case YT.PlayerState.PLAYING:
            isPlaying = true;
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            startProgressTimer();
            break;
            
        case YT.PlayerState.PAUSED:
            isPlaying = false;
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            clearInterval(updateInterval);
            break;
            
        case YT.PlayerState.ENDED:
            isPlaying = false;
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            document.querySelector('.progress-bar').style.width = '0%';
            clearInterval(updateInterval);
            break;
    }
}

// Atualiza a barra de progresso
function startProgressTimer() {
    clearInterval(updateInterval);
    updateProgress();
    updateInterval = setInterval(updateProgress, 1000);
}

function updateProgress() {
    if (!player) return;
    
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    const progressPercent = (currentTime / duration) * 100;
    
    document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
    updateTimeDisplay(currentTime);
}

function updateTimeDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    document.querySelector('.current-time').textContent = formattedTime;
}

function updateDurationDisplay() {
    const duration = player.getDuration();
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.querySelector('.duration').textContent = formattedDuration;
}

// Controles de volume
function updateVolumeDisplay() {
    const volumePercent = player.getVolume();
    document.getElementById('volumeProgress').style.width = `${volumePercent}%`;
    
    // Atualiza ícone do volume
    const volumeIcon = document.getElementById('volumeIcon');
    if (volumePercent === 0) {
        volumeIcon.classList.remove('fa-volume-down');
        volumeIcon.classList.add('fa-volume-mute');
    } else {
        volumeIcon.classList.remove('fa-volume-mute');
        volumeIcon.classList.add('fa-volume-down');
    }
}

// Event Listeners para os controles
document.getElementById('playPauseBtn').addEventListener('click', function() {
    if (!player) return;
    
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

document.getElementById('volumeBar').addEventListener('click', function(e) {
    if (!player) return;
    
    const width = this.offsetWidth;
    const clickX = e.offsetX;
    const volumePercent = Math.round((clickX / width) * 100);
    
    player.setVolume(volumePercent);
    updateVolumeDisplay();
});

document.querySelector('.progress-container').addEventListener('click', function(e) {
    if (!player) return;
    
    const width = this.offsetWidth;
    const clickX = e.offsetX;
    const duration = player.getDuration();
    const seekTo = (clickX / width) * duration;
    
    player.seekTo(seekTo, true);
});

// Controles adicionais
document.getElementById('prevBtn').addEventListener('click', function() {
    if (player) player.seekTo(0, true);
});

document.getElementById('nextBtn').addEventListener('click', function() {
    if (player) {
        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + 10, true);
    }
});

document.getElementById('repeatBtn').addEventListener('click', function() {
    if (player) {
        player.seekTo(0, true);
        player.playVideo();
    }
});

document.getElementById('shuffleBtn').addEventListener('click', function() {
    alert('Funcionalidade de shuffle seria implementada com uma playlist');
});