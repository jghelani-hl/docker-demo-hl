# Docker

## Intro

Docker is a containerization platform that allows you to package, ship and run specific applications in isolated environments. It does that using containers and images.

I went to school for cooking so this example makes sense to me:

Imagine you're a chef, and you need to cook different dishes for your customers. You want each dish to be prepared in its own special way, with its own ingredients and cooking techniques and equipment. Then imagine that you want to build a franchise or open up pop-up locations with these same dishes and maintain quality control to ensure it always tastes the same no matter where you open your locations up.

Docker helps with this. Instead of using physical pots and pans or a physical kitchen, you use virtual "containers" that can hold all the ingredients, recipes and cooking equipment needed for each dish. Docker containers are like self-contained kitchens that can be easily set up, used, and taken down as needed. Just like pop-up restaurants or franchises, you take the recipes, ingredients and equipment (or images) for your items and use them for each location (aka spin up new containers based on these images or recipes). It ensures that you have the same reproducible code and environments each time you spin up a container with those images.

So what are containers and images.

## Images

Images are like pre-built templates of your kitchen. It contains everything you need in order to cook a specific dish all bundled up in one template. You can't run docker containers without images. You can think of images as the recipes and equipment needed to cook a dish. You can create your own images or use pre-built images from Docker Hub or private repos.

## Containers

When you want to cook a new dish, you create a whole new kitchen specifically just for that dish. Not really what you would do in real life, but in the world of Docker and containerization, we always want a container to do one specific task. So in this case, a container is an environment that runs an image. You can create as many containers as you want based on an image. Just like a franchise - you have your recipes and equipment as an image. Now you can open as many locations based on that image of recipes and equipment. To be more efficient in our kitchens we will talk about multi-container setups later on so that you can have one kitchen create more than just one dish.

# Benefits

These are the benefits of using Docker:

- Isolation: Each container is self-contained and doesn't affect other containers or your local machine
- Portability: Containers are extremely lightweight and easy to move between environments (like dev to staging to prod)
- Reusability: You can reuse the same image to create multiple containers, making it easy to deploy and manage applications to various environments with their own specific needs.

# Demo

All this technical talk is great, but let's see how this works in practice. Let's start by installing Docker on your local machine. You can download Docker Desktop from [here](https://www.docker.com/products/docker-desktop). Docker Desktop is available for Windows and macOS. If you are using Linux, you can install Docker Engine. You can find the installation instructions for Docker Engine [here](https://docs.docker.com/engine/install/).

I have Docker Desktop installed on my system, and I will show you that later, but while we are going through the demo, I will use the command line to interact with Docker. You can use the Docker Desktop GUI if you prefer. The commands are the same, but the GUI makes it easier to see what's going on.

There are various ways to create images and run containers. You can either use pre-built images from docker hub or private repos, or you can create your own images.

Let’s look at all these options starting from terminal commands to then using Dockerfile to build images and then finally using docker-compose for multi-container setups.

## Docker Run

The simplest way of starting a docker container is by using a pre-built image. We will use Node as an example in the demos today, but there are many other pre-built images for various environments - depending on your needs - all available on Docker Hub.

By the end of today, we will have an extremely simple MERN stack application set up with a React frontend, a Node backend, and a MongoDB database. We will use Docker to containerize each of these services and run them in isolated environments.

To run a docker container, you simply write the following:

```powershell
docker run --rm -it --name demo-node node:latest
```

Let's talk about this command:

- `docker run` indicates that we want to run a container
- `--rm` tells docker that we want to remove the container once it stops running. This is useful for when you want to run a container once and then remove it after it stops running. More on this later when we talk about utility containers
- `-it` tells docker that we want to enable interactive mode (Keep STDIN open) and allocate a pseudo-TTY. Basically allows us to use an interactive terminal
- `--name` tells docker that we want to give this container a name. If we don’t add this flag docker will give it a random name
- `node:latest` tells docker that we want to run this container based on the `node` image. This is an image that is available on Docker Hub and the `latest` tag tells docker we want to use the `node` image with the `latest` tag. More on that later

What this command will do is create and run a container called `demo-node` based off of the official Node image from docker hub and then by default run it in `attached` mode and also tell it that we want to interact with it through a terminal.

Now we can run commands in the terminal using the node interpreter just as you would if you were running a node shell on your local environment.

So what is so special about this? It may not be as exciting through this one example, but what if you didn't have node installed on your system. Let’s take it a step further, what if you are working on a project that requires a specific version of node while the rest of your other projects run on other versions of node. If you don’t have `nvm` installed on your machine locally, you have to constantly install/uninstall versions of node just to run one project.

Hopefully now you can begin to see how this is useful initially. Docker allows you to run these containers in isolation - disregarding other containers - in their own environments without having to have those environments or runtimes installed or set up on your local machine. We will see some other examples as we go on to see more complex setups.

Let's stop the container by typing `exit` in the terminal. This will stop the container and remove it because we used the `--rm` flag. If you didn't use the `--rm` flag, or if you started the container in `detached` mode, you can stop the container by running `docker stop <container-name>`. More on that later.

## Docker Build

Great! We can run images like Node or Nginx, but is that all we can do? This is just scratching the surface. Let’s talk about more real-life examples starting with building our own images.

Let’s say you have a node application with some endpoints that you are working on. This is a great little example to demonstrate how you can containerize your app from your own image of your application.

Here is a quick little node application that returns a `{message: 'Hello World!'}` response when you call the root `/` endpoint. Nothing crazy, but let’s say you don’t have node installed on your system, and you don’t really want to install it on your system for this small application, and you don't really want to install the local dependencies in the `node_modules` folder either. You just want to quickly spin this app up so that you can test the API locally.

You do notice that the project has a `Dockerfile` which is great for you because you are an awesome engineer and have Docker installed on your local machine.

You examine the `Dockerfile` and see that it’s a really simple set of instructions to build an image for this node application. Let’s examine it:

```docker
FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV MONGO_URI=mongodb://demo-mongo:27017

CMD [ "npm", "start" ]
```

- `FROM` tells Docker that we want to build our image on top of the latest node environment image that is available on Docker Hub. There are other environments that you can build on including Nginx, Mongo and many others. But because we are building a Node app, it makes sense for us to use the Node image.
- `WORKDIR` tells Docker that when you create this image, set the working directory to the `/app` path inside the image. This is the context of the image that we will be working in
- `COPY package.json .` tells Docker that you want to copy `package.json` to `.` inside the image. `.` Represents the working directory of our image which we have set to as `/app` above
- `RUN` tells Docker that when you start to build the image, run the `npm install` command
- `COPY . .` tells Docker to copy everything from the context of your local machine to the context of the working directory in the image
- `ENV MONGO_URI=mongodb://demo-mongo:27017` tells Docker that we want to set an environment variable called `MONGO_URI` with the value `mongodb://demo-mongo:27017`. This is useful when you want to set environment variables for your images and containers. We will see more on this later and talk about the hostname of the connection string as well when we talk about Docker networks
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
Everything is the same as before except for this time we are exposing a port. Let’s break this down:

- `-p 3000:3000` tells docker that we want to map port 3000 on our local machine to port 3000 on the container. This is important because the node app is running on port 3000 inside the container. If we don’t map the ports, we won’t be able to access the app from our local machine

Now you can access your app at [localhost:3000](http://localhost:3000) and see the `{message: 'Hello World!'}` response if you use the browser or tools like Postman or other HTTP calling methods.

This is a great example of how you can containerize your applications and run them in isolated environments without having to install the dependencies on your local machine. This is especially useful when you have multiple projects that require different versions of dependencies or when you want to share your project with others without having to worry about them setting up their environments.

You will notice that the terminal is still running the container, and you can't make any other input commands. This is because by default Docker runs containers in the foreground in `attached` mode. If you want to run the container in the background (`detached` mode), you can add the `-d` flag to the `docker run` command. This will run the container in detached mode and free up your terminal to continue using it without locking it up like it does in attached mode. You can still access the logs of the container by running `docker logs <container-name>`. You can also attach to the container by running `docker attach <container-name>`.

To get the container name, you can run `docker ps` to see all the running containers. You can also see all the containers that have run in the past but have not yet been removed by running `docker ps -a`.

To stop the container, you can run `docker stop <container-name>`. If you want to remove the container, you can run `docker rm <container-name>`. If you want to remove the image, you can run `docker rmi <image-name>`.

Let's open another terminal and run `docker ps` to see the running containers. You will see that the container is running. Now let’s stop the container by running `docker stop demo-node-app`. You can also stop a container by using the `CONTAINER ID` instead of the name. You don't have to type out the whole ID; you can just type the first few characters of the ID and docker will stop the container for you. If you run `docker ps` again, you will see that the container is no longer running. If you run `docker ps -a`, you will see that the container is still there, but it’s in an exited state. If you want to remove the container, you can run `docker rm demo-node-app`. If you run `docker ps -a` again, you will see that the container is no longer there.

To see a list of all the images that you have built, you can run `docker images`. If you want to remove the image you just built, you can run `docker rmi demo-node:latest`. If you run `docker images`, you will see that the image is no longer there. You can also remove multiple images by adding multiple image names to the `docker rmi` command.

## Environment Variables for Docker Build and Run

Great! We have seen how to build images and run containers. But what if you want to set environment variables for your images and containers? This is where environment variables come in. Environment variables allow you to set environment variables for your images and containers. This is useful when you want to set environment variables for things such as dev versus prod endpoints, or application credentials for different environments. You can set environment variables for your images and containers using the `ENV` instruction in the `Dockerfile` like you saw before or the `-e` flag in the `docker run` command.

Let’s say you have a node application that connects to a MongoDB database. You want to run the node app in a container and set the MongoDB connection string as an environment variable. You can set the environment variable in the `Dockerfile` using the `ENV` instruction or in the `docker run` command using the `-e` flag.

## Docker Network

Great! We have seen how to build images and run containers. But what if you want to run multiple containers that need to communicate with each other? This is where Docker networks come in.

Docker networks allow you to create a network that your containers can connect to. This is useful when you have multiple containers that need to communicate with each other. You can create a network and attach your containers to that network. This way your containers can communicate with each other without having to expose ports to the outside world.

Let’s say you have a node application that connects to a MongoDB database. You want to run both the node app and the MongoDB database in their own containers isolated in their own environments. You can create a network and attach both the node app and the MongoDB database to that network. This way the node app can connect to the MongoDB database without having to expose the MongoDB port to the outside world.

To create a network, you can run:

```powershell
docker network create demo-network
```

This will create a network called `demo-network`. You can see all the networks that you have created by running `docker network ls`. You can also see all the containers that are connected to your network by running `docker network inspect <network-name>`.

Now let’s run a MongoDB container and attach it to the `demo-network` network:

```powershell
docker run --rm -d --network demo-network --name demo-mongo mongo:latest
```

- `--network demo-network` tells docker that we want to attach this container to the `demo-network` network

If you run `docker ps`, you will see that the MongoDB container is running. If you run `docker network inspect demo-network`, you will see that the MongoDB container is attached to the `demo-network` network.

Now let’s run a node app container and attach it to the `demo-network` network:

```powershell
docker run --rm -it -p 3000:3000 --network demo-network --name demo-node-app demo-node:latest
```

- `--network demo-network` tells docker that we want to attach this container to the `demo-network` network as well.

Now you can access your app at [localhost:3000](http://localhost:3000) and see the `{message: 'Hello World!'}` response as well as the successful connection to MongoDB in the node console. If you run `docker ps`, you will see that both the MongoDB container and the node app container are running. If you run `docker network inspect demo-network`, you will now see that both the MongoDB container and the node app container are attached to the `demo-network` network.

Something interesting to note is that the node app container connects to the MongoDB container using the container name as the host name for the Mongo connection string. This is because Docker automatically creates a DNS entry for each container that is attached to a network. This allows you to connect to other containers using the container name as the hostname. This is useful when you have multiple containers that need to communicate with each other. If you look at the code inside `index.js`, you will notice that we are using the container name as the hostname to connect to the MongoDB database. This is because the node app container can connect to the MongoDB container using the container name as the hostname. It's important to note that this will only work if the containers are attached to the same network and if the container calls are made from within the container. If, for example, you have a React app that is running on your local machine, and you want to connect to the node app container, you will have to use the IP address of the node app container (or localhost) instead of the container name, and you have to make sure that you are exposing port 3000 on the node container. This is because the React app is executed on the browser and not from within the container, so you will not get DNS resolution from the browser run code.

When we talk about Docker Compose, we will see how we can define networks and attach containers to networks in a more structured way.

## Volumes and Mounts

Until now, we have seen how to build images, run containers, use environment variables, and create networks. The one thing I didn't mention before is that containers are intrinsically stateless. But what if you want to persist data between container restarts? For example, what if you want to save data to the MongoDB database, but everytime you restart the container that data is lost right now. What if we want to persist that data. This is where Docker volumes and mounts come in. By default, docker containers are stateless. This means that when a container stops running, all the data inside the container is lost. If you want to persist data between container restarts, you can use Docker volumes and mounts. it is important to note that you are not modifying the image itself, but you are modifying the container that is running the image.

Let's test this out. Let's try a POST request to the `/name` endpoint for the node and mongo containers that are already running. It does come back with a success message. If we try the GET request to `/names` you will see the name we just entered coming back from MongoDB.

Now let's stop the mongo container by running `docker stop demo-mongo`. Let's start the Mongo container again, and this time without the `--rm` flag. Now if you hit the `/names` endpoint, you will see that the name we entered earlier is no longer there. This is because the data inside the MongoDB container isn't there even though we had saved it to the database using our POST request. If you want to persist data between container restarts, you can use Docker volumes and mounts.

There are multiple ways to create volumes. You can either create them explicitly or inline when you run the `docker run` command.

### Named Volumes

Let's create a volume and attach it to the MongoDB container:

To explicitly create a volume, you could run this command:

```powershell
docker volume create demo-mongo-data
```

This will create a volume called `demo-mongo-data`. 

AAlternatively, you can create a volume inline when you run the `docker run` command. Let's remove the MongoDB container by running `docker stop demo-mongo` and `docker rm demo-mongo`.

Now let's run the MongoDB container again and attach the volume to it:

```powershell
docker run --rm -d --network demo-network -v demo-mongo-data:/data/db --name demo-mongo mongo:latest
```

- `-v demo-mongo-data:/data/db` tells docker that we want to attach the `demo-mongo-data` volume to the `/data/db` path inside the container. The colon `:` separates the volume name from the path inside the container

Now if you hit the `/names` endpoint, you will see that the name we entered persists even if we stop, remove and re-run the container. We can even delete the image and container and the data will still persist. This is because the data inside the MongoDB container is persisted in `demo-mongo-data` volume that is mapped to the `/data/db` path inside the container.

### Anonymous Volumes

The `demo-mongo-data` volume is a named volume. You can also create anonymous volumes by only specifying the path inside the container in the `-v` flag. For example, you can run:

```powershell
docker run --rm -d --network demo-network -v /data/db --name demo-mongo mongo:latest
```

This will create an anonymous volume that is not named. Anonymous volumes are useful when you don't care about persisting the data between container restarts, and you just want to persist the data while the container is running. If you pass the `--rm` flag to the `docker run` command, the anonymous volume will automatically be removed when the container stops running, otherwise you will have to manually clean up unused volumes. 

### Bind Mounts

Volumes are great for persisting data between container restarts, but what if you want to persist data between container restarts and also have access to the data on your local machine? This is where bind mounts come in. Bind mounts allow you to mount a path on your local machine to a path inside the container. This way you can persist data between container restarts and also have access to the data on your local machine. This is also great for development so that you can make changes on the fly without having to rebuild your docker image and running a new container every time you make a change.

Bind mounts are great because data between the container and your local machine is synced. If you make changes to the data on your local machine, the changes will be reflected in the container. If you make changes to the data inside the container, the changes will be reflected on your local machine.

Let's test this out with the node app. Let's stop the node app container by running `docker stop demo-node-app`. It should have automatically removed the container because we used the `--rm` flag when we ran the container.

Now let's run the node app container again and attach a bind mount to it:

```powershell
docker run --rm -it -p 3000:3000 --network demo-network -v /c/repos/docker-demo/docker-app:/app -v /app/node_modules --name demo-node-app -e CHOKIDAR_USEPOLLING=true demo-node:latest
```

- `-v /c/repos/docker-demo/docker-app:/app` tells docker that we want to attach the `/c/repos/docker-demo/docker-app` path on our local machine to the `/app` path inside the container. One thing to note here is that the path of your local machine has to be an absolute path. Because I am using WSL2, I have to use the `/c/` prefix to specify the correct path. If you are using macOS or Linux, you can use the `/` prefix to specify the path. If you are using Windows, you can use the `C:\` prefix to specify the path.
- `-v /app/node_modules` tells docker that we want to attach the `/app/node_modules` path inside the container. This is important as our Dockerfile copies everything from our local to the container, and since our local doesn't have a node_modules folder, it will replace the node_modules folder in the container that the image has when it was built. So to avoid this from happening we are telling docker to persist the node_modules folder from the container to the local machine. This way we don't have to install the node_modules on our local machine every time we run the container. The deeper the path, the higher the priority for that data persistence.
- `-e CHOKIDAR_USEPOLLING=true` tells docker that we want to set the `CHOKIDAR_USEPOLLING` environment variable to `true`. This is useful when you are using bind mounts on Windows or macOS. This is because the file system on Windows and macOS doesn't support file system events like Linux does. This can cause issues with file system events not being detected by the container. Setting the `CHOKIDAR_USEPOLLING` environment variable to `true` tells the container to use polling to detect file system events.

Now if you make changes to the source code for our node app, you will see that the changes will be reflected in the container and `nodemon` restarts the server.

Like mentioned above, if you are using WSL2 on Windows, you may have to set the `CHOKIDAR_USEPOLLING` environment variable to `true` because the file system on Windows doesn't support file system events like Linux does. This can cause issues with file system events not being detected by the container. Setting the `CHOKIDAR_USEPOLLING` environment variable to `true` tells the container to use polling to detect file system events. This is useful when you are using bind mounts on Windows. If you are running a front-end application like React, you may have to set the `WATCHPACK_POLLING` environment variable to `true` for the same reason.

## Docker Compose

Docker compose is one of my favourite tools when working with Docker. It allows you to define multi-container applications in a single file. This is great because you can define all your services in one file and run them with a single command. This is especially useful when you have multiple services that need to communicate with each other. You can define networks, volumes, environment variables, mounts and other configurations in a structured way.

So far we have a node app and a mongo container running. Let's complete the cycle by adding a React app and putting all the commands to build and run the three containers in a single file.

Let's create a `docker-compose.yml` file in the root of our project:

```yaml
services:
  demo-mongo:
    image: mongo:latest
    volumes:
      - demo-mongo-data:/data/db

  demo-backend:
    build:
      context: ./docker-backend
      dockerfile: Dockerfile
    image: demo-node
    container_name: demo-backend
    ports:
      - 3001:3000
    volumes:
      - ./docker-backend:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    depends_on:
      - demo-mongo

  demo-frontend:
    build:
      context: ./docker-frontend
      dockerfile: Dockerfile
    image: demo-react
    container_name: demo-frontend
    ports:
      - 3000:3000
    volumes:
      - ./docker-frontend/src:/app/src
    depends_on:
      - demo-backend
    stdin_open: true
    tty: true
    environment:
      - WATCHPACK_POLLING=true

volumes:
  demo-mongo-data:
```

- `services` is where you define all your services. Each service is a container that you want to run. You can define multiple services in the `services` section.
- `demo-mongo` is the MongoDB service. We define the image that we want to use, and we attach the `demo-mongo-data` volume to it.
- `demo-backend` is the node app service. We define the build context and the Dockerfile that we want to use. We also define the image name, the container name, the ports that we want to map, the volumes that we want to attach, the environment variables that we want to set, and the services that we want to depend on. We depend on the `demo-mongo` service because the node app needs to connect to the MongoDB database.
- `demo-frontend` is the React app service. We define the build context and the Dockerfile that we want to use. We also define the image name, the container name, the ports that we want to map, the volumes that we want to attach, the services that we want to depend on, and the environment variables that we want to set. We depend on the `demo-backend` service because the React app needs to connect to the node app. We also set `stdin_open` and `tty` to `true` because we want to run the container in interactive mode.
- `volumes` is where you define all your volumes. Each volume is a volume that you want to create. You can define multiple volumes in the `volumes` section.
- `demo-mongo-data` is the volume that we attach to the MongoDB service.
- `context` is the path to the build context. This is the path where the Dockerfile is located.
- `dockerfile` is the path to the Dockerfile. This is the path where the Dockerfile is located at that context.
- `image` is the name of the image that you want to build.
- `container_name` is the name of the container that you want to run.
- `ports` is the ports that you want to map. This is important because the node app is running on port 3000 inside the container, and the React app is running on port 3000 inside the container. If we don’t map the ports, we won’t be able to access the apps from our local machine.
- `environment` is the environment variables that you want to set. This is useful when you want to set environment variables for your services. We can also optionally use a `.env` file to set environment variables and use them in the `docker-compose.yml` file using the `- env_file: .env` option instead of the `environment` option.
- `depends_on` is the services that you want to depend on. This is useful when you have multiple services that need to communicate with each other. You can define the order in which the services start up by using the `depends_on` option. You can also use the `restart` option to define the restart policy for your services. This is useful when you want to automatically restart your services when they stop running. The neat thing about `depends_on` is that the services that your service depends on will automatically start when you try starting just the one service.

Now that we have a docker-compose file and the modules in their own directories with their own Dockerfiles, we can run the following command to build and run the containers:

```powershell
docker-compose up
```

That is it! This will build and run all the containers in the `docker-compose.yml` file using a single command instead of running `docker build` and `docker run` multiple times for each image. You will see that the containers are running, and you can access the node app at [localhost:3001](http://localhost:3001) and the React app at [localhost:3000](http://localhost:3000). You can also access the frontend container's terminal by running `docker exec -it demo-frontend /bin/bash`.

To stop the containers, all you have to do is run `docker-compose down` and it will stop and remove all the running containers for this docker-compose file. You can also remove the volumes by running `docker-compose down -v`. This will stop and remove the containers and the volumes.

Did you notice that we didn't define networks explicitly in the docker-compose file? That's because docker-compose automatically creates a network for you when you run `docker-compose up`. 

If you want to rebuild the images and run the containers, you can run `docker-compose up --build`. This will rebuild the images and run the containers should you happen to change the contents of the image to be built. You can also rebuild an image for a single service by running `docker-compose up --build <service-name>`. You can also run individual services by running `docker-compose up <service-name>`. This will run only the service that you specify. You can also run multiple services by running `docker-compose up <service-name> <service-name>`. This will run the services that you specify. The same way, you can also stop individual services by running `docker-compose stop <service-name>`. This will stop the service that you specify. You can also stop multiple services by running `docker-compose stop <service-name> <service-name`.

You can see how versatile docker-compose can be. The neatest thing is you never have to ask your co-worker what version of node or react or any other dependency they are using. You can just share the docker-compose file and run the same environment as everyone else. 

You will also continue to notice that we never installed any dependencies on our local machine. Another benefit of containerizing your applications is that you don't have to install dependencies on your local machine.

## Multistep Builds

Multistep builds are a great way to optimize your Docker images. They allow you to build your application in one image and then copy the built application to another image. This way you can keep your images small and only include the dependencies that you need. This is especially useful when you have a build step and a run step. You can build your application in one image and then run your application in another image. This way you don't have to include the build dependencies in the run image. This is a great way to optimize your Docker images and keep them small.

Let's take our React app for example. Let's say we want to build our React app and then use Nginx to run it. We can use a multistep build to build our React app in one image and then copy the built React app to another image. This way we can keep our Nginx image small and only include the built React app. 

Let's create a new `Dockerfile` in the `docker-frontend` directory and call it Build.Dockerfile with the following configuration:

```docker
# Build the React app
FROM node:latest as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Run the React app
FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]    
```

- `FROM node:latest as build` tells Docker that we want to build our application in one image and then copy the built application to another image. The `as build` tag allows us to name the image that we want to build. This is useful when we want to reference the image later on in the Dockerfile.
- `COPY --from=build /app/build /usr/share/nginx/html` tells Docker that we want to copy the built application from the `build` image to the `/usr/share/nginx/html` path inside the `nginx` image. This way we can keep our `nginx` image small and only include the built application.
- `EXPOSE 80` tells Docker that we want to expose port 80 on the container. This is important because `nginx` is running on port 80 inside the container. If we don’t expose the port, we won’t be able to access the React app from our local machine.
- `CMD ["nginx", "-g", "daemon off;"]` tells Docker that we want to run the `nginx` command with the `-g "daemon off;"` flag. This is important because `nginx` runs in the background by default. If we don’t run `nginx` in the foreground, the container will stop running after it starts.

Now let's add a new service to the `docker-compose.yml` file to run the React app with Nginx:

```yaml
  demo-frontend-build:
    build:
      context: ./docker-frontend
      dockerfile: Build.Dockerfile
    image: demo-react-nginx
    container_name: demo-frontend-build
    ports:
      - 8080:80
    depends_on:
      - demo-backend
```

We can call just this service by running `docker-compose up demo-frontend-build`. This will build the React app and run it with Nginx. You can access the React app at [localhost:8080](http://localhost:8080). Since we set `demo-backend` as a dependency, and `demo-backend` has a dependency for the mongo service, all three services will come up when you run `docker-compose up demo-frontend-build`.



## Utility Containers

Utility containers (non-official term) are containers that are used for a specific task. They are usually run once and then removed. They are great for running one-off tasks like running a script, backing up data, or running a database migration. You can run utility containers in any of the ways we mentioned above. There's nothing special about utility containers, they are just containers that are used for a specific task.

Creating a node project requires you to run `npm init` to initially create a `package.json` file. If you don't want to create it manually, this is typically what you would do. But, what if you don't have `node` or `npm` installed. This is a great example for a Utility container. You can run a node container, run `npm init` and then remove the container. This way you don't have to install `node` or `npm` on your local machine. You can run the following command to run a node container and run `npm init`:

```powershell
docker run --rm -it -v /c/repos/docker-demo/docker-node:/app -w /app node:latest npm init -y
```

- `-v /c/repos/docker-demo/docker-node:/app` tells docker that we want to attach the `/c/repos/docker-demo/docker-node` path on our local machine to the `/app` path inside the container.
- `-w /app` tells docker that we want to set the working directory to the `/app` path inside the container.
- `node:latest` tells docker that we want to run this container based on the `node` image with the `latest` tag.
- `npm init -y` tells docker that we want to run the `npm init -y` command. The `-y` flag tells `npm` that we want to use the default options for the `npm init` command.

This will create a `package.json` file in the `docker-node` directory on your local machine. You can also run `npm install` to install the dependencies in the `package.json` file. This is a great example of how you can use utility containers to run one-off tasks without having to install the dependencies on your local machine.

To do this with `docker-compose` we can add a service to the `docker-compose.yml` file with the following configuration:

```yaml
services:
  demo-utility:
    image: node:latest
    volumes:
      - /c/repos/docker-demo/docker-node:/app
    working_dir: /app
    command: npm init -y
```

To do this with a `Dockerfile` we can create a `Dockerfile` in the `docker-node` directory with the following configuration:

```docker
FROM node:latest

WORKDIR /app

CMD [ "npm", "init", "-y" ]
```

To make the Dockerfile more versatile instead of only running `npm init -y`, we can set an entrypoint in the Dockerfile and pass the command as an argument when we run the container. This way we can run any command we want when we run the container. Here is an example of how you can set an entrypoint in the Dockerfile:

```docker
FROM node:latest

WORKDIR /app

ENTRYPOINT [ "npm" ]
```

Now you can run the container and pass the command as an argument:

```powershell
docker run --rm -it -v /c/repos/docker-demo/docker-node:/app -w /app node:latest init -y
```

You will notice how we didn't have to type `npm` before `init -y`. This is because the `entrypoint` option in the Dockerfile specifies `npm` as the entrypoint command. This way you can use the same image to run different containers with different commands such as `npm install`, `npm start`, `npm test`, etc. All while omitting the `npm` command in the `docker run` command.

To achieve the same thing in docker-compose to make it more versatile, we can also pass the entrypoint and command as arguments in the `docker-compose.yml` file:

```yaml
services:
  demo-utility:
    image: node:latest
    volumes:
      - /c/repos/docker-demo/docker-node:/app
    working_dir: /app
    entrypoint: [ "npm" ]
    command: [ "init", "-y" ]
```

By default, it will run `npm init -y`. However, if you run `docker-compose run` instead of `docker-compose up`, you can pass the command as an argument. For example, you can run `docker-compose run demo-utility install express` to install the `express` package. You don't have to specify `npm` as the `entrypoint` option already specifies `npm`. This is a great example of how you can use utility containers to run one-off tasks without having to install the dependencies on your local machine. 

## Conclusion

This is just scratching the surface of what you can do with Docker. There are so many other options and flags to suit your need. Docker is a great tool for running applications in isolated environments without having to install the dependencies on your local machine. It's also a great way to share your applications with others without having to worry about them setting up their environments.