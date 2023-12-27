(() => {
    "use strict";
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function formRating() {
        const ratings = document.querySelectorAll(".rating");
        if (ratings.length > 0) initRatings();
        function initRatings() {
            let ratingActive, ratingValue;
            for (let index = 0; index < ratings.length; index++) {
                const rating = ratings[index];
                initRating(rating);
            }
            function initRating(rating) {
                initRatingVars(rating);
                setRatingActiveWidth();
                if (rating.classList.contains("rating--set")) setRating(rating);
            }
            function initRatingVars(rating) {
                ratingActive = rating.querySelector(".rating__active");
                ratingValue = rating.querySelector(".rating__value");
            }
            function setRatingActiveWidth(index = ratingValue.innerHTML) {
                const ratingActiveWidth = index / .05;
                ratingActive.style.width = `${ratingActiveWidth}%`;
            }
            function setRating(rating) {
                const ratingItems = rating.querySelectorAll(".rating__item");
                for (let index = 0; index < ratingItems.length; index++) {
                    const ratingItem = ratingItems[index];
                    ratingItem.addEventListener("mouseenter", (function(e) {
                        initRatingVars(rating);
                        setRatingActiveWidth(ratingItem.value);
                    }));
                    ratingItem.addEventListener("mouseleave", (function(e) {
                        setRatingActiveWidth();
                    }));
                    ratingItem.addEventListener("click", (function(e) {
                        initRatingVars(rating);
                        if (rating.dataset.ajax) setRatingValue(ratingItem.value, rating); else {
                            ratingValue.innerHTML = index + 1;
                            setRatingActiveWidth();
                        }
                    }));
                }
            }
            async function setRatingValue(value, rating) {
                if (!rating.classList.contains("rating_sending")) {
                    rating.classList.add("rating_sending");
                    let response = await fetch("rating.json", {
                        method: "GET"
                    });
                    if (response.ok) {
                        const result = await response.json();
                        const newRating = result.newRating;
                        ratingValue.innerHTML = newRating;
                        setRatingActiveWidth();
                        rating.classList.remove("rating_sending");
                    } else {
                        alert("Помилка");
                        rating.classList.remove("rating_sending");
                    }
                }
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("DOMContentLoaded", (() => {
        txtaAutoHeight();
        addActiveClassOnClick();
        formValidation((() => console.log("Форма відправлена")));
        startIdleTimer("home.html");
    }));
    function startIdleTimer(pageName, defaultIdleTime = 2e4) {
        let idleTime = defaultIdleTime;
        let timeout;
        function resetTimer() {
            clearTimeout(timeout);
            if (!window.location.pathname.includes(pageName)) timeout = setTimeout((() => window.location.href = pageName), idleTime);
        }
        let storedIdleTime = localStorage.getItem("idleTime");
        if (storedIdleTime) idleTime = storedIdleTime; else if (window.location.pathname.includes(pageName)) {
            const idleTimeElement = document.querySelector("[data-idletime]");
            if (idleTimeElement) {
                idleTime = idleTimeElement.getAttribute("data-idletime");
                localStorage.setItem("idleTime", idleTime);
            }
        }
        window.onload = resetTimer;
        window.onmousemove = resetTimer;
        window.onclick = resetTimer;
        window.onscroll = resetTimer;
        window.onkeypress = resetTimer;
    }
    function formValidation(callback) {
        const forms = document.querySelectorAll("form");
        if (forms.length > 0) forms.forEach((function(form) {
            form.addEventListener("submit", (function(e) {
                e.preventDefault();
                const dishItem = form.closest(".dish-item");
                const textarea = form.querySelector("textarea");
                if (dishItem) {
                    const rating = dishItem.querySelector(".rating");
                    const ratingValue = rating.querySelector(".rating__value");
                    const ratingActive = rating.querySelector(".rating__active");
                    if (!ratingValue.textContent || ratingValue.textContent == "0") {
                        rating.classList.remove("_shake");
                        setTimeout((function() {
                            rating.classList.add("_shake");
                        }), 0);
                        setTimeout((function() {
                            rating.classList.remove("_shake");
                        }), 400);
                    } else {
                        ratingValue.textContent = "0";
                        ratingActive.style.width = "0";
                        textarea.value = "";
                        callback();
                    }
                } else if (textarea.value.trim() !== "") {
                    textarea.value = "";
                    callback();
                }
            }));
        }));
    }
    function txtaAutoHeight() {
        const textareas = document.querySelectorAll("textarea[data-autoheight]");
        if (textareas.length) textareas.forEach((textarea => {
            const style = getComputedStyle(textarea, null);
            const verticalBorders = Math.round(parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth));
            const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
            const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
            function setHeight() {
                textarea.style.height = "auto";
                const newHeight = textarea.scrollHeight + verticalBorders;
                textarea.style.overflowY = newHeight > maxHeight ? "auto" : "hidden";
                textarea.style.height = Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight) + "px";
            }
            setHeight();
            textarea.addEventListener("focusin", (e => {
                setHeight();
            }));
            textarea.addEventListener("input", (e => {
                setHeight();
            }));
            window.addEventListener("resize", (e => {
                setHeight();
            }));
        }));
    }
    function addActiveClassOnClick() {
        document.addEventListener("click", (e => {
            const target = e.target;
            const dishItem = target.closest(".dish-item");
            if (target && dishItem && !target.closest(".rating") && !target.closest(".dish-form") && !dishItem.classList.contains("_process")) {
                const dishRating = dishItem.querySelector(".rating");
                const dishForm = dishItem.querySelector(".dish-form");
                dishItem.classList.toggle("_active");
                dishItem.classList.add("_process");
                _slideToggle(dishRating, 300);
                _slideToggle(dishForm, 300);
                setTimeout((() => dishItem.classList.remove("_process")), 300);
            }
        }));
    }
    window["FLS"] = false;
    addLoadedClass();
    formRating();
})();