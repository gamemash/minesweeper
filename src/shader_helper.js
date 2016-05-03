let ShaderLoader = require('./shader_loader.js');

function initBuffers(gl){
  let vertices = [
     0.0,  0.0,
     1.0,  0.0,
     1.0,  1.0,
     0.0,  0.0,
     1.0,  1.0,
     0.0,  1.0
  ];

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


module.exports = {
  initShaders: initShaders,
  initBuffers: initBuffers
};
