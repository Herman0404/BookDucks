import { getBookRating, getUser, addBookToUser, getBook } from "./api.js";

const BASE_URL = "http://localhost:1337";

document.addEventListener("DOMContentLoaded", () => {
    isLoggedIn();
    //document.querySelector('.logout-button').addEventListener('click', logOut);
    document.querySelector('.logout-button').addEventListener('click', () => logOut());
});

const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in before accessing the site")
        window.location.href = "login.html"
    } else if (!!token) {
        fetchBooks();
    }
}



function logOut() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
};

async function fetchBooks() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:1337/api/books?populate=*", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        console.log("Books:", data.data);
        displayBooks(data.data);

    } catch (error) {
        console.error("Error fetching books:", error);
    }
}


async function displayBooks(books) {
    const bookContainer = document.getElementById("book-container");
    bookContainer.innerHTML = "";

    for (let book of books) {
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
            <h3 class="book-title">${book.title}</h3>
            <img src="${image}" alt="${image}" class="book-cover">
        </div>
        <div class="book-container-right book-container-both">
            <h4>Author: ${book.author}</h4>
            <h4>Rating: ${ratingText}</h4>
            <button class="save-to-user">save</button>
        </div>
        `;
        const saveButton = item.querySelector('.save-to-user');
        saveButton.addEventListener('click', () => addBookToUser(book.documentId));
        bookContainer.appendChild(item);
    }
}
