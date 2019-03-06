export const numberToTime = seconds => {
  const secNum = parseInt(seconds, 10);
  if (secNum >= 60 * 60) return '59:59';

  let mins = Math.floor(secNum / 60);
  let secs = Math.floor(secNum - mins * 60);

  mins = mins < 10 ? `0${mins}` : mins;
  secs = secs < 10 ? `0${secs}` : secs;

  return `${mins}:${secs}`;
};

export const scoreToString = (saved, seconds) =>
  `Saved: ${saved}, Time: ${numberToTime(seconds)}`;

export const assessStars = saved => {
  if (saved == null) return 0;
  if (saved >= 10) return 3;
  if (saved >= 8) return 2;
  if (saved <= 0) return 0;
  return 1;
};
