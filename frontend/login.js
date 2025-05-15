import { getTheme, loginUser } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector(".login-form");
    const guestRedirect = document.getElementById("guest-redirect-login");
    const registerRedirect = document.getElementById("register-redirect");
    await getTheme();

    // Login
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let user = document.getElementById("username-input").value.trim();
        let password = document.getElementById("password-input").value.trim();

        if (!user || !password) {
            alert("Please fill in both fields.");
            return;
        }
        await loginUser(user, password, form);
    });

    // Redirects (guest och register)

    guestRedirect.addEventListener("click", () => {
        window.location.href = "index.html";
    })
    registerRedirect.addEventListener("click", () => {
        window.location.href = "register.html";
    })
});