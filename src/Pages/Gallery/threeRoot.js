import * as THREE from "three";

export default function THREERoot(params) {
  // defaults
  params = Object.assign(
    {
      container: "#three-container",
      fov: 60,
      zNear: 1,
      zFar: 10000,
      createCameraControls: true,
      autoStart: true,
      pixelRatio: window.devicePixelRatio,
      antialias: window.devicePixelRatio === 1,
      alpha: false,
    },
    params
  );

  // maps and arrays
  this.updateCallbacks = [];
  this.resizeCallbacks = [];
  this.objects = {};

  // renderer
  this.renderer = new THREE.WebGLRenderer({
    antialias: params.antialias,
    alpha: params.alpha,
  });
  this.renderer.setPixelRatio(params.pixelRatio);

  // container
  this.container =
    typeof params.container === "string"
      ? document.querySelector(params.container)
      : params.container;
  this.container.appendChild(this.renderer.domElement);

  // camera
  this.camera = new THREE.PerspectiveCamera(
    params.fov,
    window.innerWidth / window.innerHeight,
    params.zNear,
    params.zFar
  );

  // scene
  this.scene = new THREE.Scene();

  // resize handling
  this.resize = this.resize.bind(this);
  this.resize();
  window.addEventListener("resize", this.resize, false);

  // tick / update / render
  this.tick = this.tick.bind(this);
  params.autoStart && this.tick();
}
THREERoot.prototype = {
  start: function () {
    this.tick();
  },
  addUpdateCallback: function (callback) {
    this.updateCallbacks.push(callback);
  },
  addResizeCallback: function (callback) {
    this.resizeCallbacks.push(callback);
  },
  add: function (object, key) {
    key && (this.objects[key] = object);
    this.scene.add(object);
  },
  addTo: function (object, parentKey, key) {
    key && (this.objects[key] = object);
    this.get(parentKey).add(object);
  },
  get: function (key) {
    return this.objects[key];
  },
  remove: function (o) {
    var object;

    if (typeof o === "string") {
      object = this.objects[o];
    } else {
      object = o;
    }

    if (object) {
      object.parent.remove(object);
      delete this.objects[o];
    }
  },
  tick: function () {
    this.update();
    this.render();
    requestAnimationFrame(this.tick);
  },
  update: function () {
    this.updateCallbacks.forEach(function (callback) {
      callback();
    });
  },
  render: function () {
    this.renderer.render(this.scene, this.camera);
  },
  resize: function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.resizeCallbacks.forEach(function (callback) {
      callback();
    });
  },
};
