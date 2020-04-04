import getRandomInt from '../../utils/getRandomInt';
import rollChance from '../../utils/rollChance';
import settings from '../settings';
import currentTime from '../../utils/currentTime';

const ballFrames = {
  red: 0,
  blue: 1,
  magenta: 2,
  green: 3,
  cyan: 4,
  yellow: 5,
};

export function create() {
  const thisScene = this;

  // create subjects
  this.subjectsGroup = this.add.group();
  for (let i = 0; i < settings.subjects; i++) {
    const subject = this.physics.add.sprite(getRandomInt(10, settings.width - 10), getRandomInt(10, settings.height), 'balls', ballFrames.green);
    subject.setCollideWorldBounds(true);
    subject.setDepth(10);
    thisScene.subjectsGroup.add(subject);
    subject.details = {
      infected: false,
    };
  }

  // ensure at least one subject is infected :)
  if (!this.subjectsGroup.getChildren().find((subject) => subject.details.infected === true)) {
    this.subjectsGroup.getChildren()[0].details.infected = true;
  }

  // allow the user to add cones to prevent movement
  this.conesGroup = this.add.group();

  // enable subjects to collide with cones
  this.physics.add.collider(this.subjectsGroup, this.conesGroup);

  // enable subjects to collide with each other
  this.physics.add.collider(this.subjectsGroup, this.subjectsGroup, (subjectA, subjectB) => {

    const involvedSubjects = [subjectA, subjectB];

    // get a susceptible subject (if any)
    // meaning a non immune and not currently infected
    const susceptible = involvedSubjects.find(body => body.details.infected === false && !body.details.immune);

    // get the infected subject (if any)
    const infected = involvedSubjects.find(body => body.details.infected === true);

    // we have a match of an infected with a susceptible subject, infect
    if (infected && susceptible) {
      susceptible.details.infected = rollChance(settings.transmissionChance);
    }

  });

  this.statusText = this.make.text({
    x: 5,
    y: 5,
    text: '',
    style: {
      font: '12px monospace',
      fill: '#ffffff'
    }
  });
  this.statusText.setDepth(30);

  this.cameras.main.setBounds(0, 0, settings.width, settings.height);
}
