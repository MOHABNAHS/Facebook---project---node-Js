// [FUNCTION] getPosts
async function getPosts(){
    const token = await localStorage.getItem("token");
    console.log("TOKEN:", token);

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

        <div class="comments">
            <input
                type="text"
                class="comment-input"
                placeholder="Write a comment..."
            >

            <button class="comment-button">Comment</button>

            <div class="comments-list"></div>
        </div>
    `;

    postsContainer.appendChild(postElement);

    const commentInput = postElement.querySelector(".comment-input");
    const commentButton = postElement.querySelector(".comment-button");

    const commentsList = postElement.querySelector(".comments-list");

    getComments(post.id, commentsList);

    commentButton.addEventListener("click", async () => {
        const text = commentInput.value;

        if (!text) return;

        await addComment(post.id, text);

        commentInput.value = "";
    });

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

// [FUNCTION] addComments
async function addComment(post_id, text) {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/comments", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            text: text,
            post_id: post_id
        })
    });

    const data = await response.json();

    console.log(data);
}

// [FUNCTION] getComments
async function getComments(post_id, commentsList) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:5000/comments`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    commentsList.innerHTML = "";

    data
        .filter(comment => comment.post_id === post_id)
        .forEach(comment => {
            const commentElement = document.createElement("div");

            commentElement.classList.add("comment");

            commentElement.innerHTML = `
                <strong>${comment.username}</strong>
                <p>${comment.text}</p>
            `;

            commentsList.appendChild(commentElement);
        });
}