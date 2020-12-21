{
  "name": "edge-konva",
  "version": "1.0.0",
  "description": "edgexfoundry digital twin",
  "keywords": [],
  "main": "dist/index.tsx",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@babel/plugin-proposal-optional-chaining": "^7.12.7",
    "@types/ramda": "0.26.19",
    "eventbusjs": "0.2.0",
    "font-awesome": "4.7.0",
    "konva": "4.0.0",
    "ramda": "0.26.1",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-konva": "16.8.7-4",
    "react-scripts": "^4.0.1",
    "react-scripts-ts": "2.13.0",
    "react-spring": "8.0.27",
    "request": "^2.88.2",
    "use-image": "1.0.4"
  },
  "devDependencies": {
    "@types/react": "16.8.8",
    "@types/react-dom": "16.8.2",
    "@typescript-eslint/eslint-plugin": "^4.10.0",
    "@typescript-eslint/parser": "^4.10.0",
    "awesome-typescript-loader": "^5.2.1",
    "clean-webpack-plugin": "^3.0.0",
    "cross-env": "^7.0.3",
    "css-loader": "^5.0.1",
    "eslint": "^7.15.0",
    "eslint-config-prettier": "^7.0.0",
    "eslint-plugin-prettier": "^3.3.0",
    "html-webpack-plugin": "^4.5.0",
    "less-loader": "^7.1.0",
    "prettier-eslint": "^12.0.0",
    "prettier-eslint-cli": "^5.0.0",
    "style-loader": "^2.0.0",
    "typescript": "^4.1.3",
    "uglifyjs-webpack-plugin": "^2.2.0",
    "webpack": "^5.1.3",
    "webpack-cli": "^4.1.0",
    "webpack-dev-server": "^3.11.0"
  },
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
