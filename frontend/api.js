export async function getBookRating() {
    const res = await fetch(`http://localhost:1337/api/books`);
    const data = await res.json();
    return data;
};