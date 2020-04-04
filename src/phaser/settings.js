import screenSize from '../utils/screenSize';

export default {
  subjects: 100,
  subjectsMovementRate: 20,
  transmissionChance: 60,

  showSymptomsTime: 5,
  cureTime: 13,

  availableIcu: 5,
  icuChance: 15,
  deathChance: 3,
  deathChanceWithoutIcu: 80,
  maxTimeToDeath: 8,

  coneDestroyTime: 8,
  width: 400, //screenSize.width,
  height: 400, //screenSize.height,
  debug: false,
};
