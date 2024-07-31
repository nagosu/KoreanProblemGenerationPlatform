const editButtons = document.querySelectorAll(".edit-button");
const promptAreas = document.querySelectorAll(".prompt-area");
const recreateButtons = document.querySelectorAll(".recreate-button");
const copyButtons = document.querySelectorAll(".copy-button");

const modalWarningOverlay = document.querySelector(".modal-warning-overlay");
const modalWarningContent = document.querySelector(".modal-warning-content");
const modalWarningCloseButton = document.querySelector(
  ".modal-warning-close-button"
);

const toastMessageContainer = document.querySelector(
  ".toast-message-container"
);

// 문제 및 해설 텍스트 변수 저장
let tab = "";
let problemType = "";
let passageInput = "";
let generatedProblem = "";
let problemExplanation = "";

let promptGeneratedProblem = document
  .querySelector(".generated-problem-wrapper .prompt-area")
  .value.trim();
let promptProblemExplanation = document
  .querySelector(".problem-explanation-wrapper .prompt-area")
  .value.trim();

// 문제 및 해설 텍스트가 비어있을 경우 경고 메시지 출력
recreateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("problem")) {
      // 문제 재생성 버튼 클릭 시
      if (generatedProblem === "" || promptGeneratedProblem === "") {
        // 생성된 문제 혹은 프롬프트 입력이 비어있을 경우
        openModalWarningRecreate();
      } else {
        recreateProblem(); // 문제 재생성 API 호출
      }
    } else if (button.classList.contains("explanation")) {
      // 해설 재생성 버튼 클릭 시
      if (problemExplanation === "" || promptProblemExplanation === "") {
        openModalWarningRecreate();
      } else {
        recreateExplanation(); // 해설 재생성 API 호출
      }
    }
  });
});

// 경고 모달 닫기 버튼 클릭 시
modalWarningCloseButton.addEventListener("click", () => {
  closeModalWarningRecreate();
});

// 경고 모달 띄우기
function openModalWarningRecreate() {
  modalWarningOverlay.classList.remove("fade-out"); // 기존에 fade-out 클래스가 있을 경우 제거
  modalWarningOverlay.style.display = "block";
}

// 경고 모달 닫기
function closeModalWarningRecreate() {
  modalWarningOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalWarningOverlay.style.display = "none";
    modalWarningOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

// 복사 버튼 클릭 시 클립보드에 복사
copyButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const isProblemCopy = e.target.closest(".generated-problem-wrapper");
    const textToCopy = isProblemCopy ? generatedProblem : problemExplanation;
    copyToClipboard(textToCopy);
    showToastMessage(); // 토스트 메시지 출력
  });
});

const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

// 복사 토스트 메시지 출력
function showToastMessage() {
  toastMessageContainer.style.display = "flex";
  setTimeout(() => {
    toastMessageContainer.classList.add("fade-out");
  }, 2000);
  setTimeout(() => {
    toastMessageContainer.style.display = "none";
    toastMessageContainer.classList.remove("fade-out");
  }, 2300);
}

// 이전 페이지에서 가져온 데이터로 변수 초기화
function initResultData() {
  tab = sessionStorage.getItem("tab");
  problemType = sessionStorage.getItem("problemType");
  passageInput = sessionStorage.getItem("passageInput");
  generatedProblem = sessionStorage.getItem("generatedProblem");
  problemExplanation = sessionStorage.getItem("problemExplanation");

  // 이전 페이지에서 가져온 데이터로 문제 및 해설 텍스트 초기화
  document.querySelector(".generated-problem-wrapper .editable").innerText =
    generatedProblem;
  document.querySelector(".problem-explanation-wrapper .editable").innerText =
    problemExplanation;
}

// 문제 재생성 API 호출
async function recreateProblem() {
  // const url = "/recreate/problem"; // 문제 및 해설 재생성 API 주소

  const dummyResponseData = {
    newGeneratedProblem:
      "1. 윗글의 내용을 근거로 ㉠에 대한 설명으로 적절하지 않은 것은?\n① 조선에서 서양 학문을 공식적으로 배제했기 때문이다.\n② 서양에서 도입된 의학이 체계적으로 완성되지 않았기 때문이다.\n③ 당대 의사들이 서양 의학의 한계를 인식했기 때문이다.\n④ 서양 해부학이 조선의 도덕적 기준에 반했기 때문이다.\n⑤ 서양 의학이 천문학에 비해 주목받지 못했기 때문이다.\n\n2. 윗글의 내용을 근거로 ㉠에 대한 설명으로 적절하지 않은 것은?\n① 조선에서 서양 학문을 공식적으로 배제했기 때문이다.\n② 서양에서 도입된 의학이 체계적으로 완성되지 않았기 때문이다.\n③ 당대 의사들이 서양 의학의 한계를 인식했기 때문이다.\n④ 서양 해부학이 조선의 도덕적 기준에 반했기 때문이다.\n⑤ 서양 의학이 천문학에 비해 주목받지 못했기 때문이다.\n\n3. 윗글의 내용을 근거로 ㉠에 대한 설명으로 적절하지 않은 것은?\n① 조선에서 서양 학문을 공식적으로 배제했기 때문이다.\n② 서양에서 도입된 의학이 체계적으로 완성되지 않았기 때문이다.\n③ 당대 의사들이 서양 의학의 한계를 인식했기 때문이다.\n④ 서양 해부학이 조선의 도덕적 기준에 반했기 때문이다.\n⑤ 서양 의학이 천문학에 비해 주목받지 못했기 때문이다.\n",
  };

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     problemType: problemType,
    //     passageInput: passageInput,
    //     generatedProblem: generatedProblem,
    //     promptGeneratedProblem: promptGeneratedProblem,
    //   }),
    // });
    // const data = await response.json();

    const data = dummyResponseData;
    console.log("문제 재생성 결과: ", data);
    generatedProblem = data.newGeneratedProblem;
    // 문제 생성 텍스트 업데이트
    document.querySelector(".generated-problem-wrapper .editable").innerText =
      generatedProblem;
  } catch (e) {
    console.error(e);
  }
}

// 해설 재생성 API 호출
async function recreateExplanation() {
  // const url = "/recreate/explnation"; // 문제 및 해설 재생성 API 주소

  const dummyResponseData = {
    newProblemExplanation:
      "1번은 ~~~~~~~ 이유로 오답이다.\n2번은 ~~~~~~~ 때문에 오답이다.\n3번은 ~~~~~~~ 때문에 정답이다.\n4번은 ~~~~~~~ 때문에 오답이다.\n5번은 ~~~~~~~ 때문에 오답이다.\n\n1번은 ~~~~~~~ 이유로 오답이다.\n2번은 ~~~~~~~ 때문에 오답이다.\n3번은 ~~~~~~~ 때문에 정답이다.\n4번은 ~~~~~~~ 때문에 오답이다.\n5번은 ~~~~~~~ 때문에 오답이다.\n\n1번은 ~~~~~~~ 이유로 오답이다.\n2번은 ~~~~~~~ 때문에 오답이다.\n3번은 ~~~~~~~ 때문에 정답이다.\n4번은 ~~~~~~~ 때문에 오답이다.\n5번은 ~~~~~~~ 때문에 오답이다.\n",
  };

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     problemType: problemType,
    //     passageInput: passageInput,
    //     generatedProblem: generatedProblem,
    //     problemExplanation: problemExplanation,
    //     promptProblemExplanation: promptProblemExplanation,
    //   }),
    // });
    // const data = await response.json();

    const data = dummyResponseData;
    console.log("해설 재생성 결과: ", data);
    problemExplanation = data.newProblemExplanation;
    // 해설지 텍스트 업데이트
    document.querySelector(".problem-explanation-wrapper .editable").innerText =
      problemExplanation;
  } catch (e) {
    console.error(e);
  }
}

// DOMContentLoaded 이벤트 발생 시 실행
document.addEventListener("DOMContentLoaded", () => {
  initResultData(); // 이전 페이지에서 가져온 데이터로 변수 초기화

  // 문제 및 해설 수정 버튼 클릭 시
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // 가장 가까운 문제 또는 해설 박스의 contenteditable 속성을 true로 변경
      const editableDiv = e.target
        .closest(".problem-container, .explanation-container")
        .querySelector(".editable");
      editableDiv.contentEditable = "true";
    });
  });

  // 문제 및 해설 프롬프트 입력 시 변수에 저장
  promptAreas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      if (textarea.classList.contains("generate-problem")) {
        promptGeneratedProblem = textarea.value.trim();
        console.log(promptGeneratedProblem);
      } else if (textarea.classList.contains("problem-explanation")) {
        promptProblemExplanation = textarea.value.trim();
        console.log(promptProblemExplanation);
      }
    });
  });

  // 문제 및 해설 editable 입력 시 변수에 저장
  const editableAreas = document.querySelectorAll(".editable");
  editableAreas.forEach((editable) => {
    editable.addEventListener("input", () => {
      if (editable.closest(".generated-problem-wrapper")) {
        generatedProblem = editable.innerText.trim();
      } else if (editable.closest(".problem-explanation-wrapper")) {
        problemExplanation = editable.innerText.trim();
      }
    });
  });
});
