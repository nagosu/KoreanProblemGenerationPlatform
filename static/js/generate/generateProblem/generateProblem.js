const underlineApply = document.querySelector(".underline-apply");
const underlineMenuList = document.querySelector(".underline-menu-list");
const underlineMenuItem = document.querySelectorAll(".underline-menu-item");
const problemCreateButton = document.querySelector(".problem-create-button");
const modalConfirmOverlay = document.querySelector(".modal-confirm-overlay");
const modalConfirm = document.querySelector(".modal-confirm");
const modalConfirmCloseButton = document.querySelector(
  ".modal-confirm-close-button"
);

let problemType = ""; // 선택한 문제 유형을 저장할 변수
let passageInput = ""; // 입력한 텍스트 저장하는 변수
let tab = ""; // 현재 탭을 저장하는 변수

problemCreateButton.addEventListener("click", () => {
  // 문제 생성 버튼 클릭 시
  if (problemType.trim() === "" || passageInput.trim() === "") {
    openModalConfirm();
  } else {
    // 현재 페이지의 URL 확인하여 결과 페이지 결정
    const currentUrl = window.location.href;
    let resultPageUrl = "";

    if (currentUrl.includes("tab01-generateProblem.html")) {
      // 현재 페이지가 문학 탭일 경우
      tab = "문학";
      resultPageUrl = "tab01-generateProblemResult.html";
    } else if (currentUrl.includes("tab02-generateProblem.html")) {
      // 현재 페이지가 비문학 탭일 경우
      tab = "비문학";
      resultPageUrl = "tab02-generateProblemResult.html";
    }

    // 문제 생성 API 호출
    generateProblem(tab, problemType, passageInput)
      .then((response) => {
        // 세션 스토리지에 문제 생성 결과 저장
        sessionStorage.setItem("tab", response.tab);
        sessionStorage.setItem("problemType", response.problemType);
        sessionStorage.setItem("passageInput", response.passageInput);
        sessionStorage.setItem("generatedProblem", response.generatedProblem);
        sessionStorage.setItem(
          "problemExplanation",
          response.problemExplanation
        );

        window.location.href = resultPageUrl; // 결과 페이지로 이동
      })
      .catch((e) => {
        console.error(e);
      });
  }
});

modalConfirmCloseButton.addEventListener("click", () => {
  closeModalConfirm();
});

function openModalConfirm() {
  modalConfirmOverlay.classList.remove("fade-out"); // 기존에 fade-out 클래스가 있을 경우 제거
  modalConfirmOverlay.style.display = "block";
  modalConfirm.style.display = "flex";
}

function closeModalConfirm() {
  modalConfirmOverlay.classList.add("fade-out");
  setTimeout(() => {
    modalConfirmOverlay.style.display = "none";
    modalConfirmOverlay.classList.remove("fade-out"); // fade-out 클래스 제거
  }, 300);
}

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

// 드롭다운 메뉴의 항목을 클릭하면 선택한 항목을 표시하고 문제 유형을 저장
document.querySelectorAll(".dropdown-menu div").forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.stopPropagation();
    document.querySelector(".selected").childNodes[0].nodeValue =
      this.textContent;
    problemType = this.textContent.trim(); // 선택한 문제 유형을 problemType 변수에 할당
    console.log("problemType :", problemType);
    document.querySelector(".dropdown").classList.remove("active");
    document.querySelector(".dropdown-menu").classList.remove("active");
  });
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

// Placeholder 처리
function updatePlaceholder() {
  if (editableDiv.textContent.trim() === "") {
    // 텍스트가 없을 경우
    editableDiv.classList.add("empty");
  } else {
    // 텍스트가 있을 경우
    editableDiv.classList.remove("empty");
  }
}

// 텍스트 업데이트
function updatePassageInput() {
  const div = document.getElementById("editableDiv");
  passageInput = div.innerHTML;
  console.log("passageInput: ", passageInput);
}

async function generateProblem(tab, problemType, passageInput) {
  // const url = "/"; // 문제 생성 API 주소

  const dummyResponseData = {
    tab: tab,
    problemType: problemType,
    passageInput: passageInput,
    generatedProblem:
      "1. 윗글을 참고할 때, ㉠의 이유로 적절하지 않은 것은?<br />① 조선에서 서양 학문을 정책적으로 배척했기 때문이다.<br />② 전래된 서양 의학이 내용 면에서 불충분했기 때문이다.<br />③ 당대 의원들이 서양 의학의 한계를 지적했기 때문이다.<br />④ 서양 해부학이 조선의 윤리 의식에 위배되었기 때문이다.<br />⑤ 서양 의학이 천문 지식에 비해 충격적이지 않았기 때문이다.<br /><br />2. 윗글을 참고할 때, ㉠의 이유로 적절하지 않은 것은?<br />① 조선에서 서양 학문을 정책적으로 배척했기 때문이다.<br />② 전래된 서양 의학이 내용 면에서 불충분했기 때문이다.<br />③ 당대 의원들이 서양 의학의 한계를 지적했기 때문이다.<br />④ 서양 해부학이 조선의 윤리 의식에 위배되었기 때문이다.<br />⑤ 서양 의학이 천문 지식에 비해 충격적이지 않았기 때문이다.<br /><br />3. 윗글을 참고할 때, ㉠의 이유로 적절하지 않은 것은?<br />① 조선에서 서양 학문을 정책적으로 배척했기 때문이다.<br />② 전래된 서양 의학이 내용 면에서 불충분했기 때문이다.<br />③ 당대 의원들이 서양 의학의 한계를 지적했기 때문이다.<br />④ 서양 해부학이 조선의 윤리 의식에 위배되었기 때문이다.<br />⑤ 서양 의학이 천문 지식에 비해 충격적이지 않았기 때문이다.<br />",
    problemExplanation:
      "1번은 -- 이유로 오답이다.<br />2번은 -- 때문에 오답이다.<br />3번은 -- 때문에 정답이다.<br />4번은 -- 때문에 오답이다.<br />5번은 -- 때문에 오답이다.<br /><br />1번은 -- 이유로 오답이다.<br />2번은 -- 때문에 오답이다.<br />3번은 -- 때문에 정답이다.<br />4번은 -- 때문에 오답이다.<br />5번은 -- 때문에 오답이다.<br /><br />1번은 -- 이유로 오답이다.<br />2번은 -- 때문에 오답이다.<br />3번은 -- 때문에 정답이다.<br />4번은 -- 때문에 오답이다.<br />5번은 -- 때문에 오답이다.<br />",
  };
  try {
    // 실제 API 호출 (수정 필요)
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tab,
    //     problemType,
    //     passageInput,
    //   }),
    // });
    // const data = await response.json();

    const data = dummyResponseData; // 테스트용 더미 데이터
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
}

// DOMContentLoaded 이벤트 발생 시 실행
document.addEventListener("DOMContentLoaded", () => {
  const editableDiv = document.getElementById("editableDiv");

  // URL 쿼리 파라미터에서 지문 불러오기
  const urlParams = new URLSearchParams(window.location.search);
  const generatedPassage = urlParams.get("generatedPassage");
  if (generatedPassage) {
    editableDiv.innerHTML = decodeURIComponent(generatedPassage); // URL 디코딩하여 지문 입력
    updatePlaceholder(); // Placeholder 업데이트
    updatePassageInput(); // 텍스트 업데이트
  }

  // 텍스트 입력 시 Placeholder 업데이트
  editableDiv.addEventListener("input", () => {
    updatePlaceholder();
    updatePassageInput();
  });

  // 초기 Placeholder 업데이트
  updatePlaceholder();
});
