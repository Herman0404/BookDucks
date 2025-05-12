const BASE_URL = "http://localhost:1337/api/"

export async function getBookRating(id, endpoint = `books/${id}?populate=ratings`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    let ratings = data.data.ratings;
    return ratings;
}

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

export async function getBook(id, endpoint = `books/${id}`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url);

    if (!res.ok) {
        console.error('Error fetching book:', res.statusText);
        throw new Error('Failed to fetch the book');
    }
    const data = await res.json();
    return data.data;
}

async function getUserBooks(id = 1, endpoint = `users/${id}`) {
    const url = `${BASE_URL}${endpoint}?populate=books`;
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




export async function addBookToUser(bookId, endpoint = `users/`) {

    const user = await getUserBooks();
    const book = await getBook(bookId)
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