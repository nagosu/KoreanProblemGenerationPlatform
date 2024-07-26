const underlineApply = document.querySelector(".underline-apply");
const underlineMenuList = document.querySelector(".underline-menu-list");
const underlineMenuItem = document.querySelectorAll(".underline-menu-item");
const addProblemButton = document.querySelector(".add-problem-button");

let passageInput = ""; // 입력한 텍스트 저장하는 변수

// 문제 및 정/오답 사유를 저장하는 배열
let problems = [{ problemType: "", problemInput: "", answerExplanation: "" }];

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
  passageInput = div.innerHTML;
  console.log("passageInput: ", passageInput);
}

// 새로운 문제 추가 시 문제 및 정/오답 사유 추가
function saveProblemAndExplanation(problemContainer, index) {
  const problemInput = problemContainer.querySelector(".problem-input");
  const answerExplanation = problemContainer.querySelector(
    ".answer-explanation"
  );

  const problemText = problemInput.innerHTML;
  const explanationText = answerExplanation.innerHTML;

  // 문제 및 정/오답 사유를 problems 배열에 저장
  problems[index] = {
    ...problems[index],
    problemInput: problemText,
    answerExplanation: explanationText,
  };

  console.log("problems: ", problems);
}

function addDropdownEventListener(problemContainer, index) {
  const dropdown = problemContainer.querySelector(".dropdown");
  const dropdownItems = dropdown.querySelectorAll(".dropdown-item");
  const selected = dropdown.querySelector(".selected");

  console.log("dropdown", dropdown);

  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selected.childNodes[0].nodeValue = e.target.textContent;
      problems[index].problemType = e.target.textContent.trim(); // 선택한 문제 유형을 problems 배열에 저장
      dropdown.classList.remove("active");
      dropdown.querySelector(".dropdown-menu").classList.remove("active");
      console.log("problems: ", problems);
    });
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
    dropdown.querySelector(".dropdown-menu").classList.toggle("active");
  });
}

addProblemButton.addEventListener("click", () => {
  if (problems.length >= 6) {
    return; // 문제6 까지만 추가 가능
  }

  const mainContent = document.querySelector(".main-content");
  const addUploadButtonContainer = document.querySelector(
    ".add-upload-button-container"
  );

  const newProblemContainer = document.createElement("div");
  newProblemContainer.classList.add("problem-input-container");

  // 새로운 문제 추가
  newProblemContainer.innerHTML = `
    <div class="problem-container">
      <div class="problem-input-header">
        <h3 class="problem-input-title">문제${problems.length + 1}</h3>
        <div class="dropdown">
          <div class="selected">
            문제 유형
            <img
              src="../../../static/images/icon/svg/Arrow_drop_down.svg"
              alt="드롭다운 화살표"
              class="triangle"
            />
          </div>
          <div class="dropdown-menu">
            <div class="dropdown-item" data-value="일치 불일치">
              일치 불일치
            </div>
            <div class="dropdown-item" data-value="의미 추론">
              의미 추론
            </div>
            <div class="dropdown-item" data-value="지문의 전개방식">
              지문의 전개방식
            </div>
            <div class="dropdown-item" data-value="정오 판별">
              정오 판별
            </div>
            <div class="dropdown-item" data-value="대상 비교">
              대상 비교
            </div>
            <div class="dropdown-item" data-value="이유 찾기">
              이유 찾기
            </div>
          </div>
        </div>
      </div>
      <div class="editable problem problem-input" contenteditable="true" data-placeholder="여기에 텍스트를 입력하세요."></div>
    </div>
    <div class="answer-explanation-container">
      <h3 class="answer-explanation-title">정/오답 사유 (선택)</h3>
      <div class="editable problem answer-explanation" contenteditable="true" data-placeholder="여기에 텍스트를 입력하세요."></div>
    </div>
  `;

  mainContent.insertBefore(newProblemContainer, addUploadButtonContainer); // 새로운 문제 추가

  const index = problems.length; // 현재 문제 인덱스

  addDropdownEventListener(newProblemContainer, index); // 드롭다운 이벤트 추가

  problems.push({ problemType: "", problemInput: "", answerExplanation: "" }); // problems 배열에 새로운 문제 추가

  const editableDivs =
    newProblemContainer.querySelectorAll(".editable.problem");

  editableDivs.forEach((editableDiv) => {
    const updatePlaceholder = () => {
      if (editableDiv.textContent.trim() === "") {
        editableDiv.classList.add("empty");
      } else {
        editableDiv.classList.remove("empty");
      }
    };

    editableDiv.addEventListener("input", () => {
      updatePlaceholder();
      saveProblemAndExplanation(newProblemContainer, index);
      console.log("problems: ", problems);
    });

    updatePlaceholder();
  });

  // 새로운 문제가 추가된 후 화면 가장 아래로 부드럽게 스크롤
  newProblemContainer.scrollIntoView({ behavior: "smooth" });

  // 6개의 문제가 추가되면 "문제 추가" 버튼 비활성화
  if (problems.length >= 6) {
    addProblemButton.disabled = true;
  }
});

// DOMContentLoaded 이벤트 발생 시 실행
document.addEventListener("DOMContentLoaded", () => {
  // 지문 입력 div
  const editableDivPassage = document.querySelectorAll(".editable.passage");

  // Placeholder 처리
  editableDivPassage.forEach((editableDiv) => {
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
      updatePassageInput();
    });

    // 초기 Placeholder 업데이트
    updatePlaceholder();
  });

  // 문제1 입력 div
  const editableDivProblemFirst = document.querySelectorAll(
    ".editable.problem.first"
  );
  // Placeholder 처리
  editableDivProblemFirst.forEach((editableDiv) => {
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
      if (editableDiv.classList.contains("problem-input")) {
        problems[0].problemInput = editableDiv.innerHTML;
      } else {
        problems[0].answerExplanation = editableDiv.innerHTML;
      }
      console.log("problems: ", problems);
    });

    // 초기 Placeholder 업데이트
    updatePlaceholder();
  });

  // 드롭다운 메뉴의 항목을 클릭하면 선택한 항목을 표시하고 문제 유형을 저장
  document.querySelectorAll(".dropdown-menu div").forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.stopPropagation();
      document.querySelector(".selected").childNodes[0].nodeValue =
        this.textContent;
      problems[0].problemType = item.textContent.trim(); // 선택한 문제 유형을 첫 번째 문제에 할당
      console.log("problems: ", problems);
      document.querySelector(".dropdown").classList.remove("active");
      document.querySelector(".dropdown-menu").classList.remove("active");
    });
  });
});

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
