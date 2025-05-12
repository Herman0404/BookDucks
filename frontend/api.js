const BASE_URL = "http://localhost:1337/api/"

export async function getBookRating(id, endpoint = `books/${id}?populate=ratings`) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    // Directly assign the ratings (no need for `await` here)
    let ratings = data.data.ratings;

    return ratings;
}

export const addBookToProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        // Check if token is available
        if (!token) {
            console.error("No JWT token found.");
            return;
        }

        const response = await axios.get("http://localhost:1337/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response);
        if (response.status === 200) {
            console.log("You are logged in! Welcome " + response.data.username);
        }
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.log("Error Response:", error.response);
            if (error.response.status === 403) {
                console.log("Forbidden: You don't have permission to access this resource.");
            }
            if (error.response.status === 401) {
                console.log("Unauthorized: Please check your JWT token.");
            }
        } else if (error.request) {
            // No response received
            console.log("Error Request:", error.request);
        } else {
            // Something went wrong in setting up the request
            console.log("Error Message:", error.message);
        }
    }
};
