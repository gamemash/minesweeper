"use strict";

let Immutable = require('immutable');
let Tile = require('./src/tile.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');

let settings = {rows: 10, cols: 10, mines: 10};

function startGame(){
  settings = {
    cols: parseInt(document.getElementById('cols').value),
    rows: parseInt(document.getElementById('rows').value),
    mines: parseInt(document.getElementById('mines').value)
  }

  let width = 32 * settings.cols;
  let height = 32 * settings.rows;
  gl.viewport(0, 0, width, height);
  canvas.width = width;
  canvas.height = height;
  Tile.setup(gl);
  world = createGame(settings);
  render();
}
document.getElementById('startGame').onclick = startGame;


function initTiles(rows, cols, mines){
  let tiles = Immutable.List(Immutable.Range(0, rows * cols)).map(function(index){
    let x = index % cols;
    let y = Math.floor(index / cols);
    let isMine = Math.random() <  mines / cols / rows;
    return Immutable.Map({ x: x, y: y, isMine: isMine, isRevealed: false, isFlagged: false, surroundingMines: 0 });
  });
  tiles = tiles.map(function(tile){
    return tile.set('surroundingMines', surrounding(tiles, tile, rows, cols).filter(function(tile) { return tile.get('isMine') }).size);
  });

  return tiles;
}

function surrounding(tiles, tile, rows, cols){
  return Immutable.List(Immutable.Range(0, 9).map(function(i){
    let x = i % 3  - 1 + tile.get('x');
    let y = Math.floor(i / 3)  - 1 + tile.get('y');
    let index = y * cols + x;
    if (x >= 0 && x < cols && y >= 0 && y < rows){
      return tiles.get(index);
    } else {
      return false;
    }
  })).filter(function(a) { return a });
}

function createGame(options){
  return Immutable.Map({
      columns: options.cols,
      rows: options.rows,
      tiles: initTiles(options.rows, options.cols, options.mines),
      gameOver: false
  });
}

function setupRenderer(canvas, world){
  
  let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  gl.clearColor(0.75, 0.75, 0.75, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let width = 32 * world.get('columns');
  let height = 32 * world.get('rows');
  
  gl.viewport(0, 0, width, height);
  canvas.width = width;
  canvas.height = height;
  return gl;
}

let world = null;
let gl = null;
let canvas = document.getElementById('game-canvas');


let clickEvents = new Set();
let addClick = function(e){
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = rect.height - e.clientY + Math.round(rect.top);
  let action = (e.button == 0 ? 'left' : 'right');
  clickEvents.add(Immutable.Map({
    x: x,
    y: y,
    action: action
  }));
}
canvas.addEventListener('mousedown', addClick);
canvas.oncontextmenu = function (e) {
  e.preventDefault();
};

let stuffToLoad = [
  ShaderLoader.load('tile.vert'),
  ShaderLoader.load('tile.frag'),
  TextureLoader.load('tiles.png')
];

Promise.all(stuffToLoad).then(function(){
  world = createGame(settings);
  gl = setupRenderer(canvas, world);
  TextureLoader.buildTextures(gl);
  Tile.setup(gl);
  render();
  renderLoop();
});

function revealTile(world, tileIndex){
  world = world.setIn(['tiles', tileIndex, 'isRevealed'], true);
  if (world.getIn(['tiles', tileIndex, 'isMine'])){
    return world.set('gameOver', true);
  }
  if (world.getIn(['tiles', tileIndex, 'surroundingMines']) == 0){
    surrounding(world.get('tiles'), world.getIn(['tiles', tileIndex]), world.get('rows'), world.get('columns')).filter(function(tile) { return !tile.get('isRevealed'); }).forEach(function(tile){
      world = revealTile(world, tile.get('x') + tile.get('y') * world.get('columns'));
    });
  }
  return world;
}

function renderLoop(){
  if (!world.get('gameOver')){
    for (let clickEvent of clickEvents){
      let position = [
        Math.floor(clickEvent.get('x') / 32),
        Math.floor(clickEvent.get('y') / 32)
      ];
      let tile = position[1] * world.get('columns') + position[0];
      switch(clickEvent.get('action')){
        case 'left':
          world = revealTile(world, tile);
          break;
        case 'right':
          world = world.setIn(['tiles', tile, 'isFlagged'], !world.getIn(['tiles', tile, 'isFlagged']));
          break;
      }
    }
  }
  if (clickEvents.size > 0){
    clickEvents = new Set();
    render();
  }
  requestAnimationFrame(renderLoop);
}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  world.get('tiles').forEach(function(tile){
    Tile.display(tile, gl);
  });
}

