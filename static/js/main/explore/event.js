// 1. 탭 요소
const tabProducts = document.getElementById("tabProducts");
const tabTrending = document.getElementById("tabTrending");
const tabNews = document.getElementById("tabNews");

// 2. 섹션 요소
const productsSection = document.getElementById("productsSection");
const trendingSection = document.getElementById("trendingSection");
const newsSection = document.getElementById("newsSection");

if (tabProducts && tabTrending && tabNews && productsSection && trendingSection && newsSection) {

    // 3. 탭 전환 함수
    function showProductsTab() {
        tabProducts.classList.add("isActive");
        tabProducts.setAttribute("aria-current", "page");
        tabTrending.classList.remove("isActive");
        tabTrending.removeAttribute("aria-current");
        tabNews.classList.remove("isActive");
        tabNews.removeAttribute("aria-current");

        productsSection.hidden = false;
        trendingSection.hidden = true;
        newsSection.hidden = true;
    }

    function showTrendingTab() {
        tabTrending.classList.add("isActive");
        tabTrending.setAttribute("aria-current", "page");
        tabProducts.classList.remove("isActive");
        tabProducts.removeAttribute("aria-current");
        tabNews.classList.remove("isActive");
        tabNews.removeAttribute("aria-current");

        productsSection.hidden = true;
        trendingSection.hidden = false;
        newsSection.hidden = true;
    }

    function showNewsTab() {
        tabNews.classList.add("isActive");
        tabNews.setAttribute("aria-current", "page");
        tabProducts.classList.remove("isActive");
        tabProducts.removeAttribute("aria-current");
        tabTrending.classList.remove("isActive");
        tabTrending.removeAttribute("aria-current");

        productsSection.hidden = true;
        trendingSection.hidden = true;
        newsSection.hidden = false;
    }

    // 4. 이벤트 바인딩
    tabProducts.addEventListener("click", (e) => { showProductsTab(); });
    tabTrending.addEventListener("click", (e) => { showTrendingTab(); });
    tabNews.addEventListener("click", (e) => { showNewsTab(); });
}

// 5. Trending 서브탭
const trendingSubtabs = document.querySelectorAll("#trendingSubtabs .trending-subtab");
if (trendingSubtabs.length > 0) {
    trendingSubtabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            trendingSubtabs.forEach((t) => { t.classList.remove("isActive"); });
            tab.classList.add("isActive");
        });
    });
}
