# Monolith to Microservices

[![Build Status](https://travis-ci.com/nicholaspretorius/cloud-nd-microservices-1.svg?branch=master)](https://travis-ci.com/nicholaspretorius/cloud-nd-microservices-1)

### Reviewer Notes

Thank you for reviewing my project!

Please see below for submission details as laid out by the [Project Rubric](https://review.udacity.com/#!/rubrics/2572/view).

### GitHub

* `git checkout https://github.com/nicholaspretorius/cloud-nd-microservices-1.git`

### DockerHub

* [REST API Users](https://hub.docker.com/r/nicholaspretorius/ncp-clound-project3-restapi-user)
* [REST API Feed](https://hub.docker.com/r/nicholaspretorius/ncp-clound-project3-restapi-feed)
* [Reverse Proxy](https://hub.docker.com/r/nicholaspretorius/ncp-clound-project3-restapi-reverseproxy)
* [Client](https://hub.docker.com/r/nicholaspretorius/ncp-clound-project3-restapi-client)

#### Screenshots

#### Travis CI Screenshot

Screenshot of passing Travis CI build:

![Travis CI Screenshot](/images/travis-ci-passing.png)

#### kubectl Screenshot

Screenshot of running pods and services from kubectl:

![kubectl Screenshot](/images/kubectl-pods-services.png)

#### App Screenshot

Screenshot of live client app on AWS [URL](http://a8e8b3e6ab880427fa823f7970f5d8d6-1669744884.eu-west-1.elb.amazonaws.com:8100): 

![App Screenshot](/images/app-screenshot.png)


### Development Notes

This application uses Docker for development. 

To run the development application, from the command line, run: 
* `docker-compose up --build` to run the apps
* `docker ps` to see running containers, note the name of the container you want to access
* `docker exec -it microservices1_client_1 bash` to access bash on client service
* `curl http://localhost:8100` to get what is running on localhost:8100 in that container
* `exit` to exit bash on the running container
* `docker-compose exec users-feed-db psql -U postgres` to connect to the DB via PSQL
* `\l` to list the databases
* `\c db` to connect to the database
* `\dt` to list the relations, you should see tables for `User` and `FeedItem`
* `SELECT * FROM "User";` will return all values in the Users table, there should not be any
* `SELECT * FROM "FeedItem";` will return all values in the FeedItem table, there should not be any
* `DELETE FROM "FeedItem";` to delete all items in FeedItem
* `docker-compose down` to stop the apps

### Production docker-compose

To run the "production" docker-compose file (which uses an AWS RDS) as well as the AWS URL (instead of the local API), run the following from the command-line: 

`docker-compose -f docker-compose.prod.yml up --build`

### URLS

You should find the different services on the following ports: 

* /users: http://localhost:8082
* /feed: http://localhost:8081
* /client: http://localhost:8100

With the nginx reverse proxy, which the client reads, you will find them here: 

* /users: http://localhost:8080/api/v0/users
* /feed: http://localhost:8080/api/v0/feed

### Docker

Kubernetes deployments require your containers to be located in a registry, as such, you need to push your containers to a registry, such as Docker Hub, AWS ECR (Elastic Container Registry) or similar. In order to do so, you need to name your local image with the name of your registry and tag it. Then push the image to the registry. 

*Note: When pushing to GitHub, Travis CI builds the images and pushes them to DockerHub. You do not need to manually push to DockerHub, the commands below are notes on how to do them manually for information purposes.*

*Docker Repository Note: The registry used needs to be the prefix of the tagged image, for example: registryname/imagename:tagname. This is how Docker knows which registry to push to.*

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

### kubectl

Check your kubectl version: `kubectl version`

Create your secrets as follows: 

1. Manually: `echo -n stringToConvert | base64`
3. `kubectl apply -f ./aws-secret.yaml`
2. Generate: `kubectl create secret generic aws-secret --from-literal=DB_USER='exampleuser' --from-literal=DB_PASS='examplepass' --from-literal=JWT_SECRET='examplesecret'`

Alternately, you can run from a file as follows: `kubectl create secret generic aws-secret --from-file=./AWS_USERNAME --from-file=./AWS_PASSWORD `

If run correctly, you can now view your secrets as follows: 

* `kubectl get secret aws-secret -o yaml`
* `kubectl describe secrets/aws-secret`

### Travis CI

Travis CI will build once a push to GitHub has happened. If you want to skip a CI build, i.e. for updates to files that do not impact build, then you can commit as follows: 

`git commit -m "docs: Update docs [skip ci]"`

Note the use of the `[skip ci]` indicator in the Git commit message. 

### Terraform

The application uses Terraform to provision AWS infrastructure and then uses kubectl to to run the containers.

There is a terraform folder containing Terraform variables, specifically, pay attention to `terraform.tfvars` and modify where appropriate. 

Note that the [default] AWS credentials are used from `~/aws/credentials`. i.e. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY need to be specified as environment variables in your Terminal. Instead of manually setting these in each Terminal session, you can add these to: `~/.bashrc` and then, from the command line, run `source ~/.bashrc` in order to activate the latest vars there. 

#### SSH

You need an SSH key to successfully run the Terraform commands. Take a look here for background on how to add your SSH key: https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

* `eval "$(ssh-agent -s)"` start SSH agent in background
* `ssh-add -K ~/.ssh/id_rsa` Add SSH key to ssh-agent and store passphrase in keychain

You will need to run these SSH commands every time you have a new terminal session and want to interact with the cluster. 

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
* `export KUBECONFIG=$PWD/project3-tf-v7-kubeconfig`

In order to create your configmaps, deployments and services, run the following: 

Make sure to first create deployments for feed and users, wait for them to be up and running and then create services for feed and users. Only once these are all complete, do you create the deployment for the reverseproxy, the service for reverseproxy and finally, the deployment and service for client. 

* `kubectl apply -f ./udacity-c3-deployment/k8s/env-configmap.yaml`
* `kubectl get configmaps`
* `kubectl apply -f ./udacity-c3-deployment/k8s/users.deployment.yaml`
* `kubectl get deploy`
* `kubectl get pods`
* `kubectl describe pods podnamehere`
* `kubectl logs podname-7bdc944cdb-kn9wv`

Create rest of deployments:

* `kubectl apply -f ./udacity-c3-deployment/k8s/feed.deployment.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/client.deployment.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/reverseproxy.deployment.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/users.service.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/feed.service.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/client.service.yaml`
* `kubectl apply -f ./udacity-c3-deployment/k8s/reverseproxy.service.yaml`


* `kubectl get machinedeployments -n kube-system`
* `kubectl scale machinedeployment/project3-tf-v3-eu-west-1a -n kube-system --replicas=2` scale up
* `kubectl scale machinedeployment/project3-tf-v3-eu-west-1a -n kube-system --replicas=0` scale down
* `kubeone reset ./terraform/config.yaml --tfjson ./terraform/tf.json`
* `terraform destroy`

Make sure to check your AWS resources afterwards, chances are, not everything will be deleted and you need to be sure the resources are gone!

If you need to convert the format of your deployments due to API version errors: 

* `kubectl convert -f ./udacity-c3-deployment/k8s/users.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/feed.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/client.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/reverseproxy.deployment.yaml --output-version apps/v1` 
* `kubectl convert -f ./udacity-c3-deployment/k8s/users.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/feed.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/client.deployment.yaml --output-version apps/v1`
* `kubectl convert -f ./udacity-c3-deployment/k8s/reverseproxy.deployment.yaml --output-version apps/v1`

### Other

Below are more useful commands: 

* `kubectl get services`
* `kubectl get pods`
* `kubectl get pods -o wide`
* `kubectl get pods reverseproxy-7bdc944cdb-s7d4n --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'`
* `kubectl get rs`
* `kubectl port-forward services/reverseproxy 8080:8080`
* `kubectl port-forward services/client 8100:8100`
* `kubectl port-forward services/reverseproxy 8080:8080 &` to run in background, then pres `fg` to get it back into foreground
* `kubectl expose deployment/reverseproxy --type="NodePort" --port 8080`
* `kubectl set image deployments/client client=nicholaspretorius/ncp-clound-project3-restapi-client:latest`
* `kubectl set image deployments/restapi-users restapi-users=nicholaspretorius/ncp-clound-project3-restapi-user:latest`
* `kubectl set image deployments/restapi-feed restapi-feed=nicholaspretorius/ncp-clound-project3-restapi-feed:latest`
* `kubectl rollout status deployments/client`
* `kubectl scale deployment client --replicas=0 -n service`
* `kubectl scale deployment reverseproxy --replicas=0 -n service`

### eksctl and kubectl

This project does not currently use eksctl, but during development, it was experimented with, these notes are only for reference. 

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

### Cleanup

To delete everything you can run: 

* `eksctl delete cluster --name=name-here`

Then run through all the deployments and service deletions as follows: 

* `kubectl delete -f ./udacity-c3-deployment/k8s/users.service.yaml`
* `kubectl delete -f ./udacity-c3-deployment/k8s/users.deployment.yaml`   

### Miscellaneous Notes and k8s Tutorial Notes

* `kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2`
* `kubectl describe services/kubernetes-bootcamp`
* `export NODE_PORT=$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}'`
* `echo NODE_PORT=$NODE_PORT`
* `curl $(minikube ip):$NODE_PORT`
* `kubectl rollout status deployments/kubernetes-bootcamp`
* `kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10` fetch image that does not exist...
* `kubectl get deployments` see not all are ready...
* `kubectl get pods` will show new pods erroring...
* `kubectl rollout undo deployments/kubernetes-bootcamp` undo rollout... 
* `kubectl get pods` back to normal, only running pods
* `kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080` expose service 
* `kubectl get services` view service details
* `kubectl describe services/kubernetes-bootcamp` see further details
* `export NODE_PORT=$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')`
* `echo NODE_PORT=$NODE_PORT`
* `curl $(minikube ip):$NODE_PORT`
* `kubectl describe deployment` describe deployment, take not of the "label" field, which is run=kubernetes-bootcamp
* `kubectl get pods -l run=kubernetes-bootcamp` get pods with that label (-l)
* `kubectl get services -l run=kubernetes-bootcamp` can use for services too
* `export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')` store pod name
* `echo Name of the Pod: $POD_NAME` display pod name
* `kubectl label pod $POD_NAME app=v1` give pod a new label
* `kubectl describe pods $POD_NAME` see pod has nee label
* `kubectl get pods -l app=v1` query with new label
* `kubectl delete service -l run=kubernetes-bootcamp` delete service
* `kubectl get services` see NodePort service no longer available
* `curl $(minikube ip):$NODE_PORT` failed to connect (since it no longer exists)
* `kubectl exec -ti $POD_NAME curl localhost:8080` confirm app is still running on internal cluster

Further notes on k8s:

When you see values "port" and "targetPort": 
* "port" is the port on the external IP 
* "targetPort" is the port on the container. 
* `port-forward` is only a means of debugging, it is not a practical means of making containers available. 


