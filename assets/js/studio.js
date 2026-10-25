document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* LOADER */
    const loader = document.getElementById("loader");
    const start = performance.now();
    const hideLoader = () => {
        const wait = reducedMotion ? 0 : Math.max(0, 1300 - (performance.now() - start));

        setTimeout(() => {
            loader?.classList.add("done");
            root.classList.add("ready");
            setTimeout(() => loader?.remove(), 900);
        }, wait);
    };

    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader, { once: true });
    setTimeout(hideLoader, 3000); // filet de sécurité si une image tarde

    /* LIENS INTERNES : défilement sans ajouter #section dans l'adresse */
    document.addEventListener("click", event => {
        const link = event.target instanceof Element && event.target.closest('a[href^="#"]');
        if (!link) return;

        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });

    /* MENU PLEIN ÉCRAN */
    const menu = document.getElementById("menu");
    const menuOpen = document.getElementById("menu-open");
    const menuClose = document.getElementById("menu-close");

    const setMenu = open => {
        if (!menu) return;

        menu.hidden = !open;
        menuOpen?.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
        (open ? menuClose : menuOpen)?.focus();
    };

    menuOpen?.addEventListener("click", () => setMenu(true));
    menuClose?.addEventListener("click", () => setMenu(false));
    menu?.addEventListener("click", event => {
        if (event.target instanceof Element && event.target.closest("a")) setMenu(false);
    });

    /* EFFETS VISUELS */
    const clearFx = document.getElementById("clear-fx");
    const setFx = fx => {
        root.classList.remove("fx-bw", "fx-negative");
        if (fx) root.classList.add(`fx-${fx}`);
        if (clearFx) clearFx.hidden = !fx;
    };

    clearFx?.addEventListener("click", () => setFx(null));

    /* TERMINAL DE COMMANDES */
    const terminal = document.getElementById("terminal");
    const form = document.getElementById("terminal-form");
    const input = document.getElementById("terminal-input");
    const list = document.getElementById("terminal-cmds");
    const out = document.getElementById("terminal-out");

    const goTo = id => () => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    const openUrl = url => () => window.open(url, "_blank", "noopener");

    const commands = {
        accueil: ["Retour en haut", goTo("hero")],
        projets: ["Mes réalisations", goTo("projects")],
        parcours: ["Mes expériences", goTo("experience")],
        "savoir-faire": ["Mes compétences", goTo("skills")],
        formation: ["Mes études", goTo("education")],
        contact: ["Me contacter", goTo("contact")],
        cv: ["Ouvrir mon CV", openUrl(document.querySelector('a[href$="cv.pdf"]')?.href || "/assets/cv/cv.pdf")],
        linkedin: ["Mon LinkedIn", openUrl("https://www.linkedin.com/in/donatien-zinsou/")],
        github: ["Mon GitHub", openUrl("https://github.com/DonZ572")],
        nb: ["Passer en noir et blanc", () => setFx("bw")],
        negatif: ["Inverser les couleurs", () => setFx("negative")],
        reset: ["Effacer les effets", () => setFx(null)],
        fermer: ["Fermer le terminal", () => {}],
    };

    let lastFocus = null;

    const setTerminal = open => {
        if (!terminal) return;

        if (open) {
            lastFocus = document.activeElement;
            setMenu(false);
            terminal.hidden = false;
            input.value = "";
            out.textContent = "";
            renderCommands("");
            input.focus();
        } else {
            terminal.hidden = true;
            lastFocus?.focus?.();
        }
    };

    const run = name => {
        const command = commands[name];

        if (!command) {
            out.textContent = `Commande inconnue : « ${name} ». Essayez « projets » ou « contact ».`;
            return;
        }

        setTerminal(false);
        command[1]();
    };

    const renderCommands = query => {
        list.innerHTML = "";
        Object.entries(commands).forEach(([name, [label]]) => {
            const li = document.createElement("li");
            const button = document.createElement("button");

            button.type = "button";
            button.textContent = name;
            button.title = label;
            button.classList.toggle("is-match", query !== "" && name.startsWith(query));
            button.addEventListener("click", () => run(name));
            li.append(button);
            list.append(li);
        });
    };

    input?.addEventListener("input", () => renderCommands(input.value.trim().toLowerCase()));

    form?.addEventListener("submit", event => {
        event.preventDefault();
        const query = input.value.trim().toLowerCase();
        if (!query) return;

        const match = commands[query] ? query : Object.keys(commands).find(name => name.startsWith(query));
        run(match || query);
    });

    document.querySelectorAll("[data-terminal-open]").forEach(button => {
        button.addEventListener("click", () => setTerminal(true));
    });

    document.querySelectorAll("[data-terminal-close]").forEach(button => {
        button.addEventListener("click", () => setTerminal(false));
    });

    terminal?.addEventListener("click", event => {
        if (event.target === terminal) setTerminal(false);
    });

    document.addEventListener("keydown", event => {
        const typing = event.target instanceof HTMLElement && event.target.closest("input, textarea, [contenteditable]");

        if (event.key === "/" && !typing && terminal?.hidden) {
            event.preventDefault();
            setTerminal(true);
        } else if (event.key === "Escape") {
            if (terminal && !terminal.hidden) setTerminal(false);
            else if (menu && !menu.hidden) setMenu(false);
        }
    });

    /* FORMULAIRE EN VERSION STATIQUE (GitHub Pages) : ouvre la messagerie du visiteur */
    const mailForm = document.querySelector("form[data-mailto]");

    mailForm?.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(mailForm);
        const subject = data.get("subject") || "Contact depuis le portfolio";
        const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;

        window.location.href = `mailto:${mailForm.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    /* NUAGE DE MOTS DU PIED DE PAGE */
    if (!reducedMotion) {
        document.querySelectorAll(".cloud-word").forEach((word, index) => {
            const words = word.dataset.words.split("|");
            let i = 0;

            setInterval(() => {
                word.classList.add("swap");
                setTimeout(() => {
                    i = (i + 1) % words.length;
                    word.textContent = words[i];
                    word.classList.remove("swap");
                }, 250);
            }, 2200 + index * 450);
        });
    }

    /* APPARITION AU SCROLL */
    if ("IntersectionObserver" in window && !reducedMotion) {
        const reveal = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document
            .querySelectorAll(".intro-title, .intro-grid, .block-head, .work, .works-small li, .row, .services li, .stickers, .contact-title")
            .forEach(target => {
                target.classList.add("reveal");
                reveal.observe(target);
            });
    }
});
