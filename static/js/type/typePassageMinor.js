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

let tab = ""; // 현재 탭을 저장할 변수
let previousPassageTypeMinor = ""; // 이전 지문 유형 (소)을 저장할 변수
let updatePassageTypeMinor = ""; // 수정할 지문 유형 (소)을 저장할 변수
let deletePassageTypeMinor = ""; // 삭제할 지문 유형 (소)을 저장할 변수

const currentUrl = window.location.href;

if (currentUrl.includes("tab01")) {
  // 현재 탭이 문학인 경우
  tab = "문학";
} else if (currentUrl.includes("tab02")) {
  // 현재 탭이 비문학인 경우
  tab = "비문학";
}

// URL 파라미터에서 passageTypeMajor 값을 받아오기
const urlParams = new URLSearchParams(window.location.search);
const passageTypeMajor = urlParams.get("passageTypeMajor");

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
  const typePassageTitle = event.currentTarget
    .closest(".type-passage-minor-item")
    .querySelector(".type-passage-minor-title").textContent;
  previousPassageTypeMinor = typePassageTitle; // previousPassageTypeMinor에 저장

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

function moveToTypePassageSelect(event) {
  const passageTypeMinor = event.currentTarget
    .closest(".type-passage-minor-item")
    .querySelector(".type-passage-minor-title").textContent;

  // 현재 페이지의 URL 확인하여 결과 페이지 결정
  const currentUrl = window.location.href;
  let resultPageUrl = "";

  if (currentUrl.includes("tab01")) {
    resultPageUrl =
      "../../../templates/tab01/type/tab01-typePassageSelect.html";
  } else if (currentUrl.includes("tab02")) {
    resultPageUrl =
      "../../../templates/tab02/type/tab02-typePassageSelect.html";
  }

  resultPageUrl += `?passageTypeMajor=${encodeURIComponent(
    passageTypeMajor
  )}&passageTypeMinor=${encodeURIComponent(passageTypeMinor)}`;

  window.location.href = resultPageUrl;
}

// 지문 유형 (소) 페이지네이션 조회 API
async function fetchPassageTypeMinors(page = 1) {
  const url = `/example?tab=${tab}&passageTypeMajor=${passageTypeMajor}&page=${page}&pageSize=10`; // 지문 유형 (소) 페이지네이션 조회 API 주소

  try {
    // const response = await fetch(url, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await response.json();

    const start = (page - 1) * 10;
    const end = start + 10;
    const data = {
      page: page,
      pageSize: 10,
      totalPages: Math.ceil(dummyPassageMinor.length / 10),
      items: dummyPassageMinor.slice(start, end),
    };

    console.log("지문 유형 (소) 조회 성공", data);

    renderPassageTypeMinors(data.items); // 지문 유형 (소) 렌더링
  } catch (e) {
    console.error(e);
  }
}

// 지문 유형 (소) 렌더링
function renderPassageTypeMinors(passageTypeMinors) {
  const container = document.querySelector(".type-passage-minor-container");
  container.innerHTML = ""; // 기존 지문 유형 (소) 초기화

  console.log(passageTypeMinors);

  passageTypeMinors.forEach((item) => {
    const passageTypeMinorItem = document.createElement("div");
    passageTypeMinorItem.classList.add("type-passage-minor-item-container");
    passageTypeMinorItem.innerHTML = `
      <div class="type-passage-minor-item">
        <div class="type-passage-minor-title-container">
          <div class="dot"></div>
          <span
            class="type-passage-minor-title"
            onclick="moveToTypePassageSelect(event)"
            >${item}</span>
        </div>
        <div class="type-passage-minor-button-container">
          <div
            class="icon-container delete-container"
            onclick="openDeleteConfirmModal(event)"
          >
            <img
              src="../../../static/images/icon/svg/Trash.svg"
              alt="삭제"
            />
          </div>
          <div
            class="icon-container edit-container"
            onclick="openTypeEditModal(event)"
          >
            <img
              src="../../../static/images/icon/svg/Edit_fill.svg"
              alt="수정"
            />
          </div>
        </div>
      </div>
    `;
    container.appendChild(passageTypeMinorItem);
  });
}

// 지문 유형 (소) 추가 API
async function addPassageTypeMinor() {
  // const url = "/"; // 지문 유형 (소) 추가 API 주소

  let createPassageTypeMinor = document.querySelector(
    ".modal-type-add-content-input"
  ).value;

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     createPassageTypeMinor: createPassageTypeMinor,
    //   }),
    // });
    // const data = await response.json();

    console.log("지문 유형 (소) 추가 성공", {
      tab: tab,
      createPassageTypeMinor: createPassageTypeMinor,
    });

    closeTypeAddModal(); // 모달창 닫기
  } catch (e) {
    console.error(e);
  }
}

// 지문 유형 (소) 수정 API
async function editPassageTypeMinor() {
  const url = "/"; // 지문 유형 (소) 수정 API 주소

  updatePassageTypeMinor = document.querySelector(
    ".modal-type-edit-content-input"
  ).value;

  try {
    // const response = await fetch(url, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     previousPassageTypeMinor: previousPassageTypeMinor,
    //     updatePassageTypeMinor: updatePassageTypeMinor,
    //   }),
    // });
    // const data = await response.json();

    console.log("문제 유형 수정 성공", {
      tab: tab,
      previousPassageTypeMinor: previousPassageTypeMinor,
      updatePassageTypeMinor: updatePassageTypeMinor,
    });
    closeTypeEditModal(); // 모달창 닫기
  } catch (e) {
    console.error(e);
  }
}

// 지문 유형 (소) 삭제 API
async function removePassageTypeMinor() {
  const url = "/"; // 지문 유형 (소) 삭제 API 주소

  try {
    // const response = await fetch(url, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     deletePassageTypeMinor: deletePassageTypeMinor,
    //   }),
    // });
    // const data = await response.json();

    console.log("지문 유형 (소) 삭제 성공", {
      tab: tab,
      deletePassageTypeMinor: deletePassageTypeMinor,
    });
    showToastDeleteDone(); // 토스트 메시지 보여주기
  } catch (e) {
    console.error(e);
  }
}

// 페이지네이션 버튼 핸들러 함수
function handlePagination(event) {
  const targetPage = parseInt(event.target.textContent); // 버튼의 텍스트를 숫자로 변환하여 페이지 번호로 사용
  fetchPassageTypeMinors(targetPage); // 해당 페이지의 문제 유형을 가져옴
  updatePaginationButtons(targetPage); // 페이지 버튼 상태 업데이트
}

// 페이지네이션 버튼 상태 업데이트 함수
function updatePaginationButtons(currentPage) {
  const totalPages = Math.ceil(dummyPassageMinor.length / 10); // 총 페이지 수 계산
  let startPage = Math.floor((currentPage - 1) / 5) * 5 + 1; // 시작 페이지 계산
  let endPage = Math.min(startPage + 4, totalPages); // 끝 페이지 계산

  const paginationButtons = document.querySelectorAll(".pagination__button");
  paginationButtons.forEach((button, index) => {
    const pageNumber = startPage + index;
    if (pageNumber <= endPage) {
      button.textContent = pageNumber;
      button.style.display = "inline-block";
      button.classList.remove("pagination__button--active");
      if (pageNumber === currentPage) {
        button.classList.add("pagination__button--active");
      }
    } else {
      button.style.display = "none";
    }
  });

  updatePrevNextButtons(currentPage, totalPages); // 이전, 다음 버튼 상태 업데이트
}

// 이전, 다음 버튼 상태 업데이트 함수
function updatePrevNextButtons(currentPage, totalPages) {
  const prevButton = document.querySelector(".pagination__button-prev");
  const nextButton = document.querySelector(".pagination__button-next");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

// 초기 페이지네이션 버튼 생성 함수
function initializePagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; // 기존 버튼 초기화

  const prevButton = document.createElement("button");
  prevButton.classList.add("pagination__button-prev");
  prevButton.innerHTML = `<img src="../../../static/images/icon/svg/Expand_left_double.svg" />`;
  prevButton.addEventListener("click", () => {
    const currentPage = parseInt(
      document.querySelector(".pagination__button--active").textContent
    );
    if (currentPage > 1) {
      handlePagination({ target: { textContent: currentPage - 1 } });
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 0; i < 5; i++) {
    // 최대 5개의 페이지 버튼 생성
    const button = document.createElement("button");
    button.classList.add("pagination__button");
    button.addEventListener("click", handlePagination);
    paginationContainer.appendChild(button);
  }

  const nextButton = document.createElement("button");
  nextButton.classList.add("pagination__button-next");
  nextButton.innerHTML = `<img src="../../../static/images/icon/svg/Expand_right_double.svg" />`;
  nextButton.addEventListener("click", () => {
    const currentPage = parseInt(
      document.querySelector(".pagination__button--active").textContent
    );
    if (currentPage < totalPages) {
      handlePagination({ target: { textContent: currentPage + 1 } });
    }
  });
  paginationContainer.appendChild(nextButton);

  updatePaginationButtons(1); // 초기 버튼 상태 설정
}

document.addEventListener("DOMContentLoaded", () => {
  const totalPages = Math.ceil(dummyPassageMinor.length / 10); // 총 페이지 수 계산
  initializePagination(totalPages); // 페이지네이션 버튼 초기화
  fetchPassageTypeMinors(1); // 지문 유형 (소) 페이지네이션 조회 API 호출
});
