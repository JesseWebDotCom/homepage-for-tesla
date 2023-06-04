My notes for maintaining this project

## Local Testing

### Reset Project

Clears module and build files; Reinstalls dependencies

```bash
rm -rf node_modules
rm -rf build
npm install
```

### Build Project

Builds this project

```bash
npm run build
```

## Run Project

Runs the project

```bash
npm start
```

## DockerHub

### Login

Run and supply password when prompted (not the same as Github)

```bash
docker login --username=jessewebdotcom
```

### Delete Local Containers and Images

```bash
if docker ps -a --filter ancestor=homepage-for-tesla -q 2>/dev/null | grep -q .; then docker stop $(docker ps -a --filter ancestor=homepage-for-tesla -q) && docker rm $(docker ps -a --filter ancestor=homepage-for-tesla -q); fi
docker rmi $(docker images -q homepage-for-tesla) 2>/dev/null
```

### Pushing image

Build the image:

```bash
docker build -t homepage-for-tesla .
docker image tag homepage-for-tesla jessewebdotcom/homepage-for-tesla:latest
docker images --filter "reference=homepage-for-tesla"
``

Test the image:

```bash
docker run \
  -v $(pwd)/public/bookmarks.json:/app/public/bookmarks.json \
  -p 3333:3000 \
  jessewebdotcom/homepage-for-tesla:latest
```

Push the image to DockerHub
```bash
docker image push jessewebdotcom/homepage-for-tesla:latest
``