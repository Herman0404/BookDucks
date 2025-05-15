import { getTheme, registerUser } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector(".login-form");
    const guestRedirect = document.getElementById("guest-redirect-register");
    const loginRedirect = document.getElementById("login-redirect");
    // Skapa nytt konto
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let email = document.getElementById("email-register").value.trim();
        let user = document.getElementById("username-register").value.trim();
        let password = document.getElementById("password-register").value.trim();
        console.log(email, user, password);
        await registerUser(email, user, password);
        document.getElementById("password-register").value = "";
    })

    // Redirects (guest och login)

    guestRedirect.addEventListener("click", () => {
        window.location.href = "index.html";
    })

    loginRedirect.addEventListener("click", () => {
        window.location.href = "login.html"
    })

    getTheme();
})