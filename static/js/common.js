const accountCreationButton = document.querySelector(
  ".account-creation-button"
);
const modalAccountCancelButton = document.querySelector(
  ".modal-account-cancel-button"
);
const modalAccountCreateButton = document.querySelector(
  ".modal-account-create-button"
);
const modalOverlay = document.querySelector(".modal-overlay");
const modalAccountCreate = document.querySelector(".modal-account-create");
const cancelIcon = document.querySelector(".cancel-icon");
const passwordInput = document.querySelector(".password-input");
const passwordView = document.querySelector(".password-view");
const passwordConfirmInput = document.querySelector(
  "#creation-password-confirm"
);
const passwordConfirmView = passwordConfirmInput.nextElementSibling;
const modalWarning = document.querySelector(".modal-warning");
const modalMessage = document.querySelector(".modal-message");
const modalCloseButton = document.querySelector(".modal-close-button");

// 계정 생성 버튼 클릭 이벤트
accountCreationButton.addEventListener("click", () => {
  openModalAccountCreate();
});

// 취소 아이콘 클릭 이벤트
cancelIcon.addEventListener("click", () => {
  closeModalAccountCreate();
});

// 모달 오버레이 클릭 이벤트
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModalAccountCreate();
  }
});

// 계정 생성 모달창 열기
const openModalAccountCreate = () => {
  modalAccountCreate.classList.remove("hide");
  modalAccountCreate.classList.add("show");
  modalOverlay.classList.remove("hide");
  modalOverlay.classList.add("show");
  modalAccountCreate.style.display = "flex";
  modalOverlay.style.display = "block";
};

// 계정 생성 모달창 닫기
const closeModalAccountCreate = () => {
  modalAccountCreate.classList.remove("show");
  modalAccountCreate.classList.add("hide");
  modalOverlay.classList.remove("show");
  modalOverlay.classList.add("hide");

  // 애니메이션 종료 후 display:none 설정
  setTimeout(() => {
    modalAccountCreate.style.display = "none";
    modalOverlay.style.display = "none";
  }, 300);
};

modalAccountCancelButton.addEventListener("click", () => {
  closeModalAccountCreate();
});

// 계정 생성 버튼 클릭 시 input 정보 확인
modalAccountCreateButton.addEventListener("click", () => {
  const userId = document.getElementById("creation-id").value;
  const password = document.getElementById("creation-password").value;
  const passwordConfirm = document.getElementById(
    "creation-password-confirm"
  ).value;

  const userIdPattern = /^[a-zA-Z0-9]{6,12}$/; // 6~12자의 영문 대소문자와 숫자
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/; // 8자 이상의 영문 대소문자, 숫자, 특수문자 조합

  if (!userId) {
    // 아이디를 입력하지 않았을 때
    openModalWarning("아이디를 입력해주세요.");
  } else if (!userIdPattern.test(userId)) {
    // 아이디 형식이 맞지 않을 때
    openModalWarning("아이디 형식을 확인해주세요.");
  } else if (!password) {
    // 비밀번호를 입력하지 않았을 때
    openModalWarning("비밀번호를 입력해주세요.");
  } else if (!passwordPattern.test(password)) {
    // 비밀번호 형식이 맞지 않을 때
    openModalWarning("비밀번호 형식을 확인해주세요.");
  } else if (password !== passwordConfirm) {
    // 비밀번호와 비밀번호 확인이 맞지 않을 때
    openModalWarning("비밀번호가 일치하지 않습니다.");
  } else {
    // 계정 생성 API 연동해야함
    closeModalAccountCreate();
    window.location.href = "";
  }
});

// 경고 모달창 확인 버튼 클릭 시 모달 닫기
modalCloseButton.addEventListener("click", () => {
  closeModalWarning();
});

// 경고 모달창 열기
const openModalWarning = (message) => {
  modalMessage.textContent = message;
  modalWarning.classList.remove("fade-out");
  modalWarning.style.display = "flex";
};

const closeModalWarning = () => {
  modalWarning.classList.add("fade-out");
  setTimeout(() => {
    modalWarning.style.display = "none";
  }, 500);
};

// 비밀번호 눈 모양 아이콘 클릭 시 패스워드 보이기/숨기기
passwordView.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordView.src = "../../../static/images/icon/svg/View_fill.svg";
    passwordView.setAttribute("draggable", "false");
  } else {
    passwordInput.type = "password";
    passwordView.src = "../../../static/images/icon/svg/View_hide_fill.svg";
    passwordView.setAttribute("draggable", "false");
  }
});

// 비밀번호 확인 눈 모양 아이콘 클릭 시 패스워드 보이기/숨기기
passwordConfirmView.addEventListener("click", () => {
  if (passwordConfirmInput.type === "password") {
    passwordConfirmInput.type = "text";
    passwordConfirmView.src = "../../../static/images/icon/svg/View_fill.svg";
    passwordConfirmView.setAttribute("draggable", "false");
  } else {
    passwordConfirmInput.type = "password";
    passwordConfirmView.src =
      "../../../static/images/icon/svg/View_hide_fill.svg";
    passwordConfirmView.setAttribute("draggable", "false");
  }
});
