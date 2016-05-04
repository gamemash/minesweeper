attribute vec2 vertexPosition;
uniform vec2 position;
uniform vec2 screenSize;
varying highp vec2 textureVertex;

void main(){
  vec2 tileSize = vec2(32);
  //vec2 screenSize = vec2(320);
  gl_Position = vec4((vertexPosition + position) * vec2(2) / screenSize * tileSize - vec2(1) , 0, 1);
  textureVertex = vec2(vertexPosition.x, 1.0 - vertexPosition.y);

}
