import Phaser from 'phaser';
import { preload } from './preload';
import { create } from './create';
import { update } from './update';

class scene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MY_PLAY_SCENE',
    });
  }
  preload() {
    return preload.call(this);
  }
  create() {
    return create.call(this);
  }
  update() {
    return update.call(this);
  }
}

export default scene;
