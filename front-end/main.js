const loginForm = document.getElementById("loginForm");


// [BUTTON] loginBtn
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    console.log(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken)
});


const registerForm = document.getElementById("registerForm");

// [BUTTON] registerBtn
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    console.log(data);
});

// [FUNCTION] refresh access token
async function refreshAccessToken() {

    const refreshToken = localStorage.getItem("refreshToken");

    const response = await fetch("/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);

        console.log("Access Token refreshed");

        return data.token;
    }

    console.log("Refresh Token expired");
    return null;
}

// [INTERVAL] refresh access token
setInterval(() =>{
    refreshAccessToken();
}, 9 * 60 * 1000);