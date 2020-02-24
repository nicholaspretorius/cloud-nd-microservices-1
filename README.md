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

### eksctl

To setup and run the clusters take a look at the `k8s/cluster.yaml`. 

Then run: 

* `eksctl create cluster -f k8s/cluster.yaml`

### Terraform

There is a terraform folder containing Terraform variables, specifically, pay attention to `terraform.tfvars` and modify where appropriate. 

Note that the [default] AWS credentials are used from `~/aws/credentials`. i.e. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY need to be specified as environment variables in your Terminal. Instead of manually setting these in each Terminal session, you can add these to: `~/.bashrc` and then, from the command line, run `source ~/.bashrc` in order to activate the latest vars there. 

Commands to run in order to setup KubeOne on AWS infrastructure via Terraform: 

* `terraform version` check Terraform version
* `kubeone version` check KubeOne version
* `cd/terraform && terraform init` Initialise Terraform
* `terraform plan` shows what Terraform will setup for you
* `terraform plan -out plan` outputs a non-human readable Terraform plan, in order to see what the plan outputs, run the following command: 
* `terraform show -json plan`
* `terraform apply`