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
        progression: ["Ce que j'ai appris", goTo("progress")],
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

    /* FORMULAIRE DE CONTACT : envoi via l'API REST d'EmailJS (sans bibliothèque) */
    const EMAILJS = {
        service: "service_p5ggbfo",
        template: "template_1yhlfwj",
        publicKey: "bLFCL04jZGDODukfD",
    };

    const contactForm = document.querySelector("form[data-mailto]");
    const formStatus = document.getElementById("form-status");
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    const showStatus = (message, type) => {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = `form-msg ${type === "ok" ? "form-ok" : "form-err"}`;
        formStatus.hidden = false;
    };

    contactForm?.addEventListener("submit", async event => {
        event.preventDefault();
        const data = new FormData(contactForm);

        // Piège anti-robots : ce champ invisible doit rester vide
        if (data.get("website")) return;

        submitButton.disabled = true;
        submitButton.textContent = "Envoi en cours…";

        try {
            const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    service_id: EMAILJS.service,
                    template_id: EMAILJS.template,
                    user_id: EMAILJS.publicKey,
                    template_params: {
                        from_name: data.get("name"),
                        from_email: data.get("email"),
                        reply_to: data.get("email"),
                        subject: data.get("subject") || "Contact depuis le portfolio",
                        message: data.get("message"),
                        time: new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(new Date()),
                    },
                }),
            });

            if (!response.ok) throw new Error(await response.text());

            contactForm.reset();
            showStatus("Merci ! Votre message a bien été envoyé, je vous réponds rapidement.", "ok");
        } catch {
            showStatus(`L'envoi a échoué. Vous pouvez m'écrire directement à ${contactForm.dataset.mailto}.`, "err");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Envoyer le message →";
        }
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
