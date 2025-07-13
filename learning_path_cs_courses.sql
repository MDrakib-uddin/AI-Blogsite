-- Computer Science Track & Courses SQL

-- ১. Computer Science ট্র্যাক যোগ করুন
insert into tracks (name, description) values
('Computer Science', 'Core concepts and fundamentals of Computer Science')
on conflict do nothing;

-- ২. Computer Science ট্র্যাকের id দিয়ে সব কোর্স যুক্ত করুন
insert into courses (track_id, name, description) values
((select id from tracks where name='Computer Science'), 'Introduction to Computer Science', 'Overview of CS, history, and applications'),
((select id from tracks where name='Computer Science'), 'Programming Fundamentals', 'Basic programming concepts using C/C++/Java/Python'),
((select id from tracks where name='Computer Science'), 'Data Structures and Algorithms', 'Core data structures and algorithmic techniques'),
((select id from tracks where name='Computer Science'), 'Discrete Mathematics', 'Logic, sets, combinatorics, and graphs'),
((select id from tracks where name='Computer Science'), 'Computer Organization and Architecture', 'How computers work at the hardware level'),
((select id from tracks where name='Computer Science'), 'Operating Systems', 'Processes, memory, file systems, and OS concepts'),
((select id from tracks where name='Computer Science'), 'Database Systems', 'Relational databases, SQL, and data modeling'),
((select id from tracks where name='Computer Science'), 'Computer Networks', 'Networking basics, protocols, and the Internet'),
((select id from tracks where name='Computer Science'), 'Theory of Computation', 'Automata, languages, and computability'),
((select id from tracks where name='Computer Science'), 'Software Engineering', 'Software development lifecycle and methodologies'),
((select id from tracks where name='Computer Science'), 'Web Development Basics', 'HTML, CSS, JavaScript, and web frameworks'),
((select id from tracks where name='Computer Science'), 'Object-Oriented Programming', 'OOP principles and design patterns'),
((select id from tracks where name='Computer Science'), 'Artificial Intelligence Basics', 'Intro to AI, search, and reasoning'),
((select id from tracks where name='Computer Science'), 'Compiler Design', 'Lexical analysis, parsing, and code generation'),
((select id from tracks where name='Computer Science'), 'Cybersecurity Fundamentals', 'Security principles, cryptography, and threats'),
((select id from tracks where name='Computer Science'), 'Mobile App Development', 'Building apps for Android/iOS'),
((select id from tracks where name='Computer Science'), 'Cloud Computing Basics', 'Cloud models, virtualization, and services'),
((select id from tracks where name='Computer Science'), 'Human-Computer Interaction', 'User interface design and usability'),
((select id from tracks where name='Computer Science'), 'Parallel and Distributed Computing', 'Concurrency, parallelism, and distributed systems'),
((select id from tracks where name='Computer Science'), 'Machine Learning Foundations', 'ML concepts, algorithms, and applications')
on conflict do nothing; 