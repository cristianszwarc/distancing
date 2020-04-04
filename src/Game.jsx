import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import settings from "./phaser/settings";
import scene from "./phaser/scenes/scene";

class Game extends Component {

  state = {
    initialize: true,
    game: {
      width: settings.width,
      height: settings.height,
      type: Phaser.AUTO,
      pixelArt: true,
      backgroundColor: '#2d2d2d',
      physics: {
        default: 'arcade',
        arcade: {
          debug: settings.debug,
        }
      },
      scene: scene,
    },
  };

  render() {
    const { initialize, game } = this.state
    return (
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

export default Game;
