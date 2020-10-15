
const electron = require('electron');
const { ipcRenderer: ipc, shell, remote } = electron;

navigator.getUserMedia = navigator.webkitGetUserMedia;

const countdown = require('./countdown')
const video = require('./video')
const images = remote.require('./images')

function formatImgTag(document, bytes) {
    const div = document.createElement('div');
    div.classList.add('photo');
    const close = document.createElement('div');
    close.classList.add('photoClose');
    const img = new Image();
    img.classList.add('photoImg');
    img.src = bytes;
    div.appendChild(img);
    div.appendChild(close);
    return div;
}

window.addEventListener('DOMContentLoaded', _ => {
    const videoEl = document.getElementById('video');
    const canvasEl = document.getElementById('canvas');
    const recordEl = document.getElementById('record');
    const photosEl = document.querySelector('.photosContainer');
    const counterEl = document.getElementById('counter');

    const ctx = canvasEl.getContext('2d');

    video.init(navigator, videoEl);


    recordEl.addEventListener('click', _ => {
        countdown.start(counterEl, 3, _ => {
            const bytes = video.captureBytes(videoEl, ctx, canvasEl);
            ipc.send('image-captured', bytes);
            photosEl.appendChild(formatImgTag(document, bytes));
        })

    })

    photosEl.addEventListener(`click`, evt => {

        const isRemoving = evt.target.classList.contains('photoClose');
        const selector = isRemoving ? '.photoClose' : '.photoImg';

        const photos = Array.from(document.querySelectorAll(selector));
        const index = photos.findIndex(el => el == evt.target);

        if (index > -1) {
            if (isRemoving) {
                ipc.send('image-remove', index);
            } else {
                shell.showItemInFolder(images.getFromCache(index));
            }
        }
    })


})




ipc.on('image-removed', (evt, index) => {
    console.log(evt, index);
    console.log(Array.from(document.querySelectorAll('.photo')));
    document.getElementById('photos').removeChild(Array.from(document.querySelectorAll('.photo'))[index]);
})