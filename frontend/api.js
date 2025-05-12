const BASE_URL = "http://localhost:1337/api/"

export async function getBookRating(id, endpoint = `books/${id}?populate=ratings`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    // Directly assign the ratings (no need for `await` here)
    let ratings = data.data.ratings;

    return ratings;
}