let passageInput = ""; // 입력한 텍스트 저장하는 변수

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

  updatePassateInput(); // 밑줄 적용 후 텍스트 업데이트
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

    updatePassateInput(); // 밑줄 제거 후 텍스트 업데이트
  } else {
    alert("선택한 텍스트에 밑줄이 없습니다.");
  }
}

function updatePassateInput() {
  const div = document.getElementById("editableDiv");
  passageInput = div.innerHTML;
  console.log("passageInput: ", passageInput);
}

// DOMContentLoaded 이벤트 발생 시 실행
document.addEventListener("DOMContentLoaded", () => {
  const editableDiv = document.getElementById("editableDiv");

  // Placeholder 처리
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
    updatePassateInput();
  });

  // 초기 Placeholder 업데이트
  updatePlaceholder();
});
