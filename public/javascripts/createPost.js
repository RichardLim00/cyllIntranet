
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
    // eslint-disable-next-line no-undef
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
        if (this.readyState === 2 && this.status === 200) {
            console.log('Post Submitted!')
        }
    }

    // eslint-disable-next-line no-undef
    const postFormData = new FormData();

    postFormData.append('title', post.title);
    postFormData.append('content', post.content);

    ajax.open('POST', '/dashboard/createPost');
    ajax.send(postFormData);
}
