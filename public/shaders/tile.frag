uniform sampler2D tilesTexture;
varying highp vec2 texturePosition;

void main(){
  //gl_FragColor = vec4(1);
  highp vec2 textureLayout = vec2(4.0);
  gl_FragColor = texture2D(tilesTexture, texturePosition / textureLayout);
  
}
