window.addEventListener("DOMContentLoaded", function () {
    function formatCount(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        }

        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
        }

        return String(num);
    }

    function showToast(message, extraClass) {
        const existing = document.querySelector(".toast");

        if (existing) {
            existing.remove();
        }

        const toast = document.createElement("div");
        toast.className = "toast" + (extraClass ? " " + extraClass : "");
        toast.textContent = message;
        document.body.appendChild(toast);

        window.setTimeout(function () {
            toast.remove();
        }, 2500);
    }

    function showShareToast(message) {
        const existing = document.querySelector(".share-toast");

        if (existing) {
            existing.remove();
        }

        const toast = document.createElement("div");
        toast.className = "share-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.textContent = message;
        document.body.appendChild(toast);

        window.setTimeout(function () {
            toast.remove();
        }, 3000);
    }

    function closeSortMenu() {
        if (!sortButton || !sortDropdown) {
            return;
        }

        sortDropdown.classList.remove("show");
        sortButton.setAttribute("aria-expanded", "false");
    }

    function setBookmarkButtonState(button, isActive) {
        const path = button?.querySelector("path");

        if (!button || !path) {
            return;
        }

        const activePath = path.dataset.pathActive || "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z";
        const inactivePath = path.dataset.pathInactive || "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z";

        button.classList.toggle("active", isActive);
        path.setAttribute("d", isActive ? activePath : inactivePath);
    }

    function getSharePostMeta(button) {
        const actionBar = button.closest(".post-detail-actions");
        const bookmarkButton = actionBar ? actionBar.querySelector(".tweet-action-btn-bookmark") : null;

        return {
            permalink: window.location.href,
            bookmarkButton: bookmarkButton,
        };
    }

    function closeShareDropdown() {
        if (!activeShareDropdown) {
            return;
        }

        activeShareDropdown.remove();
        activeShareDropdown = null;

        if (activeShareButton) {
            activeShareButton.setAttribute("aria-expanded", "false");
            activeShareButton = null;
        }
    }

    function closeShareModal() {
        if (!activeShareModal) {
            return;
        }

        activeShareModal.remove();
        activeShareModal = null;
    }

    function copyShareLink(button) {
        const permalink = getSharePostMeta(button).permalink;
        closeShareDropdown();

        if (!navigator.clipboard?.writeText) {
            showShareToast("링크를 복사하지 못했습니다");
            return;
        }

        navigator.clipboard.writeText(permalink).then(function () {
            showShareToast("클립보드로 복사함");
        }).catch(function () {
            showShareToast("링크를 복사하지 못했습니다");
        });
    }

    function openShareChatModal(button) {
        closeShareDropdown();
        closeShareModal();

        const modal = document.createElement("div");
        modal.className = "share-sheet";
        modal.innerHTML = '<div class="share-sheet__backdrop" data-share-close="true"></div><div class="share-sheet__card" role="dialog" aria-modal="true" aria-labelledby="share-chat-title"><div class="share-sheet__header"><button type="button" class="share-sheet__icon-btn" data-share-close="true" aria-label="돌아가기"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg></button><h2 id="share-chat-title" class="share-sheet__title">공유하기</h2><span class="share-sheet__header-spacer"></span></div><div class="share-sheet__search"><input type="text" class="share-sheet__search-input" placeholder="검색" aria-label="검색"></div><div class="share-sheet__list"><button type="button" class="share-sheet__user" data-share-user-id="tradehub-kr"><span class="share-sheet__user-avatar"><img src="https://pbs.twimg.com/profile_images/2029361845321207808/LltLeaLS_bigger.jpg" alt="TradeHub KR"></span><span class="share-sheet__user-body"><span class="share-sheet__user-name">TradeHub KR</span><span class="share-sheet__user-handle">@TradeHub_KR</span></span></button></div></div>';
        modal.addEventListener("click", function (event) {
            if (
                event.target.closest("[data-share-close='true']") ||
                event.target.classList.contains("share-sheet__backdrop") ||
                event.target.closest(".share-sheet__user")
            ) {
                event.preventDefault();
                closeShareModal();
            }
        });

        document.body.appendChild(modal);
        activeShareModal = modal;
    }

    function openShareBookmarkModal(button) {
        const bookmarkButton = getSharePostMeta(button).bookmarkButton;
        const isBookmarked = bookmarkButton?.classList.contains("active") ?? false;
        closeShareDropdown();
        closeShareModal();

        const modal = document.createElement("div");
        modal.className = "share-sheet";
        modal.innerHTML = '<div class="share-sheet__backdrop" data-share-close="true"></div><div class="share-sheet__card share-sheet__card--bookmark" role="dialog" aria-modal="true" aria-labelledby="share-bookmark-title"><div class="share-sheet__header"><button type="button" class="share-sheet__icon-btn" data-share-close="true" aria-label="닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button><h2 id="share-bookmark-title" class="share-sheet__title">폴더에 추가</h2><span class="share-sheet__header-spacer"></span></div><button type="button" class="share-sheet__create-folder">새 북마크 폴더 만들기</button><button type="button" class="share-sheet__folder" data-share-folder="all-bookmarks"><span class="share-sheet__folder-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M2.998 8.5c0-1.38 1.119-2.5 2.5-2.5h9c1.381 0 2.5 1.12 2.5 2.5v14.12l-7-3.5-7 3.5V8.5zM18.5 2H8.998v2H18.5c.275 0 .5.224.5.5V15l2 1.4V4.5c0-1.38-1.119-2.5-2.5-2.5z"></path></g></svg></span><span class="share-sheet__folder-name">모든 북마크</span><span class="share-sheet__folder-check' + (isBookmarked ? ' share-sheet__folder-check--active' : '') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg></span></button></div>';
        modal.addEventListener("click", function (event) {
            if (
                event.target.closest("[data-share-close='true']") ||
                event.target.classList.contains("share-sheet__backdrop")
            ) {
                event.preventDefault();
                closeShareModal();
                return;
            }

            if (event.target.closest(".share-sheet__create-folder")) {
                event.preventDefault();
                closeShareModal();
                return;
            }

            if (event.target.closest("[data-share-folder='all-bookmarks']")) {
                event.preventDefault();
                setBookmarkButtonState(bookmarkButton, !isBookmarked);
                closeShareModal();
            }
        });

        document.body.appendChild(modal);
        activeShareModal = modal;
    }

    function openShareDropdown(button) {
        if (!layersRoot) {
            return;
        }

        closeShareDropdown();
        const rect = button.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 8;
        const right = Math.max(16, window.innerWidth - rect.right);
        const layer = document.createElement("div");
        layer.className = "layers-dropdown-container";
        layer.innerHTML = '<div class="layers-overlay"></div><div class="layers-dropdown-inner"><div role="menu" class="dropdown-menu" style="top: ' + top + 'px; right: ' + right + 'px; display: flex;"><div><div class="dropdown-inner"><button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--copy"><span class="menu-item__icon share-menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg></span><span class="menu-item__label">링크 복사하기</span></button><button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--chat"><span class="menu-item__icon share-menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path></g></svg></span><span class="menu-item__label">Chat으로 전송하기</span></button><button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--bookmark"><span class="menu-item__icon share-menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18 3V0h2v3h3v2h-3v3h-2V5h-3V3zm-7.5 1a.5.5 0 00-.5.5V7h3.5A2.5 2.5 0 0116 9.5v3.48l3 2.1V11h2v7.92l-5-3.5v7.26l-6.5-3.54L3 22.68V9.5A2.5 2.5 0 015.5 7H8V4.5A2.5 2.5 0 0110.5 2H12v2zm-5 5a.5.5 0 00-.5.5v9.82l4.5-2.46 4.5 2.46V9.5a.5.5 0 00-.5-.5z"></path></g></svg></span><span class="menu-item__label">폴더에 북마크 추가하기</span></button></div></div></div></div>';
        layer.addEventListener("click", function (event) {
            const actionButton = event.target.closest(".share-menu-item");

            if (!actionButton || !activeShareButton) {
                event.stopPropagation();
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (actionButton.classList.contains("share-menu-item--copy")) {
                copyShareLink(activeShareButton);
                return;
            }

            if (actionButton.classList.contains("share-menu-item--chat")) {
                openShareChatModal(activeShareButton);
                return;
            }

            if (actionButton.classList.contains("share-menu-item--bookmark")) {
                openShareBookmarkModal(activeShareButton);
            }
        });

        layersRoot.appendChild(layer);
        activeShareDropdown = layer;
        activeShareButton = button;
        activeShareButton.setAttribute("aria-expanded", "true");
    }

    const backButton = document.getElementById("newsBackButton");
    const layersRoot = document.getElementById("layers");
    const sortButton = document.querySelector(".post-detail-sort-button");
    const sortDropdown = document.querySelector(".post-detail-sort-menu");
    const replyInput = document.querySelector(".post-detail-reply-input");
    const replySubmit = document.querySelector(".post-detail-reply-submit");
    let activeShareDropdown = null;
    let activeShareButton = null;
    let activeShareModal = null;

    if (backButton) {
        backButton.addEventListener("click", function () {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            window.location.href = "/news";
        });
    }

    document.querySelectorAll(".tweet-action-btn-like").forEach(function (likeButton) {
        const countElement = likeButton.querySelector(".tweet-action-count");
        const path = likeButton.querySelector("svg path");

        if (!countElement || !path) {
            return;
        }

        const outlinePath = path.getAttribute("d");
        const filledPath = "M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z";
        let count = Number(likeButton.dataset.count || countElement.textContent.replace(/[^0-9]/g, ""));
        let isLiked = false;

        likeButton.addEventListener("click", function () {
            isLiked = !isLiked;
            count += isLiked ? 1 : -1;

            likeButton.classList.toggle("active", isLiked);
            likeButton.dataset.count = String(count);
            path.setAttribute("d", isLiked ? filledPath : outlinePath);
            countElement.textContent = formatCount(count);
            showToast(isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.", "toast--like");
        });
    });

    document.querySelectorAll(".tweet-action-btn-bookmark").forEach(function (bookmarkButton) {
        const path = bookmarkButton.querySelector("svg path");

        if (!path) {
            return;
        }

        let isBookmarked = false;

        bookmarkButton.addEventListener("click", function () {
            isBookmarked = !isBookmarked;
            setBookmarkButtonState(bookmarkButton, isBookmarked);
            showToast(isBookmarked ? "북마크에 저장되었습니다." : "북마크가 해제되었습니다.");
        });
    });

    document.querySelectorAll(".tweet-action-btn-share").forEach(function (shareButton) {
        shareButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (activeShareButton === shareButton) {
                closeShareDropdown();
                return;
            }

            openShareDropdown(shareButton);
        });
    });

    if (sortButton && sortDropdown) {
        sortButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const willOpen = !sortDropdown.classList.contains("show");
            closeSortMenu();

            if (willOpen) {
                sortDropdown.classList.add("show");
                sortButton.setAttribute("aria-expanded", "true");
            }
        });

        sortDropdown.querySelectorAll(".dropdown-item").forEach(function (item) {
            item.addEventListener("click", function (event) {
                event.stopPropagation();
                sortButton.querySelector("span").textContent = item.textContent;
                closeSortMenu();
            });
        });

        document.addEventListener("click", closeSortMenu);
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeSortMenu();
                closeShareDropdown();
                closeShareModal();
            }
        });
        document.addEventListener("scroll", closeSortMenu, true);
    }

    document.addEventListener("click", function () {
        closeShareDropdown();
    });

    if (replyInput && replySubmit) {
        replyInput.addEventListener("input", function () {
            const hasValue = replyInput.value.trim().length > 0;

            replySubmit.disabled = !hasValue;
            replySubmit.classList.toggle("disabled", !hasValue);
        });
    }
});
