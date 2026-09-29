const navToggle = document.querySelector("#nav-toggle");
const siteNavigation = document.querySelector("#site-navigation");
let navigationPinnedOpen = false;

function setNavigationOpen(open, pin = false) {
    siteNavigation.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "close navigation" : "open navigation");
    if (!open) navigationPinnedOpen = false;
    else if (pin) navigationPinnedOpen = true;
}

navToggle.addEventListener("click", () => {
    if (siteNavigation.hidden) setNavigationOpen(true, true);
    else if (!navigationPinnedOpen) navigationPinnedOpen = true;
    else setNavigationOpen(false);
});

document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse" && event.clientX <= 16 && siteNavigation.hidden) {
        setNavigationOpen(true);
    }
});

siteNavigation.addEventListener("pointerleave", (event) => {
    if (!navigationPinnedOpen && !navToggle.contains(event.relatedTarget)) {
        setNavigationOpen(false);
    }
});

navToggle.addEventListener("pointerleave", (event) => {
    if (!navigationPinnedOpen && !siteNavigation.contains(event.relatedTarget)) {
        setNavigationOpen(false);
    }
});

document.addEventListener("pointerdown", (event) => {
    if (
        navigationPinnedOpen &&
        !siteNavigation.contains(event.target) &&
        !navToggle.contains(event.target)
    ) {
        setNavigationOpen(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !siteNavigation.hidden) {
        setNavigationOpen(false);
        navToggle.focus();
    }
});