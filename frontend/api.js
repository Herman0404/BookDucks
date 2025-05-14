export const BASE_URL = "http://localhost:1337/api"


/* GENERAL API/NONAPI*/

export async function usernameDisplay() {
    const user = await getUser();
    console.log(user)
}

export async function isLoggedIn() {
    var token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in before accessing the site");
        window.location.href = "login.html";
    } else if (token) {
        try {
            var user = await getUser();
            document.querySelector('.username-label').textContent = user.username;
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
}

/* GET THEME API*/

export async function getTheme(endpoint = "/chosen-theme") {
    const url = `${BASE_URL}${endpoint}?populate[currentTheme][populate]=*`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        applyTheme(data.data.currentTheme);
        return data;
    } catch (error) {
        console.error("Fetch fail:", error);
    }
}

function applyTheme(theme) {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--button-color', theme.buttonColor);
    document.documentElement.style.setProperty('--card-color', theme.cardColor);
    document.documentElement.style.setProperty('--button-text-color', theme.buttonText);
}

/* USER API */

export async function getUser(endpoint = `/users/me`) {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const res = await fetch(`${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
}

async function getUserBooks() {
    const id = await getUser();
    const endpoint = `/users/${id.id}?populate=books`
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    const data = await res.json();
    return data;
}

/* BOOK API */

export async function fetchBooks(endpoint = `/books/?populate=*`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
}

export async function getBookById(id, endpoint = `/books/${id}`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
}

export async function getBookRating(id, endpoint = `/books/${id}?populate=ratings`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    let ratings = data.data.ratings;
    return ratings;
}

export async function addBookToUser(bookId, endpoint = `/users/`) {
    const user = await getUserBooks();
    const book = await getBookById(bookId)
    const url = `${BASE_URL}${endpoint}${user.id}?populate=books`;
    const token = localStorage.getItem("token");

    const updatedBooks = user.books.some(book => book.documentId === bookId)
        ? user.books
        : [...user.books, book];
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            books: updatedBooks,
        }),
    });

    const data = await res.json();
    return data;
}