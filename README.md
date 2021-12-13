# connect-the-dots

Two-players game. Each player should click the first and the second dot in order to create one line.

Game rules:
1. Each section of the line should go through the dots
2. Sections should not intersect
3. Each turn should start on either end of the existing line
4. The player who sets the last line looses
5. Refresh the browser page to re-start the game

## Deployed version of the app

https://connect-the-dots-game.herokuapp.com/

## Run the application locally

1. Make sure you have **node.js** and **npm** installed
2. Clone the project
3. From the **server** directory type `npm i` to install all the dependencies from package.json
4. Type `npm start` to activate the application
5. Open client/index.html in the browser
6. Click any dot on the field to start the game

## Technologies/frameworks used:

1. WebSocket API Protocol is used
2. [ws](https://www.npmjs.com/package/ws) library to establish WebSocket connection 
3. [express.js](https://www.npmjs.com/package/express) Node.js framework
4. [jest](https://www.npmjs.com/package/jest) testing framework
