import { getBookRating } from "./api.js";

const BASE_URL = "http://localhost:1337";

document.addEventListener("DOMContentLoaded", () => {
    isLoggedIn();
});

const isLoggedIn = () => {
    const token = localStorage.getItem("jwt");
    const username = localStorage.getItem("user");
    if (!token) {
        alert("Please log in before accessing the site")
        window.location.href = "login.html"
    } else if (!!token) {
        fetchBooks();
    }
}

const logOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "login.html";
};

function fetchBooks() {
    const token = localStorage.getItem("jwt");
    fetch("http://localhost:1337/api/books?populate=*", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch books");
            return response.json();
        })
        .then(data => {
            console.log("Books:", data.data);
            displayBooks(data.data);
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
}

function displayBooks(books) {
    const bookContainer = document.getElementById("book-container");
    bookContainer.innerHTML = ""
    books.forEach(book => {
        let test = getBookRating(book.id)
        console.log(book.id)
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
            <h4>Rating 4.5/5</h4>
        </div>
        `;
        bookContainer.appendChild(item);
    });
}
