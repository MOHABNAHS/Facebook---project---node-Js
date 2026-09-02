// [FUNCTION] getPosts
async function getPosts(){
    const token = await localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/posts", 
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    const data = await response.json();
    console.log(data);

    const postsContainer = document.getElementById("postsContainer");

    postsContainer.innerHTML = "";

    data.forEach(post =>{
        const postElement = document.createElement("div");
        postElement.classList.add("post");

    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">U</div>

            <div>
                <div class="post-user">${post.username}</div>
                <div class="post-date">${post.created_at}</div>
            </div>
        </div>

        <div class="post-text">
            ${post.text}
        </div>
    `;

    postsContainer.appendChild(postElement);

    })

}
getPosts();


// [FORM] create post
const postForm = document.getElementById("postForm");

postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = document.getElementById("postText").value;
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/posts", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            text: text
        })
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
        document.getElementById("postText").value = "";

        getPosts();
    }
});