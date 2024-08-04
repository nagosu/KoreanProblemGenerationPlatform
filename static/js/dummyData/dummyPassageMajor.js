const array = [
  "평가원",
  "교육청",
  "사관학교",
  "유형 4",
  "유형 5",
  "유형 6",
  "유형 7",
  "유형 8",
  "유형 9",
  "유형 10",
];

const dummyPassageMajor = [...array];

while (dummyPassageMajor.length < 500) {
  dummyPassageMajor.push(...array);
}
