USE nback_test;

DROP TABLE IF EXISTS participants;
CREATE TABLE participants
(
	task_id	int unsigned NOT NULL auto_increment,
	user_a_array_1	varchar(255) NOT NULL,
	user_v_array_1	varchar(255) NOT NULL,
	correct_a_array_1	varchar(255) NOT NULL,
	correct_v_array_1	varchar(255) NOT NULL,
	user_a_array_2	varchar(255) NOT NULL,
	user_v_array_2	varchar(255) NOT NULL,
	correct_a_array_2	varchar(255) NOT NULL,
	correct_v_array_2	varchar(255) NOT NULL,

	PRIMARY KEY					(task_id)
);