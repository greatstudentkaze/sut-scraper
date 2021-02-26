const Day = {
  'MON': 1,
  'TUE': 2,
  'WED': 3,
  'THU': 4,
  'FRI': 5,
  'SAT': 6,
  'SUN': 0,
};

const StudyDate = {
  START: '2021-02-09',
  END: '2021-06-14',
};

const WEEK_TIME = 1000 * 60 * 60 * 24 * 7;

const addZero = (number: string): string => number.length === 1 ? '0' + number : number;

export const getTimeOfTheClosestMonday = (time: number): number => {
  const dateInstance = new Date(time);

  dateInstance.setDate(dateInstance.getDate() - (dateInstance.getDay() - Day.MON) % 7);

  dateInstance.setHours(0, 0, 0, 0);

  return dateInstance.getTime();
};

export const getTimeOfCurrentMonday = (): number => getTimeOfTheClosestMonday(Date.now());

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

// todo: refactor (54-71)
export const getStudyWeek = (): number => {
  const studyingStartTime = getTimeOfTheClosestMonday(convertFormattedDateToTime(StudyDate.START));
  const currentWeekStartTime = getTimeOfCurrentMonday();

  const elapsedWeeksNumber = (currentWeekStartTime - studyingStartTime) / WEEK_TIME;

  return elapsedWeeksNumber + 1;
};

export const getStudyWeeksCount = (): number => {
  const studyingStartTime = getTimeOfTheClosestMonday(convertFormattedDateToTime(StudyDate.START));
  const studyingEndTime = getTimeOfTheClosestMonday(convertFormattedDateToTime(StudyDate.END));

  const elapsedWeeksNumber = (studyingEndTime - studyingStartTime) / WEEK_TIME;

  return elapsedWeeksNumber + 1;
};

export const getMondayDatesArray = () => {
  const studyWeeksCount = getStudyWeeksCount();
  const startTime = convertFormattedDateToTime(StudyDate.START);
  const array = new Array(studyWeeksCount).fill(startTime);

  return array.map((it, index) => formatDate(new Date(startTime + index * WEEK_TIME).getTime()))
};
