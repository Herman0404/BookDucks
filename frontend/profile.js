import { getTheme, isLoggedIn, getUserBooks, getBookRating, getBookRatingAvg, getUserRating, BASE_URL, removeBookFromUser, updateUserRating, addUserRating } from "./api.js";

let currentSort = 'title';

document.addEventListener("DOMContentLoaded", async () => {
    await getTheme();
    await isLoggedIn();
    sortListeners();
    sortBooks(currentSort);
});

async function displayBooks(books) {
    let res = await getUserRating();
    const ratings = res.ratings;
    const bookContainer = document.getElementById("book-container");
    bookContainer.innerHTML = "";
    if (books && books.length > 0) {
        for (let book of books) {
            const matchingRating = ratings.find(rating => rating.book?.id === book.id);
            let userRatingText = "No rating";
            if (matchingRating) {
                userRatingText = matchingRating.rating;
            }

            let button = "<button class='card-button remove-from-user'>remove</button>";
            let giveRatingButton = "<button class='card-button give-rating'>rate</button>";

            const bookRatings = await getBookRating(book.documentId);
            let ratingText = getBookRatingAvg(bookRatings);

            let image = BASE_URL + book.cover.url;
            let item = document.createElement("li");
            item.classList.add("book-item");
            item.innerHTML = `
        <div class="book-container-left book-container-both">
            <img src="${image}" alt="${image}" class="book-cover">
            <h4>Update rating: 
            <input 
            type="number" 
            id="user-rating-${book.id}" 
            class="user-rating-input" 
            value="${userRatingText}" 
            min="1" max="5" step="1">
            </h4>
            ${giveRatingButton}
        </div>
        <div class="book-container-right book-container-both">
            <h3 class="book-title">${book.title}</h3>
            <h4>Author: ${book.author}</h4>
            <h5>Released: ${book.release}</h5>
            <h5>Pages: ${book.pages}</h5>
            <h4 id="book-rating-${book.id}">Rating: ${ratingText}/5</h4>
            <h4>Your rating: <span id="user-rating-text-${book.id}">${userRatingText}</span></h4>
            
            ${button}
        </div>
    `;

            bookContainer.appendChild(item);

            const removeButton = item.querySelector('.remove-from-user');
            const rateButton = item.querySelector('.give-rating');

            removeButton.addEventListener('click', async (e) => {
                e.preventDefault();
                if (confirm(`Do you want to remove ${book.title} from your reading list?`)) {
                    removeBookFromUser(book.documentId);
                    bookContainer.removeChild(item);
                    if (bookContainer.childElementCount === 0) {
                        bookContainer.innerHTML = "Empty, you can add books on the homepage!";
                    }
                }
            });

            rateButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const chosenRating = Number(document.getElementById(`user-rating-${book.id}`).value);
                if (
                    chosenRating &&
                    Number.isInteger(chosenRating) &&
                    chosenRating >= 1 &&
                    chosenRating <= 5
                ) {
                    if (confirm(`Do you want to rate ${book.title} as a ${chosenRating}?`)) {
                        rateButton.disabled = true;

                        try {
                            res = await getUserRating();
                            const ratings = res.ratings;
                            const matchingRating = ratings.find(rating => rating.book?.id === book.id);

                            if (matchingRating) {
                                await updateUserRating(chosenRating, matchingRating.documentId);
                            } else {
                                await addUserRating(chosenRating, book.documentId);
                            }

                            sortBooks();
                        } catch (error) {
                            console.error("Failed to submit rating:", error);
                            alert("Something went wrong while submitting your rating.");
                        } finally {
                            rateButton.disabled = false;
                        }
                    }
                } else {
                    alert("Please choose a valid rating first");
                }
            });

        }

    } else {
        bookContainer.innerHTML = "Empty, you can add books on the homepage!"
        console.log("test")
    }

}

function sortListeners() {
    document.querySelectorAll('input[name="sort-option"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentSort = e.target.value;
            sortBooks(currentSort);
        });
    });

    document.querySelectorAll('input[name="rating-toggle"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            sortBooks(currentSort);
        });
    });
}


async function sortBooks(sort = currentSort) {
    const res = await getUserBooks();
    let books = res.books;

    const ratingRes = await getUserRating();
    const userRatings = ratingRes.ratings;

    let sortedBooks;

    if (sort === 'title') {
        sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'author') {
        sortedBooks = [...books].sort((a, b) => a.author.localeCompare(b.author));
    } else if (sort === 'rating') {
        sortedBooks = [...books].sort((a, b) => {
            const avgA = getBookRatingAvg(a.ratings);
            const avgB = getBookRatingAvg(b.ratings);
            return avgB - avgA;
        });
    } else if (sort === 'user-rating') {
        sortedBooks = [...books].sort((a, b) => {
            const userRatingA = userRatings.find(rating => rating.book?.id === a.id);
            const userRatingB = userRatings.find(rating => rating.book?.id === b.id);

            const ratingA = userRatingA ? userRatingA.rating : 0;
            const ratingB = userRatingB ? userRatingB.rating : 0;

            return ratingB - ratingA;
        });
    }

    displayBooks(sortedBooks);
}