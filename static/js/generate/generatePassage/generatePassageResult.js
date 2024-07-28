const underlineApply = document.querySelector(".underline-apply");
const underlineMenuList = document.querySelector(".underline-menu-list");
const underlineMenuItem = document.querySelectorAll(".underline-menu-item");

const createProblemButton = document.querySelector(".create-problem-button");
const editButton = document.querySelector(".edit-button");
const copyButton = document.querySelector(".copy-button");

const promptArea = document.querySelector(".prompt-area");
const recreateButton = document.querySelector(".recreate-button");

const modalWarningOverlay = document.querySelector(".modal-warning-overlay");
const modalWarningContent = document.querySelector(".modal-warning-content");
const modalWarningCloseButton = document.querySelector(
  ".modal-warning-close-button"
);

const toastMessageContainer = document.querySelector(
  ".toast-message-container"
);

let passageInput = ""; // 입력한 텍스트 저장하는 변수

// 결과물 텍스트 변수 저장
let generatedPassage = document.querySelector(
  ".result-wrapper .editable"
).innerText;
let promptGeneratedPassage = document
  .querySelector(".result-wrapper .prompt-area")
  .value.trim();

editButton.addEventListener("click", () => {});

// 복사 버튼 클릭 시 클립보드에 복사
copyButton.addEventListener("click", (e) => {
  const isProblemCopy = e.target.closest(".result-wrapper");
  if (isProblemCopy) {
    const textToCopy = generatedPassage;
    copyToClipboard(textToCopy);
    showToastMessage(); // 토스트 메시지 출력
  }
});

// 클립보드에 복사
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

recreateButton.addEventListener("click", () => {
  if (generatedPassage === "" || promptGeneratedPassage === "") {
    openModalWarningRecreate();
  } else {
    // 결과물 재생성 API 로직 추가해야함
    console.log({
      generatedPassage,
      promptGeneratedPassage,
    });
  }
});

// 경고 모달 닫기 버튼 클릭 시
modalWarningCloseButton.addEventListener("click", () => {
  closeModalWarningRecreate();
});

// 경고 모달 띄우기
function openModalWarningRecreate() {
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

// 토스트 메시지 출력
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

// 밑줄 관련 코드

// 밑줄 적용 버튼 클릭 시 밑줄 메뉴 보여주기
underlineApply.addEventListener("click", () => {
  showUnderlineMenu(); // 밑줄 메뉴 보여주기
});

// 밑줄 메뉴 아이템 클릭 시
underlineMenuItem.forEach((item) => {
  item.addEventListener("click", () => {
    // 밑줄 적용하는 로직 추가해야함
    hideUnderlineMenu(); // 밑줄 메뉴 숨기기
  });
});

const showUnderlineMenu = () => {
  underlineMenuList.classList.remove("fade-out");
  underlineMenuList.style.display = "flex";
};

const hideUnderlineMenu = () => {
  underlineMenuList.classList.add("fade-out");
  setTimeout(() => {
    underlineMenuList.style.display = "none";
    underlineMenuList.classList.remove("fade-out");
  }, 300);
};

// 밑줄 적용 버튼 클릭 시 밑줄 적용
function applyUnderline(underlineText) {
  const div = document.getElementById("editableDiv");
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  if (range.toString().length === 0) {
    alert("먼저 텍스트를 선택해주세요.");
    return;
  }

  const selectedText = range.toString();
  const span = document.createElement("span");
  span.className = "text-underline";
  span.textContent = underlineText + " " + selectedText;

  range.deleteContents();
  range.insertNode(span);

  updatePassageInput(); // 밑줄 적용 후 텍스트 업데이트
}

// 밑줄 삭제 버튼 클릭 시 밑줄 제거
function removeUnderline() {
  const div = document.getElementById("editableDiv");
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  if (range.toString().length === 0) {
    alert("먼저 텍스트를 선택해주세요.");
    return;
  }

  const container = range.commonAncestorContainer;
  const parentElement =
    container.nodeType === 3 ? container.parentElement : container;

  if (parentElement.classList.contains("text-underline")) {
    const parent = parentElement.parentNode;

    // 밑줄 텍스트를 분리하여 제거
    const textContent = parentElement.textContent;
    const underlineText = textContent.split(" ")[0] + " ";
    const remainingText = textContent.replace(underlineText, "");

    const textNode = document.createTextNode(remainingText);

    parent.insertBefore(textNode, parentElement);
    parent.removeChild(parentElement);
    selection.removeAllRanges();

    updatePassageInput(); // 밑줄 제거 후 텍스트 업데이트
  } else {
    alert("선택한 텍스트에 밑줄이 없습니다.");
  }
}

function updatePassageInput() {
  const div = document.getElementById("editableDiv");
  passageInput = div.innerHTML;
  console.log("passageInput: ", passageInput);
}

// DOMContentLoaded 이벤트 발생 시 실행
document.addEventListener("DOMContentLoaded", () => {
  const editableDiv = document.getElementById("editableDiv");

  // Placeholder 처리
  const updatePlaceholder = () => {
    if (editableDiv.textContent.trim() === "") {
      // 텍스트가 없을 경우
      editableDiv.classList.add("empty");
    } else {
      // 텍스트가 있을 경우
      editableDiv.classList.remove("empty");
    }
  };

  // 텍스트 입력 시 Placeholder 업데이트
  editableDiv.addEventListener("input", () => {
    updatePlaceholder();
    updatePassageInput();
  });

  // 초기 Placeholder 업데이트
  updatePlaceholder();
});

document.addEventListener("DOMContentLoaded", () => {
  // 결과물 수정 버튼 클릭 시
  editButton.addEventListener("click", (e) => {
    const editableDiv = e.target
      .closest(".result-passage-container")
      .querySelector(".editable");
    editableDiv.contentEditable = "true";
    document.querySelector(".underline-container").style.display = "flex";
  });

  // 결과물 editable 입력 시 변수에 저장
  const editableArea = document.querySelector(".editable");
  editableArea.addEventListener("input", () => {
    if (editableArea.closest(".result-wrapper")) {
      generatedPassage = editableArea.innerText.trim();
    }
  });

  // 결과물 프롬프트 입력 시 변수에 저장
  promptArea.addEventListener("input", () => {
    if (promptArea.classList.contains("generate-passage")) {
      promptGeneratedPassage = promptArea.value.trim();
    }
  });
});

// 위의 지문으로 문제 생성하기 버튼 클릭 시
function createProblem() {
  const editableDivContent = document.querySelector(
    ".result-wrapper .editable"
  ).innerHTML;
  const encodedContent = encodeURIComponent(editableDivContent); // URL 인코딩
  window.location.href = `../../../templates/tab01/generate/tab01-generateProblem.html?generatedPassage=${encodedContent}`;
}
