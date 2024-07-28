const passageNameInput = document.querySelector(".passage-name-input");

const underlineApply = document.querySelector(".underline-apply");
const underlineMenuList = document.querySelector(".underline-menu-list");
const underlineMenuItem = document.querySelectorAll(".underline-menu-item");

const passageCreateButton = document.querySelector(".passage-create-button");

const modalUploadConfirmOverlay = document.querySelector(
  ".modal-upload-confirm-overlay"
);
const modalUploadConfirmContent = document.querySelector(
  ".modal-upload-confirm-content"
);
const modalUploadConfirmCancelButton = document.querySelector(
  ".modal-upload-confirm-cancel-button"
);
const modalUploadConfirmButton = document.querySelector(
  ".modal-upload-confirm-button"
);
const toastUploadDone = document.querySelector(".toast-upload-done");

// 드롭다운 관련 코드

let passageTypeMajor = ""; // 지문 유형(대)을 저장할 변수
let passageTypeMinor = ""; // 지문 유형(소)을 저장할 변수
let passageName = ""; // 지문 이름을 저장할 변수
let passageInput = ""; // 지문 내용을 저장할 변수
let passageFlowInput = ""; // 지문 흐름을 저장할 변수

// 첫 번째 드롭다운 메뉴를 클릭하면 활성화/비활성화
document.addEventListener("click", function (event) {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const dropdownMenu = dropdown.querySelector(".dropdown-menu");

    if (dropdown.contains(event.target)) {
      dropdown.classList.toggle("active");
      dropdownMenu.classList.toggle("active");
    } else {
      dropdown.classList.remove("active");
      dropdownMenu.classList.remove("active");
    }
  });
});

// 드롭다운 메뉴의 항목을 클릭하면 선택한 항목을 표시하고 문제 유형을 저장
document.querySelectorAll(".dropdown-menu div").forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.stopPropagation();
    const dropdown = this.closest(".dropdown");
    const selected = dropdown.querySelector(".selected");

    selected.childNodes[0].nodeValue = this.textContent;

    if (dropdown.classList.contains("dropdown-major")) {
      passageTypeMajor = this.textContent.trim();
      console.log("passageTypeMajor :", passageTypeMajor);
    } else if (dropdown.classList.contains("dropdown-minor")) {
      passageTypeMinor = this.textContent.trim();
      console.log("passageTypeMinor :", passageTypeMinor);
    }

    dropdown.classList.remove("active");
    dropdown.querySelector(".dropdown-menu").classList.remove("active");
  });
});

// 지문 이름을 입력하면 저장
passageNameInput.addEventListener("input", (e) => {
  passageName = e.target.value.trim();
  console.log("passageName :", passageName);
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

  updatePassateInput(); // 밑줄 적용 후 텍스트 업데이트
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

    updatePassateInput(); // 밑줄 제거 후 텍스트 업데이트
  } else {
    alert("선택한 텍스트에 밑줄이 없습니다.");
  }
}

function updatePassateInput() {
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
    updatePassateInput();
  });

  // 초기 Placeholder 업데이트
  updatePlaceholder();
});

// 업로드 확인 모달창 열기
function openUploadConfirmModal() {
  if (
    passageTypeMajor === "" ||
    passageTypeMinor === "" ||
    passageName === "" ||
    passageInput === "" ||
    passageFlowInput === ""
  ) {
    return;
  }
  modalUploadConfirmOverlay.classList.remove("fade-out"); //  fade-out 클래스 제거
  modalUploadConfirmOverlay.style.display = "block";
  modalUploadConfirmContent.style.display = "flex";
}

// 업로드 확인 모달창 닫기
function closeUploadConfirmModal() {
  modalUploadConfirmOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalUploadConfirmOverlay.style.display = "none";
    modalUploadConfirmOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

// 업로드 완료 토스트 메시지 보여주기
function showToastUploadDone() {
  modalUploadConfirmContent.style.display = "none"; // 모달 컨텐츠 숨김
  toastUploadDone.style.display = "flex"; // 토스트 메시지 보여줌
  // 2초 후 토스트 메시지 사라짐
  setTimeout(() => {
    modalUploadConfirmOverlay.classList.add("fade-out");
    toastUploadDone.classList.add("fade-out");
  }, 2000);
  setTimeout(() => {
    modalUploadConfirmOverlay.style.display = "none";
    toastUploadDone.style.display = "none";
    modalUploadConfirmOverlay.classList.remove("fade-out");
    toastUploadDone.classList.remove("fade-out");

    // 초기화
    document.getElementById("editableDiv").innerHTML = "";
    document.querySelector(".passage-flow-input").value = "";
    passageInput = "";
    passageFlowInput = "";
    updatePlaceholder(); // Placeholder 업데이트
  }, 2300);
}

document.addEventListener("input", (e) => {
  const target = e.target;
  if (target.classList.contains("passage-flow-input")) {
    passageFlowInput = target.value.trim(); // 입력된 값을 저장
    console.log("passageFlowInput :", passageFlowInput);
  }
});
