export default function rollChance(chances) {
  return Math.random() <= (chances / 100);
};
