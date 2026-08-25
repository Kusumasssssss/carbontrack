# Redis Setup Guide (via Docker)

CarbonTrack uses Redis for caching to significantly speed up dashboard load times. Follow these steps to get Redis running locally on your machine using Docker.

## 1. Install Docker Desktop

If you don't already have Docker installed:
1. Go to the [Docker Desktop Download Page](https://www.docker.com/products/docker-desktop/).
2. Download the installer for your operating system (Windows/Mac/Linux).
3. Run the installer and follow the setup wizard.
4. Once installed, **open Docker Desktop** and wait for the engine to start (the whale icon in your taskbar should stop animating and turn green/solid).

## 2. Run Redis in Docker

Once Docker is running, open your terminal (Command Prompt, PowerShell, or Terminal) and run this single command to download and start a Redis container:

```bash
docker run -d --name carbontrack-redis -p 6379:6379 redis:latest
```

### What this command does:
- `-d`: Runs the container in the background (detached mode) so it doesn't lock up your terminal.
- `--name carbontrack-redis`: Gives the container a recognizable name.
- `-p 6379:6379`: Maps port `6379` from the container to your local machine (this is the default Redis port that Spring Boot expects).
- `redis:latest`: Pulls the official, most recent Redis image from Docker Hub.

## 3. Verify Redis is Running

To verify that Redis is up and running successfully, you can run:

```bash
docker ps
```
You should see a container named `carbontrack-redis` in the list with a status of "Up".

Alternatively, you can access the Redis CLI inside the container to test it directly:
```bash
docker exec -it carbontrack-redis redis-cli ping
```
If everything is working correctly, it should respond with:
```
PONG
```

## Managing the Container

- **To stop Redis**: `docker stop carbontrack-redis`
- **To start it again later**: `docker start carbontrack-redis`
- **To view Redis logs**: `docker logs carbontrack-redis`

## Troubleshooting

- **"Port is already allocated"**: If you get an error that port 6379 is in use, you might already have a local instance of Redis running on your machine. You will need to stop that instance before starting the Docker container.
- **"Docker daemon is not running"**: Make sure you have actually opened the Docker Desktop application before running terminal commands.
