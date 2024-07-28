const underlineContainer = document.querySelector(".underline-container");
const underlineApply = document.querySelector(".underline-apply");
const underlineMenuList = document.querySelector(".underline-menu-list");
const underlineMenuItem = document.querySelectorAll(".underline-menu-item");

const editableDiv = document.getElementById("editableDiv");

const modalSaveConfirmOverlay = document.querySelector(
  ".modal-save-confirm-overlay"
);
const modalSaveConfirmContent = document.querySelector(
  ".modal-save-confirm-content"
);
const toastSaveDone = document.querySelector(".toast-save-done");

let passageInput = ""; // 입력한 텍스트 저장하는 변수

// 문제 수정 버튼 클릭 시
function editTypeProblemDetail() {
  underlineContainer.style.display = "flex";
  editableDiv.contentEditable = "true";
}

// 삭제 확인 모달창 열기
function openSaveConfirmModal() {
  modalSaveConfirmOverlay.classList.remove("fade-out"); //  fade-out 클래스 제거
  modalSaveConfirmOverlay.style.display = "block";
  modalSaveConfirmContent.style.display = "flex";
}

// 삭제 확인 모달창 닫기
function closeSaveConfirmModal() {
  modalSaveConfirmOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalSaveConfirmOverlay.style.display = "none";
    modalSaveConfirmOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

// 삭제 완료 토스트 메시지 보여주기
function showToastSaveDone() {
  modalSaveConfirmContent.style.display = "none"; // 모달 컨텐츠 숨김
  toastSaveDone.style.display = "flex"; // 토스트 메시지 보여줌
  // 2초 후 토스트 메시지 사라짐
  setTimeout(() => {
    modalSaveConfirmOverlay.classList.add("fade-out");
    toastSaveDone.classList.add("fade-out");
  }, 2000);
  setTimeout(() => {
    modalSaveConfirmOverlay.style.display = "none";
    toastSaveDone.style.display = "none";
    modalSaveConfirmOverlay.classList.remove("fade-out");
    toastSaveDone.classList.remove("fade-out");
    window.location.href =
      "../../../templates/tab01/type/tab01-typeProblemSelect.html";
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
