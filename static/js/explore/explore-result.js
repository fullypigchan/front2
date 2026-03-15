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
