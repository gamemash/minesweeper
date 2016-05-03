let ShaderLoader = require('./shader_loader.js');

let vertices = [
     0.0,  0.0,
     1.0,  0.0,
     1.0,  1.0,
     0.0,  0.0,
     1.0,  1.0,
     0.0,  1.0
  ];


function initBuffers(gl){
  let squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return squareVerticesBuffer;
}

function initShaders(gl) {
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, ShaderLoader.get('tile.frag'));
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {  
    console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader));  
  }
  
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, ShaderLoader.get('tile.vert'));
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {  
    console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader));  
  }

  //// Create the shader program

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  return shaderProgram;
}

let shaderProgram = null;
let buffers = null;


let Tile = function(data, gl){
  this.data = data;

  this.render = function(){
    gl.useProgram(this.shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers);
    let vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    let positionUniformLocation = gl.getUniformLocation(this.shaderProgram, "position");
    let position = [this.data.get('x'), this.data.get('y')];
    gl.uniform2fv(positionUniformLocation, position);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

  };
}

Tile.prototype.setup = function(gl){
  Tile.prototype.shaderProgram = initShaders(gl);
  Tile.prototype.buffers = initBuffers(gl);
}

console.log(new Tile());

module.exports = Tile;
