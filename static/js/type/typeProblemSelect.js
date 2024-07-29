const modalDeleteConfirmOverlay = document.querySelector(
  ".modal-delete-confirm-overlay"
);
const modalDeleteConfirmContent = document.querySelector(
  ".modal-delete-confirm-content"
);
const toastDeleteDone = document.querySelector(".toast-delete-done");

const checkboxes = document.querySelectorAll(
  '.type-select-item input[type="checkbox"]'
);
const selectAllButton = document.querySelector(".select-all-button");

const typeSelectItemsTitle = document.querySelectorAll(
  ".type-select-item-title"
);

const deleteButton = document.querySelector(".delete-button");

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

// 전체 선택/선택해제 하기
function toggleSelectAll() {
  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );

  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allChecked;
  });

  updateDeleteButtonState(); // 삭제 버튼 상태 업데이트
}

function moveToTypeProblemDetail() {
  // 현재 페이지의 URL 확인하여 결과 페이지 결정
  const currentUrl = window.location.href;
  let resultPageUrl = "";

  if (currentUrl.includes("tab01-typeProblemSelect.html")) {
    resultPageUrl =
      "../../../templates/tab01/type/tab01-typeProblemDetail.html";
  } else if (currentUrl.includes("tab02-typeProblemSelect.html")) {
    resultPageUrl =
      "../../../templates/tab02/type/tab02-typeProblemDetail.html";
  }

  window.location.href = resultPageUrl;
}

// 삭제 버튼 상태 업데이트 함수
function updateDeleteButtonState() {
  const isAnyCheckboxChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );
  deleteButton.disabled = !isAnyCheckboxChecked;
}

// 체크박스 상태 변경 시 이벤트 리스너 추가
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateDeleteButtonState);
});

// 초기 상태 업데이트
updateDeleteButtonState();
