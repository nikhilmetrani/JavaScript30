const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let filter;

const getVideo = () => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error('I need access to your webcam!');
    });
};

const paintToCanvas = () => {
  const {videoWidth: width, videoHeight: height} = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = filter[filter.selected](pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
};

const takePhoto = () => {
  snap.currentTime = 0;
  snap.play();
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('document', 'Photo');
  link.innerHTML = `<img src="${data}" alt="Photo"/>`;
  strip.insertBefore(link, strip.firstChild);
};

const redEffect = (pixels) => {
  for (i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;  // r channel
    pixels.data[i + 1] = pixels.data[i + 1] - 50;   // g channel
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;  // b channel
    // pixels.data[i + 3] = pixels.data[i + 3];     // alpha channel
  }
  return pixels;
};

const rgbSplit = (pixels) => {
  for (i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // r channel
    pixels.data[i + 500] = pixels.data[i + 1]; // r channel
    pixels.data[i - 550] = pixels.data[i + 2]; // r channel
  }
  return pixels;
};

const greenScreen = (pixels) => {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i + 0];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];
    const alpha = pixels.data[i + 3];

    if(
      red >= levels.rmin &&
      red <= levels.rmax &&
      green >= levels.gmin &&
      green <= levels.gmax &&
      blue >= levels.bmin &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
};

filter = {rgbSplit, greenScreen, redEffect, selected: 'rgbSplit'};

const selectFilter = (e) => {
  filter.selected = e.currentTarget.value;
};

getVideo();

video.addEventListener('canplay', paintToCanvas);

const filterSelector = document.querySelector('.controls .filter');

filterSelector.addEventListener('change', selectFilter);
