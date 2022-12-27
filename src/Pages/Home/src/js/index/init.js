const THREE = require("three");
// const debounce = require("js-util/debounce");

const SmoothScrollManager =
  require("../smooth_scroll_manager/SmoothScrollManager").default;

export default function init1() {
  const scrollManager = new SmoothScrollManager();

  const canvas = document.getElementById("canvas-webgl");
  const renderer = new THREE.WebGL1Renderer({
    antialias: false,
    canvas: canvas,
  });
  const renderBack = new THREE.WebGLRenderTarget(
    document.body.clientWidth,
    window.innerHeight
  );
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new THREE.PerspectiveCamera(
    45,
    document.body.clientWidth / window.innerHeight,
    1,
    10000
  );
  const clock = new THREE.Clock();

  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    cameraBack.aspect = document.body.clientWidth / window.innerHeight;
    cameraBack.updateProjectionMatrix();
    renderBack.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setSize(document.body.clientWidth, window.innerHeight);
  };
  const render = () => {
    renderer.setRenderTarget(renderBack);
    renderer.render(sceneBack, cameraBack);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const on = () => {
    // window.addEventListener(
    //   "resize",
    //   debounce(() => {
    //     resizeWindow();
    //   }),
    //   1000
    // );

    scrollManager.renderNext = () => {
      if (scrollManager.isValidSmooth()) {
        cameraBack.position.y = scrollManager.hookes.contents.velocity[1] * 0.6;
      } else {
        cameraBack.position.y = scrollManager.scrollTop * -1;
      }
    };
  };

  const init = () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    cameraBack.position.z = 800;

    clock.start();

    on();
    resizeWindow();
    renderLoop();
    scrollManager.start();
  };
  init();
}
