
/**
 * @file A simple WebGL example drawing a triangle with colors
 * @author Eric Shaffer <shaffer1@eillinois.edu>
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/** @global The WebGL buffer holding the triangle */
var vertexPositionBuffer;

/** @global The WebGL buffer holding the vertex colors */
var vertexColorBuffer;

/** @global The matrix */
var mvMatrix = glMatrix.mat4.create();

/** @global Angle */
var degreeAngle = 0;

/** @global Angle */
var degreeAngle2 = 0;

/** @global Translate */
var transMove = vec3.create();

/** @global Translate */
var increment = 0;

/** @global Translate */
var minMax = 0;

/** @global Translate */
var xMove = 0;

/** @global Translate */
var colorGrad = 0;

/**
 * Translates degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} The radians that correspond to the degree input
 */
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */

 function createGLContext(canvas) {
   var context = null;
   context = canvas.getContext("webgl2");
   if (context) {
     context.viewportWidth = canvas.width;
     context.viewportHeight = canvas.height;
   } else {
     alert("Failed to create WebGL context!");
   }
   return context;
 }

 /**
  * Loads Shaders
  * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
  */

  function loadShaderFromDOM(id) {
    var shaderScript = document.getElementById(id);

    // If we don't find an element with the specified id
    // we do an early exit
    if (!shaderScript) {
      return null;
    }
    var shaderSource = shaderScript.text;

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
  function setupBuffersFlame() {
    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var triangleVertices = [
      0,  -0.3, 0,
      -0.2, -0.2, 0,
      -0.3, 0,  0,

      0,  -0.3, 0,
      -0.2, 0.3, 0,
      -0.3, 0,  0,

      0,  -0.3, 0,
      -0.2, 0.3, 0,
      -0.1, 0.2,  0,

      0,  -0.3, 0,
      0, 0.6, 0,
      -0.1, 0.2,  0,

      0,  -0.3, 0,
      0, 0.6, 0,
      0.1, 0.2,  0,

      0,  -0.3, 0,
      0.2, 0.3, 0,
      0.1, 0.2,  0,

      0,  -0.3, 0,
      0.2, 0.3, 0,
      0.3, 0,  0,

      0,  -0.3, 0,
      0.2, -0.2, 0,
      0.3, 0,  0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numberOfItems = 24;

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    var triangleColors = [
          //Inner orange color
          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,

          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,

          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,

          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,

          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,

          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,

          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,
          1.0, 0.25, 0.0, 1.0,

          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0,
          1.0, 0.5, 0.0, 1.0
        ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.DYNAMIC_DRAW);
      vertexColorBuffer.itemSize = 4;
      vertexColorBuffer.numberOfItems = 27;
  }

function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMvMatrix");

  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
        //Bottom right inner triangle
         0.01,  0.01,  0.0,
         0.14,  0.01,  0.0,
         0.14,  0.05,  0.0,
         //Bottom left inner triangle
         0.01,  0.01,  0.0,
         0.01,  0.05,  0.0,
         0.14,  0.05,  0.0,
         //Middle right inner triangle
         0.05, 0.05, 0.0,
         0.10, 0.05, 0.0,
         0.10, 0.16, 0.0,
         //Middle left inner triangle
         0.05, 0.05, 0.0,
         0.05, 0.16, 0.0,
         0.10, 0.16, 0.0,
         //Top right inner triangle
         0.01, 0.16, 0.0,
         0.14, 0.16, 0.0,
         0.14, 0.20, 0.0,
         //Top left inner triangle
         0.01, 0.16, 0.0,
         0.01, 0.20, 0.0,
         0.14, 0.20, 0.0,

         //Bottom margin triangle (right)
         0.0, 0.0, 0.0,
         0.15, 0.0, 0.0,
         0.15, 0.01, 0.0,
         //Bottom margin triangle (left)
         0.0, 0.0, 0.0,
         0.0, 0.01, 0.0,
         0.15, 0.01, 0.0,
         //Lower side margins
         0.0, 0.01, 0.0,
         0.01, 0.01, 0.0,
         0.01, 0.05, 0.0,

         0.0, 0.01, 0.0,
         0.0, 0.05, 0.0,
         0.01, 0.05, 0.0,

         0.14, 0.01, 0.0,
         0.15, 0.01, 0.0,
         0.15, 0.05, 0.0,

         0.14, 0.01, 0.0,
         0.14, 0.05, 0.0,
         0.15, 0.05, 0.0,

         //Top of bottom margins lol
         0.0, 0.05, 0.0,
         0.05, 0.05, 0.0,
         0.05, 0.06, 0.0,

         0.0, 0.05, 0.0,
         0.0, 0.06, 0.0,
         0.05, 0.06, 0.0,

         0.1, 0.05, 0.0,
         0.15, 0.05, 0.0,
         0.15, 0.06, 0.0,

         0.1, 0.05, 0.0,
         0.10, 0.06, 0.0,
         0.15, 0.06, 0.0,

         //Middle left
         0.04, 0.06, 0.0,
         0.05, 0.06, 0.0,
         0.05, 0.15, 0.0,

         0.04, 0.06, 0.0,
         0.04, 0.15, 0.0,
         0.05, 0.15, 0.0,

         //Middle right
         0.1, 0.06, 0.0,
         0.11, 0.06, 0.0,
         0.11, 0.15, 0.0,

         0.1, 0.06, 0.0,
         0.10, 0.15, 0.0,
         0.11, 0.15, 0.0,

         //Bottom of top margins lol
         0.0, 0.15, 0.0,
         0.05, 0.15, 0.0,
         0.05, 0.16, 0.0,

         0.0, 0.15, 0.0,
         0.0, 0.16, 0.0,
         0.05, 0.16, 0.0,

         0.1, 0.15, 0.0,
         0.15, 0.15, 0.0,
         0.15, 0.16, 0.0,

         0.1, 0.15, 0.0,
         0.10, 0.16, 0.0,
         0.15, 0.16, 0.0,

         //Upper side margins
         0.0, 0.16, 0.0,
         0.01, 0.16, 0.0,
         0.01, 0.2, 0.0,

         0.0, 0.16, 0.0,
         0.0, 0.2, 0.0,
         0.01, 0.2, 0.0,

         0.14, 0.16, 0.0,
         0.15, 0.16, 0.0,
         0.15, 0.2, 0.0,

         0.14, 0.16, 0.0,
         0.14, 0.2, 0.0,
         0.15, 0.2, 0.0,

         //Upper right margin
         0.0, 0.2, 0.0,
         0.15, 0.2, 0.0,
         0.15, 0.21, 0.0,

         //Upper left margin
         0.0, 0.2, 0.0,
         0.0, 0.21, 0.0,
         0.15, 0.21, 0.0,

  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 90;

  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var triangleColors = [
        //Inner orange color
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,

        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,

        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,

        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,

        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,

        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.5, 0.0, 1.0,

        //Border blue colors
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.DYNAMIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numberOfItems = 90;
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                         vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

function animate() {
  draw();
  // //Increase degree by 1, so it rotates 360 degrees
  degreeAngle = (degreeAngle + 1) % 360;
  degreeAngle2 = (degreeAngle2 + 0.01) % 360;
  colorGrad = (colorGrad + 1) % 100;
  //First, we rotate on the Y Axis
  glMatrix.mat4.fromXRotation(mvMatrix, degToRad(degreeAngle));
  //glMatrix.mat4.fromXRotation(mvMatrix, degToRad(degreeAngle));
  //I moves between 0 and 5
  if (xMove = 0 && minMax < 5) {
    minMax = minMax + 0.1;
    increment = 0.1;
  }
  else if (xMove == 0 && minMax == 5){
    xMove = 1;
    minMax = minMax - 0.1;
    increment = -0.1;
  }
  else if (xMove == 1 && minMax > 0){
    minMax = minMax - 0.1;
    increment = -0.1;
  }
  else if (xMove == 1 && increment == 0){
    xMove = 0;
    minMax = minMax + 0.1;
    increment = 0.1;
  }

  //vec3.set (transMove, increment, 0, 0);
  //glMatrix.mat4.fromTranslation (mvMatrix, (0,0,0));

  nonAffine();
  if(document.getElementById("flame").checked == true){
    setupShaders();
    setupBuffersFlame();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    requestAnimationFrame(animate2);
  }
  else{
    requestAnimationFrame(animate);
  }
}

function animate2() {
   draw();
   degreeAngle = (degreeAngle + 1) % 360;
   degreeAngle2 = (degreeAngle2 + 0.01) % 360;
   colorGrad = (colorGrad + 1) % 100;
   glMatrix.mat4.fromXRotation(mvMatrix, degToRad(0));
   nonAffine2();
   if (document.getElementById("logo").checked == true){
     setupShaders();
     setupBuffers();
     gl.clearColor(0.0, 0.0, 0.0, 1.0);
     gl.enable(gl.DEPTH_TEST);
     requestAnimationFrame(animate);
   }
   else{
      requestAnimationFrame(animate2);
   }
}

function nonAffine() {
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
        //Bottom right inner triangle
         0.01 + 0.25*Math.cos(degreeAngle2),  0.01,  0.0,
         0.14 + 0.25*Math.cos(degreeAngle2),  0.01,  0.0,
         0.14 + 0.25*Math.cos(degreeAngle2),  0.05,  0.0,
         //Bottom left inner triangle
         0.01 + 0.25*Math.cos(degreeAngle2),  0.01,  0.0,
         0.01 + 0.25*Math.cos(degreeAngle2),  0.05,  0.0,
         0.14 + 0.25*Math.cos(degreeAngle2),  0.05,  0.0,
         //Middle right inner triangle
         0.05 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.10 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.10 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         //Middle left inner triangle
         0.05 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.05 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.10 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         //Top right inner triangle
         0.01 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.14 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.14 - 0.25*Math.cos(degreeAngle2), 0.20, 0.0,
         //Top left inner triangle
         0.01 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.01 - 0.25*Math.cos(degreeAngle2), 0.20, 0.0,
         0.14 - 0.25*Math.cos(degreeAngle2), 0.20, 0.0,

         //Bottom margin triangle (right)
         0.0 + 0.25*Math.cos(degreeAngle2), 0.0, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.0, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         //Bottom margin triangle (left)
         0.0 + 0.25*Math.cos(degreeAngle2), 0.0, 0.0,
         0.0 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         //Lower side margins
         0.0 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.01 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.01 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,

         0.0 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.0 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.01 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,

         0.14 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,

         0.14 + 0.25*Math.cos(degreeAngle2), 0.01, 0.0,
         0.14 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,

         //Top of bottom margins lol
         0.0 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.05 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.05 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,

         0.0 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.0 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.05 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,

         0.1 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,

         0.1 + 0.25*Math.cos(degreeAngle2), 0.05, 0.0,
         0.10 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.15 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,

         //Middle left
         0.04 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.05 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.05 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,

         0.04 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.04 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.05 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,

         //Middle right
         0.1 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.11 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.11 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,

         0.1 + 0.25*Math.cos(degreeAngle2), 0.06, 0.0,
         0.10 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.11 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,

         //Bottom of top margins lol
         0.0 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.05 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.05 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,

         0.0 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.0 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.05 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,

         0.1 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,

         0.1 - 0.25*Math.cos(degreeAngle2), 0.15, 0.0,
         0.10 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,

         //Upper side margins
         0.0 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.01 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.01 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,

         0.0 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.0 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,
         0.01 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,

         0.14 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,

         0.14 - 0.25*Math.cos(degreeAngle2), 0.16, 0.0,
         0.14 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,

         //Upper right margin
         0.0 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.21, 0.0,

         //Upper left margin
         0.0 - 0.25*Math.cos(degreeAngle2), 0.2, 0.0,
         0.0 - 0.25*Math.cos(degreeAngle2), 0.21, 0.0,
         0.15 - 0.25*Math.cos(degreeAngle2), 0.21, 0.0

  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 90;
}

function nonAffine2(){
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
    0,  -0.3, 0,
    -0.2, -0.2, 0,
    -0.3, 0,  0,

    0,  -0.3, 0,
    -0.2 + 0.1*Math.sin(3*degreeAngle2), 0.3, 0,
    -0.3, 0,  0,

    0,  -0.3, 0,
    -0.2 + 0.1*Math.sin(3*degreeAngle2), 0.3, 0,
    -0.1 + 0.1*Math.sin(3*degreeAngle2), 0.2,  0,

    0,  -0.3, 0,
    0 + 0.2*Math.sin(3*degreeAngle2), 0.6, 0,
    -0.1 + 0.1*Math.sin(3*degreeAngle2), 0.2,  0,

    0,  -0.3, 0,
    0 + 0.2*Math.sin(3*degreeAngle2), 0.6, 0,
    0.1 + 0.1*Math.sin(3*degreeAngle2), 0.2,  0,

    0,  -0.3, 0,
    0.2 + 0.1*Math.sin(3*degreeAngle2), 0.3, 0,
    0.1 + 0.1*Math.sin(3*degreeAngle2), 0.2,  0,

    0,  -0.3, 0,
    0.2 + 0.1*Math.sin(3*degreeAngle2), 0.3, 0,
    0.3, 0,  0,

    0,  -0.3, 0,
    0.2, -0.2, 0,
    0.3, 0,  0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 24;
}


function startup() {
  console.log("No bugs so far...");
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders();
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  requestAnimationFrame(animate);
  }
