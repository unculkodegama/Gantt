# Gantt Chart

A simple Gantt Chart.

## ToDo before use

1. Run `npm install`
2. Run `npm install -g json-server`

## Build

1. Open two terminals
2. In one run `ng serve --port xxxx` (xxxx - number of port you wish to use, e.g. 4200) or run `npm start`
3. In other run `json-server --watch tasks.json`

## Test

Test are running thanks to protractor. 

! Please use Chrome for testning ! 

1. Build the app ( see chapter Build)
2. run `protractor protractor.conf.js`
