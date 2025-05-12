const BASE_URL = "http://localhost:1337/api/"

export async function getBookRating(id, endpoint = `books/${id}?populate=ratings`) {
    console.log(id);
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    // Directly assign the ratings (no need for `await` here)
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
    const url = `${BASE_URL}${endpoint}?populate=users`;  // Ensure you're using `populate=users`
    const res = await fetch(url);

    if (!res.ok) {
        console.error('Error fetching book:', res.statusText);
        throw new Error('Failed to fetch the book');
    }

    const data = await res.json();
    console.log(data.data);  // Check if 'users' are included in the response
    return data;
}

async function getUser2(id = 1, endpoint = `users/${id}`) {
    const url = `${BASE_URL}${endpoint}?populate=books`;  // Ensure you're using `populate=books`
    const token = localStorage.getItem("token");  // Get token from localStorage

    // Check if the token is available
    if (!token) {
        console.error('No token found');
        throw new Error('Token is missing');
    }

    const res = await fetch(url, {
        method: "GET",  // Use GET method
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Add token to Authorization header
        }
    });

    if (!res.ok) {
        console.error('Error fetching user:', res.statusText);
        throw new Error('Failed to fetch the user');
    }

    const data = await res.json();
    console.log(data);  // Check if 'books' are included in the response
    return data;
}




export async function addBookToUser(bookId, endpoint = `books/`) {
    const url = `${BASE_URL}${endpoint}${bookId}`;
    //await getBook(bookId)
    await getUser2()
    const user = await getUser(); // Fetch the user data
    console.log(user);
    const token = localStorage.getItem("token");

    const res = await fetch(`${url}`, {
        method: "PUT", // Make sure the book is updated
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            "user": user.id
        })
    });

    const data = await res.json();
    console.log(data);
    return data;
}
