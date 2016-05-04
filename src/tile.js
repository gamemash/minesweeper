let ShaderHelper = require('./shader_helper.js');
let TextureLoader = require('./texture_loader.js');


let Tile = {
  setup: function(gl){
    Tile.shaderProgram = ShaderHelper.initShaders('tile', gl);
    Tile.buffer = ShaderHelper.initBuffers(gl);
    Tile.texture = TextureLoader.get('tiles.png');
  },
  display: function(data, gl){
    let texturePosition = [0, 0];
    if (data.get('isFlagged')){
      texturePosition = [1, 0];
    }
    if (data.get('isRevealed')){
      if (data.get('isMine')){
        texturePosition = [2, 0];
      } else {
        let n = data.get('surroundingMines');
        texturePosition = [(n + 3) % 4, Math.floor((n + 3) / 4)];
      }
    }
    let position = [data.get('x'), data.get('y')];

    Tile.render(gl, position, texturePosition);
  },
  render: function(gl, position, texturePosition){
    gl.useProgram(Tile.shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, Tile.buffer);
    let vertexPositionAttribute = gl.getAttribLocation(Tile.shaderProgram, "vertexPosition");
    gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    let positionUniformLocation = gl.getUniformLocation(Tile.shaderProgram, "position");
    gl.uniform2fv(positionUniformLocation, position);
    gl.uniform2fv(gl.getUniformLocation(Tile.shaderProgram, "texturePosition"), texturePosition);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Tile.texture);
    gl.uniform1i(gl.getUniformLocation(Tile.shaderProgram, "tilesTexture"), 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },
};

module.exports = Tile;
