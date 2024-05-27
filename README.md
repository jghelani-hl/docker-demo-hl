Let’s start with what Docker is and why it is a great tool for engineers. Docker is a containerization platform that allows you to package, ship and run specific applications in isolated environments. It does that using containers and images.

I went to school for cooking so this example makes sense to me:

Imagine you're a chef, and you need to cook different dishes for your customers. You want each dish to be prepared in its own special way, with its own ingredients and cooking techniques. Then imagine that you want to build a franchise or open up pop-up locations with these same dishes and maintain quality control to ensure it always tastes the same no matter where you open your locations up.

Docker helps with this. Instead of using physical pots and pans or a physical kitchen, you use virtual "containers" that can hold all the ingredients, recipes and cooking equipment needed for each dish. Docker containers are like self-contained kitchens that can be easily set up, used, and taken down as needed. Just like pop-up restaurants or franchises, you take the recipes, ingredients and equipment (or images) for your items and use them for each location (aka spin up new containers based on these images or recipes). It ensures that you have the same reproducible code and environments each time you spin up a container with those images.

So what are containers and images.

# Intro

## Images

Images are like pre-built templates of your kitchen. It contains everything you need in order to cook a specific dish.

## Containers

When you want to cook a new dish, you create a whole new kitchen specifically just for that dish. Not really what you would do in real life, but in the world of Docker and containerization, we always want a container to do one specific task. So in this case, a container is an environment that runs an image. You can create as many containers as you want based on an image. Just like a franchise - you have your recipes and equipment as an image. Now you can open as many locations based on that image of recipes and equipment.

# Benefits

These are the benefits of using Docker:

- Isolation: Each container is self-contained and doesn't affect other containers or your local machine
- Portability: Containers are extremely lightweight and easy to move between environments (like dev to staging to prod)
- Reusability: You can reuse the same image to create multiple containers, making it easy to deploy and manage applications to various environments with their own specific needs.

# Demo

There are various ways to create images and run containers. You can either use pre-built images from docker hub or private repos, or you can create your own images.

Let’s look at all these options starting from terminal commands to then using Dockerfile to build images and then finally using docker-compose for multi-container setups.

## Docker Run

The simplest way of starting a docker container is by using a pre-built image. We will use Node as an example in the demos today, but there are pre-built images for various environments - depending on your needs.

To run a docker container, you simply write the following:

```powershell
docker run --rm -it --name demo-node node:latest
```

Ignoring some flags, lets talk about this command:

- `docker run` indicates that we want to run a container
- `--rm` tells docker that we want to remove the container once it stops running. This is useful for when you want to run a container once and then remove it after it stops running. More on this later when we talk about utility containers
- `-it` tells docker that we want to enable interactive mode (Keep STDIN open) and allocate a pseudo-TTY. Basically allows us to use an interactive terminal
- `--name` tells docker that we want to give this container a name. If we don’t add this flag docker will give it a random name
- `node:latest` tells docker that we want to run this container based on the `node` image. This is an image that is available on Docker Hub and the `latest` tag tells docker we want to use the `node` image with the `latest` tag. More on that later

What this command will do is create and run a container called `demo-node` based off of the official Node image from docker hub and then by default run it in `attached` mode and also tell it that we want to interact with it through a terminal.

Now we can run commands in the terminal using the node interpreter as you would as if you were running a node shell on your local environment.

So what is so special about this? It may not be as exciting through this one example, but what if you didn't have node installed on your system. Let’s take it a step further, what if you are working on a project that requires a specific version of node while the rest of your other projects run on other versions of node. If you don’t have `nvm` installed on your machine locally, you have to constantly install/uninstall versions of node just to run one project.

Hopefully now you can see how this is useful. Docker allows you to run these containers in isolation - disregarding other containers - in their own environments without having to have those environments installed or set up on your local machine. We will see some other great examples as we go on to see other complex setups.

Let's stop the container by typing `exit` in the terminal. This will stop the container and remove it because we used the `--rm` flag. If you didn't use the `--rm` flag, or if you started the container in `detached` mode, you can stop the container by running `docker stop <container-name>`. More on that later.

## Docker Build

Great! We can run images like Node or Nginx but is that all we can do? This is just scratching the surface. Let’s talk about more real-life examples starting with building our own images.

Let’s say you have a node application with some endpoints that you are working on. This is a great little example to demonstrate how you can containerize your app from your own image of your application.

Here is a quick little node application that returns a `{message: 'Hello World!'}` response when you call the `[app]/` endpoint. Nothing crazy, but let’s say you don’t have node installed on your system, and you don’t really want to install it on your system for this small application, and you don't really want to install the local dependencies in the `node_modules` folder.

You do notice that the project has a `Dockerfile` which is great for you because you are an awesome engineer and have Docker installed on your local machine.

You examine the `Dockerfile` and see that it’s a really simple set of instructions to build an image for this node application. Let’s examine it:

```docker
FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]
```

- `FROM` tells Docker that we want to build our image on top of the latest node environment image that is available on Docker Hub. There are other environments that you can build on including Nginx, Mongo and many others. But because we are building a Node app, it makes sense for us to the Node image.
- `WORKDIR` tells Docker that when you create this image, set the working directory to the `/app` path inside the image
- `COPY package.json .` tells Docker that you want to copy `package.json` to `.` inside the image. `.` Represents the working directory of our image which we have set to `/app` above
- `RUN` tells Docker that when you start to create the image, run the `npm install` command
- `COPY . .` tells Docker to copy everything from the context of your local machine to the context of the working directory in the image
- `CMD ["npm", "start"]` tells node that when the image is run by the container, run this command. It’s important to note that this doesn't happen during build time - therefore there’s a differentiation between running `RUN npm install` and `CMD ["npm", "start"]`

Great, the Dockerfile has instructions on running this node app in a container, so how do we actually run this image. We use the `docker build` command:

```powershell
docker build -t demo-node:latest .
```

Let’s break this down:

- `docker build` tells docker that we want to build an image
- `-t demo-node:latest` tells docker that we want to name our image `demo-node` and tag it as `:latest` . This allows us for versioning our images
- `.` tells docker that we want to use the current directory on our local machine as the build context. What this does is it looks inside this directory for a file called `Dockerfile` and runs all the commands from the `Dockerfile` with the current directory as its context. For more complex options, you can set the context as whatever path you like and pass a `-f` flag to specify the path and name of the docker file that you want to use if you have it saved somewhere else

Great! We built the image, but it didn't do anything. I can’t access [localhost:3000](http://localhost:3000) to access my app’s API. That’s because building an image is just one part of the equation. You always need a container to run an image. To run this image we can use a similar command as the one we saw before to run the official node image in a container, except we will use our own image this time.

Simply run:
    
    ```powershell
    docker run --rm -it -p 3000:3000 --name demo-node-app demo-node:latest
    ```

- `docker run` tells docker that we want to run a container
- `--rm` tells docker that we want to remove the container once it stops running
- `-it` tells docker that we want to enable interactive mode (Keep STDIN open) and allocate a pseudo-TTY
- `-p 3000:3000` tells docker that we want to map port 3000 on our local machine to port 3000 on the container. This is important because the node app is running on port 3000 inside the container. If we don’t map the ports, we won’t be able to access the app from our local machine
- `--name` tells docker that we want to give this container a name
- `demo-node:latest` tells docker that we want to run this container based on the `demo-node` image that we built earlier

Now you can access your app at [localhost:3000](http://localhost:3000) and see the `{message: 'Hello World!'}` response if you use the browser or tools like Postman or other HTTP calling methods.

This is a great example of how you can containerize your applications and run them in isolated environments without having to install the dependencies on your local machine. This is especially useful when you have multiple projects that require different versions of dependencies or when you want to share your project with others without having to worry about them setting up their environments.

You will notice that the terminal is still running the container, and you can't make any other input commands. This is because by default Docker runs containers in the foreground in `attached` mode. If you want to run the container in the background (`detached` mode), you can add the `-d` flag to the `docker run` command. This will run the container in detached mode. You can still access the logs of the container by running `docker logs <container-name>`. You can also attach to the container by running `docker attach <container-name>`.

To get the container name, you can run `docker ps` to see all the running containers. You can also see all the containers that have run in the past by running `docker ps -a`.

To stop the container, you can run `docker stop <container-name>`. If you want to remove the container, you can run `docker rm <container-name>`. If you want to remove the image, you can run `docker rmi <image-name>`.

Let's open another terminal and run `docker ps` to see the running containers. You will see that the container is running. Now let’s stop the container by running `docker stop demo-node-app`. You can also stop a container by using the `CONTAINER ID` instead of the name. You don't have to type out the whole ID; you can just type the first few characters of the ID and docker will stop the container for you. If you run `docker ps` again, you will see that the container is no longer running. If you run `docker ps -a`, you will see that the container is still there, but it’s in an exited state. If you want to remove the container, you can run `docker rm demo-node-app`. If you run `docker ps -a` again, you will see that the container is no longer there.

To see a list of all the images that you have built, you can run `docker images`. You will see a list of all the images that you have built. If you want to remove the image you just built, you can run `docker rmi demo-node:latest`. If you run `docker images`, you will see that the image is no longer there. You can also remove multiple images by adding multiple image names to the `docker rmi` command. 

If you want to remove all the images that you have built, you can run `docker rmi $(docker images -q)`. This will remove all the images that you have built. If you want to remove all the containers that you have run, you can run `docker rm $(docker ps -a -q)`. You can also run `docker system prune` to remove all the stopped containers, all the dangling images, and all the unused networks. Be careful with this command because it will remove all the stopped containers, all the dangling images, and all the unused networks. To only prune images, you can run `docker image prune`. To only prune containers, you can run `docker container prune`. To only prune networks, you can run `docker network prune`. Pruning is a great way to clean up your system and remove all the unused containers, images, and networks.

## Docker Network

Great! We have seen how to build images and run containers. But what if you want to run multiple containers that need to communicate with each other? This is where Docker networks come in.

Docker networks allow you to create a network that your containers can connect to. This is useful when you have multiple containers that need to communicate with each other. You can create a network and attach your containers to that network. This way your containers can communicate with each other without having to expose ports to the outside world.

Let’s say you have a node application that connects to a MongoDB database. You want to run both the node app and the MongoDB database in containers. You can create a network and attach both the node app and the MongoDB database to that network. This way the node app can connect to the MongoDB database without having to expose the MongoDB port to the outside world.

To create a network, you can run:

```powershell
docker network create demo-network
```

This will create a network called `demo-network`. You can see all the networks that you have created by running `docker network ls`. You can also see all the networks that your containers are attached to by running `docker network inspect <network-name>`.

Now let’s run a MongoDB container and attach it to the `demo-network` network:

```powershell
docker run --rm -d --network demo-network --name demo-mongo mongo:latest
```

- `docker run` tells docker that we want to run a container
- `--rm` tells docker that we want to remove the container once it stops running
- `-d` tells docker that we want to run the container in detached mode
- `--network demo-network` tells docker that we want to attach this container to the `demo-network` network
- `--name demo-mongo` tells docker that we want to give this container a name
- `mongo:latest` tells docker that we want to run this container based on the `mongo` image that is available on Docker Hub
- `latest` tells docker that we want to use the `latest` tag of the `mongo` image

If you run `docker ps`, you will see that the MongoDB container is running. If you run `docker network inspect demo-network`, you will see that the MongoDB container is attached to the `demo-network` network.

Now let’s run a node app container and attach it to the `demo-network` network:

```powershell
docker run --rm -it -p 3000:3000 --network demo-network --name demo-node-app demo-node:latest
```

- `docker run` tells docker that we want to run a container
- `--rm` tells docker that we want to remove the container once it stops running
- `-it` tells docker that we want to enable interactive mode (Keep STDIN open) and allocate a pseudo-TTY
- `-p 3000:3000` tells docker that we want to map port 3000 on our local machine to port 3000 on the container
- `--network demo-network` tells docker that we want to attach this container to the `demo-network` network
- `--name demo-node-app` tells docker that we want to give this container a name
- `demo-node:latest` tells docker that we want to run this container based on the `demo-node` image that we built earlier
- `latest` tells docker that we want to use the `latest` tag of the `demo-node` image

Now you can access your app at [localhost:3000](http://localhost:3000) and see the `{message: 'Hello World!'}` response. If you run `docker ps`, you will see that both the MongoDB container and the node app container are running. If you run `docker network inspect demo-network`, you will see that both the MongoDB container and the node app container are attached to the `demo-network` network.

Something interesting to note is that the node app container can connect to the MongoDB container using the container name. This is because Docker automatically creates a DNS entry for each container that is attached to a network. This allows you to connect to other containers using the container name as the hostname. This is useful when you have multiple containers that need to communicate with each other. If you look at the code inside `index.js`, you will notice that we are using the container name as the hostname to connect to the MongoDB database. This is because the node app container can connect to the MongoDB container using the container name as the hostname. It's important to note that this will only work if the containers are attached to the same network and if the container calls are made from within the container. If, for example, you have a React app that is running on your local machine, and you want to connect to the node app container, you will have to use the IP address of the node app container (or localhost) instead of the container name, and you have to make sure that you are exposing port 3000 on the node container. This is because the React app is executed on the browser and not within the container, so you will not get DNS resolution from the browser run code.

When we talk about Docker Compose, we will see how we can define networks and attach containers to networks in a more structured way.

## Volumes and Mounts

Until now, we have seen how to build images, run containers, and create networks. But what if you want to persist data between container restarts? This is where Docker volumes and mounts come in. By default, docker containers are stateless. This means that when a container stops running, all the data inside the container is lost. If you want to persist data between container restarts, you can use Docker volumes and mounts. it is important to note that you are not modifying the image itself, but you are modifying the container that is running the image.