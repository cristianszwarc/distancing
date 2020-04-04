import screenSize from '../utils/screenSize';

export default {
  subjects: 100,
  subjectsMovementRate: 20,
  initialInfectionChance: 3,
  transmissionChance: 50,

  showSymptomsTime: 5,
  cureTime: 13,

  icu: 10,

  deathChance: 10,
  maxTimeToDeath: 8,

  coneDestroyTime: 8,
  width: 400, //screenSize.width,
  height: 400, //screenSize.height,
  debug: false,
};
