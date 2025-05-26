export default function formateDate(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);
  const [month, day, year] = formattedDate.split(' ');
  const monthNames: { [key: string]: string } = {
    Jan: 'Jan',
    Feb: 'Feb',
    Mar: 'Mar',
    Apr: 'Apr',
    May: 'May',
    Jun: 'Jun',
    Jul: 'Jul',
    Aug: 'Aug',
    Sep: 'Sep',
    Oct: 'Oct',
    Nov: 'Nov',
    Dec: 'Dec'
  };
  return `${day} ${monthNames[month]} ${year}`;
}
