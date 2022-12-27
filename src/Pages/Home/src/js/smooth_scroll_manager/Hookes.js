import Force3 from "../old/Force3";

const force3 = new Force3();

export default class Hookes {
  constructor(opt) {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.k = opt && opt.k !== undefined ? opt.k : 0.3;
    this.d = opt && opt.d !== undefined ? opt.d : 0.7;
    this.m = opt && opt.m !== undefined ? opt.m : 1;
  }
  render() {
    force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    force3.applyDrag(this.acceleration, this.d);
    force3.updateVelocity(this.velocity, this.acceleration, this.m);
  }
}
