export const BASE_URL = "http://localhost:1337"


/* GENERAL API/NONAPI*/

export async function usernameDisplay() {
    const user = await getUser();
}

export function logOut() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
};

export async function isLoggedIn() {
    var token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in before accessing the site");
        window.location.href = "login.html";
    } else if (token) {
        try {
            const usernameLabel = document.querySelector('.username-label')
            var user = await getUser();
            const imgSrc = "http://localhost:1337/uploads/6522516_47626feaa7.png";
            usernameLabel.innerHTML = `<img src="${imgSrc}" alt="User Icon" class="user-icon">${user.username}`;
            usernameLabel.addEventListener("click", () => {
                window.location.href = "profile.html"
            })
            document.querySelector('.log-out').addEventListener('click', () => logOut());
            document.querySelector('.home-button').addEventListener('click', () => {
                window.location.href = "home.html"
            })
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
}

export function getBookRatingAvg(bookRatings) {
    let ratingText = "No ratings"
    let totalRate = 0;
    for (let rating of bookRatings) {
        totalRate += rating.rating;
    }

    if (bookRatings.length > 0) {
        totalRate = (totalRate / bookRatings.length).toFixed(1);
        ratingText = totalRate;
    }
    return ratingText;
}

/* GET THEME API*/

export async function getTheme(endpoint = "/api/chosen-theme") {
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

export async function registerUser(email, user, password, endpoint = `/api/auth/local/register`) {
    const url = `${BASE_URL}${endpoint}`
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "username": user,
                "password": password
            })
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }
        alert("User successfully created")
        window.location.href = "login.html"
    } catch (e) {
        alert("Make sure to input correct details!");
        console.log(e);
    }
}

export async function loginUser(user, password, form, endpoint = `/api/auth/local`) {
    const url = `${BASE_URL}${endpoint}`
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: user,
                password: password
            })
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }

        const data = await res.json();
        localStorage.setItem("token", data.jwt);
        window.location.href = "home.html";
    } catch (error) {
        form.reset();
        alert("Wrong username/password");
    }
}

export async function getUser(endpoint = `/api/users/me`) {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
}

export async function getUserBooks() {
    const id = await getUser();
    const endpoint = `/api/users/${id.id}?populate[books][populate]=*`;
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

export async function getUserRating() {
    const id = await getUser();
    const endpoint = `/api/users/${id.id}?populate[ratings][populate]=*`;
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

export async function addUserRating(value, bookId, endpoint = "/api/ratings") {
    const url = `${BASE_URL}${endpoint}`
    const token = localStorage.getItem("token");
    const user = await getUser();

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                rating: value,
                user: user.id,
                book: bookId,
            }
        })
    });

    const data = await res.json();
    return data;
}

export async function updateUserRating(newRating, ratingId, endpoint = `/api/ratings/${ratingId}`) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                rating: newRating
            }
        })
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        throw new Error(`Failed to update rating: ${errorData.message || "Unknown error"}`);
    }
    const data = await res.json();
    return data;
}


/* BOOK API */

export async function fetchBooks(endpoint = `/api/books/?populate=*`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
}

export async function getBookById(id, endpoint = `/api/books/${id}`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
}

export async function getBookRating(id, endpoint = `/api/books/${id}?populate=ratings`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    let ratings = data.data.ratings;
    return ratings;
}

export async function addBookToUser(bookId, endpoint = `/api/users/`) {
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

export async function removeBookFromUser(bookId, endpoint = `/api/users/`) {
    const user = await getUserBooks();
    const url = `${BASE_URL}${endpoint}${user.id}?populate=books`;
    const token = localStorage.getItem("token");
    const updatedBooks = user.books.filter(book => book.documentId !== bookId);

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
