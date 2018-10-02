var instruction_counter=0;
var total_instructions=5; //TODO: finalize total number

var instructions = ["instruction 1", "instruction 2", "instruction 3", "instruction 4", "instruction 5"]; //TODO: fill in instructions

document.addEventListener('keypress', (event) => {
	if (instruction_counter < total_instructions) {
		show_instruction(instruction_counter);
		instruction_counter++;
	} else {
		document.location.href += 'trial';
	}
});

function show_instruction(counter) {
	document.getElementsByTagName("h3")[0].innerHTML = instructions[counter];
	if (instruction_counter == 0) {
		document.getElementsByTagName("h2")[0].innerHTML = "Press any key to continue";
	}
}