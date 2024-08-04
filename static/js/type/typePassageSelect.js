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

let tab = ""; // 현재 탭을 저장할 변수
let deletePassages = []; // 선택된 지문들을 저장할 배열

const currentUrl = window.location.href;

if (currentUrl.includes("tab01")) {
  // 현재 탭이 문학인 경우
  tab = "문학";
} else if (currentUrl.includes("tab02")) {
  // 현재 탭이 비문학인 경우
  tab = "비문학";
}

// URL 파라미터에서 passageTypeMajor, passageTypeMinor 값을 받아오기
const urlParams = new URLSearchParams(window.location.search);
const passageTypeMajor = urlParams.get("passageTypeMajor");
const passageTypeMinor = urlParams.get("passageTypeMinor");

let currentPage = 1;
const itemsPerPage = 10; // 한 페이지에 표시할 지문 수

// 지문을 렌더링하는 함수
function renderPassages(passages) {
  const container = document.querySelector(".type-select-container");
  container.innerHTML = ""; // 기존 지문 초기화

  passages.forEach((passage, index) => {
    const passageItem = document.createElement("div");
    passageItem.classList.add("type-select-item");
    passageItem.innerHTML = `
      <input type="checkbox" id="checkbox${index}" name="checkbox${index}" />
      <span
        class="type-select-item-title"
        onclick="moveToTypePassageDetail(event)"
      >${passage}</span>
    `;
    container.appendChild(passageItem);
  });

  // 지문 아이템들이 새로 렌더링된 후 체크박스 이벤트 리스너 재등록
  const checkboxes = document.querySelectorAll(
    '.type-select-item input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateDeleteButtonState(); // 삭제 버튼 상태 업데이트
      updateDeletePassages(); // 체크된 항목의 제목을 배열에 추가
    });
  });

  updateDeleteButtonState(); // 삭제 버튼 상태 업데이트
  updateDeletePassages(); // 체크된 항목의 제목을 배열에 추가
}

// 페이지네이션 버튼 핸들러 함수
function handlePagination(event) {
  const targetPage = parseInt(event.target.textContent); // 버튼의 텍스트를 숫자로 변환하여 페이지 번호로 사용
  currentPage = targetPage;
  fetchPassages(targetPage); // 페이지에 맞는 지문들 가져오기
  updatePaginationButtons(targetPage); // 페이지 버튼 상태 업데이트
}

// 페이지네이션 버튼 상태 업데이트 함수
function updatePaginationButtons(currentPage) {
  const totalPages = Math.ceil(dummyPassages.length / itemsPerPage); // 전체 페이지 수 계산
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
    // if (currentPage > 1) {
    //   currentPage -= 1;
    //   updatePaginationButtons(currentPage);
    //   updateDisplayedProblems();
    // }
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
    // const totalPages = Math.ceil(currentProblems.length / itemsPerPage);
    // if (currentPage < totalPages) {
    //   currentPage += 1;
    //   updatePaginationButtons(currentPage);
    //   updateDisplayedProblems();
    // }
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
  const checkboxes = document.querySelectorAll(
    '.type-select-item input[type="checkbox"]'
  );

  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );

  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allChecked;
  });

  updateDeleteButtonState(); // 삭제 버튼 상태 업데이트
  updateDeletePassages(); // 체크된 항목의 제목을 배열에 추가
}

function moveToTypePassageDetail(event) {
  const passage = event.currentTarget.innerText;

  // 현재 페이지의 URL 확인하여 결과 페이지 결정
  const currentUrl = window.location.href;
  let resultPageUrl = "";

  if (currentUrl.includes("tab01")) {
    resultPageUrl =
      "../../../templates/tab01/type/tab01-typePassageDetail.html";
  } else if (currentUrl.includes("tab02")) {
    resultPageUrl =
      "../../../templates/tab02/type/tab02-typePassageDetail.html";
  }

  resultPageUrl += `?passageTypeMajor=${encodeURIComponent(
    passageTypeMajor
  )}&passageTypeMinor=${encodeURIComponent(
    passageTypeMinor
  )}&passage=${encodeURIComponent(passage)}`;

  window.location.href = resultPageUrl;
}

// 체크된 항목의 제목을 배열에 추가하는 함수
function updateDeletePassages() {
  const checkboxes = document.querySelectorAll(
    '.type-select-item input[type="checkbox"]'
  );

  deletePassages.length = 0; // 배열 초기화

  const typeSelectItemsTitle = document.querySelectorAll(
    ".type-select-item-title"
  );

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const title = typeSelectItemsTitle[index].innerText;
      deletePassages.push(title);
    }
  });
}

// 삭제 버튼 상태 업데이트 함수
function updateDeleteButtonState() {
  const checkboxes = document.querySelectorAll(
    '.type-select-item input[type="checkbox"]'
  );

  const isAnyCheckboxChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );
  deleteButton.disabled = !isAnyCheckboxChecked;
}

// 특정 문제 유형 조회 API
async function fetchPassages(page = 1) {
  const url = `/example?tab=${tab}&passageTypeMajor=${passageTypeMajor}&passageTypeMinor=${passageTypeMinor}&page=${page}&pageSize=10`; // 특정 문제 유형 조회 API 주소

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
      totalPages: Math.ceil(dummyPassages.length / 10),
      items: dummyPassages.slice(start, end),
    };
    console.log("특정 문제 유형 조회 성공", data);

    renderPassages(data.items); // 문제 렌더링
  } catch (e) {
    console.error(e);
  }
}

// 특정 문제 삭제 API
async function deletePassage() {
  // const url = "/" // 특정 문제 삭제 API 주소

  try {
    // const response = await fetch(url, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab: tab,
    //     passageTypeMajor: passageTypeMajor,
    //     passageTypeMinor: passageTypeMinor,
    //     deletePassages: deletePassages,
    //   }),
    // });
    // const data = await response.json();

    console.log("특정 문제 삭제 성공", {
      tab: tab,
      passageTypeMajor: passageTypeMajor,
      passageTypeMinor: passageTypeMinor,
      deletePassages: deletePassages,
    });
    showToastDeleteDone(); // 삭제 완료 토스트 메시지 보여주기
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const totalPages = Math.ceil(dummyPassages.length / itemsPerPage); // 전체 페이지 수 계산
  initializePagination(totalPages); // 페이지네이션 버튼 초기화
  fetchPassages(1); // 페이지에 맞는 문제들 가져오기

  // 체크박스 상태 변경 시 이벤트 리스너 추가
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateDeleteButtonState(); // 삭제 버튼 상태 업데이트
      updateDeletePassages(); // 체크된 항목의 제목을 배열에 추가
    });
  });

  // 초기 상태 업데이트
  updateDeleteButtonState();
  updateDeletePassages();
});
