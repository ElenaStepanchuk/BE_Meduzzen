# BE_Meduzzen

Back End repository

The application starts command "npm run start" in the terminal.
The tests runs command "npm run test" in the terminal.

Build docker image command "docker build -t be-meduzen-docker ."

The application starts in Docker command the "docker run -d -p 8080:5000 be-meduzen-docker" in the terminal.

The tests runs in Docker command "docker run be-meduzen-docker-test" in the terminal.

Migrations

For generate migrations command "npm run migrations:generate" in terminal.

For run migrations and add all tables in data base command "npm run migrations:run" in terminal.

For revert migrations command "npm run migrations:revert" in terminal.
