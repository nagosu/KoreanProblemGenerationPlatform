const underlineApply = document.querySelector(".underline-apply");
const underlineMenuList = document.querySelector(".underline-menu-list");
const underlineMenuItem = document.querySelectorAll(".underline-menu-item");
const problemCreateButton = document.querySelector(".problem-create-button");
const modalConfirmOverlay = document.querySelector(".modal-confirm-overlay");
const modalConfirm = document.querySelector(".modal-confirm");
const modalConfirmCloseButton = document.querySelector(
  ".modal-confirm-close-button"
);

let problemType = ""; // 선택한 문제 유형을 저장할 변수
let passageInput = ""; // 입력한 텍스트 저장하는 변수

problemCreateButton.addEventListener("click", () => {
  // 문제 생성 버튼 클릭 시
  if (problemType.trim() === "" || passageInput.trim() === "") {
    openModalConfirm();
  } else {
    // 문제 생성 api 로직 추가해야함
    window.location.href = "tab01-generateProblemResult.html";
  }
});

modalConfirmCloseButton.addEventListener("click", () => {
  closeModalConfirm();
});

function openModalConfirm() {
  modalConfirmOverlay.classList.remove("fade-out"); // 기존에 fade-out 클래스가 있을 경우 제거
  modalConfirmOverlay.style.display = "block";
  modalConfirm.style.display = "flex";
}

function closeModalConfirm() {
  modalConfirmOverlay.classList.add("fade-out");
  setTimeout(() => {
    modalConfirmOverlay.style.display = "none";
    modalConfirmOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

// 드롭다운 관련 코드

// 드롭다운 메뉴를 클릭하면 활성화/비활성화
document.addEventListener("click", function (event) {
  const dropdown = document.querySelector(".dropdown");
  const selected = document.querySelector(".selected");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdown.contains(event.target)) {
    dropdown.classList.toggle("active");
    dropdownMenu.classList.toggle("active");
  } else {
    dropdown.classList.remove("active");
    dropdownMenu.classList.remove("active");
  }
});

// 드롭다운 메뉴의 항목을 클릭하면 선택한 항목을 표시하고 문제 유형을 저장
document.querySelectorAll(".dropdown-menu div").forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.stopPropagation();
    document.querySelector(".selected").childNodes[0].nodeValue =
      this.textContent;
    problemType = this.textContent.trim(); // 선택한 문제 유형을 problemType 변수에 할당
    console.log("problemType :", problemType);
    document.querySelector(".dropdown").classList.remove("active");
    document.querySelector(".dropdown-menu").classList.remove("active");
  });
});

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

// Placeholder 처리
function updatePlaceholder() {
  if (editableDiv.textContent.trim() === "") {
    // 텍스트가 없을 경우
    editableDiv.classList.add("empty");
  } else {
    // 텍스트가 있을 경우
    editableDiv.classList.remove("empty");
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

  // URL 쿼리 파라미터에서 지문 불러오기
  const urlParams = new URLSearchParams(window.location.search);
  const generatedPassage = urlParams.get("generatedPassage");
  if (generatedPassage) {
    editableDiv.innerHTML = decodeURIComponent(generatedPassage); // URL 디코딩하여 지문 입력
    updatePlaceholder(); // Placeholder 업데이트
    updatePassageInput(); // 텍스트 업데이트
  }

  // 텍스트 입력 시 Placeholder 업데이트
  editableDiv.addEventListener("input", () => {
    updatePlaceholder();
    updatePassageInput();
  });

  // 초기 Placeholder 업데이트
  updatePlaceholder();
});
