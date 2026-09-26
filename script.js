/* =========================
   CELESTIAL SHOOTING STARS
========================= */

const celestial = document.querySelector(".celestial-symbol");

const shootingStars = [
    {
        element: document.querySelector(".trail-one"),
        start: [210, -190],
        control: [80, -40],
        end: [-210, 190],
        duration: 1500,
        delay: 1000
    },

    {
        element: document.querySelector(".trail-two"),
        start: [190, -160],
        control: [70, -20],
        end: [-220, 210],
        duration: 1700,
        delay: 5200
    },

    {
        element: document.querySelector(".trail-three"),
        start: [230, -210],
        control: [100, -60],
        end: [-200, 190],
        duration: 1450,
        delay: 8300
    },

    {
        element: document.querySelector(".trail-four"),
        start: [180, -180],
        control: [60, -10],
        end: [-230, 220],
        duration: 1600,
        delay: 14600
    }
];


/* =========================
   SMOOTH CURVE
========================= */

function bezierPoint(t, start, control, end) {

    const x =
        Math.pow(1 - t, 2) * start[0] +
        2 * (1 - t) * t * control[0] +
        Math.pow(t, 2) * end[0];

    const y =
        Math.pow(1 - t, 2) * start[1] +
        2 * (1 - t) * t * control[1] +
        Math.pow(t, 2) * end[1];

    return { x, y };
}


/* =========================
   DIRECTION OF TRAVEL
========================= */

function bezierDirection(t, star) {

    const step = 0.01;

    const current =
        bezierPoint(
            t,
            star.start,
            star.control,
            star.end
        );

    const next =
        bezierPoint(
            Math.min(t + step, 1),
            star.start,
            star.control,
            star.end
        );

    return Math.atan2(
        next.y - current.y,
        next.x - current.x
    ) * 180 / Math.PI;
}


/* =========================
   SMOOTH MOVEMENT
========================= */

function easeOutCubic(t) {

    return 1 -
        Math.pow(1 - t, 3);
}


/* =========================
   SHOOTING STAR ANIMATION
========================= */

function animateShootingStar(star) {

    if (!star.element || !celestial) {
        return;
    }

    const startTime =
        performance.now() + star.delay;


    function frame(time) {

        const elapsed =
            time - startTime;


        /* Waiting */
        if (elapsed < 0) {

            star.element.style.opacity = 0;

            requestAnimationFrame(frame);

            return;
        }


        let progress =
            elapsed / star.duration;


        /* Finished */
        if (progress >= 1) {

            star.element.style.opacity = 0;

            setTimeout(() => {

                animateShootingStar({
                    ...star,
                    delay: 3000 + Math.random() * 4500
                });

            }, 3000 + Math.random() * 4500);

            return;
        }


        /*
            Slightly faster at the beginning,
            smooth through the middle,
            gentle finish.
        */
        const t =
            easeOutCubic(progress);


        const point =
            bezierPoint(
                t,
                star.start,
                star.control,
                star.end
            );


        const angle =
            bezierDirection(t, star);


        /* =========================
           VISIBILITY

           invisible
           ↓
           flash
           ↓
           bright
           ↓
           fade
           ↓
           invisible
        ========================= */

        let opacity = 0;


        if (progress < 0.08) {

            /*
                Very quick appearance
            */

            opacity =
                progress / 0.08;

        }

        else if (progress < 0.18) {

            /*
                Bright flash
            */

            opacity = 1;

        }

        else if (progress < 0.72) {

            /*
                Main visible section
            */

            opacity = 0.9;

        }

        else {

            /*
                Fade away
            */

            opacity =
                1 -
                ((progress - 0.72) / 0.28);
        }


        /*
            Move the shooting star
        */

        star.element.style.transform = `
            translate(
                ${point.x}px,
                ${point.y}px
            )
            rotate(${angle}deg)
        `;


        star.element.style.opacity =
            opacity;


        /*
            Tiny energy burst near
            the beginning of the shot.
        */

        if (
            progress > 0.05 &&
            progress < 0.09
        ) {

            star.element.classList.add("burst");

            setTimeout(() => {

                star.element.classList.remove("burst");

            }, 180);
        }


        requestAnimationFrame(frame);
    }


    requestAnimationFrame(frame);
}


/* =========================
   START SHOOTING STARS
========================= */

shootingStars.forEach(star => {

    animateShootingStar(star);

});

/* =========================================
   PROJECT CAROUSEL
========================================= */

const projectPanels =
    document.querySelectorAll(".project-panel");

const previousProject =
    document.querySelector(".project-prev");

const nextProject =
    document.querySelector(".project-next");


let currentProject = 0;


function updateProjects() {

    const total =
        projectPanels.length;


    projectPanels.forEach((panel, index) => {

        panel.classList.remove(
            "active",
            "left",
            "right",
            "hidden-left",
            "hidden-right"
        );


        if (index === currentProject) {

            panel.classList.add("active");

            return;
        }


        /*
            Distance from current project.
        */

        let distance =
            index - currentProject;


        /*
            Make the carousel circular.
        */

        if (distance > total / 2) {

            distance -= total;
        }

        if (distance < -total / 2) {

            distance += total;
        }


        if (distance === -1) {

            panel.classList.add("left");

        }

        else if (distance === 1) {

            panel.classList.add("right");

        }

        else if (distance < -1) {

            panel.classList.add("hidden-left");

        }

        else {

            panel.classList.add("hidden-right");

        }

    });
}


/* =========================================
   NEXT
========================================= */

nextProject.addEventListener("click", () => {

    currentProject++;

    if (currentProject >= projectPanels.length) {

        currentProject = 0;
    }

    updateProjects();
});


/* =========================================
   PREVIOUS
========================================= */

previousProject.addEventListener("click", () => {

    currentProject--;

    if (currentProject < 0) {

        currentProject =
            projectPanels.length - 1;
    }

    updateProjects();
});


/* Initial state */

updateProjects();