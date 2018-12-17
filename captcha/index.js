/* 
 *** 
 GLOBAL VARIABLES 
 *** 
*/

// SERVER-SIDE INFO
var total_trials = 0;
var blurry_images_total = 0;
var rating_images_total = 0;
var instructions_total = 7;
var filename = "captcha_data";
var secret_key_prefix = "cAPtchA";
var trash_image_url = "<img src='https://vignette.wikia.nocookie.net/clubpenguin/images/1/18/Trashcan_sprite_001.png/revision/latest?cb=20161002161138' />";

// SERVER-SIDE DATA
var rating_images = [];
var blurry_images = [];
var practice_images = [];
var blurry_trial_indices;

// SERVER-SIDE PER-TRIAL DATA
var trial_images = [];
var can_select = true;
var blurry_strikes = 0;
var selected_blurry = false;
var timer;

// PARTICIPANT INFO
var worker_id = "";
var finished = false;

// TRIAL DATA
var selected_images_trial = [];
var selected_images_task = [];
var selected_all_trials = new Array(3);

/*
 ***
 ONLOAD FUNCTION
 ***
*/

$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "practice_images.csv",
		dataType: "text",
		success: function(data) {
			var practice = get_practice_images(data);
			practice_images_total = practice.length;
			set_practice_images(practice);
		}
	});
    $.ajax({
        type: "GET",
        url: "images.csv",
        dataType: "text",
        success: function(data) {
            var rating = get_rating_images(data);
            rating_images_total = rating.length;

            $.ajax({
            type: "GET",
            url: "blurry_images.csv",
            dataType: "text",
            success: function(data) {
                var blurry = get_blurry_images(data);
                blurry_images_total = blurry.length;
                total_trials = Math.floor((blurry_images_total + rating_images_total) / 15);
                set_trial_images(0, rating, blurry);
            }
        });}
     });

    $('body').on('click', 'img', function() {
        select_image(this.id);
    });

    $('body').on('click', 'button', function() {
    	var button_id = this.id.split("_");
    	var button_type = button_id[0];
    	if (button_type == "instructions") {
    		show_instructions(Number(button_id[1]) + 1);
    	} else if (button_type == "practice") {
    		practice_trial_handler(Number(button_id[1]));
    	} else {
    		var task_index = Number(button_id[1]);
	        var trial_index = Number(button_id[2]);
	        if (task_index == 0 && trial_index == 0) {
	        	task_handler(0);
	        } else {
	        	check_blurry(trial_index);
		        clearInterval(timer);
		        if (trial_index == total_trials-1) {
		            task_handler(task_index+1);
		        } else {
		        	console.log(task_index);
		            trial_handler(task_index, trial_index);
		        }
	        }
    	}
    });
});


/*
 ***
 START FUNCTIONS
 ***
*/
function start() {
    if (check_window()) {
        worker_id = get_worker_id_from_url();
        show_instructions(0);
    } else {
        alert("Your computer does not meet the required screen resolution. Please exit");
    }
}

function check_window() {
    return true;
}

function get_worker_id_from_url() {
    return window.location.href.split("workerID=")[1];
}

function get_rating_images(rating_image_data) {
    return get_images_from_data(rating_image_data);
}

function get_blurry_images(blurry_image_data) {
    return get_images_from_data(blurry_image_data);
}

function get_practice_images(practice_image_data) {
	return get_images_from_data(practice_image_data);
}

function get_images_from_data(image_data) {
    var dataLines = image_data.split(/\r\n|\n/);
    var headers = dataLines[0].split(',');
    var images = [];

    for (var i=1; i<dataLines.length; i++) {
        var data = dataLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            images.push(tarr);
        }
    }

    return images;
}

/*
 ***
 INSTRUCTIONS FUNCTIONS
 ***
*/

function show_instructions(instruction_index) {
	if (instruction_index < instructions_total) {
		document.getElementById("instructions").innerHTML = "<img src= './instructions/" + (instruction_index+1).toString() + ".gif'>"
		var button_id = "instructions_" + instruction_index.toString();
		document.getElementById("instructions").innerHTML += "<button id='" + button_id + "'>Next</button>";
	} else {
        transition_handler(0);
    }
}

/*
 ***
 PRACTICE TRIAL FUNCTIONS
 ***
*/

function set_practice_images(practice_image_data) {
	for (var i = 0; i < Math.floor(practice_images.length/15); i++) {
		practice_images[i] = practice_image_data.slice(i * 15, i * 15 + 14);
	}
}

function practice_trial_handler(practice_trial_index) {
	if (practice_trial_index < practice_images.length) {
		document.getElementById("task_instructions").innerHTML = "Select all images that you like";
		fill_image_grid(practice_images[practice_trial_index],practice_trial_index);
		var button_id = "practice_" + (practice_trial_index+1).toString()
		document.getElementById("next").innerHTML = "<button id='" + button_id + "'>Next</button>";
	} else {
		transition_handler(1);
	}
}

/*
 ***
 TRANSITION FUNCTIONS
 ***
*/

function transition_handler(transition_index) {
	if (transition_index == 0) {
        document.getElementById("instructions").innerHTML = "<h3>Here is a practice trial!</h3>";
        // var button_id = "practice_0";
        // document.getElementById("instructions").innerHTML += "<button id='" + button_id + "'>Next</button>";
        var button_id = "trial_0_0";
        document.getElementById("instructions").innerHTML += "<button id='" + button_id + "'>Next</button>";
	} else if (transition_index == 1) {
		document.getElementById("images").innerHTML = "";
		document.getElementById("instructions").innerHTML = "<h3>Practice complete!</h3>";
		document.getElementById("instructions").innerHTML += "<h4>Click the 'Next' button to begin the task</h4>";
		var button_id = "trial_0_0";
        document.getElementById("instructions").innerHTML += "<button id='" + button_id + "'>Next</button>";
	}
}


/*
 ***
 TASK TRANSITION FUNCTIONS
 ***
*/

function task_handler(task_index) {
    if (task_index == 3) {
        finished = true;
        finish();
    } else if (task_index != 0) {
        selected_all_trials[task_index-1] = selected_images_task;
        selected_images_task = [];
        console.log(selected_all_trials);
        document.getElementById("trialcounter").innerHTML = "";
        shuffle_trial_images(task_index);
        console.log(trial_images);
        trial_handler(task_index, 0);
    } else {
    	document.getElementById("instructions").innerHTML = "";
    	console.log(trial_images);
        trial_handler(task_index, 0);
    }
}

function set_trial_images(next_task_index, rating, blurry) {
    blurry_trial_indices = new Array(total_trials);

    blurry.forEach(function(element) {
        var random = Math.floor(Math.random() * 100) % total_trials;
        while (blurry_trial_indices[random]) {
            random = Math.floor(Math.random() * 100) % total_trials;
        }
        blurry_trial_indices[random] = element;
    });

    var rating_image_counter=0;
    trial_counter = 0;
    while (trial_counter < total_trials) {
        if (blurry_trial_indices[trial_counter]) {
            var images = rating.slice(rating_image_counter, rating_image_counter+14);
            var random_index = Math.floor(Math.random() * 100) % 15;
            images.splice(random_index, 0, blurry_trial_indices[trial_counter]);
            trial_images.push(images);
            rating_image_counter += 14;
        } else {
            trial_images.push(rating.slice(rating_image_counter, rating_image_counter+15));
            rating_image_counter+=15;
        }
        trial_counter++;
    }

    if (next_task_index == 0) {
        blurry_images = blurry;

        if (rating_image_counter < rating.length) {
            rating_images = rating.slice(0, rating_image_counter);
        } else {
            rating_images = rating;
        }
    }
}

function shuffle_trial_images(task_index) {
    for (var i = rating_images.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = rating_images[i];
        rating_images[i] = rating_images[j];
        rating_images[j] = x;
    }
    for (var i = blurry_images.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = blurry_images[i];
        blurry_images[i] = blurry_images[j];
        blurry_images[j] = x;
    }

    set_trial_images(task_index, rating_images, blurry_images);
}

/*
 ***
 TASK FUNCTIONS
 ***
*/

function trial_handler(task_index, trial_index) {
    selected_images_task = selected_images_task.concat(selected_images_trial);
    console.log(selected_images_task);
    selected_images_trial = [];
    selected_blurry = false;
    can_select = true;
    document.getElementById("images").innerHTML = "";
    document.getElementById("trash").innerHTML = trash_image_url;
    document.getElementById("trialcounter").innerHTML = "<p>Trial " + (trial_index+1).toString() + " / " + total_trials.toString() + "</p>";
    show_timer();
    var button_id = "next_" + task_index.toString() + "_" + (trial_index+1).toString();
    document.getElementById("next").innerHTML = "<button id='" + button_id + "'> > </button>";
    fill_image_grid(trial_images[trial_index],trial_index);
}

function show_timer() {
    var seconds = 15;
    timer = setInterval(function() {
        document.getElementById("timer").innerHTML = "<p>" + seconds + " sec. remaining </p>";
        if (--seconds < 0) {
            clearInterval(timer);
            can_select = false;
        }
    }, 1000);
}

function fill_image_grid(images, trial_index) {
    for (var i = 0; i < 3; i++) {
        document.getElementById("images").innerHTML += "<tr>";

        image_row_html = "";
        for (var j = 0; j < 5; j++) {
            image_row_html += "<td>";
            image_row_html += "<img id='" + images[i*5+j][0] + "' draggable='true' ondragstart='drag(event)' src=" + images[i*5+j][1] + " />";
            image_row_html += "</td>";
        }

        document.getElementById("images").innerHTML += image_row_html;
        document.getElementById("images").innerHTML += "</tr>";
    }
}

function select_image(image_id) {
    if (can_select) {
        border = document.getElementById(image_id).style.border;
        if (border == "2px solid white") {
            document.getElementById(image_id).style.border = "";
            selected_images_trial.remove(image_id);
        } else {
            document.getElementById(image_id).style.border = "2px solid white";
            selected_images_trial.push(image_id);
        }
    }
}

function check_blurry(trial_index) {
    if (blurry_trial_indices[trial_index] && selected_blurry == false) {
        blurry_strikes+=1
        alert("You missed a blurry image! You have " + (3-blurry_strikes).toString() + " strikes left.");
    }
    if (blurry_strikes == 3) {
        finish();
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("Text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var image_id = event.dataTransfer.getData("Text");
    console.log(image_id);
    if (image_id = "blurry") {
        selected_blurry = true;
        document.getElementById(image_id).style.opacity = .5;
    }
}

/*
 ***
 FINISH FUNCTIONS
 ***
*/

function generate_worker_key() {
    var secret_key = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    for (var i = 0; i < 7; i++) {
        secret_key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return worker_id + secret_key_prefix + secret_key;
}

function save_data(worker_key) {
    var filedata = {"Worker Key": worker_key, "Preferred Images": selected_all_trials[0], "Nature Images": selected_all_trials[1], "Urban Images": selected_all_trials[2]};
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_data.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({name: filename, data: filedata}));
}

function finish() {
    document.getElementById("taskgrid").innerHTML = "";
    if (finished) {
        var worker_key = generate_worker_key();
        document.getElementById("instructions").innerHTML = "<h2>You have finished the task</h2>";
        document.getElementById("instructions").innerHTML += "<br><h2>Here is your unique key: </h2><br>";
        document.getElementById("instructions").innerHTML += "<h5>" + worker_key + "</h5>"
        save_data(worker_key);
    } else {
        document.getElementById("instructions").innerHTML = "<h2>You did not complete the task. Please exit.</h2>";
    }
    
}




