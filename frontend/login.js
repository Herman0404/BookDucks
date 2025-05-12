document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let user = document.getElementById("username-input").value.trim();
        let password = document.getElementById("password-input").value.trim();

        if (!user || !password) {
            alert("Please fill in both fields.");
            return;
        }
        login(user, password, form);
    });
});

const login = async (user, password, form) => {
    try {
        const response = await fetch("http://localhost:1337/api/auth/local", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: user,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Login failed", error);
        }

        const data = await response.json();
        console.log("Login success:", data);

        localStorage.setItem("token", data.jwt);

        window.location.href = "home.html";
    } catch (error) {
        form.reset();
        alert("Wrong username/password");
        console.error("Error during login:", error);
    }
};