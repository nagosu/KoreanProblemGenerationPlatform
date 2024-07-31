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

let tab = ""; // 현재 탭을 저장할 변수
let passageTypeMajor = ""; // 지문 유형(대)을 저장할 변수
let passageTypeMinor = ""; // 지문 유형(소)을 저장할 변수
let selectedPassages = []; // 선택된 항목을 저장할 배열
let passageFlowInput = ""; // 지문 흐름을 저장할 변수

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
  passageFlowInput = document.querySelector(".passage-flow-input").value.trim();

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
      // 현재 탭이 문학인 경우
      tab = "문학";
      resultPageUrl = "tab01-generatePassageResult.html";
    } else if (currentUrl.includes("tab02-generatePassage.html")) {
      // 현재 탭이 비문학인 경우
      tab = "비문학";
      resultPageUrl = "tab02-generatePassageResult.html";
    }

    // 지문 생성 API 호출
    generatePassage(
      tab,
      passageTypeMajor,
      passageTypeMinor,
      selectedPassages,
      passageFlowInput
    )
      .then((response) => {
        // 세션 스토리지에 지문 생성 결과 저장
        sessionStorage.setItem("tab", response.tab);
        sessionStorage.setItem("passageTypeMajor", response.passageTypeMajor);
        sessionStorage.setItem("passageTypeMinor", response.passageTypeMinor);
        sessionStorage.setItem("selectedPassages", response.selectedPassages);
        sessionStorage.setItem("passageFlowInput", response.passageFlowInput);

        window.location.href = resultPageUrl;
      })
      .catch((e) => {
        console.error(e);
      });
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

// 지문 생성 API 호출
async function generatePassage(
  tab,
  passageTypeMajor,
  passageTypeMinor,
  selectedPassages,
  passageFlowInput
) {
  // const url = "/create/passage"; // 지문 생성 API 주소

  const dummyResponseData = {
    tab: tab,
    passageTypeMajor: passageTypeMajor,
    passageTypeMinor: passageTypeMinor,
    selectedPassages: selectedPassages,
    passageFlowInput: passageFlowInput,
    generatedPassage:
      "이에 해당하는 법조문을 '단속 법규'라고 한다.\n공인 중개사가 자신이 소유한 부동산을 고객에게 직접 파는 것을금지하는 규정은 단속 법규에 해당한다.\n따라서 ㉠이 규정을 위반하여 공인 중개사와 고객이 체결한 매매계약의 경우 공인 중개사에게\n벌금은 부과되지만 계약 자체는 유효이다.\n\n이에 해당하는 법조문을 '단속 법규'라고 한다.\n공인 중개사가 자신이 소유한 부동산을 고객에게 직접 파는 것을금지하는 규정은 단속 법규에 해당한다.\n따라서 ㉠이 규정을 위반하여 공인 중개사와 고객이 체결한 매매계약의 경우 공인 중개사에게\n벌금은 부과되지만 계약 자체는 유효이다.\n\n이에 해당하는 법조문을 '단속 법규'라고 한다.\n공인 중개사가 자신이 소유한 부동산을 고객에게 직접 파는 것을금지하는 규정은 단속 법규에 해당한다.\n따라서 ㉠이 규정을 위반하여 공인 중개사와 고객이 체결한 매매계약의 경우 공인 중개사에게\n벌금은 부과되지만 계약 자체는 유효이다.\n\n이에 해당하는 법조문을 '단속 법규'라고 한다.\n공인 중개사가 자신이 소유한 부동산을 고객에게 직접 파는 것을금지하는 규정은 단속 법규에 해당한다.\n따라서 ㉠이 규정을 위반하여 공인 중개사와 고객이 체결한 매매계약의 경우 공인 중개사에게\n벌금은 부과되지만 계약 자체는 유효이다.\n",
  };

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab,
    //     passageTypeMajor,
    //     passageTypeMinor,
    //     selectedPassages,
    //     passageFlowInput,
    //   }),
    // });
    // const data = await response.json();

    const data = dummyResponseData;
    console.log("지문 생성 결과", data);
    return data;
  } catch (e) {
    console.error(e);
  }
}
