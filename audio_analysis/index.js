var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple'
});


function start() {
	audioFile = getAudioFromUrl();
}

function getAudioFromUrl() {

}

function initWavesurfer(filename) {
	wavesurfer.load(filename);
}