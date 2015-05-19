create table if not exists
	users
	(
		iduser integer primary key asc,
		username text,
		password text,
		salt text,
		email text
	);
insert into users (username, password, salt, email) values ('admin', '0ad418be9786615c2c8f902a23215ae56800d3c663c3ba4d3a8fc2ea0c2f71d4', 'aherkjfpsjnnwopfiosjeklfpqjfp193irfjvnxp29', 'hurtybob@gmail.com');

create table if not exists
	whispers
	(
		idWhisper integer primary key asc,
		whisper text,
		uploadTime text,
		creature text
	);
insert into whispers (whisper, uploadTime, creature) values ('Hello World!', '2015-05-17', 'alex' );
insert into whispers (whisper, uploadTime, creature) values ('Hello World2!', '2015-05-17', 'alex' );
insert into whispers (whisper, uploadTime, creature) values ('Hello World3!', '2015-05-17', 'alex' );
