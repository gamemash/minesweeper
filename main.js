"use strict";

let Immutable = require('immutable');
let Tile = require('./src/tile.js');
let ShaderLoader = require('./src/shader_loader.js');
let TextureLoader = require('./src/texture_loader.js');


console.log("init");
function initTiles(rows, cols, mines){
  let list = Immutable.List();
  for (let x = 0; x < cols; x += 1){
    for (let y = 0; y < rows; y += 1){
      let isMine = Math.random() <  mines / cols / rows;
      list = list.push(Immutable.Map({ x: x, y: y, isMine: isMine, isRevealed: false }));
    }
  }

  return list;
}

function createGame(options){
  return new Promise(function(resolve){
    resolve(Immutable.Map({
      columns: options.cols,
      rows: options.rows,
      tiles: initTiles(options.rows, options.cols, options.mines)
    }));
  });
}

function createScene(renderer, world){
  let scene = [];
  world.get('tiles').forEach(function(tile){
    var plane = new Tile(tile, gl);
    scene.push(plane);
  });
  return scene;
}

function setupRenderer(world){
  let canvas = document.getElementById('game-canvas');
  
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
let scene = null;

let stuffToLoad = [
  ShaderLoader.load('tile.vert'),
  ShaderLoader.load('tile.frag'),
  TextureLoader.load('tiles.png')
  ];

Promise.all(stuffToLoad).then(function(){
  createGame({rows: 10, cols: 10, mines: 5}).then(function(newWorld){
    world = newWorld;
    gl = setupRenderer(world);
    TextureLoader.buildTextures(gl);
    scene = createScene(gl, world);
    render();
  });
});

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  scene.forEach(function(tile){
    tile.render();
  });
  requestAnimationFrame(render);
}

