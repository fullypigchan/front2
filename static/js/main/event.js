document.addEventListener("DOMContentLoaded", () => {
    setupComposerState();
    setupComposerToolbar();
    setupSearchForm();
    setupTimelineTabs();
    setupExpandablePostText();
    setupMediaPreview();
    setupTweetActions();
    setupConnectButtons();
});

const composerEmojiRecentsKey = "main_composer_recent_emojis";
const composerMaxRecentEmojis = 18;
const composerEmojiCategoryMeta = {
    recent: {
        label: "최근",
        icon: "🕘",
    },
    smileys: {
        label: "스마일리 및 사람",
        icon: "🙂",
    },
    animals: {
        label: "동물 및 자연",
        icon: "🐻",
    },
    food: {
        label: "음식 및 음료",
        icon: "🍔",
    },
    activities: {
        label: "활동",
        icon: "⚽",
    },
    travel: {
        label: "여행 및 장소",
        icon: "📍",
    },
    objects: {
        label: "사물",
        icon: "💡",
    },
    symbols: {
        label: "기호",
        icon: "❤️",
    },
    flags: {
        label: "깃발",
        icon: "🏁",
    },
};

const composerEmojiCategoryData = {
    smileys: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😂",
        "😊",
        "😉",
        "😍",
        "🥰",
        "😎",
        "🤔",
        "😭",
        "🥳",
        "🤩",
        "😴",
        "😤",
        "🤯",
        "🫠",
    ],
    animals: [
        "🐶",
        "🐱",
        "🐻",
        "🐼",
        "🦊",
        "🐯",
        "🦁",
        "🐸",
        "🐵",
        "🐧",
        "🐦",
        "🦄",
        "🐝",
        "🦋",
        "🌸",
        "🌿",
        "🌙",
        "⭐",
    ],
    food: [
        "🍔",
        "🍕",
        "🍜",
        "🍣",
        "🍩",
        "🍪",
        "🍫",
        "🍿",
        "🥐",
        "🍎",
        "🍓",
        "🍉",
        "🍇",
        "☕",
        "🍵",
        "🥤",
    ],
    activities: [
        "⚽",
        "🏀",
        "🎮",
        "🎯",
        "🎳",
        "🎸",
        "🎧",
        "🎬",
        "📚",
        "🧩",
        "🏆",
        "🥇",
        "🏃",
        "🚴",
    ],
    travel: [
        "🚗",
        "🚌",
        "✈️",
        "🚀",
        "🚲",
        "⛵",
        "🏠",
        "🏙️",
        "🏝️",
        "🌁",
        "🗼",
        "🗽",
        "📍",
    ],
    objects: [
        "💡",
        "📱",
        "💻",
        "⌚",
        "📷",
        "🎥",
        "💰",
        "💎",
        "🔑",
        "🎁",
        "📌",
        "🧸",
        "🛒",
        "🧠",
    ],
    symbols: [
        "❤️",
        "💙",
        "💚",
        "💛",
        "💜",
        "🖤",
        "✨",
        "💫",
        "💥",
        "💯",
        "✔️",
        "❌",
        "⚠️",
        "🔔",
    ],
    flags: ["🏳️", "🏴", "🏁", "🚩", "🎌", "🏳️‍🌈", "🇰🇷", "🇺🇸", "🇯🇵", "🇫🇷", "🇬🇧"],
};

<<<<<<< Updated upstream
=======
const composerFormatButtonLabels = {
    bold: {
        inactive: "굵게, (CTRL+B) 님",
        active: "굵게, 활성 상태, (CTRL+B) 님 님",
    },
    italic: {
        inactive: "기울임꼴, (CTRL+I) 님",
        active: "기울임꼴, 활성 상태, (CTRL+I) 님 님",
    },
};

function parseTwemoji(scope) {
    if (!scope || !window.twemoji) {
        return;
    }

    window.twemoji.parse(scope, {
        folder: "svg",
        ext: ".svg",
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

>>>>>>> Stashed changes
function setupComposerState() {
    const composerSection = document.getElementById("composerSection");
    const composerTextarea = document.getElementById("postContent");
    const composerValue = document.getElementById("postContentValue");
    const composerGauge = document.getElementById("composerGauge");
    const composerGaugeText = document.getElementById("composerGaugeText");
    const submitButton = document.getElementById("postSubmitButton");
    const maxLength = 500;

    if (!composerSection || !composerTextarea) {
        return;
    }

    function getComposerText() {
        return (
            composerTextarea.textContent?.replace(/\u00a0/g, " ").trim() || ""
        );
    }

    function expandComposer() {
        composerSection.classList.add("isExpanded");
    }

    function normalizeComposerContent() {
        const text =
            composerTextarea.textContent?.replace(/\u00a0/g, " ") || "";
        if (text.trim() === "") {
            composerTextarea.innerHTML = "";
            if (composerValue) {
                composerValue.value = "";
            }
            return "";
        }

        return text;
    }

    function collapseComposer() {
        if (getComposerText() !== "") {
            return;
        }

        normalizeComposerContent();
        composerSection.classList.remove("isExpanded");
    }

    composerTextarea.addEventListener("focus", expandComposer);
    composerTextarea.addEventListener("click", expandComposer);
    composerTextarea.addEventListener("input", updateComposerGauge);

    document.addEventListener("click", (event) => {
        if (composerSection.contains(event.target)) {
            return;
        }

        collapseComposer();
    });

    updateComposerGauge();

    function updateComposerGauge() {
        if (!composerGauge || !composerGaugeText) {
            return;
        }

        let content = normalizeComposerContent();
        if (content.length > maxLength) {
            content = content.slice(0, maxLength);
            composerTextarea.textContent = content;
            placeCaretAtEnd(composerTextarea);
        }

        const normalizedContent = content.trim();
        if (composerValue) {
            composerValue.value = normalizedContent;
        }
        if (submitButton) {
            submitButton.disabled = normalizedContent.length === 0;
        }

        const currentLength = content.length;
        const ratio = Math.min(currentLength / maxLength, 1);
        const progress = `${ratio * 360}deg`;
        const remaining = Math.max(maxLength - currentLength, 0);

        composerGauge.style.setProperty("--gauge-progress", progress);
        composerGauge.setAttribute("aria-valuenow", String(currentLength));
        composerGaugeText.textContent = String(remaining);
    }
}

<<<<<<< Updated upstream
=======
function setupComposerModal() {
    const createPostButton = document.getElementById("createPostButton");
    const composerModalOverlay = document.getElementById(
        "composerModalOverlay",
    );
    const composerModalClose = document.getElementById("composerModalClose");
    const composerSection = document.getElementById("composerSection");
    const composeView = document.getElementById("composerComposeView");
    const composerTextarea = document.getElementById("postContent");
    const emojiPicker = composerSection?.querySelector(
        ".tweet-modal__emoji-picker",
    );
    const emojiButton = composerSection?.querySelector(
        "[data-testid='emojiButton']",
    );
    const boardMenu = document.getElementById("boardMenu");
    const audienceButton = document.getElementById("audienceButton");
    const locationModalOverlay = document.getElementById(
        "locationModalOverlay",
    );
    const tagView = document.getElementById("composerTagView");

    if (
        !createPostButton ||
        !composerModalOverlay ||
        !composerSection ||
        !composeView
    ) {
        return;
    }

    function openComposerModal({ focusEditor = true } = {}) {
        composerSection.hidden = false;
        composerModalOverlay.hidden = false;
        composerSection.classList.add("isExpanded");
        composerSection.classList.add("isModalOpen");
        composerSection.classList.remove("isTagViewOpen");
        if (composeView) {
            composeView.hidden = false;
        }
        if (tagView) {
            tagView.hidden = true;
        }
        if (focusEditor) {
            window.setTimeout(() => {
                composerTextarea?.focus();
            }, 0);
        }
    }

    function closeComposerModal() {
        composerModalOverlay.hidden = true;
        if (typeof composerSection.__closeTagPanel === "function") {
            composerSection.__closeTagPanel({ restoreFocus: false });
        } else if (tagView) {
            tagView.hidden = true;
        }
        if (composeView) {
            composeView.hidden = false;
        }
        composerSection.classList.remove("isTagViewOpen");
        composerSection.classList.remove("isModalOpen");
        if (emojiPicker) {
            emojiPicker.hidden = true;
        }
        if (emojiButton) {
            emojiButton.setAttribute("aria-expanded", "false");
        }
        if (boardMenu) {
            boardMenu.hidden = true;
        }
        if (audienceButton) {
            audienceButton.setAttribute("aria-expanded", "false");
        }
        if (locationModalOverlay) {
            locationModalOverlay.hidden = true;
        }
        createPostButton.focus();
    }

    createPostButton.addEventListener("click", (event) => {
        event.preventDefault();
        openComposerModal();
    });

    composerModalClose?.addEventListener("click", closeComposerModal);

    composerModalOverlay.addEventListener("click", (event) => {
        if (event.target === composerModalOverlay) {
            closeComposerModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || composerModalOverlay.hidden) {
            return;
        }

        if (emojiPicker && !emojiPicker.hidden) {
            return;
        }

        if (tagView && !tagView.hidden) {
            if (typeof composerSection.__closeTagPanel === "function") {
                composerSection.__closeTagPanel();
            } else {
                tagView.hidden = true;
            }
            return;
        }

        if (locationModalOverlay && !locationModalOverlay.hidden) {
            locationModalOverlay.hidden = true;
            return;
        }

        closeComposerModal();
    });
}

function setupBoardSelector() {
    const audienceButton = document.getElementById("audienceButton");
    const boardMenu = document.getElementById("boardMenu");
    const boardType = document.getElementById("boardType");
    const communityId = document.getElementById("communityId");
    const boardOptions = Array.from(
        document.querySelectorAll(".boardMenuOption"),
    );
    const communityOptions = Array.from(
        document.querySelectorAll(".communityMenuItem"),
    );

    if (!audienceButton || !boardMenu || boardOptions.length === 0) {
        return;
    }

    function closeBoardMenu() {
        boardMenu.hidden = true;
        audienceButton.setAttribute("aria-expanded", "false");
    }

    function openBoardMenu() {
        boardMenu.hidden = false;
        audienceButton.setAttribute("aria-expanded", "true");
    }

    function selectBoard(option) {
        const boardLabel = option.dataset.boardLabel || "일반";
        const boardValue = option.dataset.boardValue || "general";

        audienceButton.textContent = boardLabel;
        if (boardType) {
            boardType.value = boardValue;
        }
        if (communityId) {
            communityId.value = "";
        }

        boardOptions.forEach((item) => {
            const isSelected = item === option;
            item.classList.toggle("isSelected", isSelected);
            item.setAttribute("aria-selected", isSelected ? "true" : "false");
        });
        communityOptions.forEach((item) => {
            item.classList.remove("isSelected");
        });

        closeBoardMenu();
    }

    function selectCommunity(option) {
        const communityLabel = option.dataset.communityLabel || "커뮤니티";
        const communityValue = option.dataset.communityId || "";

        audienceButton.textContent = communityLabel;
        if (boardType) {
            boardType.value = "community";
        }
        if (communityId) {
            communityId.value = communityValue;
        }

        boardOptions.forEach((item) => {
            item.classList.remove("isSelected");
            item.setAttribute("aria-selected", "false");
        });
        communityOptions.forEach((item) => {
            item.classList.toggle("isSelected", item === option);
        });

        closeBoardMenu();
    }

    audienceButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (boardMenu.hidden) {
            openBoardMenu();
        } else {
            closeBoardMenu();
        }
    });

    boardOptions.forEach((option) => {
        option.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            selectBoard(option);
        });
    });

    communityOptions.forEach((option) => {
        option.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            selectCommunity(option);
        });
    });

    document.addEventListener("click", (event) => {
        if (
            !boardMenu.hidden &&
            !boardMenu.contains(event.target) &&
            event.target !== audienceButton
        ) {
            closeBoardMenu();
        }
    });
}

>>>>>>> Stashed changes
function setupComposerToolbar() {
    const composerSection = document.getElementById("composerSection");
    const composeView = document.getElementById("composerComposeView");
    const tagView = document.getElementById("composerTagView");
    const composerTextarea = document.getElementById("postContent");
    const mediaUploadButton = document.querySelector(
        "[data-testid='mediaUploadButton']",
    );
    const fileInput = document.querySelector("[data-testid='fileInput']");
    const emojiButton = document.querySelector("[data-testid='emojiButton']");
    const emojiPicker = document.querySelector(".tweet-modal__emoji-picker");
    const emojiSearchInput = document.querySelector(
        "[data-testid='emojiSearchInput']",
    );
    const emojiTabs = document.querySelectorAll(".tweet-modal__emoji-tab");
    const emojiContent = document.querySelector(
        "[data-testid='emojiPickerContent']",
    );
    const formatButtons = document.querySelectorAll("[data-format]");
    const geoButton = document.querySelector("[data-testid='geoButton']");
    const locationButton = document.getElementById("composerLocation");
    const attachmentPreview = document.getElementById(
        "composerAttachmentPreview",
    );
    const attachmentList = document.getElementById("composerAttachmentList");
    const locationModalOverlay = document.getElementById(
        "locationModalOverlay",
    );
    const locationModalClose = document.getElementById("locationModalClose");
    const locationModalDelete = document.getElementById("locationModalDelete");
    const locationModalApply = document.getElementById("locationModalApply");
    const locationModalSearchInput = document.getElementById(
        "locationModalSearchInput",
    );
    const locationModalList = document.getElementById("locationModalList");
    const userTagTrigger = document.querySelector("[data-user-tag-trigger]");
    const userTagLabel = document.querySelector("[data-user-tag-label]");
    const tagModalClose = document.getElementById("tagModalClose");
    const tagModalComplete = document.getElementById("tagModalComplete");
    const tagSearchForm = document.getElementById("tagSearchForm");
    const tagSearchInput = document.getElementById("tagSearchInput");
    const tagChipList = document.getElementById("tagChipList");
    const tagResults = document.getElementById("tagResults");
    const maxAttachments = 4;
    const availableLocations = [
        "대한민국 서초구",
        "대한민국 강남구",
        "대한민국 송파구",
        "대한민국 광진구",
        "대한민국 동작구",
        "대한민국 중구",
        "대한민국 과천시",
        "대한민국 관악구",
        "대한민국 용산구",
        "대한민국 마포구",
    ];
    const attachmentUrls = [];
    let pendingLocation = locationButton?.textContent.trim() || "";
    let activeEmojiCategory = "recent";
<<<<<<< Updated upstream
=======
    let savedComposerSelection = null;
    let pendingComposerFormats = new Set();
    let attachedComposerFiles = [];
    let pendingAttachmentEditIndex = null;
    let selectedTaggedUsers = [];
    let pendingTaggedUsers = [];
    let currentTagResults = [];
>>>>>>> Stashed changes

    if (!composerSection || !composerTextarea) {
        return;
    }

    function getRecentEmojis() {
        try {
            const saved = window.localStorage.getItem(composerEmojiRecentsKey);
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveRecentEmoji(emoji) {
        const next = getRecentEmojis().filter((item) => item !== emoji);
        next.unshift(emoji);

        try {
            window.localStorage.setItem(
                composerEmojiRecentsKey,
                JSON.stringify(next.slice(0, composerMaxRecentEmojis)),
            );
        } catch {
            return;
        }
    }

    function getEmojiSearchTerm() {
        return emojiSearchInput?.value.trim().toLowerCase() ?? "";
    }

    function getEmojiList(category) {
        if (category === "recent") {
            return getRecentEmojis();
        }

        return composerEmojiCategoryData[category] ?? [];
    }

    function renderEmojiTabs() {
        emojiTabs.forEach((tab) => {
            const category = tab.getAttribute("data-emoji-category");
            const meta = category ? composerEmojiCategoryMeta[category] : null;
            const isActive = category === activeEmojiCategory;

            tab.classList.toggle("tweet-modal__emoji-tab--active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
            if (meta) {
                tab.innerHTML = `<span class="tweet-modal__emoji-tab-icon">${meta.icon}</span>`;
            }
        });
    }

    function renderEmojiPicker() {
        if (!emojiContent) {
            return;
        }

        const searchTerm = getEmojiSearchTerm();
        const categories = searchTerm
            ? Object.keys(composerEmojiCategoryData)
            : [
                  activeEmojiCategory === "recent"
                      ? "recent"
                      : activeEmojiCategory,
              ];

        const sections = categories
            .map((category) => {
                const source = getEmojiList(category);
                const emojis = searchTerm
                    ? source.filter(
                          (emoji) =>
                              emoji.includes(searchTerm) ||
                              category.includes(searchTerm),
                      )
                    : source;

                if (emojis.length === 0) {
                    return "";
                }

                const title =
                    composerEmojiCategoryMeta[category]?.label ?? category;
                return `
                    <section class="tweet-modal__emoji-section">
                        <div class="tweet-modal__emoji-section-header">
                            <h3 class="tweet-modal__emoji-section-title">${title}</h3>
                        </div>
                        <div class="tweet-modal__emoji-grid">
                            ${emojis
                                .map(
                                    (emoji) => `
                                        <button type="button" class="tweet-modal__emoji-option" data-emoji="${emoji}">${emoji}</button>
                                    `,
                                )
                                .join("")}
                        </div>
                    </section>
                `;
            })
            .join("");

        emojiContent.innerHTML =
            sections ||
            '<p class="tweet-modal__emoji-empty">일치하는 이모티콘이 없습니다.</p>';
        renderEmojiTabs();
    }

    function openEmojiPicker() {
        if (!emojiPicker || !emojiButton) {
            return;
        }

        renderEmojiPicker();
        emojiPicker.hidden = false;
        emojiButton.setAttribute("aria-expanded", "true");
    }

    function closeEmojiPicker() {
        if (!emojiPicker || !emojiButton) {
            return;
        }

        emojiPicker.hidden = true;
        emojiButton.setAttribute("aria-expanded", "false");
    }

    function insertEmojiAtCaret(emoji) {
        composerTextarea.focus();
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            composerTextarea.textContent += emoji;
            placeCaretAtEnd(composerTextarea);
            composerTextarea.dispatchEvent(
                new Event("input", { bubbles: true }),
            );
            return;
        }

        const range = selection.getRangeAt(0);
        if (!composerTextarea.contains(range.commonAncestorContainer)) {
            placeCaretAtEnd(composerTextarea);
        }

        const safeSelection = window.getSelection();
        if (!safeSelection || safeSelection.rangeCount === 0) {
            return;
        }

        const nextRange = safeSelection.getRangeAt(0);
        nextRange.deleteContents();
        nextRange.insertNode(document.createTextNode(emoji));
        nextRange.collapse(false);
        safeSelection.removeAllRanges();
        safeSelection.addRange(nextRange);
        composerTextarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function syncFormatButtons() {
        formatButtons.forEach((button) => {
            const format = button.getAttribute("data-format");
            if (!format) {
                return;
            }

            let isActive = false;
            try {
                isActive = document.queryCommandState(format);
            } catch {
                isActive = false;
            }

            button.classList.toggle("tweet-modal__tool-btn--active", isActive);
        });
    }

<<<<<<< Updated upstream
=======
    function isComposerImageSet() {
        return (
            attachedComposerFiles.length > 0 &&
            attachedComposerFiles.every((file) =>
                file.type.startsWith("image/"),
            )
        );
    }

    function cloneTaggedUsers(users) {
        return users.map((user) => ({ ...user }));
    }

    function getCurrentPageTagUsers() {
        const seenHandles = new Set();
        const users = [];
        const accountName = document
            .getElementById("accountName")
            ?.textContent.trim();
        const accountHandle = document
            .getElementById("accountHandle")
            ?.textContent.trim();

        if (accountName && accountHandle) {
            seenHandles.add(accountHandle);
            users.push({
                id: accountHandle.replace("@", "") || "current-user",
                name: accountName,
                handle: accountHandle,
                avatar: "",
            });
        }

        document.querySelectorAll(".postCard").forEach((postCard, index) => {
            const name = postCard
                .querySelector(".postName")
                ?.textContent.trim();
            const handle = postCard
                .querySelector(".postHandle")
                ?.textContent.trim();
            const avatar =
                postCard
                    .querySelector(".postAvatarImage")
                    ?.getAttribute("src") ?? "";

            if (!name || !handle || seenHandles.has(handle)) {
                return;
            }

            seenHandles.add(handle);
            users.push({
                id: `${handle.replace("@", "") || "user"}-${index}`,
                name,
                handle,
                avatar,
            });
        });

        return users;
    }

    function isTagModalOpen() {
        return Boolean(tagView && !tagView.hidden);
    }

    function getTagSearchTerm() {
        return tagSearchInput?.value.trim() ?? "";
    }

    function getTaggedUserSummary(users) {
        if (users.length === 0) {
            return "사용자 태그하기";
        }

        return users.map((user) => user.name).join(", ");
    }

    function syncUserTagTrigger() {
        const canTagUsers = isComposerImageSet();
        const label = getTaggedUserSummary(selectedTaggedUsers);

        if (userTagTrigger) {
            userTagTrigger.hidden = !canTagUsers;
            userTagTrigger.disabled = !canTagUsers;
            userTagTrigger.setAttribute("aria-label", label);
        }

        if (userTagLabel) {
            userTagLabel.textContent = label;
        }

        if (!canTagUsers) {
            selectedTaggedUsers = [];
            pendingTaggedUsers = [];
            currentTagResults = [];
            if (isTagModalOpen()) {
                closeTagPanel({ restoreFocus: false });
            }
        }
    }

    function renderTagChipList() {
        if (!tagChipList) {
            return;
        }

        if (pendingTaggedUsers.length === 0) {
            tagChipList.innerHTML = "";
            return;
        }

        tagChipList.innerHTML = pendingTaggedUsers
            .map((user) => {
                const avatarMarkup = user.avatar
                    ? `<span class="tweet-modal__tag-chip-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" /></span>`
                    : '<span class="tweet-modal__tag-chip-avatar"></span>';

                return `
                    <button type="button" class="tweet-modal__tag-chip" data-tag-remove-id="${escapeHtml(user.id)}">
                        ${avatarMarkup}
                        <span class="tweet-modal__tag-chip-name">${escapeHtml(user.name)}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__tag-chip-icon">
                            <g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                        </svg>
                    </button>
                `;
            })
            .join("");
    }

    function getFilteredTagUsers(query) {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) {
            return [];
        }

        return getCurrentPageTagUsers()
            .filter((user) =>
                `${user.name} ${user.handle}`
                    .toLowerCase()
                    .includes(normalizedQuery),
            )
            .slice(0, 6);
    }

    function renderTagResults(users) {
        if (!tagResults || !tagSearchInput) {
            return;
        }

        currentTagResults = users;
        const hasQuery = getTagSearchTerm().length > 0;

        if (!hasQuery) {
            tagSearchInput.setAttribute("aria-expanded", "false");
            tagSearchInput.removeAttribute("aria-controls");
            tagResults.removeAttribute("role");
            tagResults.removeAttribute("id");
            tagResults.innerHTML = "";
            return;
        }

        tagSearchInput.setAttribute("aria-expanded", "true");
        tagSearchInput.setAttribute("aria-controls", "main-tag-results");
        tagResults.setAttribute("role", "listbox");
        tagResults.id = "main-tag-results";

        if (users.length === 0) {
            tagResults.innerHTML =
                '<p class="tweet-modal__tag-empty">일치하는 사용자를 찾지 못했습니다.</p>';
            return;
        }

        tagResults.innerHTML = users
            .map((user) => {
                const isSelected = pendingTaggedUsers.some(
                    (entry) => entry.id === user.id,
                );
                const subtitle = isSelected
                    ? `${user.handle} 이미 태그됨`
                    : user.handle;
                const avatarMarkup = user.avatar
                    ? `<span class="tweet-modal__tag-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" /></span>`
                    : '<span class="tweet-modal__tag-avatar"></span>';

                return `
                    <div role="option" class="tweet-modal__tag-option" data-testid="typeaheadResult">
                        <div role="checkbox" aria-checked="${String(isSelected)}" aria-disabled="${String(isSelected)}" class="tweet-modal__tag-checkbox">
                            <button type="button" class="tweet-modal__tag-user" data-tag-user-id="${escapeHtml(user.id)}" ${isSelected ? "disabled" : ""}>
                                ${avatarMarkup}
                                <span class="tweet-modal__tag-user-body">
                                    <span class="tweet-modal__tag-user-name">${escapeHtml(user.name)}</span>
                                    <span class="tweet-modal__tag-user-handle">${escapeHtml(subtitle)}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                `;
            })
            .join("");
    }

    function runTagSearch() {
        const query = getTagSearchTerm();
        if (!query) {
            renderTagResults([]);
            return;
        }

        renderTagResults(getFilteredTagUsers(query));
    }

    function openTagPanel() {
        if (!composeView || !tagView || !isComposerImageSet()) {
            return;
        }

        closeEmojiPicker();
        pendingTaggedUsers = cloneTaggedUsers(selectedTaggedUsers);
        composerSection.classList.add("isTagViewOpen");
        composeView.hidden = true;
        tagView.hidden = false;

        if (tagSearchInput) {
            tagSearchInput.value = "";
        }

        renderTagChipList();
        renderTagResults([]);

        window.requestAnimationFrame(() => {
            tagSearchInput?.focus();
        });
    }

    function closeTagPanel({ restoreFocus = true } = {}) {
        if (!composeView || !tagView || tagView.hidden) {
            return;
        }

        composerSection.classList.remove("isTagViewOpen");
        tagView.hidden = true;
        composeView.hidden = false;
        pendingTaggedUsers = cloneTaggedUsers(selectedTaggedUsers);

        if (tagSearchInput) {
            tagSearchInput.value = "";
        }

        renderTagChipList();
        renderTagResults([]);

        if (restoreFocus) {
            window.requestAnimationFrame(() => {
                if (userTagTrigger && !userTagTrigger.hidden) {
                    userTagTrigger.focus();
                    return;
                }

                composerTextarea.focus();
            });
        }
    }

    function applyPendingTaggedUsers() {
        selectedTaggedUsers = cloneTaggedUsers(pendingTaggedUsers);
        syncUserTagTrigger();
    }

    composerSection.__closeTagPanel = closeTagPanel;

    emojiButton?.addEventListener("mousedown", (event) => {
        event.preventDefault();
    });

>>>>>>> Stashed changes
    emojiButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (emojiPicker?.hidden) {
            openEmojiPicker();
            return;
        }

        closeEmojiPicker();
    });

    emojiSearchInput?.addEventListener("input", renderEmojiPicker);

    emojiTabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const category = tab.getAttribute("data-emoji-category");
            if (!category) {
                return;
            }

            activeEmojiCategory = category;
            renderEmojiPicker();
        });
    });

    emojiContent?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const option = event.target.closest(".tweet-modal__emoji-option");
        if (!option) {
            return;
        }

        const emoji = option.getAttribute("data-emoji");
        if (!emoji) {
            return;
        }

        insertEmojiAtCaret(emoji);
        saveRecentEmoji(emoji);
        closeEmojiPicker();
    });

    formatButtons.forEach((button) => {
        button.addEventListener("mousedown", (event) => {
            event.preventDefault();
        });

        button.addEventListener("click", (event) => {
            event.preventDefault();
            const format = button.getAttribute("data-format");
            if (!format) {
                return;
            }

            composerTextarea.focus();
            try {
                document.execCommand(format, false);
            } catch {
                return;
            }

            composerTextarea.dispatchEvent(
                new Event("input", { bubbles: true }),
            );
            syncFormatButtons();
        });
    });

    composerTextarea.addEventListener("keyup", syncFormatButtons);
    composerTextarea.addEventListener("mouseup", syncFormatButtons);
    composerTextarea.addEventListener("focus", syncFormatButtons);

    geoButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLocationModal();
    });

    userTagTrigger?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openTagPanel();
    });

    tagModalClose?.addEventListener("click", () => {
        closeTagPanel();
    });

    tagModalComplete?.addEventListener("click", () => {
        applyPendingTaggedUsers();
        closeTagPanel();
    });

    tagSearchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        runTagSearch();
    });

    tagSearchInput?.addEventListener("input", () => {
        runTagSearch();
    });

    tagChipList?.addEventListener("click", (event) => {
        const chipButton = event.target.closest("[data-tag-remove-id]");
        if (!chipButton) {
            return;
        }

        const userId = chipButton.getAttribute("data-tag-remove-id");
        pendingTaggedUsers = pendingTaggedUsers.filter(
            (user) => user.id !== userId,
        );
        renderTagChipList();
        runTagSearch();
    });

    tagResults?.addEventListener("click", (event) => {
        const userButton = event.target.closest("[data-tag-user-id]");
        if (!userButton) {
            return;
        }

        const userId = userButton.getAttribute("data-tag-user-id");
        const user = currentTagResults.find((entry) => entry.id === userId);
        if (!user || pendingTaggedUsers.some((entry) => entry.id === user.id)) {
            return;
        }

        pendingTaggedUsers = [...pendingTaggedUsers, { ...user }];
        renderTagChipList();
        runTagSearch();
    });

    mediaUploadButton?.addEventListener("click", (event) => {
        event.preventDefault();
        if ((fileInput?.files?.length ?? 0) >= maxAttachments) {
            return;
        }
        fileInput?.click();
    });

    fileInput?.addEventListener("change", () => {
        const files = Array.from(fileInput.files ?? []);
        renderAttachments(files.slice(0, maxAttachments));
    });

    attachmentList?.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-attachment]");
        if (!removeButton) {
<<<<<<< Updated upstream
=======
            const editButton = event.target.closest(
                "[data-attachment-edit-index]",
            );
            if (!editButton || !fileInput) {
                return;
            }

            pendingAttachmentEditIndex = Number(
                editButton.getAttribute("data-attachment-edit-index"),
            );
            fileInput.value = "";
            fileInput.click();
>>>>>>> Stashed changes
            return;
        }

        const index = Number(
            removeButton.getAttribute("data-remove-attachment"),
        );
        const currentFiles = Array.from(fileInput?.files ?? []);
        currentFiles.splice(index, 1);
        renderAttachments(currentFiles);
    });

    locationButton?.addEventListener("click", (event) => {
        event.preventDefault();
        openLocationModal();
    });

    locationModalClose?.addEventListener("click", closeLocationModal);
    locationModalOverlay?.addEventListener("click", (event) => {
        if (event.target === locationModalOverlay) {
            closeLocationModal();
        }
    });
    locationModalDelete?.addEventListener("click", () => {
        pendingLocation = "";
        applyLocation();
        closeLocationModal();
    });
    locationModalApply?.addEventListener("click", () => {
        applyLocation();
        closeLocationModal();
    });
    locationModalSearchInput?.addEventListener("input", renderLocationList);
    locationModalList?.addEventListener("click", (event) => {
        const item = event.target.closest("[data-location-value]");
        if (!item) {
            return;
        }

        pendingLocation = item.getAttribute("data-location-value") ?? "";
        renderLocationList();
    });

    document.addEventListener("click", (event) => {
        if (
            emojiPicker &&
            !emojiPicker.hidden &&
            !emojiPicker.contains(event.target) &&
            !emojiButton?.contains(event.target)
        ) {
            closeEmojiPicker();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isTagModalOpen()) {
            closeTagPanel();
        }
    });

    syncUserTagTrigger();
    renderEmojiPicker();
    syncFormatButtons();

    function renderAttachments(files) {
        while (attachmentUrls.length > 0) {
            const url = attachmentUrls.pop();
            if (url) {
                URL.revokeObjectURL(url);
            }
        }

        if (!attachmentPreview || !attachmentList || !fileInput) {
            return;
        }

        if (files.length === 0) {
            attachmentPreview.hidden = true;
            attachmentList.innerHTML = "";
            fileInput.value = "";
            selectedTaggedUsers = [];
            pendingTaggedUsers = [];
            currentTagResults = [];
            syncUserTagTrigger();
            if (mediaUploadButton) {
                mediaUploadButton.disabled = false;
            }
            return;
        }

        const limitedFiles = files.slice(0, maxAttachments);
        const dataTransfer = new DataTransfer();
        limitedFiles.forEach((file) => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        if (mediaUploadButton) {
            mediaUploadButton.disabled = limitedFiles.length >= maxAttachments;
        }

        attachmentPreview.hidden = false;
<<<<<<< Updated upstream
=======
        const objectUrls = limitedFiles.map((file) => {
            const objectUrl = URL.createObjectURL(file);
            attachmentUrls.push(objectUrl);
            return objectUrl;
        });

        if (limitedFiles.every((file) => file.type.startsWith("image/"))) {
            attachmentList.innerHTML = renderAttachmentImageGrid(objectUrls);
            syncUserTagTrigger();
            return;
        }

        if (
            limitedFiles.length === 1 &&
            limitedFiles[0].type.startsWith("video/")
        ) {
            attachmentList.innerHTML = renderAttachmentVideo(
                limitedFiles[0],
                objectUrls[0],
            );
            syncUserTagTrigger();
            return;
        }

>>>>>>> Stashed changes
        attachmentList.innerHTML = limitedFiles
            .map((file, index) => {
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");
                const objectUrl = URL.createObjectURL(file);
                attachmentUrls.push(objectUrl);

                let body = `<div class="composerAttachmentFile">${file.name}</div>`;
                if (isImage) {
                    body = `<img class="composerAttachmentThumb" src="${objectUrl}" alt="${file.name}">`;
                } else if (isVideo) {
                    body = `<video class="composerAttachmentThumb" src="${objectUrl}" muted playsinline controls></video>`;
                }

                return `
                    <div class="composerAttachmentItem">
                        ${body}
                        <button type="button" class="composerAttachmentRemove" data-remove-attachment="${index}" aria-label="첨부 삭제">×</button>
                    </div>
                `;
            })
            .join("");
        syncUserTagTrigger();
    }

    function openLocationModal() {
        if (!locationModalOverlay) {
            return;
        }

        pendingLocation = locationButton?.textContent.trim() || "";
        locationModalOverlay.hidden = false;
        renderLocationList();
        locationModalSearchInput?.focus();
    }

    function closeLocationModal() {
        if (!locationModalOverlay) {
            return;
        }

        locationModalOverlay.hidden = true;
        if (locationModalSearchInput) {
            locationModalSearchInput.value = "";
        }
    }

    function renderLocationList() {
        if (!locationModalList || !locationModalApply || !locationModalDelete) {
            return;
        }

        const keyword = locationModalSearchInput?.value.trim() ?? "";
        const filtered = keyword
            ? availableLocations.filter((location) =>
                  location.includes(keyword),
              )
            : availableLocations;

        locationModalApply.disabled = pendingLocation === "";
        locationModalDelete.hidden =
            (locationButton?.textContent.trim() || "") === "";

        if (filtered.length === 0) {
            locationModalList.innerHTML =
                '<p class="tweet-modal__emoji-empty">일치하는 위치를 찾지 못했습니다.</p>';
            return;
        }

        locationModalList.innerHTML = filtered
            .map((location) => {
                const selected = pendingLocation === location;
                return `
                    <button type="button" class="locationModalItem" data-location-value="${location}">
                        <span>${location}</span>
                        <span class="locationModalCheck">${selected ? "✓" : ""}</span>
                    </button>
                `;
            })
            .join("");
    }

    function applyLocation() {
        if (!locationButton || !geoButton) {
            return;
        }

        locationButton.textContent = pendingLocation || "위치 추가";
        geoButton.classList.toggle(
            "tweet-modal__tool-btn--active",
            pendingLocation !== "",
        );
    }
}

function placeCaretAtEnd(element) {
    const selection = window.getSelection();
    if (!selection) {
        return;
    }

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

function setupSearchForm() {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchPanel = document.getElementById("searchPanel");
    const searchPanelEmpty = document.getElementById("searchPanelEmpty");
    const searchResults = document.getElementById("searchResults");
    const searchResultLabel = document.getElementById("searchResultLabel");

    if (!searchForm || !searchInput || !searchPanel) {
        return;
    }

    function openSearchPanel() {
        searchForm.classList.add("isFocused");
        searchPanel.hidden = false;
    }

    function closeSearchPanel() {
        searchForm.classList.remove("isFocused");
        searchPanel.hidden = true;
    }

    function updateSearchPanel() {
        const keyword = searchInput.value.trim();

        if (!searchPanelEmpty || !searchResults || !searchResultLabel) {
            return;
        }

        if (keyword === "") {
            searchPanelEmpty.hidden = false;
            searchResults.hidden = true;
            return;
        }

        searchPanelEmpty.hidden = true;
        searchResults.hidden = false;
        searchResultLabel.textContent = `#${keyword}`;
    }

    searchInput.addEventListener("focus", openSearchPanel);
    searchInput.addEventListener("click", openSearchPanel);
    searchInput.addEventListener("input", updateSearchPanel);

    document.addEventListener("click", (event) => {
        if (searchForm.contains(event.target)) {
            return;
        }

        closeSearchPanel();
    });

    updateSearchPanel();
}

function setupTimelineTabs() {
    const tabFeed = document.getElementById("tabFeed");
    const tabFriends = document.getElementById("tabFriends");
    const composerSection = document.getElementById("composerSection");
    const feedSection = document.getElementById("feedSection");
    const friendsSection = document.getElementById("friendsSection");

    if (
        !tabFeed ||
        !tabFriends ||
        !composerSection ||
        !feedSection ||
        !friendsSection
    ) {
        return;
    }

    function showFeedTab() {
        tabFeed.classList.add("isActive");
        tabFeed.setAttribute("aria-current", "page");
        tabFriends.classList.remove("isActive");
        tabFriends.removeAttribute("aria-current");
        composerSection.hidden = false;
        feedSection.hidden = false;
        friendsSection.hidden = true;
    }

    function showFriendsTab() {
        tabFriends.classList.add("isActive");
        tabFriends.setAttribute("aria-current", "page");
        tabFeed.classList.remove("isActive");
        tabFeed.removeAttribute("aria-current");
        composerSection.hidden = true;
        feedSection.hidden = true;
        friendsSection.hidden = false;
    }

    tabFeed.addEventListener("click", showFeedTab);
    tabFriends.addEventListener("click", showFriendsTab);
}

function setupConnectButtons() {
    const modal = document.getElementById("disconnectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalConfirm = document.getElementById("modalConfirm");
    const modalCancel = document.getElementById("modalCancel");
    let pendingButton = null;

    function openModal(button) {
        pendingButton = button;

        let handle = "";
        const card = button.closest("[data-handle]");
        if (card) {
            handle = card.dataset.handle;
        } else {
            const handleElement = button
                .closest(".trend-item")
                ?.querySelector(".sidebar-user-handle");
            if (handleElement) {
                handle = handleElement.textContent.trim();
            }
        }

        if (modalTitle) {
            modalTitle.textContent = handle
                ? `${handle} 님과의 연결을 끊으시겠습니까?`
                : "연결을 끊으시겠습니까?";
        }

        modal?.classList.add("active");
    }

    function closeModal() {
        modal?.classList.remove("active");
        pendingButton = null;
    }

    modalConfirm?.addEventListener("click", () => {
        if (pendingButton) {
            pendingButton.classList.remove("connected");
            pendingButton.classList.add("default");
            pendingButton.textContent = "Connect";
            pendingButton.style.borderColor = "";
            pendingButton.style.color = "";
            pendingButton.style.background = "";
        }
        closeModal();
    });

    modalCancel?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("click", (event) => {
        const button = event.target.closest(".connect-btn, .connect-btn-sm");
        if (!button) {
            return;
        }

        if (button.classList.contains("default")) {
            button.classList.remove("default");
            button.classList.add("connected");
            button.textContent = "Connected";
            return;
        }

        if (button.classList.contains("connected")) {
            openModal(button);
        }
    });

    document.addEventListener("mouseover", (event) => {
        const button = event.target.closest(
            ".connect-btn.connected, .connect-btn-sm.connected",
        );
        if (!button) {
            return;
        }

        button.textContent = "Disconnect";
        button.style.borderColor = "#f4212e";
        button.style.color = "#f4212e";
        button.style.background = "rgba(244,33,46,.1)";
    });

    document.addEventListener("mouseout", (event) => {
        const button = event.target.closest(
            ".connect-btn.connected, .connect-btn-sm.connected",
        );
        if (!button) {
            return;
        }

        button.textContent = "Connected";
        button.style.borderColor = "#cfd9de";
        button.style.color = "#0f1419";
        button.style.background = "transparent";
    });
}

function setupTweetActions() {
    document.querySelectorAll(".tweet-action-btn--like").forEach((button) => {
        const countElement = button.querySelector(".tweet-action-count");
        const path = button.querySelector("path");
        let baseCount = Number.parseInt(countElement?.textContent || "0", 10);
        if (Number.isNaN(baseCount)) {
            baseCount = 0;
        }

        button.addEventListener("click", (event) => {
            event.preventDefault();
            const isActive = button.classList.toggle("active");

            if (countElement) {
                countElement.textContent = String(
                    isActive ? baseCount + 1 : baseCount,
                );
            }
            if (path) {
                path.setAttribute(
                    "d",
                    isActive
                        ? path.dataset.pathActive || path.getAttribute("d")
                        : path.dataset.pathInactive || path.getAttribute("d"),
                );
            }
        });
    });

    document
        .querySelectorAll(".tweet-action-btn--bookmark")
        .forEach((button) => {
            const path = button.querySelector("path");
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const isActive = button.classList.toggle("active");
                if (path) {
                    path.setAttribute(
                        "d",
                        isActive
                            ? path.dataset.pathActive || path.getAttribute("d")
                            : path.dataset.pathInactive ||
                                  path.getAttribute("d"),
                    );
                }
            });
        });

    document.querySelectorAll(".tweet-action-btn--share").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });

    document
        .querySelectorAll(".tweet-action-btn[data-testid='reply']")
        .forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
            });
        });
}

function setupExpandablePostText() {
    const maxLength = 200;

    document.querySelectorAll(".postText").forEach((element, index) => {
        const fullText = element.textContent.replace(/\s+/g, " ").trim();
        if (fullText.length <= maxLength) {
            return;
        }

        const truncatedText = `${fullText.slice(0, maxLength).trimEnd()}...`;
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "postTextToggle";
        toggleButton.id = `${element.id || `postText${index}`}_toggle`;
        toggleButton.textContent = "더보기";
        const textSpan = document.createElement("span");
        textSpan.className = "postTextContent";
        textSpan.textContent = truncatedText;

        element.dataset.fullText = fullText;
        element.textContent = "";
        element.append(textSpan, toggleButton);

        toggleButton.addEventListener("click", () => {
            textSpan.textContent = element.dataset.fullText || fullText;
            toggleButton.remove();
        });
    });
}

function setupMediaPreview() {
    const mediaPreviewOverlay = document.getElementById("mediaPreviewOverlay");
    const mediaPreviewImage = document.getElementById("mediaPreviewImage");
    const mediaPreviewClose = document.getElementById("mediaPreviewClose");

    if (!mediaPreviewOverlay || !mediaPreviewImage) {
        return;
    }

    function closePreview() {
        mediaPreviewOverlay.hidden = true;
        mediaPreviewImage.removeAttribute("src");
    }

    document.querySelectorAll("img.postMediaImage").forEach((image) => {
        image.addEventListener("click", () => {
            const imageSrc = image.getAttribute("src");
            if (!imageSrc) {
                return;
            }

            mediaPreviewImage.src = imageSrc;
            mediaPreviewImage.alt = image.alt || "게시물 이미지 미리보기";
            mediaPreviewOverlay.hidden = false;
        });
    });

    mediaPreviewClose?.addEventListener("click", closePreview);

    mediaPreviewOverlay.addEventListener("click", (event) => {
        if (event.target === mediaPreviewOverlay) {
            closePreview();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !mediaPreviewOverlay.hidden) {
            closePreview();
        }
    });
}
