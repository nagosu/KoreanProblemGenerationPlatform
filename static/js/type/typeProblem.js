const modalDeleteConfirmOverlay = document.querySelector(
  ".modal-delete-confirm-overlay"
);
const modalDeleteConfirmContent = document.querySelector(
  ".modal-delete-confirm-content"
);
const toastDeleteDone = document.querySelector(".toast-delete-done");

const modalTypeEditOverlay = document.querySelector(".modal-type-edit-overlay");
const modalTypeEditContent = document.querySelector(".modal-type-edit-content");

const modalTypeAddOverlay = document.querySelector(".modal-type-add-overlay");
const modalTypeAddContent = document.querySelector(".modal-type-add-content");

let tab = ""; // 탭을 저장할 변수
let previousProblemType = ""; // 이전 문제 유형을 저장할 변수
let updateProblemType = ""; // 수정할 문제 유형을 저장할 변수

// 삭제 확인 모달창 열기
function openDeleteConfirmModal() {
  modalDeleteConfirmOverlay.classList.remove("fade-out"); //  fade-out 클래스 제거
  modalDeleteConfirmOverlay.style.display = "block";
  modalDeleteConfirmContent.style.display = "flex";
}

// 삭제 확인 모달창 닫기
function closeDeleteConfirmModal() {
  modalDeleteConfirmOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalDeleteConfirmOverlay.style.display = "none";
    modalDeleteConfirmOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

// 삭제 완료 토스트 메시지 보여주기
function showToastDeleteDone() {
  modalDeleteConfirmContent.style.display = "none"; // 모달 컨텐츠 숨김
  toastDeleteDone.style.display = "flex"; // 토스트 메시지 보여줌
  // 2초 후 토스트 메시지 사라짐
  setTimeout(() => {
    modalDeleteConfirmOverlay.classList.add("fade-out");
    toastDeleteDone.classList.add("fade-out");
  }, 2000);
  setTimeout(() => {
    modalDeleteConfirmOverlay.style.display = "none";
    toastDeleteDone.style.display = "none";
    modalDeleteConfirmOverlay.classList.remove("fade-out");
    toastDeleteDone.classList.remove("fade-out");
  }, 2300);
}

// 타입 수정 모달창 열기
function openTypeEditModal(event) {
  const typeProblemTitle = event.currentTarget
    .closest(".type-problem-item")
    .querySelector(".type-problem-title").textContent;
  previousProblemType = typeProblemTitle; // previousProblemType에 저장

  modalTypeEditOverlay.classList.remove("fade-out"); //  fade-out 클래스 제거
  modalTypeEditOverlay.style.display = "block";
  modalTypeEditContent.style.display = "flex";
}

// 타입 수정 모달창 닫기
function closeTypeEditModal() {
  modalTypeEditOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalTypeEditOverlay.style.display = "none";
    modalTypeEditOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

// 타입 추가 모달창 열기
function openTypeAddModal() {
  modalTypeAddOverlay.classList.remove("fade-out"); //  fade-out 클래스 제거
  modalTypeAddOverlay.style.display = "block";
  modalTypeAddContent.style.display = "flex";
}

// 타입 추가 모달창 닫기
function closeTypeAddModal() {
  modalTypeAddOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalTypeAddOverlay.style.display = "none";
    modalTypeAddOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

function moveToTypeProblemSelect() {
  // 현재 페이지의 URL 확인하여 결과 페이지 결정
  const currentUrl = window.location.href;
  let resultPageUrl = "";

  if (currentUrl.includes("tab01-typeProblem.html")) {
    resultPageUrl =
      "../../../templates/tab01/type/tab01-typeProblemSelect.html";
  } else if (currentUrl.includes("tab02-typeProblem.html")) {
    resultPageUrl =
      "../../../templates/tab02/type/tab02-typeProblemSelect.html";
  }

  window.location.href = resultPageUrl;
}

// 문제 유형 추가 API
async function addProblemType() {
  // const url = "/"; // 문제 유형 추가 API 주소

  let createProblemType = document.querySelector(
    ".modal-type-add-content-input"
  ).value;

  const currentUrl = window.location.href;

  if (currentUrl.includes("tab01-typeProblem.html")) {
    // 현재 탭이 문학인 경우
    tab = "문학";
  } else if (currentUrl.includes("tab02-typeProblem.html")) {
    // 현재 탭이 비문학인 경우
    tab = "비문학";
  }

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     createProblemType: createProblemType,
    //   }),
    // });
    // const data = await response.json();

    console.log("문제 유형 추가 성공", {
      tab: tab,
      createProblemType: createProblemType,
    });

    closeTypeAddModal(); // 모달창 닫기
  } catch (e) {
    console.error(e);
  }
}

// 문제 유형 수정 API
async function editProblemType() {
  const url = "/"; // 문제 유형 수정 API 주소

  const currentUrl = window.location.href;

  updateProblemType = document.querySelector(
    ".modal-type-edit-content-input"
  ).value;

  if (currentUrl.includes("tab01-typeProblem.html")) {
    // 현재 탭이 문학인 경우
    tab = "문학";
  } else if (currentUrl.includes("tab02-typeProblem.html")) {
    // 현재 탭이 비문학인 경우
    tab = "비문학";
  }

  try {
    // const response = await fetch(url, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     updateProblemType: updateProblemType,
    //   }),
    // });
    // const data = await response.json();

    console.log("문제 유형 수정 성공", {
      tab: tab,
      previousProblemType: previousProblemType,
      updateProblemType: updateProblemType,
    });
    closeTypeEditModal(); // 모달창 닫기
  } catch (e) {
    console.error(e);
  }
}
