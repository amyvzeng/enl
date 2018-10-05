var trial_duration_seconds = 10; //number of seconds for trial
var trialCounter, onTrial, trialPhotos;
var totalTrials = 3;

var questions = ["question 1", "question 2", "question 3"];

window.onload=() => {
	initializeCounters();
	grabImages();
}

function initializeCounters() {
	trialCounter = 0;
	onTrial = 0;
}

function grabImages() {
	trialPhotos = new Array(3);
	trialPhotos[0] = window.firstURL;
	trialPhotos[1] = window.secondURL;
	trialPhotos[2] = window.thirdURL;
}

document.addEventListener('keypress', (event) => {
	console.log("key pressed");
	if (!onTrial && trialCounter < totalTrials) {
		onTrial = 1;
		console.log(trialCounter);
		document.getElementById("question").innerHTML = questions[trialCounter];
		trial();
	} else if (trialCounter == totalTrials) {
		console.log("finished");
	}
});

function trial() {
	window.setTimeout(function() {
		document.getElementById("next").innerHTML = "Press any key to continue";
		onTrial = 0;
	}, (trial_duration_seconds + 2) * 1000);
	populate_grid();
	show_timer(trial_duration_seconds);
	trialCounter++;
}

function populate_grid() {
	for (var counter = 0; counter < 15; counter++) {
		document.getElementById("grid-" + (counter+1).toString()).innerHTML = "<img src=" + trialPhotos[trialCounter][counter] + " />";
	}
}

function show_timer(seconds) {
	var timer = setInterval(function() {
		document.getElementById("timer").innerHTML = seconds + " seconds remaining";
		if (--seconds < 0) {
			clearInterval(timer);
		}
	}, 1000);
}