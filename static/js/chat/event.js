window.onload = () => {
    // 상담 받기 버튼
    const newChatBtn = document.querySelector(".ChatContent-Button");
    // 새 채팅방 div
    const newChatDiv = document.querySelector(".Chat-ChatContent");
    // 채팅방 div
    const chatDiv = document.querySelector(".ChatPage-Layout");
    // 채팅방 유저
    const chatUser = chatDiv.querySelector(".ChatPage-UserInfo");

    // 좌측의 채팅방이 있는 유저들
    const chats = document.querySelectorAll(".UserList-EachUser") || null;
    // 모달 백드롭
    const modalBackDrop = document.querySelector(".Modal-BackDrop");
    // 전문가 검색 모달
    const searchExpertModal = document.querySelector(".Search-Modal");
    // 상대방 정보 모달
    const userInfoModal = document.querySelector(".Big-Modal.Info");
    // 상대방 별명 변경 모달
    const changeAliasModal = document.querySelector(".Big-Modal.ChangeAlias");
    // 사라진 메세지 설정 모달
    const removedMsgModal = document.querySelector(".Big-Modal.RemovedMsg");
    // 모든 대화 지우기 모달
    const removeAllMsgModal = document.querySelector(".Small-Modal.RemoveAll");
    // 스크린샷 차단 설정 모달
    const banScreanShotModal = document.querySelector(
        ".Big-Modal.BanScreanShot",
    );
    // 전달 전용 검색 모달
    const postChatModal = document.querySelector(".Small-Modal.PostChat");
    // 특정 채팅 지우기 모달
    const deleteChatModal = document.querySelector(".Small-Modal.DeleteChat");
    // 채팅방 나가기 모달
    const leaveModal = document.querySelector(".Small-Modal.Leave");
    // 대화 차단 모달
    const banUserModal = document.querySelector(".Small-Modal.Ban-User");

    // 반응형 js -----------------------------------
    const userListWrapper = document.querySelector(".Chat-UserList-Wrapper");
    const backBtn = document.getElementById("chat-back-btn");
    const bottomNav = document.querySelector(".mobile-nav");

    // 좌측 검색바
    const searchBarPlaceholder = document.querySelector(
        ".Header-SearchBar:not(.Input)",
    );
    const searchBarInput = document.querySelector(".Header-SearchBar.Input");
    const searchInput = document.querySelector(".Search-Conversation-Input");
    const searchClearBtn = document.querySelector(".Search-Clear-Btn");
    const searchConvPanel = document.querySelector(".Search-Conversation");
    const searchConvEmpty = document.querySelector(".Search-Conv-Empty"); // 검색값 없을 때 그리드
    const searchConvResults = document.querySelector(".Search-Conv-Results"); // 검색값 있을 때 리스트
    const userListEl = document.querySelector(".UserList-Wrapper");

    // 모바일 여부 판단
    function isMobile() {
        return window.innerWidth <= 600;
    }

    // 채팅방 열기 (모바일이면 유저목록 숨기기)
    function openChatRoom() {
        newChatDiv.classList.add("off");
        chatDiv.classList.remove("off");
        bottomNav.style.display = "none";
        if (isMobile()) {
            userListWrapper.classList.add("off");
        }
    }

    // 채팅방 닫기 (모바일이면 유저목록 다시 보이기)
    function closeChatRoom() {
        chatDiv.classList.add("off");
        newChatDiv.classList.remove("off");
        bottomNav.style.display = "flex";
        if (isMobile()) {
            userListWrapper.classList.remove("off");
        }
    }

    // 뒤로가기 버튼 이벤트
    backBtn.addEventListener("click", () => {
        closeChatRoom();
    });

    // 화면 크기 변경 시 처리
    window.addEventListener("resize", () => {
        if (!isMobile()) {
            // 데스크탑으로 전환되면 유저목록 항상 표시
            userListWrapper.classList.remove("off");
        } else {
            // 모바일로 전환 시 채팅방이 열려있으면 유저목록 숨기기
            if (!chatDiv.classList.contains("off")) {
                userListWrapper.classList.add("off");
            }
        }
    });
    // ---------------------------------------------

    // 좌측 대화 검색 -----------------------------------

    // 검색 패널 열기
    function openSearchPanel() {
        searchBarPlaceholder.style.display = "none";
        searchBarInput.style.display = "flex";
        userListEl.style.display = "none";
        searchConvPanel.classList.remove("off");
        // 기본: 그리드(빈 상태) 표시
        searchConvEmpty.style.display = "flex";
        searchConvResults.classList.add("off");
        setTimeout(() => searchInput.focus(), 50);
    }

    // 검색 패널 닫기
    function closeSearchPanel() {
        searchBarPlaceholder.style.display = "";
        searchBarInput.style.display = "none";
        userListEl.style.display = "";
        searchConvPanel.classList.add("off");
        searchInput.value = "";
        searchClearBtn.classList.add("off");
    }

    // 플레이스홀더 검색바 클릭 → 패널 열기
    searchBarPlaceholder.addEventListener("click", (e) => {
        e.stopPropagation();
        openSearchPanel();
    });

    // input 값 변화 → 그리드/리스트 전환
    searchInput.addEventListener("input", () => {
        const hasValue = searchInput.value.trim().length > 0;
        // 지우기 버튼 토글
        searchClearBtn.classList.toggle("off", !hasValue);
        // 그리드 ↔ 리스트 전환
        searchConvEmpty.style.display = hasValue ? "none" : "flex";
        searchConvResults.classList.toggle("off", !hasValue);
    });

    // 지우기 버튼 → input 초기화 후 그리드로 복귀
    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchClearBtn.classList.add("off");
        searchConvEmpty.style.display = "flex";
        searchConvResults.classList.add("off");
        searchInput.focus();
    });

    // ESC 누르면 검색 패널 닫기
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeSearchPanel();
    });

    // 검색 패널 바깥 클릭 시 닫기
    document.addEventListener("click", (e) => {
        if (
            !searchConvPanel.classList.contains("off") &&
            !searchBarInput.contains(e.target) &&
            !searchBarPlaceholder.contains(e.target) &&
            !searchConvPanel.contains(e.target)
        ) {
            closeSearchPanel();
        }
    });
    // ---------------------------------------------
    // 채팅 입력란 이모지 버튼
    const picker = new EmojiButton({
        position: "bottom-start",
    });
    picker.on("emoji", (emoji) => {
        const textBox = document.getElementById("chat-input");
        textBox.value += emoji;
    });

    // 채팅 메뉴 이모지 버튼
    const emojiPicker = document.querySelector(".Chat-Emoji-Picker");
    let activeEmoteBtn = null;

    function openEmojiPicker(btn) {
        emojiPicker.classList.remove("off");
        const rect = btn.getBoundingClientRect();
        const pickerWidth = emojiPicker.offsetWidth;
        const pickerHeight = emojiPicker.offsetHeight;

        const top = rect.top - pickerHeight - 8;
        let left = rect.left;

        if (left + pickerWidth > window.innerWidth) {
            left = window.innerWidth - pickerWidth - 8;
        }

        emojiPicker.style.top = `${top}px`;
        emojiPicker.style.left = `${left}px`;
        activeEmoteBtn = btn;
    }

    function closeEmojiPicker() {
        emojiPicker.classList.add("off");
        activeEmoteBtn = null;
    }

    // 이모지 선택 이벤트
    emojiPicker.querySelectorAll(".Emoji-Button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const emoji = btn.dataset.emoji;
            const targetChat = activeEmoteBtn?.closest(".Each-Main-Content");

            // 이모지 div 추가
            addReaction(emoji, targetChat);
            closeEmojiPicker();

            closeEmojiPicker();
        });
    });

    // 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
        if (!emojiPicker.contains(e.target)) {
            closeEmojiPicker();
        }
    });

    // ---------------------------------------------

    // 상담 받기 클릭시 전문가 검색창 표시
    function openSearchExpertModal() {
        openModal(searchExpertModal);

        // 전문가 모달창 닫기 버튼
        const closeBtn = searchExpertModal.querySelector(
            ".Modal-Header-Button",
        );
        // 전문가 모달창 input
        const searchInput = document.querySelector(
            ".Search-Modal-SearchBar input",
        );

        let timer;
        const delay = 1000;

        // 전문가 회원 검색
        searchInput.addEventListener("keyup", (e) => {
            e.preventDefault();

            clearTimeout(timer);

            // 검색 값이 입력되면 1초 뒤에 검색
            timer = setTimeout(() => {
                // 여기에 rest api 요청 작성
            }, delay);
        });

        // 검색한 전문가들
        const experts = searchExpertModal.querySelectorAll(".Each-Expert");
        // 전문가를 선택하면 모달이 닫히고 채팅방 불러오기
        experts.forEach((expert) => {
            expert.addEventListener("click", (e) => {
                // 새 채팅방 요청

                // 완료되면 모달 닫고 채팅방 div 열기
                closeModal(searchExpertModal);
                openChatRoom();
            });
        });

        // 닫기 버튼 누르면 모달창 닫기
        closeBtn.addEventListener("click", (e) => {
            closeModal(searchExpertModal);
        });
    }

    // 상담 받기 버튼 (채팅 없을 때 중앙 버튼)
    newChatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openSearchExpertModal();
    });

    // 헤더 Invite 버튼 (전문가 찾기)
    const inviteBtn = document.querySelector(".Header-Each-Button.Invite");
    if (inviteBtn) {
        inviteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openSearchExpertModal();
        });
    }

    // 채팅방 이벤트 --------------------------------------
    // 채팅방이 있다면 클릭 시 채팅방 불러오기
    if (chats) {
        chats.forEach((chat) => {
            chat.addEventListener("click", (e) => {
                // 눌린 채팅방에 current 추가
                chats.forEach((c) => c.classList.remove("current"));
                chat.classList.add("current");

                // 해당 유저의 채팅방 요청

                // 성공하면 채팅방 열기
                openChatRoom();
            });
        });
    }

    // 채팅방 버튼들
    const buttons = chatDiv.querySelectorAll(".ChatPage-Button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const divName = button.classList[1];
            switch (divName) {
                case "VideoCall":
                    alert("추후 업데이트 예정입니다.");
                    break;
                case "UserInfo":
                    openModal(userInfoModal);
                    break;
            }
        });
    });
    // 채팅들
    const conversations = chatDiv.querySelectorAll(
        ".Left, .Right, .MyReply, .Reply",
    );
    // 답변 채팅들
    const replyCons = chatDiv.querySelectorAll(".MyReply, .Reply");

    // 채팅 입력란 Emote 버튼
    const emoteButton = document.getElementById("emoji-btn");

    // 채팅 메뉴 누르면 메뉴 등장하는 이벤트
    const chatMenu = document.querySelector(".Chat-Extend-Menu");
    let activeBtn = null;

    // 메뉴 닫기 함수
    function closeMenu() {
        if (activeBtn) {
            const menu = activeBtn.closest(".Message-Buttons");
            if (menu) menu.classList.add("off");
        }
        chatMenu.classList.remove("on");
        chatMenu.classList.add("off");
        activeBtn = null;
    }

    // 메뉴 위치 업데이트 함수
    function updateMenuPosition() {
        if (!activeBtn) return;

        const rect = activeBtn.getBoundingClientRect();

        // 버튼이 화면 밖으로 벗어나면 메뉴 닫기
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            closeMenu();
            return;
        }

        const menuHeight = chatMenu.offsetHeight;
        const menuWidth = chatMenu.offsetWidth;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceRight = window.innerWidth - rect.left;

        // 아래 공간이 메뉴 height만큼 없으면 위로
        let top;
        if (spaceBelow >= menuHeight) {
            top = rect.bottom + 8;
        } else {
            top = rect.top - menuHeight - 8;
        }

        let left;
        if (spaceRight >= menuWidth) {
            left = rect.left;
        } else {
            left = rect.right - menuWidth;
        }
        // 왼쪽 경계 밖으로 나가지 않도록
        left = Math.max(8, left);
        // 오른쪽 경계 밖으로 나가지 않도록
        left = Math.min(left, window.innerWidth - menuWidth - 8);

        chatMenu.style.top = `${top}px`;
        chatMenu.style.left = `${left}px`;
    }

    // 각 채팅에 마우스가 올라가면 메뉴바 표시
    conversations.forEach((c) => {
        const menu = c.querySelector(".Message-Buttons");
        const emojiBtn = menu.querySelector(".Message-Button.Emote");
        const moreBtn = menu.querySelector(".Message-Button.Menu");
        if (menu) {
            c.addEventListener("mouseover", (e) => {
                menu.classList.remove("off");
            });
            c.addEventListener(
                "touchstart",
                () => {
                    menu.classList.remove("off");
                },
                { passive: true },
            );
            c.addEventListener("mouseleave", (e) => {
                // 메뉴바가 열려있고 이 채팅의 버튼이 activeBtn이면 숨기지 않음
                if (activeBtn === moreBtn) return;
                menu.classList.add("off");
            });

            // 이모지 버튼 이벤트
            emojiBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (
                    activeEmoteBtn === emojiBtn &&
                    !emojiPicker.classList.contains("off")
                ) {
                    closeEmojiPicker();
                    return;
                }
                openEmojiPicker(emojiBtn);
            });

            // 더보기 메뉴 이벤트
            moreBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                // 같은 버튼 다시 클릭 시 닫기
                if (
                    activeBtn === moreBtn &&
                    chatMenu.classList.contains("on")
                ) {
                    closeMenu();
                    return;
                }

                // 모바일에서 menu 버튼이 off 상태일 수 있으므로 강제 표시
                menu.classList.remove("off");

                activeBtn = moreBtn;
                // on 먼저 붙여서 크기를 렌더링한 뒤 위치 계산
                chatMenu.classList.remove("off");
                chatMenu.classList.add("on");
                updateMenuPosition();
            });
        }
    });

    // 스크롤 시 메뉴 위치 업데이트
    const scrollContainer = document.querySelector(".ChatPage-Main-Container");
    scrollContainer.addEventListener(
        "scroll",
        () => {
            if (chatMenu.classList.contains("on")) {
                updateMenuPosition();
            }
        },
        { passive: true },
    );

    // 외부 클릭 시 메뉴 닫기
    document.addEventListener("click", (e) => {
        if (!chatMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // 채팅 메뉴 이벤트
    const toast = document.querySelector(".Clipboard-Toast");

    // 답글 컨테이너
    const replyContainer = chatDiv.querySelector(".ChatPage-Reply-Container");
    const replyTextUser = replyContainer.querySelector(".Reply-Text-User");
    const replyTextContent = replyContainer.querySelector(
        ".Reply-Text-Content",
    );
    const replyCloseBtn = replyContainer.querySelector(".Reply-Close");

    function openReply(userName, content) {
        replyTextUser.textContent = userName;
        replyTextContent.textContent = content;
        replyContainer.classList.remove("off");
    }

    function closeReply() {
        replyContainer.classList.add("off");
        replyTextUser.textContent = "";
        replyTextContent.textContent = "";
    }

    replyCloseBtn.addEventListener("click", () => closeReply());

    const chatMenuBtns = chatMenu.querySelectorAll(".Extend-Menu-Button");
    chatMenuBtns.forEach((button) => {
        button.addEventListener("click", (e) => {
            const name = button.getAttribute("name");
            switch (name) {
                case "reply":
                    const targetChat = activeBtn.closest(".Each-Main-Content");
                    const userName =
                        targetChat
                            ?.closest(".Left, .Right, .MyReply, .Reply")
                            ?.querySelector(".UserName-Text")
                            ?.textContent.trim() ?? "상대방";
                    const content =
                        targetChat
                            ?.querySelector(".Message-Content")
                            ?.textContent.trim() ?? "";
                    openReply(userName, content);
                    closeMenu();
                    break;
                case "trans":
                    openModal(postChatModal);
                    break;
                case "copy":
                    // 현재 열린 채팅의 메시지 내용 가져오기
                    const messageContent = activeBtn
                        .closest(".Each-Main-Content")
                        ?.querySelector(".Message-Content")?.innerText;

                    if (!messageContent) break;

                    navigator.clipboard
                        .writeText(messageContent)
                        .then(() => {
                            // 이미 애니메이션 중이면 초기화
                            toast.classList.remove("show");
                            void toast.offsetWidth; // reflow 강제

                            toast.classList.add("show");

                            setTimeout(() => {
                                toast.classList.remove("show");
                            }, 4000);
                        })
                        .catch(() => {
                            console.error("클립보드 복사 실패");
                        });
                    break;
                case "delete":
                    openModal(deleteChatModal);
                    break;
            }
        });
    });

    // 답변의 채팅누르면 해당 채팅으로 이동 후 애니메이션 이벤트
    replyCons.forEach((reply) => {
        const replyWrapper = reply.querySelector(".MyReply-Wrapper");
        if (!replyWrapper) return;

        replyWrapper.addEventListener("click", (e) => {
            const targetId = reply.dataset.replyTo;
            if (!targetId) return;

            const targetLi = document.querySelector(
                `[data-chat-id="${targetId}"]`,
            );
            if (!targetLi) return;

            // 1. 스크롤 이동
            targetLi.scrollIntoView({ behavior: "smooth", block: "center" });

            // 2. 스크롤 완료 후 방향에 따라 애니메이션 실행
            setTimeout(() => {
                const messageContainer = targetLi.closest(".Each-Main-Content");
                if (!messageContainer) return;

                // 방향 판별 - li의 클래스로 확인
                const isLeft = targetLi.classList.contains("Left");
                const animClass = isLeft ? "chat-pop-right" : "chat-pop-left";

                // 기존 클래스 제거 후 재실행
                messageContainer.classList.remove(
                    "chat-pop-right",
                    "chat-pop-left",
                );
                void messageContainer.offsetWidth; // reflow 강제

                messageContainer.classList.add(animClass);

                messageContainer.addEventListener(
                    "animationend",
                    () => {
                        messageContainer.classList.remove(animClass);
                    },
                    { once: true },
                );
            }, 400);
        });
    });

    // 하단 입력란 부분 -------------------------------------
    // 채팅 입력 wrapper
    const chatInputDiv = document.querySelector(".Input-TextArea-Container");
    // 채팅 입력 form
    const chatForm = document.getElementById("chatSubmit");
    // 채팅 입력 input
    const chatInput = document.getElementById("chat-input");
    // 채팅 첨부파일 div
    const chatAttachDiv = document.querySelector(".Input-Image-Card");
    // 채팅 첨부파일 input
    const chatAttach = document.getElementById("chat-image");
    // 채팅 submit 버튼
    const chatSubmit = document.querySelector(".Submit-Button-Wrapper");

    // 채팅 input에 입력값이 있으면 버튼 활성화
    chatInput.addEventListener("keyup", (e) => {
        if (chatInput.value) {
            chatSubmit.classList.remove("off");
        } else {
            chatSubmit.classList.add("off");
        }
    });

    // 채팅 보내기 이벤트 -----------------------------
    chatSubmit.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
            // 엔터키 눌리면 submit
            chatForm.submit();
        }
    });
    chatSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        chatForm.submit();
    });

    // 이모지 버튼 이벤트
    emoteButton.addEventListener("click", (e) => {
        picker.togglePicker(emoteButton);
    });

    // 모달 이벤트 부분 -------------------------------------
    // 채팅방 회원 정보 누르면 모달 열기
    chatUser.addEventListener("click", (e) => {
        openModal(userInfoModal);
    });

    // 회원 정보 모달 닫기 버튼
    const userInfoClose = userInfoModal.querySelector(
        ".Big-Modal-Button.Close",
    );
    userInfoClose.addEventListener("click", (e) => {
        closeModal(userInfoModal);
    });

    // 회원 정보 모달 버튼들
    userInfoModal.addEventListener("click", (e) => {
        const toggle = false;
        const btn = e.target.closest("button");
        const setting = e.target.closest(".Modal-Bottom-Setting");
        const upperBtn = e.target.closest(".Modal-Upper-Button");
        const menuBtns = userInfoModal.querySelectorAll(".Menu-Icon");

        // 닫기, 별명 변경 버튼
        if (btn?.classList.contains("Close")) return closeModal(userInfoModal);
        if (btn?.classList.contains("Alias"))
            return openModal(changeAliasModal);

        // 상단 버튼
        if (upperBtn) {
            if (upperBtn.classList.contains("Call"))
                return alert("추후 업데이트 예정입니다.");
            if (upperBtn.classList.contains("Profile")) return; // 프로필 이동 로직
            if (upperBtn.classList.contains("More")) {
                userInfoModal
                    .querySelector(".Extend-Menu-Wrapper")
                    .classList.toggle("off");
                return;
            }
        }

        // 더보기 드롭다운 버튼
        menuBtns.forEach((button) => {
            button.addEventListener("click", (e) => {
                const name = button.classList[1];
                switch (name) {
                    case "Mute":
                        // 해당 대화 차단 로직

                        // 성공하면 실행
                        toggle = !toggle;
                        const text = `
                        ${
                            toggle
                                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" data-icon="icon-notifications-stroke" viewBox="0 0 24 24" width="1em" height="1em" display="flex" role="img" class="h-5 w-5"><path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path></svg>`
                                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" data-icon="icon-notifications-off" viewBox="0 0 24 24" width="1em" height="1em" display="flex" role="img" class="h-5 w-5"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.375 17C16.375 19.2091 14.5841 21 12.375 21C10.1659 21 8.375 19.2091 8.375 17"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.375 17H6.42522C5.21013 17 4.27578 15.9254 4.44462 14.7221L5.18254 9.46301C5.31208 8.25393 5.73464 7.14098 6.375 6.19173M9.375 3.65027C10.2917 3.23195 11.3086 3 12.375 3C16.0717 3 19.1736 5.78732 19.5675 9.46301L20.0536 14"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.375 3L21.375 21"></path></svg>`
                        }
                            <div class="Menu-Text">
                            ${toggle ? "뮤트" : "언뮤트"}
                            </div>
                            `;
                        btn.innerHTML = text;
                        break;
                    case "Delete":
                        userInfoModal
                            .querySelector(".Extend-Menu-Wrapper")
                            .classList.add("off");
                        openModal(leaveModal);
                        break;
                }
            });
        });

        // 하단 설정 버튼
        if (setting) {
            const modalMap = {
                RemovedMsg: removedMsgModal,
                BanScreanShot: banScreanShotModal,
                BanUser: banUserModal,
            };
            const key = Object.keys(modalMap).find((k) =>
                setting.classList.contains(k),
            );
            if (key) return openModal(modalMap[key]);
        }
    });

    // 별명 변경 모달 이벤트
    const saveBtn = changeAliasModal.querySelector(".Big-Modal-Button.Save");
    const inputWrapper = changeAliasModal.querySelector(".Input-Area");
    const aliasInput = document.getElementById("user-alias");

    // 값이 입력되면 스타일 변경
    const tempBorder = inputWrapper.style.border;
    aliasInput.addEventListener("focus", (e) => {
        inputWrapper.style.border = "1px solid #1e9cf1";
    });
    aliasInput.addEventListener("blur", (e) => {
        inputWrapper.style.border = tempBorder;
    });
    aliasInput.addEventListener("keyup", (e) => {
        if (aliasInput.value !== "") {
            saveBtn.disabled = false;
            saveBtn.classList.remove("disabled");
        } else {
            saveBtn.disabled = true;
            saveBtn.classList.add("disabled");
        }
    });

    // 사라진 메세지 모달 이벤트
    const setRemoveTimes = removedMsgModal.querySelectorAll(".Set-Remove-Time");
    const removeAll = removedMsgModal.querySelector(".Remove-All-Button");
    setRemoveTimes.forEach((setTime) => {
        setTime.addEventListener("click", (e) => {
            // 모든 svg 비활성화
            setRemoveTimes.forEach((btn) =>
                btn.querySelector("svg").classList.add("off"),
            );

            // 클릭한 버튼의 svg만 활성화
            setTime.querySelector("svg").classList.remove("off");

            // 선택한 시간 Info 모달 Setting-Arrow에 반영
            const selectedTime =
                setTime.querySelector(".Area-Content-Text").textContent;
            userInfoModal.querySelector(
                ".Modal-Bottom-Setting.RemovedMsg .Setting-Arrow",
            ).textContent = selectedTime;

            // 설정 변경 요청 로직 작성
        });
    });
    removeAll.addEventListener("click", (e) => {
        openModal(removeAllMsgModal);
    });

    // 스크린샷 차단하기 모달 이벤트
    const toggleBtn = banScreanShotModal.querySelector(".Toggle-Button");
    const toggleSpan = banScreanShotModal.querySelector(".Toggle-Switch");
    toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("clicked");
        toggleSpan.classList.toggle("moved");
        const isActive = toggleBtn.classList.contains("clicked");

        // Info 모달 Setting-Arrow에 반영
        userInfoModal.querySelector(
            ".Modal-Bottom-Setting.BanScreanShot .Setting-Arrow",
        ).textContent = isActive ? "켜기" : "끄기";

        // 설정 변경 요청 로직
    });

    // 저장 버튼 이벤트
    saveBtn.addEventListener("click", (e) => {
        if (saveBtn.disabled) return;
        // 저장 로직
    });
    // ----------------------------------------------

    // 작은 모달 클릭 이벤트 --------------------------

    // 특정 채팅 지우기 모달 이벤트
    const deleteChatBtn = deleteChatModal.querySelector(".Small-Button.Ban");
    deleteChatBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 대화 삭제 요청 로직 작성
        alert("추후 추가 예정");
    });

    // 대화 삭제 모달 이벤트
    const leaveChatBtn = leaveModal.querySelector(".Small-Button.Ban");
    leaveChatBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 대화 삭제 요청 로직 작성
        alert("추후 추가 예정");
    });

    // 모든 대화 지우기 모달 이벤트
    const removeAllMsgBtn =
        removeAllMsgModal.querySelector(".Small-Button.Ban");
    removeAllMsgBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 모든 대화 지우기 요청 로직 작성
        alert("추후 추가 예정");
    });

    // 대화 차단 모달 이벤트
    const banChatBtn = banUserModal.querySelector(".Small-Button.Ban");
    banChatBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 대화 차단 요청 로직 작성
        alert("추후 추가 예정");
    });

    // -----------------------------------------------

    // 모달 여닫기 이벤트 ---------------------
    // 모달 열기
    function openModal(modal) {
        modalBackDrop.classList.remove("off");
        modal.classList.remove("off");
        if (
            modal.classList.contains("Big-Modal") ||
            modal.classList.contains("Small-Modal")
        ) {
            requestAnimationFrame(() => modal.classList.add("on"));
        }
        // Small-Modal 열릴 때 백드롭을 Big-Modal(51) 위로 올려서 Big-Modal을 가림
        if (modal.classList.contains("Small-Modal")) {
            modalBackDrop.style.zIndex = "53";
        }
    }

    // 모달 닫기
    function closeModal(modal) {
        if (modal.classList.contains("Big-Modal")) {
            modal.classList.remove("on");
            // 애니메이션 끝난 후 off 처리
            modal.addEventListener(
                "transitionend",
                () => {
                    modal.classList.add("off");
                    // 열린 모달이 없으면 백드롭도 닫기
                    const anyOpen = document.querySelectorAll(
                        ".Big-Modal.on, .Small-Modal.on",
                    );
                    if (anyOpen.length === 0) {
                        modalBackDrop.classList.add("off");
                    }
                },
                { once: true },
            );
        } else if (modal.classList.contains("Small-Modal")) {
            modal.classList.remove("on");
            modal.classList.add("off");
            // Small-Modal 닫히면 백드롭 z-index 원복
            modalBackDrop.style.zIndex = "";
            // 열린 Big-Modal이 없으면 백드롭도 닫기
            const anyOpen = document.querySelectorAll(".Big-Modal.on");
            if (anyOpen.length === 0) {
                modalBackDrop.classList.add("off");
            }
        } else {
            modalBackDrop.classList.add("off");
            modal.classList.add("off");
        }
    }

    // 백드롭 클릭 시 모든 모달 닫기
    modalBackDrop.addEventListener("click", () => {
        const modals = document.querySelectorAll(
            ".Big-Modal, .Small-Modal, .Search-Modal",
        );
        modals.forEach((modal) => {
            modal.classList.remove("on");
            modal.classList.add("off");
        });
        modalBackDrop.style.zIndex = "";
        modalBackDrop.classList.add("off");
    });

    // 모든 모달 뒤로가기 버튼 이벤트
    const backBtns = document.querySelectorAll(".Big-Modal-Button.Close");
    backBtns.forEach((back) => {
        const currentModal = back.closest(".Big-Modal");
        back.addEventListener("click", (e) => closeModal(currentModal));
    });

    // 모든 작은 모달 닫기 버튼 이벤트
    const closeBtns = document.querySelectorAll(".Close-Button, .Cancel");
    closeBtns.forEach((closeBtn) => {
        const currentModal = closeBtn.closest(".Small-Modal");
        closeBtn.addEventListener("click", (e) => closeModal(currentModal));
    });

    // 채팅에 이모지 div 추가하기
    function addReaction(emoji, targetChat) {
        if (!targetChat) return;

        const reactionsDiv = targetChat.querySelector(".Message-Reactions");
        if (!reactionsDiv) return;

        const existing = [
            ...reactionsDiv.querySelectorAll(".Reaction-Badge"),
        ].find((badge) => badge.dataset.emoji === emoji);

        if (existing) {
            if (existing.classList.contains("my-reaction")) {
                const countEl = existing.querySelector(".Reaction-Count");
                const count = parseInt(countEl.textContent) - 1;

                if (count <= 0) {
                    existing.remove();
                } else {
                    countEl.textContent = count;
                    existing.classList.remove("my-reaction");
                }
            } else {
                const countEl = existing.querySelector(".Reaction-Count");
                countEl.textContent = parseInt(countEl.textContent) + 1;
                existing.classList.add("my-reaction");
            }
        } else {
            const badge = document.createElement("div");
            badge.classList.add("Reaction-Badge", "my-reaction");
            badge.dataset.emoji = emoji;
            badge.innerHTML = `<span>${emoji}</span><span class="Reaction-Count">1</span>`;

            badge.addEventListener("click", () => {
                addReaction(emoji, targetChat);
            });

            reactionsDiv.appendChild(badge);
        }

        // reaction 유무에 따라 클래스 토글
        if (reactionsDiv.children.length > 0) {
            targetChat.classList.add("has-reaction");
        } else {
            targetChat.classList.remove("has-reaction");
        }
    }
};
