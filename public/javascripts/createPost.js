import generatePost from './utility/generatePost.js';
const submitButton = document.getElementById('newPostSubmit');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Grab Text Elements
    const newPost = {
        title: document.getElementById('newPostTitle').value,
        content: document.getElementById('newPostContent').value
    }

    submitPost(newPost);
})

function submitPost (post) {
    const postFormData = new FormData();

    postFormData.append('title', post.title);
    postFormData.append('content', post.content);

    fetch('/dashboard/createPost', {method: 'POST', body: postFormData})
        .then((response) => {
            if(response.status == 200){
                reloadPostBasket();
            } else if(response.status == 400) {
                alert('Post Failed..., Please Refresh and Retry')
            }
        })
}

function reloadPostBasket(){
    fetch('/dashboard/loadPosts', {method: 'GET'})
        .then((response) => {
            response.json()
                .then(posts => {
                    const postBasket = document.getElementById('postBasket')
                    postBasket.innerHTML = '';

                    posts.reverse().forEach((post) => {
                        postBasket.appendChild(generatePost(post));
                    })

                    document.getElementById('newPostTitle').value = '';
                    document.getElementById('newPostContent').value = '';
                })
        })
}
