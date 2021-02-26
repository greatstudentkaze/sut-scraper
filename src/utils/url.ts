export const getURL = (groupCode: string, date: string): string => {
  const BASE_URL = 'https://www.sut.ru/studentu/raspisanie/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya';

  return `${BASE_URL}?group=${groupCode}&date=${date}`;
};
