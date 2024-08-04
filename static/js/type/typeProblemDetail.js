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

let tab = ""; // 현재 탭

let newPassage = ""; // 수정된 지문 저장하는 변수
let newProblem = ""; // 수정된 문제 저장하는 변수
let newAnswerExplanation = ""; // 수정된 정/오답 사유 저장하는 변수

const urlParams = new URLSearchParams(window.location.search);
const problemType = urlParams.get("typeProblem");
const problem = urlParams.get("problem");

const problemData = "";

const currentUrl = window.location.href;

if (currentUrl.includes("tab01")) {
  // 현재 탭이 문학인 경우
  tab = "문학";
} else if (currentUrl.includes("tab02")) {
  // 현재 탭이 비문학인 경우
  tab = "비문학";
}

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

    // 현재 페이지의 URL 확인하여 결과 페이지 결정
    const currentUrl = window.location.href;
    let resultPageUrl = "";

    if (currentUrl.includes("tab01")) {
      resultPageUrl =
        "../../../templates/tab01/type/tab01-typeProblemSelect.html";
    } else if (currentUrl.includes("tab02")) {
      resultPageUrl =
        "../../../templates/tab02/type/tab02-typeProblemSelect.html";
    }

    window.location.href = resultPageUrl;
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

  // 첫 번째, 두 번째, 세 번째 span 요소를 찾기
  const spans = div.querySelectorAll(".new");

  // 각 변수에 span의 텍스트 내용을 저장
  newPassage = spans[0] ? spans[0].innerHTML.trim() : "";
  newProblem = spans[1] ? spans[1].innerHTML.trim() : "";
  newAnswerExplanation = spans[2] ? spans[2].innerHTML.trim() : "";

  console.log("newPassage", newPassage);
  console.log("newProblem", newProblem);
  console.log("newAnswerExplanation", newAnswerExplanation);
}

// 특정 문제 조회 API
async function fetchProblemDetail() {
  const url = `/example?tab=${tab}&problemType=${problemType}&problem=${problem}`; // 특정 문제 조회 API 주소

  const data = dummyProblemDetail;

  try {
    // const response = await fetch(url, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await response.json();
    console.log("특정 문제 조회 성공", data);
    displayProblemDetail(data);
  } catch (e) {
    console.error(e);
  }
}

// 특정 문제 저장 API
async function saveProblemDetail() {
  const url = "/example"; // 특정 문제 저장 API 주소

  const data = {
    tab: tab,
    problemType: problemType,
    problem: problem,
    newPassage: newPassage,
    newProblem: newProblem,
    newAnswerExplanation: newAnswerExplanation,
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
    //     problem: problem,
    //     newPassage: newPassage,
    //     newProblem: newProblem,
    //     newAnswerExplanation: newAnswerExplanation,
    //   }),
    // });
    // const data = await response.json();
    console.log("특정 문제 저장 성공", data);
    showToastSaveDone(); // 저장 완료 토스트 메시지 보여주기
  } catch (e) {
    console.error(e);
  }
}

function displayProblemDetail(data) {
  newPassage = data.passage;
  newProblem = data.problem;
  newAnswerExplanation = data.answerExplanation;

  // 지문, 문제, 정/오답 사유 표시
  document.querySelector("#editableDiv").innerHTML = `
    <h2 class="editable-title" contentEditable="false"><지문></h2>
    <span class="new">${newPassage}</span>
    <br /><br />
    <h2 class="editable-title" contentEditable="false"><문제></h2>
    <span class="new">${newProblem}</span>
    <br /><br />
    <h2 class="editable-title" contentEditable="false"><정/오답 사유></h2>
    <span class="new">${newAnswerExplanation}</span>
  `;
}

// MutationObserver로 contentEditable 변화 감지
const observer = new MutationObserver(() => {
  updatePassageInput();
});

observer.observe(editableDiv, {
  childList: true,
  subtree: true,
  characterData: true,
});

document.addEventListener("DOMContentLoaded", () => {
  fetchProblemDetail(); // 특정 문제 조회 API 호출
});
