function showMessage() {
    alert("Welcome to my portfolio website!");
}

function submitForm() {
    document.getElementById("result").innerText =
        "Thank you! Your message has been submitted.";
}

function toggleSection(id) {
    const section = document.getElementById(id);
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}
window.onscroll = function () {
    const btn = document.getElementById("scrollBtn");
    if (document.documentElement.scrollTop > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
