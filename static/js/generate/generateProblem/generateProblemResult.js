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
let generatedProblem = document.querySelector(
  ".generated-problem-wrapper .editable"
).innerText;
let promptGeneratedProblem = document
  .querySelector(".generated-problem-wrapper .prompt-area")
  .value.trim();
let problemExplanation = document.querySelector(
  ".problem-explanation-wrapper .editable"
).innerText;
let promptProblemExplanation = document
  .querySelector(".problem-explanation-wrapper .prompt-area")
  .value.trim();

// 문제 및 해설 텍스트가 비어있을 경우 경고 메시지 출력
recreateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      generatedProblem === "" &&
      problemExplanation === "" &&
      promptGeneratedProblem === "" &&
      promptProblemExplanation === ""
    ) {
      openModalWarningRecreate();
    } else {
      // 문제 및 해설 재생성 API 로직 추가해야함
      console.log({
        generatedProblem,
        promptGeneratedProblem,
        problemExplanation,
        promptProblemExplanation,
      });
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

// DOMContentLoaded 이벤트 발생 시 실행
document.addEventListener("DOMContentLoaded", () => {
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
      } else if (textarea.classList.contains("problem-explanation")) {
        promptProblemExplanation = textarea.value.trim();
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

  console.log({
    generatedProblem,
    promptGeneratedProblem,
    problemExplanation,
    promptProblemExplanation,
  });
});
