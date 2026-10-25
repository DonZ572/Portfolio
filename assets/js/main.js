document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const menuButton = document.getElementById("burger");
    const navMenu = document.getElementById("primary-navigation");

    const closeMenu = () => {
        if (!menuButton || !navMenu) return;

        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        navMenu.classList.remove("active");
    };

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", () => {
            const isExpanded = menuButton.getAttribute("aria-expanded") === "true";

            menuButton.classList.toggle("active", !isExpanded);
            menuButton.setAttribute("aria-expanded", String(!isExpanded));
            menuButton.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
            navMenu.classList.toggle("active", !isExpanded);
        });

        navMenu.addEventListener("click", event => {
            if (event.target instanceof Element && event.target.closest("a")) {
                closeMenu();
            }
        });

        document.addEventListener("click", event => {
            if (
                navMenu.classList.contains("active") &&
                event.target instanceof Node &&
                !navMenu.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.matchMedia("(min-width: 961px)").matches) {
                closeMenu();
            }
        });
    }

    if (navbar) {
        const updateNavbar = () => {
            navbar.classList.toggle("scrolled", window.scrollY > 16);
        };

        updateNavbar();
        window.addEventListener("scroll", updateNavbar, { passive: true });
    }

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projects = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });

            projects.forEach(project => {
                project.hidden = filter !== "all" && project.dataset.category !== filter;
            });
        });
    });

    projects.forEach(card => {
        const openProject = () => {
            const page = card.dataset.projectUrl;

            if (page) {
                window.location.assign(page);
            }
        };

        card.addEventListener("click", openProject);
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProject();
            }
        });
    });
});
