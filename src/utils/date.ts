const Day = {
  'MON': 1,
  'TUE': 2,
  'WED': 3,
  'THU': 4,
  'FRI': 5,
  'SAT': 6,
  'SUN': 0,
};

const addZero = (number: string): string => number.length === 1 ? '0' + number : number;

export const getTimeOfCurrentMonday = (): number => {
  const dateInstance = new Date();

  dateInstance.setDate(dateInstance.getDate() - (dateInstance.getDay() - Day.MON) % 7);

  dateInstance.setHours(0, 0, 0, 0);

  return dateInstance.getTime();
};

export const formatDate = (time: number): string => {
  const dateInstance = new Date(time);

  dateInstance.setDate(dateInstance.getDate() - (dateInstance.getDay() - Day.MON) % 7);

  const date = dateInstance.getDate();
  const month = dateInstance.getMonth() + 1;
  const year = dateInstance.getFullYear();

  return `${year}-${addZero(month.toString())}-${addZero(date.toString())}`;
};

const convertFormattedDateToTime = (formattedDate: string): number => {
  const dateItems = formattedDate.split('-');

  const year = Number(dateItems[0]);
  const month = Number(dateItems[1]) - 1;
  const date = Number(dateItems[2]);

  return new Date(year, month, date).getTime();
};

export const getStudyWeek = () => {
  const WEEK_TIME = 1000 * 60 * 60 * 24 * 7;

  const studyingStartTime = convertFormattedDateToTime('2021-02-08');
  const currentWeekStartTime = getTimeOfCurrentMonday();

  const elapsedWeeksNumber = (currentWeekStartTime - studyingStartTime) / WEEK_TIME;

  return elapsedWeeksNumber + 1;
};
