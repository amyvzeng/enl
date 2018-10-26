total_instructions = 3;
instructions_text = "";
all_images = [];
images = [];

total_questions = 3;
filename = "captcha_data";
currentTask = 0;
workerId = "";
secretKeyPrefix = "cAPtchA";

selectedImages = [];
finalImages = new Array(3);


$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "images.csv",
        dataType: "text",
        success: function(data) {getImages(data);}
     });

	$('body').on('click','img',function(){toggleOpacity(this.id)});
});

function start() {
	console.log("hi");
	getWorkerIDFromUrl();
	showInstructions(0);
}

function getWorkerIDFromUrl() {
	workerId = window.location.href.split("workerID=")[1];
}

function getInstructions(file) {
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                instructions_text = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

function showInstructions(index) {
	getInstructions("instructions.txt");
	instructions = instructions_text.split("\n")

	if (index < total_instructions) {
		document.getElementById("instructions").innerHTML = "<p>" + instructions[index] + "</p>"
		document.getElementById("instructions").innerHTML += "<button class='button' onclick='showInstructions(" + (index+1).toString() + ")'>Next</button>"
	} else {
		document.getElementById("instructions").innerHTML = ""
		showTaskGrid(0)
	}
}

function getImages(data) {
	var dataLines = data.split(/\r\n|\n/);
    var headers = dataLines[0].split(',');
    var imagedata = []

    for (var i=1; i<dataLines.length; i++) {
        var data = dataLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            imagedata.push(tarr);
        }
    }

    all_images = imagedata;
	
	var counter=0;
	while (counter * 15 < imagedata.length) {
		images.push(imagedata.slice(counter*15,counter*15+15));
		counter++;
	}
}

function taskTransitionHandler(index, timer) {
	finalImages[currentTask] = selectedImages;
	console.log(finalImages[currentTask]);
	document.getElementById("taskgrid").innerHTML = "";
	document.getElementById("taskfooter").innerHTML = "";
	clearInterval(timer);
	shuffleImages();
	document.getElementById("timer").innerHTML = "";

	if (index == total_questions) {
		document.getElementById("question").innerHTML = "<p>Here is your worker key</p>";
		finish();
	} else {
		document.getElementById("question").innerHTML = "<p>Loading</p>";
		setTimeout(function() {
			showTaskGrid(index);
		}, 3000);
	}
}

function showTimer(index) {
	seconds = 15 * images.length;
	var timer = setInterval(function() {
		document.getElementById("timer").innerHTML = "<p>" + seconds + " seconds remaining";
		if (--seconds < 0) {
			clearInterval(timer);
			taskTransitionHandler(index+1);
		}
	}, 1000);

	return timer;
}

function showTaskGrid(index) {
	currentTask = index;
	questions = ["Task 1: Click on three images you like", "Task 2: Click on all images that look 'natural'", "Task 3: Click on all images that look 'urban'"];
	document.getElementById("question").innerHTML = "<p>" + questions[index] + "</p>";
	timer = showTimer(index);
	populateGrid(index);
	document.getElementById("taskfooter").innerHTML = "<p>Trial " + (index+1).toString() + "/" + total_questions.toString() + "</p>";
	document.getElementById("taskfooter").innerHTML += "<button class='button' onclick='taskTransitionHandler(" + (index+1).toString() + ", timer)'>Next</button>";
}

function createGrid(imageArray, taskIndex) {
	grid_prefix = "<table>"
	grid_rows = "";
	Array.apply(null, {length: 15}).map(Number.call, Number).forEach(function(gridIndex) {
		if (gridIndex % 5 == 0) {
			grid_rows += "<tr>";
		}
		image = imageArray[gridIndex];
		grid_rows += "<td>";
		grid_rows += "<img id='" + image[0] + "' src=" + image[1] + " />";
		//onclick='toggleOpacity(" + gridIndex + ")' 
		if (gridIndex % 5 == 4) {
			grid_rows += "</tr>";
		}
	});
	grid_suffix = "</table>";

	return grid_prefix + grid_rows + grid_suffix;
}

function populateGrid(taskIndex) {
	gridCounter=1;
	images.forEach(function(value) {
		document.getElementById("taskgrid").innerHTML += "<p>Trial " + gridCounter.toString() + " of " + (images.length).toString() + "</p>";
		document.getElementById("taskgrid").innerHTML += createGrid(value, taskIndex);
		gridCounter+=1
	});
}

function shuffleImages() {
	var counter=0;
	images = [];

	for (var i = all_images.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
        x = all_images[i];
        all_images[i] = all_images[j];
        all_images[j] = x;
	}

	while (counter * 15 < all_images.length) {
		images.push(all_images.slice(counter*15,counter*15+15));
		counter++;
	}

	console.log("finished");
	console.log(images);
	console.log(images.length);
}

function toggleOpacity(imageId) {
	opacity = document.getElementById(imageId).style.opacity;
	if (!opacity || opacity == 1.0) {
		document.getElementById(imageId).style.opacity = .5;
		selectedImages.push(imageId);
	} else {
		document.getElementById(imageId).style.opacity = 1.0;
		selectedImages = selectedImages.filter(e => e != imageId);
	}
}

function generateWorkerKey() {
	var secretKey = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
	for (var i = 0; i < 7; i++) {
		secretKey += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return workerId + secretKeyPrefix + secretKey;
}

function saveData(workerKey) {
	var filedata = {"Worker Key": workerKey, "Preferred Images": finalImages[0], "Nature Images": finalImages[1], "Urban Images": finalImages[2]};
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'save_data.php'); // 'write_data.php' is the path to the php file described above.
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({name: filename, data: filedata}));
}

function finish() {
	var workerKey = generateWorkerKey();
	saveData(workerKey);
}




