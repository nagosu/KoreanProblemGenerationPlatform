const array = [
  "지문의 전개방식",
  "지문 내부의 사실 일치 확인",
  "밑줄친 대상의 이해",
  "외부 내용과 비교하여 사실 일치 확인",
  "지문의 외부 대상과 대조하여 정오 판별",
  "단어 바꿔쓰기",
  "묶음에 대한 판단",
  "밑줄친 대상 사이의 비교",
  "지문에 근거한 새로운 사례와 대조하여 정오 판별",
  "의미가 가까운 단어 추론",
];

const dummyProblemTypes = [...array];

while (dummyProblemTypes.length < 500) {
  dummyProblemTypes.push(...array);
}
