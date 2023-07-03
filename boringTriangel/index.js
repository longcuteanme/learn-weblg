import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

const vertexShaderSource = `
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

const fragmentShaderSource = `
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

function renderWebGL() {
  console.log("This is working");

  var canvas = document.getElementById("canvas_id");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support WebGL");
  }

  const shaderProgram = initShaderProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Draw the scene
  drawScene(gl, programInfo, buffers);
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  return shaderProgram;
}

function loadShader(gl, type, source) {
  //tao ra mot shader theo type vertex hay fragment
  const shader = gl.createShader(type);

  //gan source moi tao den doi tuong shader
  gl.shaderSource(shader, source);

  //compile source vuwa viet
  gl.compileShader(shader);

  //bao loi neu compile that bai
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Có lỗi xảy ra khi compile shader");
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

renderWebGL();
