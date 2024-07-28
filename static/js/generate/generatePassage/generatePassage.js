const passageCreateButton = document.querySelector(".passage-create-button");
const modalPassageCreateOverlay = document.querySelector(
  ".modal-passage-create-overlay"
);
const modalPassageCreateContent = document.querySelector(
  ".modal-passage-create-content"
);
const modalPassageCreateCloseButton = document.querySelector(
  ".modal-passage-create-close-button"
);

const container = document.querySelector(".selected-items-container");

// 드롭다운 관련 코드

let passageTypeMajor = ""; // 지문 유형(대)을 저장할 변수
let passageTypeMinor = ""; // 지문 유형(소)을 저장할 변수
let selectedPassages = []; // 선택된 항목을 저장할 배열

// 첫 번째 드롭다운 메뉴를 클릭하면 활성화/비활성화
document.addEventListener("click", function (event) {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const selected = dropdown.querySelector(".selected");
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

// 드롭다운 중복선택 관련 코드

// 드롭다운 토글
document.addEventListener("click", function (event) {
  const dropdownMulti = document.querySelector(".dropdown-multi");
  const dropdownMultiMenu = document.querySelector(".dropdown-multi-menu");

  if (dropdownMulti.contains(event.target)) {
    dropdownMulti.classList.toggle("active");
    dropdownMultiMenu.classList.toggle("active");
  } else {
    dropdownMulti.classList.remove("active");
    dropdownMultiMenu.classList.remove("active");
  }
});

// 드롭다운 항목 클릭 이벤트
document.querySelectorAll(".dropdown-multi-menu div").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSelectedItem(item.textContent);
  });
});

// 선택된 항목 클릭 이벤트
function toggleSelectedItem(text) {
  const container = document.querySelector(".selected-items-container");
  const items = document.querySelectorAll(".selected-item");

  // 선택된 항목이 이미 있는지 확인
  let exists = false;
  items.forEach((item) => {
    if (item.textContent.replace("x", "").trim() === text) {
      container.removeChild(item);
      selectedPassages = selectedPassages.filter((passage) => passage !== text); // 배열에서 항목 제거
      exists = true;
    }
  });

  // 이미 선택된 항목이 아니라면 추가
  if (!exists) {
    const selectedItem = document.createElement("span");
    selectedItem.className = "selected-item";
    selectedItem.textContent = text;

    const removeBtn = document.createElement("img");
    removeBtn.className = "remove";
    removeBtn.src = "../../../static/images/icon/svg/Close_round_fill.svg";
    removeBtn.alt = "삭제";
    removeBtn.onclick = function () {
      container.removeChild(selectedItem);
      selectedPassages = selectedPassages.filter((passage) => passage !== text); // 배열에서 항목 제거
      updateDropdown();
    };

    selectedItem.appendChild(removeBtn);
    container.appendChild(selectedItem);
    selectedPassages.push(text); // 배열에 항목 추가
    console.log("selectedPassages :", selectedPassages);
  }

  // 드롭다운 항목 업데이트
  updateDropdown();
  // 선택된 항목 정렬
  sortSelectedItems();
}

// 드롭다운 검색 기능
function filterDropdown() {
  const input = document.querySelector(".search-box").value.toLowerCase();
  const items = document.querySelectorAll(".dropdown-multi-menu div");

  items.forEach((item) => {
    if (item.textContent.toLowerCase().includes(input)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// 드롭다운 항목 업데이트
function updateDropdown() {
  const selectedItems = Array.from(
    document.querySelectorAll(".selected-item")
  ).map((item) => item.textContent.replace("x", "").trim());
  const dropdownMultiItems = document.querySelectorAll(
    ".dropdown-multi-menu div"
  );

  dropdownMultiItems.forEach((item) => {
    if (selectedItems.includes(item.textContent)) {
      item.classList.add("selected-item-bg");
    } else {
      item.classList.remove("selected-item-bg");
    }
  });

  // 선택된 항목이 있으면 container를 flex로 설정
  if (selectedPassages.length > 0) {
    container.style.display = "flex";
  } else {
    container.style.display = "none";
  }
}

// 선택된 항목 정렬
function sortSelectedItems() {
  const container = document.querySelector(".selected-items-container");
  const items = Array.from(container.children);

  items.sort((a, b) => {
    if (a.textContent < b.textContent) return -1;
    if (a.textContent > b.textContent) return 1;
    return 0;
  });

  items.forEach((item) => container.appendChild(item));
}

// 초기 드롭다운 항목 업데이트
updateDropdown();

passageCreateButton.addEventListener("click", () => {
  if (
    passageTypeMajor === "" ||
    passageTypeMinor === "" ||
    selectedPassages.length === 0
  ) {
    showPassageCreateModal();
  } else {
    // 현재 페이지의 URL 확인하여 결과 페이지 결정
    const currentUrl = window.location.href;
    let resultPageUrl = "";

    if (currentUrl.includes("tab01-generatePassage.html")) {
      resultPageUrl = "tab01-generatePassageResult.html";
    } else if (currentUrl.includes("tab02-generatePassage.html")) {
      resultPageUrl = "tab02-generatePassageResult.html";
    }

    // 문제 생성 api 로직 추가해야함
    window.location.href = resultPageUrl;
  }
});

function showPassageCreateModal() {
  modalPassageCreateOverlay.classList.remove("fade-out"); //  기존에 fade-out 클래스가 있으면 제거
  modalPassageCreateOverlay.style.display = "block";
}

function hidePassageCreateModal() {
  modalPassageCreateOverlay.classList.add("fade-out"); // fade-out 클래스 추가
  setTimeout(() => {
    modalPassageCreateOverlay.style.display = "none";
    modalPassageCreateOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

modalPassageCreateCloseButton.addEventListener("click", () => {
  hidePassageCreateModal();
});
