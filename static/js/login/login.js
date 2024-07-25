const passwordInput = document.querySelector(".password-input");
const passwordView = document.querySelector(".password-view");
const loginButton = document.querySelector(".login-button");
const modal = document.getElementById("modal");
const modalContent = document.querySelector(".modal-content");
const modalMessage = document.querySelector(".modal-message");
const closeButton = document.querySelector(".close-button");

let testId = "test123"; // 테스트용 아이디
let testPassword = "test123"; // 테스트용 비밀번호

// 눈 모양 아이콘 클릭 시 패스워드 보이기/숨기기
passwordView.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordView.src = "../../static/images/icon/svg/View_fill.svg";
    passwordView.setAttribute("draggable", "false");
  } else {
    passwordInput.type = "password";
    passwordView.src = "../../static/images/icon/svg/View_hide_fill.svg";
    passwordView.setAttribute("draggable", "false");
  }
});

// 로그인 버튼 클릭 시 로그인 정보 확인
loginButton.addEventListener("click", () => {
  const userId = document.getElementById("login-id").value;
  const password = document.getElementById("login-password").value;

  if (!userId) {
    // 아이디를 입력하지 않았을 때
    showModal("아이디를 입력하세요.");
  } else if (!password) {
    // 비밀번호를 입력하지 않았을 때
    showModal("비밀번호를 입력하세요.");
  } else if (userId !== testId) {
    // 아이디가 일치하지 않을 때
    showModal("아이디 정보가 일치하지 않습니다.");
  } else if (password !== testPassword) {
    // 비밀번호가 일치하지 않을 때
    showModal("비밀번호 정보가 일치하지 않습니다.");
  } else {
    // 로그인 성공 시 페이지 이동
    window.location.href = "../tab01/generate/tab01-generateProblem.html";
  }
});

// 닫기 버튼 클릭 시 모달 닫기
closeButton.addEventListener("click", () => {
  closeModal();
});

// 모달 창 외부 클릭 시 모달 닫기
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// 모달 띄우기
function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove("fade-out"); // 기존에 fade-out 클래스가 있으면 제거
  modalContent.classList.remove("slide-out"); // 기존에 slide-out 클래스가 있으면 제거
  modal.style.display = "flex"; // 모달 보이기
}

// 모달 닫기
function closeModal() {
  modal.classList.add("fade-out"); // fade-out 클래스 추가
  modalContent.classList.add("slide-out"); // slide-out 클래스 추가
  setTimeout(() => {
    modal.style.display = "none";
  }, 500); // 애니메이션 시간 후에 모달 숨기기
}
