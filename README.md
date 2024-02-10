# Honeypot

An online party game where players are asked questions and then players have to guess who said which answer. The player with the most points at the end of the game wins.

## Installation

This project requires 2 running terminals to develop locally. One terminal will start the node.js server and one terminal will host the client via react development server. In a deployed environment, the client is built and the bundle is served by the server.

First clone the repository

```bash
git clone https://github.com/andyplank/honeypot.git
```

In the first terminal start the server
```bash
cd server
npm install
npm run start
```

In the second terminal start the client
```
cd client
npm install
npm run start
```

## Building

To run the production version of the project first go into the client directory and run `npm run build`. Next, copy the contents of the `/client/build/` folder into the `/server/src/public/` folder. If you want to test out your own prompts, you will also need to add a `prompts.txt` file into the `/server/` directory

## Authors

- Andy Plank - [Andy Plank](https://github.com/andyplank)
- Samantha Thompson - [Samantha Thompson](https://github.com/samanthathompson52)

## License

This project is covered under an MIT license. Basically use it as you wish.
