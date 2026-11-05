export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];

  for (let index = startOffset - 1; index >= 0; index -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrev - index),
      current: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), current: true });
  }
  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, cells.length - startOffset - daysInMonth + 1),
      current: false,
    });
  }
  return cells;
}
