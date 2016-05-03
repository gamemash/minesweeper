let ShaderHelper = require('./shader_helper.js');




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
  Tile.prototype.shaderProgram = ShaderHelper.initShaders(gl);
  Tile.prototype.buffers = ShaderHelper.initBuffers(gl);
}

module.exports = Tile;
