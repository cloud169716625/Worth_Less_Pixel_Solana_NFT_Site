// require("@babel/polyfill");

require("./index/init.js").default();

const canvas = document.getElementById("canvas-webgl");
canvas.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
canvas.addEventListener("selectstart", function (event) {
  event.preventDefault();
});

require("./sketch/gallery/init.js").default();
