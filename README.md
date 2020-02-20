# Monolith to Microservices

Taking the Udacity Cloud Developer Nanodegree Project 2 and converting the monolith into microservices via Docker and Docker Compose. 

### Development Notes

To run the application, from the command line, run: 
* `docker-compose up --build` to run the apps
* `docker ps` to see running containers, note the name of the container you want to access
* `docker exec -it microservices1_client_1 bash` to access bash on client service
* `curl http://localhost:8100` to get what is running on localhost:8100 in that container
* `exit` to exit bash on the running container
* `docker-compose down` to stop the apps
* `docker-compose exec users-feed-db pswl -U postgres` to connect to the DB via PSQL
* `\l` to list the databases
* `\c db` to connect to the database
* `\dt` to list the relations, you should see tables for `User` and `FeedItem`
* `SELECT * FROM "User";` will return all values in the Users table, there should not be any
* `SELECT * FROM "FeedItem";` will return all values in the FeedItem table, there should not be any



You should find the different services on the following ports: 

* /users: http://localhost:8082
* /feed: http://localhost:8081
* /client: http://localhost:8000