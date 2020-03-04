# Monolith to Microservices

[![Build Status](https://travis-ci.com/nicholaspretorius/cloud-nd-microservices-1.svg?branch=master)](https://travis-ci.com/nicholaspretorius/cloud-nd-microservices-1)

Taking the Udacity Cloud Developer Nanodegree Project 2 and converting the monolith into microservices via Docker and Docker Compose. 

### Development Notes

To run the application, from the command line, run: 
* `docker-compose up --build` to run the apps
* `docker ps` to see running containers, note the name of the container you want to access
* `docker exec -it microservices1_client_1 bash` to access bash on client service
* `curl http://localhost:8100` to get what is running on localhost:8100 in that container
* `exit` to exit bash on the running container
* `docker-compose down` to stop the apps
* `docker-compose exec users-feed-db psql -U postgres` to connect to the DB via PSQL
* `\l` to list the databases
* `\c db` to connect to the database
* `\dt` to list the relations, you should see tables for `User` and `FeedItem`
* `SELECT * FROM "User";` will return all values in the Users table, there should not be any
* `SELECT * FROM "FeedItem";` will return all values in the FeedItem table, there should not be any

### Production docker-compose

To run the "production" docker-compose file, run the following from the command-line: 

`docker-compose -f docker-compose.prod.yml up --build`


You should find the different services on the following ports: 

* /users: http://localhost:8082
* /feed: http://localhost:8081
* /client: http://localhost:8100

With the proxy, which the client reads, you will find them here: 

* /users: http://localhost:8080/api/v0/users
* /feed: http://localhost:8080/api/v0/feed

### Docker

Kubernetes deployments require your containers to be located in a registry, as such, you need to push your containers to a registry, such as Docker Hub, AWS ECR (Elastic Container Registry) or similar. In order to do so, you need to name your local image with the name of your registry and tag it. Then push the image to the registry. 

*Note: The registry used needs to be the prefix of the tagged image, for example: registryname/imagename:tagname. This is how Docker knows which registry to push to.*

*Docker can push to any registry it has been logged into. You can check these registries by looking at the "auth" contents in the config.json file in `~/.Docker/config.json`.*

Login: 

* `docker login --username=yourhubusername --email=youremail@company.com`

Example:

* `docker tag local-image:tagname new-repo:tagname`
* `docker push new-repo:tagname`

Practice: 

* `docker tag microservices1_restapi-user nicholaspretorius/ncp-clound-project3-restapi-user:v2`
* `docker push nicholaspretorius/ncp-clound-project3-restapi-user:v2`

* `docker tag microservices1_restapi-feed nicholaspretorius/ncp-clound-project3-restapi-feed:v2`
* `docker push nicholaspretorius/ncp-clound-project3-restapi-feed:v2`
* `docker tag microservices1_client nicholaspretorius/ncp-clound-project3-restapi-client:v2`
* `docker push nicholaspretorius/ncp-clound-project3-restapi-client:v2`
* `docker tag microservices1_reverseproxy nicholaspretorius/ncp-clound-project3-restapi-reverseproxy:v2`
* `docker push nicholaspretorius/ncp-clound-project3-restapi-reverseproxy:v2`


### eksctl and kubectl

To setup and run the clusters take a look at the `k8s/cluster.yaml`. 

Create your secrets as follows: 

1. Manually: `echo -n stringToConvert | base64`
3. `kubectl apply -f ./aws-secret.yaml`
2. Generate: `kubectl create secret generic aws-secret --from-literal=DB_USER='exampleuser' --from-literal=DB_PASS='examplepass' --from-literal=JWT_SECRET='examplesecret'`

Alternately, you can run from a file as follows: `kubectl create secret generic aws-secret --from-file=./AWS_USERNAME --from-file=./AWS_PASSWORD `

If run correctly, you can now view your secrets as follows: 

* `kubectl get secret aws-secret -o yaml`
* `kubectl describe secrets/aws-secret`

Then run: 

* `eksctl version`
* `kubectl version`
* `kubectl get secrets`
* `kubectl delete secrets env-secret.yaml`
* `eksctl create cluster -f cluster.yaml`
* `eksctl create cluster --name ncp-cloudnd-project3-v6`
* `eksctl utils update-cluster-logging --region=eu-west-1 --cluster=microservices1-cluster2`
* `eksctl create cluster --name=eksworkshop-eksctl --nodes=3 --managed --alb-ingress-access --region=${AWS_REGION}`
* `kubectl cluster-info`
* `kubectl config view`
* `eksctl delete cluster --name=ncp-cloudnd-project3-v6`
* `kubectl get nodes`
* `kubectl get service client -o wide`

In order to create your configmaps, deployments and services, run the following: 

* `kubectl apply -f ./udacity-c3-deployment/k8s/env-configmap.yaml`
* `kubectl get configmaps`
* `kubectl apply -f ./udacity-c3-deployment/k8s/users.deployment.yaml`
* `kubectl get deploy`
* `kubectl get pods`
* `kubectl describe pods podnamehere`
* `kubectl logs podname-7bdc944cdb-kn9wv`
* `kubectl apply -f ./udacity-c3-deployment/k8s/feed.deployment.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/client.deployment.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/reverseproxy.deployment.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/users.service.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/feed.service.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/client.service.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/reverseproxy.service.yaml`
* `kubectl convert -f ./udacity-c3-deployment/k8s/users.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/feed.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/client.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/reverseproxy.deployment.yaml --output-version apps/v1`
* `kubectl get services`
* `kubectl get pods`
* `kubectl get pods -o wide`
* `kubectl get pods reverseproxy-7bdc944cdb-s7d4n --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'`
* `kubectl get rs`
* `kubectl port-forward services/reverseproxy 8080:8080`
* `kubectl port-forward services/client 8100:8100`
* `kubectl port-forward services/reverseproxy 8080:8080 &` to run in background, then pres `fg` to get it back into foreground

### Cleanup

To delete everything you can run: 

* `eksctl delete cluster --name=name-here`

Then run through all the deployments and service deletions as follows: 

* `kubectl delete -f ./udacity-c3-deployment/k8s/users.service.yaml`
* `kubectl delete -f ./udacity-c3-deployment/k8s/users.deployment.yaml`



### Travis CI

Travis CI will build once a push to GitHub has happened. If you want to skip a CI build, i.e. for updates to files that do not impact build, then you can commit as follows: 

`git commit -m "docs: Update docs [skip ci]"`

Note the use of the `[skip ci]` indicator in the Git commit message. 

### Terraform

*Note: Terraform is not currently being used*

There is a terraform folder containing Terraform variables, specifically, pay attention to `terraform.tfvars` and modify where appropriate. 

Note that the [default] AWS credentials are used from `~/aws/credentials`. i.e. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY need to be specified as environment variables in your Terminal. Instead of manually setting these in each Terminal session, you can add these to: `~/.bashrc` and then, from the command line, run `source ~/.bashrc` in order to activate the latest vars there. 

#### SSH

You need an SSH key to successfully run the Terraform commands. Take a look here for background on how to add your SSH key: https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

* `eval "$(ssh-agent -s)"` start SSH agent in background
* `ssh-add -K ~/.ssh/id_rsa` Add SSH key to ssh-agent and store passphrase in keychain

Commands to run in order to setup KubeOne on AWS infrastructure via Terraform: 

* `terraform version` check Terraform version
* `kubeone version` check KubeOne version
* `cd/terraform && terraform init` Initialise Terraform
* `terraform plan` shows what Terraform will setup for you
* `terraform plan -out plan` outputs a non-human readable Terraform plan, in order to see what the plan outputs, run the following command: 
* `terraform show -json plan`
* `terraform apply`
* `terraform output -json > tf.json`
* `kubeone install config.yaml --tfjson tf.json`
* `export KUBECONFIG=$PWD/project3-tf-v2-kubeconfig`
* `kubectl get machinedeployments -n kube-system`
* `kubectl scale machinedeployment/project3-tf-v2-eu-west-1a -n kube-system --replicas=2` scale up
* `kubectl scale machinedeployment/project3-tf-v2-eu-west-1a -n kube-system --replicas=0` scale down
* `kubeone reset config.yaml --tfjson tf.json`
* `terraform destroy`
* `kubectl convert -f ./udacity-c3-deployment/k8s/users.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/feed.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/client.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/reverseproxy.deployment.yaml --output-version apps/v1`