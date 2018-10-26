total_instructions = 3;
instructions_text = ""
images = []
finalImages = new Array(3);
total_questions = 3;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "images.csv",
        dataType: "text",
        success: function(data) {getImages(data);}
     });
});



function start() {
	console.log("hi");
	getWorkerIDFromUrl();
	showInstructions(0);
}

function getWorkerIDFromUrl() {
	console.log("hi");
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
	
	var counter=0;
	while (counter * 15 < imagedata.length) {
		images.push(imagedata.slice(counter*15,counter*15+15));
		counter++;
	}
}

function taskTransitionHandler(index) {
	if (index == total_questions) {
		finish();
	} else {
		document.getElementById("question").innerHTML = "<p>Loading</p>";
		document.getElementById("timer").innerHTML = "";
		document.getElementById("taskgrid").innerHTML = "";
		document.getElementById("taskfooter").innerHTML = "";
		setTimeout(function() {showTaskGrid(index);}, 3000);
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
}

function showTaskGrid(index) {
	questions = ["Click on three images you like", "Click on all images that look 'natural'", "Click on all images that look 'urban'"];
	document.getElementById("question").innerHTML = "<p>" + questions[index] + "</p>";
	showTimer(index);
	populateGrid(index);
	document.getElementById("taskfooter").innerHTML = "<p>Task " + (index+1).toString() + "/" + total_questions.toString() + "</p>";
	document.getElementById("taskfooter").innerHTML += "<button class='button' onclick='taskTransitionHandler(" + (index+1).toString() + ")'>Next</button>";
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

function toggleOpacity(imageId) {
	console.log(imageId);
	// opacity = document.getElementById(imageId).style.opacity;
	// if (!opacity || opacity == 1.0) {
	// 	document.getElementById(imageId).style.opacity = .5;
	// 	finalImages[taskIndex].push(imageId);
	// } else {
	// 	document.getElementById(imageId).style.opacity = 1.0;
	// 	finalImages[taskIndex] = finalImages[taskIndex].filter(e => e != imageId);
	// }
}

function generateWorkerKey() {
	console.log("hi");
}

function finish() {
	generateWorkerKey();
	console.log("finished");
}




