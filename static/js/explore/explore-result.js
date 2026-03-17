const tabPopular = document.getElementById("tabPopular");
const tabLatest = document.getElementById("tabLatest");
const tabMembers = document.getElementById("tabMembers");

const popularSection = document.getElementById("popularSection");
const latestSection = document.getElementById("latestSection");
const membersSection = document.getElementById("membersSection");

if (tabPopular && tabLatest && tabMembers && popularSection && latestSection && membersSection) {
    function showPopularTab() {
        tabPopular.classList.add("isActive");
        tabPopular.setAttribute("aria-current", "page");
        tabLatest.classList.remove("isActive");
        tabLatest.removeAttribute("aria-current");
        tabMembers.classList.remove("isActive");
        tabMembers.removeAttribute("aria-current");

        popularSection.hidden = false;
        latestSection.hidden = true;
        membersSection.hidden = true;
    }

    function showLatestTab() {
        tabLatest.classList.add("isActive");
        tabLatest.setAttribute("aria-current", "page");
        tabPopular.classList.remove("isActive");
        tabPopular.removeAttribute("aria-current");
        tabMembers.classList.remove("isActive");
        tabMembers.removeAttribute("aria-current");

        popularSection.hidden = true;
        latestSection.hidden = false;
        membersSection.hidden = true;
    }

    function showMembersTab() {
        tabMembers.classList.add("isActive");
        tabMembers.setAttribute("aria-current", "page");
        tabPopular.classList.remove("isActive");
        tabPopular.removeAttribute("aria-current");
        tabLatest.classList.remove("isActive");
        tabLatest.removeAttribute("aria-current");

        popularSection.hidden = true;
        latestSection.hidden = true;
        membersSection.hidden = false;
    }

    tabPopular.addEventListener("click", () => { showPopularTab(); });
    tabLatest.addEventListener("click", () => { showLatestTab(); });
    tabMembers.addEventListener("click", () => { showMembersTab(); });
}

window.addEventListener("load", function () {
    var searchForm = document.getElementById("searchForm");
    var searchInput = document.getElementById("searchInput");
    var searchClearBtn = document.getElementById("searchClearBtn");
    var searchPanel = document.getElementById("searchPanel");
    var searchPanelEmpty = document.getElementById("searchPanelEmpty");
    var searchRecentSec = document.getElementById("searchRecentSection");
    var searchResultsEl = document.getElementById("searchResults");
    var searchResultTopic = document.getElementById("searchResultTopic");
    var searchResultLabel = document.getElementById("searchResultLabel");

    if (!searchForm || !searchInput || !searchPanel) {
        return;
    }

    function hasRecentItems() {
        return !!(
            searchRecentSec &&
            searchRecentSec.querySelectorAll(".searchResultItem").length > 0
        );
    }

    function showEmpty() {
        if (searchPanelEmpty) searchPanelEmpty.hidden = false;
        if (searchRecentSec) searchRecentSec.hidden = true;
        if (searchResultsEl) searchResultsEl.hidden = true;
    }

    function showRecent() {
        if (searchPanelEmpty) searchPanelEmpty.hidden = true;
        if (searchRecentSec) searchRecentSec.hidden = false;
        if (searchResultsEl) searchResultsEl.hidden = true;
    }

    function showResults(value) {
        if (searchResultLabel) searchResultLabel.textContent = value;
        if (searchPanelEmpty) searchPanelEmpty.hidden = true;
        if (searchRecentSec) searchRecentSec.hidden = true;
        if (searchResultsEl) searchResultsEl.hidden = false;
    }

    function updateSearchClearButton() {
        if (!searchClearBtn) {
            return;
        }

        searchClearBtn.hidden = searchInput.value.length === 0;
    }

    function updatePanel() {
        var value = searchInput.value.trim();
        updateSearchClearButton();

        if (value.length > 0) {
            showResults(value);
        } else if (hasRecentItems()) {
            showRecent();
        } else {
            showEmpty();
        }
    }

    searchPanel.addEventListener("mousedown", function (event) {
        event.preventDefault();
    });

    searchInput.addEventListener("focus", function () {
        searchForm.classList.add("isFocused");
        searchPanel.hidden = false;
        updatePanel();
    });

    searchInput.addEventListener("input", function () {
        updatePanel();
    });

    if (searchClearBtn) {
        searchClearBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            searchInput.value = "";
            updatePanel();
            searchInput.focus();
        });
    }

    searchInput.addEventListener("blur", function () {
        if (!document.hasFocus()) {
            return;
        }

        searchForm.classList.remove("isFocused");
        searchPanel.hidden = true;
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            searchForm.classList.remove("isFocused");
            searchPanel.hidden = true;
            searchInput.blur();
        }
    });

    if (searchResultTopic) {
        searchResultTopic.addEventListener("click", function () {
            searchForm.classList.remove("isFocused");
            searchPanel.hidden = true;
        });
    }

    if (searchRecentSec) {
        searchRecentSec.addEventListener("click", function (event) {
            var deleteBtn = event.target.closest(".searchRecentDeleteBtn");
            if (!deleteBtn) {
                return;
            }

            event.stopPropagation();
            var searchItem = deleteBtn.closest(".searchResultItem");
            if (searchItem) {
                searchItem.remove();
            }

            updatePanel();
        });

        var clearAllBtn = searchRecentSec.querySelector(".searchRecentClearAll");
        if (clearAllBtn) {
            clearAllBtn.addEventListener("click", function (event) {
                event.stopPropagation();
                searchRecentSec.querySelectorAll(".searchResultItem").forEach(function (item) {
                    item.remove();
                });

                updatePanel();
            });
        }
    }

    updateSearchClearButton();
});
