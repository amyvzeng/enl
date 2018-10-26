var wavesurfer;
var textJSONData = [];
var totalSnippets;

function start() {
	wavesurfer = WaveSurfer.create({
		container: document.querySelector('#waveform'),
		progressColor: '#3B8686',
		barHeight: 10,
		backend: 'MediaElement',
		plugins: [
			WaveSurfer.timeline.create({
                container: '#wave-timeline'
            }),
			WaveSurfer.regions.create({})
		]
	});
	loadAudio();
	wavesurfer.setHeight(250);
}

function loadAudio() {
	audioFilename = getAudioFromURL();
	wavesurfer.load(audioFilename);
	loadText(audioFilename);
}

function getAudioFromURL() {
	return "audio/wxwv9_A005_run5_trial18.wav";
}

function loadText(audioFilename) {
	textFileName = audioFilename.slice(0, audioFilename.length-4) + "_transcript.json";

	$(document).ready(function() {
	    $.ajax({
	        type: "GET",
	        url: textFileName,
	        dataType: "text",
	        success: function(data) {
	        	loadTextRegions(data);
	        }
	     });
	});
}

function loadTextRegions(data) {
	var text = JSON.parse(data);
	var snippetCounter=0;
	document.getElementById("text").innerHTML = "<ul>";
	for (var i = 0; i < text.length; i++) {
		words = text[i]["alternatives"][0]["words"];
		words.forEach(function(value) {
			populateText(value, snippetCounter);
			wavesurfer.addRegion({
				id: snippetCounter.toString(),
				start: value["startTime"].split("s")[0],
				end: value["endTime"].split("s")[0],
				color: 'hsla(100, 100%, 30%, 0.1)'
			});
			textJSONData.push(value);
			snippetCounter+=1;
		});
	}
	document.getElementById("text").innerHTML += "</ul>";
	totalSnippets = snippetCounter;
	console.log(document.getElementById("text"));
}

function populateText(text, index) {
	button = textPlayButton(text["startTime"].split("s")[0], text["endTime"].split("s")[0]);
	document.getElementById("text").innerHTML += "<li>" + text["startTime"] + " to " + text["endTime"] + " || " + text["word"] + " || " + button + "</li>";
}

function textPlayButton(startTime, endTime) {
	return "<button onclick='wavesurfer.play(" + startTime + "," + endTime + ")'>Play</button>";
}





