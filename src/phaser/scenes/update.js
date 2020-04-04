import Phaser from 'phaser';

import getRandomInt from "../../utils/getRandomInt";
import currentTime from "../../utils/currentTime";
import rollChance from "../../utils/rollChance";
import settings from "../settings";

export function update() {
  const thisScene = this;
  this.startTime = this.startTime ? this.startTime : currentTime();
  this.timeSinceStart = currentTime() - this.startTime;

  // direct subjects movement and current statuses
  const subjects = this.subjectsGroup.getChildren();
  subjects.forEach((subject) => {

    // track infection status
    if (subject.details.infected) {

      // is a new infection? initialize some details
      if (!subject.details.infectedTime ) {
        // ensure we have an infection time
        subject.details.infectedTime = currentTime();

        // define if will eventually die
        // if is infected, set a death sentence
        if (rollChance(settings.deathChance)) {
          subject.details.dieTime = currentTime() + getRandomInt(1, settings.maxTimeToDeath);
        }
      }

      const infectedTime = currentTime() - subject.details.infectedTime;

      // infected for more than settings.showSymptomsTim? show symptoms
      if (infectedTime >= settings.showSymptomsTime) {
        subject.setTint(0xdb3609);
      }

      // survived and is cured? remove infection and set immune status
      if (infectedTime >= settings.cureTime) {
        subject.details.immune = true;
        subject.details.infected = false;
        subject.setTint(0x3917e3);
      }


    }

    // if the subject is meant to die and is time, remove and continue
    if (currentTime() - subject.details.dieTime > 0) {
      subject.destroy();
      return;
    }

    // if the subject is far away from the target
    // AND is still a fresh movement
    // keep trying to reach the target
    if (
      Phaser.Math.Distance.Between(subject.x, subject.y, subject.targetX, subject.targetY) > 2 &&
      (currentTime() - subject.details.lastMovementTime) < getRandomInt(2, 4)
    ) {
      thisScene.physics.moveTo(subject, subject.targetX , subject.targetY, 2, getRandomInt(1, 10) * 1000);
    } else {
      // subject is close enough, switch movement
      // OR the target is out of reach and too much time was spent
      // switch the target
      subject.targetX = subject.x + getRandomInt(-1 * (settings.width * (settings.subjectsMovementRate / 50)), settings.width * (settings.subjectsMovementRate / 50));
      subject.targetY = subject.y + getRandomInt(-1 * (settings.height * (settings.subjectsMovementRate / 50)), settings.height * (settings.subjectsMovementRate / 50));
      subject.details.lastMovementTime = currentTime();
    }

  });

  // allow add cones
  this.lastConeAddedTime = 0;
  if (this.input.activePointer.isDown && (currentTime() - this.lastConeAddedTime) > 0.1) {
    this.lastConeAddedTime = currentTime();

    // this.mouse = this.input.mousePointer;
    // input.x,input.y
    //
    const cone = this.physics.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cone');
    cone.setDepth(9);
    cone.immovable = true;
    cone.body.moves = false;
    cone.details = {
      createdTime: currentTime(),
    };
    thisScene.conesGroup.add(cone);
  }

  // remove cones after specified time
  const cones = this.conesGroup.getChildren();
  cones.forEach((cone) => {
    if (currentTime() - cone.details.createdTime > settings.coneDestroyTime) {
      cone.destroy();
    }
  });

  // update status text if required
  const infectedCount = subjects.filter(b => b.details.infected).length;
  const immuneCount = subjects.filter(b => b.details.immune).length;
  const updatedStatusText = `Total: ${subjects.length}
Infected: ${infectedCount}
Immune: ${immuneCount}
Deaths: ${settings.subjects - subjects.length}
Time: ${this.timeSinceStart }
`;

  if (this.statusText.text !== updatedStatusText) {
    this.statusText.text = updatedStatusText;
  }

  // track infection over time
  this.dataOverTime = this.dataOverTime ? this.dataOverTime : {};

  // if we are in a new time and the simulation is not ended, add a line to represent that last time
  if (!this.dataOverTime[this.timeSinceStart] && !this.endText) {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 0.4);
    const currX = 50 + (this.timeSinceStart * 2);
    const baseY = settings.height - 50;
    graphics.lineBetween(currX, baseY, currX, baseY - (infectedCount * 3));
    graphics.setDepth(3);
  }

  // update current state
  this.dataOverTime[this.timeSinceStart] = infectedCount;

  // show an end title
  if ((subjects.length === 0 || infectedCount === 0) && !this.endText) {
    this.endText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'SIMULATION ENDED', {
        font: '40px Arial',
        fill: '#ffffff',
      }
    );
    this.endText.setOrigin(0.5);
    this.endText.setDepth(30);
  }


}
