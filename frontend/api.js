const BASE_URL = "http://localhost:1337/api/"


/* GET THEME API*/

export async function getTheme(endpoint = "chosen-theme") {
    const url = `${BASE_URL}${endpoint}?populate[currentTheme][populate]=*`;
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();

        console.log("Full Populated Response:", data);

        return data; // You can now use the populated data

    } catch (error) {
        console.error("Failed to fetch theme:", error);
    }
}

/* USER API */

export async function getUser(endpoint = `users/me`) {
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
    const endpoint = `users/${id.id}?populate=books`
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    if (!res.ok) {
        console.error('Error fetching user:', res.statusText);
        throw new Error('Failed to fetch the user');
    }

    const data = await res.json();
    return data;
}

/* BOOK API */

export async function fetchBooks(endpoint = `books/`) {

}

export async function getBookById(id, endpoint = `books/${id}`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error('Error fetching book:', res.statusText);
        throw new Error('Failed to fetch the book');
    }
    const data = await res.json();
    return data.data;
}

export async function getBookRating(id, endpoint = `books/${id}?populate=ratings`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    let ratings = data.data.ratings;
    return ratings;
}

export async function addBookToUser(bookId, endpoint = `users/`) {
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