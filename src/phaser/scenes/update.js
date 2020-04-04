import Phaser from 'phaser';

import getRandomInt from "../../utils/getRandomInt";
import currentTime from "../../utils/currentTime";
import rollChance from "../../utils/rollChance";
import settings from "../settings";

export function update() {
  const thisScene = this;
  this.startTime = this.startTime ? this.startTime : currentTime();
  this.timeSinceStart = currentTime() - this.startTime;
  const subjects = this.subjectsGroup.getChildren();
  const deathsCount = settings.subjects - subjects.length;
  const infectedCount = subjects.filter(b => b.details.infected).length;
  const usingIcu = subjects.filter(b => b.details.icu).length;

  // direct subjects movement and current statuses
  subjects.forEach((subject) => {

    // track infection status
    if (subject.details.infected) {

      // is a new infection? initialize some details
      if (!subject.details.infectedTime ) {
        // ensure we have an infection time
        subject.details.infectedTime = currentTime();

        // define if this subject requires icu
        subject.details.icu = rollChance(settings.icuChance);

        // define death chance
        const deathChance = subject.details.icu && usingIcu >= settings.availableIcu ? settings.deathChanceWithoutIcu : settings.deathChance;

        // define if will eventually die given the death chances at this time
        if (rollChance(deathChance)) {
          subject.details.dieTime = currentTime() + getRandomInt(parseInt(settings.maxTimeToDeath / 2), settings.maxTimeToDeath);
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
  const immuneCount = subjects.filter(b => b.details.immune).length;
  const updatedStatusText = `Total: ${subjects.length}
Infected: ${infectedCount}
Immune: ${immuneCount}
Deaths: ${deathsCount}
Time: ${this.timeSinceStart }
`;

  if (this.statusText.text !== updatedStatusText) {
    this.statusText.text = updatedStatusText;
  }

  // track infections and deaths over time
  this.infectionsOverTime = this.infectionsOverTime ? this.infectionsOverTime : {};
  this.deathsOverTime = this.deathsOverTime ? this.deathsOverTime : {};

  // if we are in a new time and the simulation is not ended, add a line to represent that last time
  if (!this.infectionsOverTime[this.timeSinceStart] && !this.endText) {
    const currX = 50 + (this.timeSinceStart * 2);
    const baseY = settings.height - 50;

    const infectedGraph = this.add.graphics();
    infectedGraph.lineStyle(2, 0xffffff, 0.4);
    infectedGraph.lineBetween(currX, baseY, currX, baseY - (this.infectionsOverTime[this.timeSinceStart -1] * 3));
    infectedGraph.setDepth(3);

    const deathsGraph = this.add.graphics();
    deathsGraph.lineStyle(2, 0xff0000, 0.3);
    deathsGraph.lineBetween(currX, baseY, currX, baseY - (this.deathsOverTime[this.timeSinceStart -1] * 3));
    deathsGraph.setDepth(4);
  }

  // update current state
  this.infectionsOverTime[this.timeSinceStart] = infectedCount;
  this.deathsOverTime[this.timeSinceStart] = deathsCount;

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
