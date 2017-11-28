// Select controls

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

const fullScreen = player.querySelector('.fullscreen');

// Methods
const togglePlay = () => {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
};

const updateButton = () => {
  const buttonText = video.paused ? '▶' : '▮▮';
  toggle.textContent = buttonText;
};

const skip = (e) => {
  video.currentTime += parseFloat(e.currentTarget.dataset.skip);
};

const handleRangeUpdate = (e) => {
  video[e.currentTarget.name] = e.currentTarget.value;
};

const handleProgress = () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
};

const scrub = (e) => {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
};

const switchToFullScreen = () => {
  const fullScreen = video.requestFullscreen ||
    video.webkitRequestFullscreen ||
    video.mozRequestFullScreen ||
    video.msRequestFullscreen;
  
  fullScreen.apply(video);
};

// Hook-up event listeners

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mouseDown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mouseDown && scrub(e));
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);

fullScreen.addEventListener('click', switchToFullScreen);
