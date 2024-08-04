const array = [
  "인문",
  "과학",
  "예술",
  "사회",
  "경제",
  "유형 6",
  "유형 7",
  "유형 8",
  "유형 9",
  "유형 10",
];

const dummyPassageMinor = [...array];

while (dummyPassageMinor.length < 500) {
  dummyPassageMinor.push(...array);
}
