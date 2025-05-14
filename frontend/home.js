import { getBookRating, getUser, addBookToUser, getTheme, isLoggedIn, fetchBooks, BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    await getTheme();
    await isLoggedIn();
    await displayBooks();
});

async function displayBooks() {
    const books = await fetchBooks();
    const bookContainer = document.getElementById("book-container");
    bookContainer.innerHTML = "";
    const user = await getUser();
    for (let book of books) {
        let button = "<button class='card-button save-to-user'>save to library</button>";
        if (book.users.some(bookUser => bookUser.id === user.id)) {
            button = "<button class='card-button save-to-user'>In library</button>"
        }
        let totalRate = 0;
        let ratingText = "No ratings"

        const ratings = await getBookRating(book.documentId);

        for (let rating of ratings) {
            totalRate += rating.rating;
        }

        if (ratings.length > 0) {
            totalRate /= ratings.length
            ratingText = `${totalRate + "/5"}`
        }

        let image = BASE_URL + book.cover.url;
        let item = document.createElement("li");
        item.classList.add("book-item");
        item.innerHTML = `
        <div class="book-container-left book-container-both">
            
            <img src="${image}" alt="${image}" class="book-cover">
        </div>
        <div class="book-container-right book-container-both">
            <h3 class="book-title">${book.title}</h3>
            <h4>Author: ${book.author}</h4>
            <h5>Released: ${book.release}</h5>
            <h5>Pages: ${book.pages}</h5>
            <h4>Rating: ${ratingText}</h4>
            ${button}
        </div>
        `;
        const saveButton = item.querySelector('.save-to-user');
        saveButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await addBookToUser(book.documentId);
            saveButton.innerHTML = "In library"
        });
        bookContainer.appendChild(item);
    }
}