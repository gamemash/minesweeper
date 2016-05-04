let ShaderHelper = require('./shader_helper.js');
let TextureLoader = require('./texture_loader.js');




let Tile = function(data, gl){
  this.data = data;
  this.shaderProgram = ShaderHelper.initShaders('tile', gl);
  this.buffers = ShaderHelper.initBuffers(gl);
  this.texture = TextureLoader.get('tiles.png');

  this.texturePosition = [0, 0];
  if (this.data.get('isRevealed')){
    this.texturePosition = [1, 0];
  }

  this.render = function(){
    gl.useProgram(this.shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers);
    let vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    let positionUniformLocation = gl.getUniformLocation(this.shaderProgram, "position");
    let position = [this.data.get('x'), this.data.get('y')];
    gl.uniform2fv(positionUniformLocation, position);
    gl.uniform2fv(gl.getUniformLocation(this.shaderProgram, "texturePosition"), this.texturePosition);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "tilesTexture"), 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  //this.update = function(data, gl){
  //  if (data !== this.data){
  //    return new Tile(data, gl)
  //  } else {
  //    return this;
  //  }
  //}
}

module.exports = Tile;
