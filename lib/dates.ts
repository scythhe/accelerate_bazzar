const MONTHS = [
  "იან.",
  "თებ.",
  "მარ.",
  "აპრ.",
  "მაისი",
  "ივნ.",
  "ივლ.",
  "აგვ.",
  "სექ.",
  "ოქტ.",
  "ნოე.",
  "დეკ.",
];
const WEEKDAYS = ["კვ.", "ორშ.", "სამშ.", "ოთხშ.", "ხუთშ.", "პარ.", "შაბ."];

/** The next three delivery days, soonest first, as the labels orders store. */
export function deliveryDates(now = new Date()): string[] {
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d;
  };
  const dayMonth = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const third = day(3);
  return [
    `ხვალ, ${dayMonth(day(1))}`,
    `ზეგ, ${dayMonth(day(2))}`,
    `${dayMonth(third)}, ${WEEKDAYS[third.getDay()]}`,
  ];
}
