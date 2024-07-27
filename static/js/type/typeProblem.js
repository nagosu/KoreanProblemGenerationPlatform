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
function openTypeEditModal() {
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
  window.location.href =
    "../../../templates/tab01/type/tab01-typeProblemSelect.html";
}
