
// import assets so they get included into /dist
import balls from "../../assets/balls.png";
import cone from "../../assets/cone.png";

export function preload() {

  this.load.image('cone', cone);
  this.load.spritesheet('balls', balls, { frameWidth: 17, frameHeight: 17 });

}
