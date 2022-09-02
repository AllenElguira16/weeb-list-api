import dayjs from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

/**
 * Winter season (1st quarter) from January to March.
 * Spring season (2nd quarter) from April to June.
 * Summer season (3rd quarter) from July from September.
 * Fall season (4th quarter) from October to December.
 */
export const getCurrentSeason = ():
  | 'SPRING'
  | 'SUMMER'
  | 'FALL'
  | 'WINTER'
  | null => {
  const year = dayjs().year();

  if (dayjs().isBetween(`${year}-01-01`, `${year}-03-31`)) {
    return 'WINTER';
  } else if (dayjs().isBetween(`${year}-04-01`, `${year}-06-30`)) {
    return 'SPRING';
  } else if (dayjs().isBetween(`${year}-07-01`, `${year}-09-30`)) {
    return 'SUMMER';
  } else if (dayjs().isBetween(`${year}-10-01`, `${year}-12-31`)) {
    return 'FALL';
  }

  return null;
};

/**
 * Winter season (1st quarter) from January to March.
 * Spring season (2nd quarter) from April to June.
 * Summer season (3rd quarter) from July from September.
 * Fall season (4th quarter) from October to December.
 */
export const getSeason = (
  date: Date,
): 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | null => {
  const year = dayjs(date).year();

  if (dayjs().isBetween(`${year}-01-01`, `${year}-03-31`)) {
    return 'WINTER';
  } else if (dayjs().isBetween(`${year}-04-01`, `${year}-06-30`)) {
    return 'SPRING';
  } else if (dayjs().isBetween(`${year}-07-01`, `${year}-09-30`)) {
    return 'SUMMER';
  } else if (dayjs().isBetween(`${year}-10-01`, `${year}-12-31`)) {
    return 'FALL';
  }

  return null;
};
