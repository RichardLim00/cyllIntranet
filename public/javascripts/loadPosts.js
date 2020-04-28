import generatePost from './utility/generatePost.js'
const loadIndicator = document.getElementById('load-indicator')

fetch('/dashboard/loadPosts', {method: 'GET'})
    .then((response) => {
        response.json()
            .then((posts) => {
                const postBasketElement = document.getElementById('postBasket')
                if(posts.length > 0){

                    loadIndicator.remove();
                    
                    posts.reverse().forEach((post) => {
                        postBasketElement.appendChild(generatePost(post));
                    })
                } else {
                    loadIndicator.innerHTML = 'No Card for Now, Post one?'
                }

            }).catch(() => {
                loadIndicator.innerHTML = 'Please Refresh Your Browser...'
            })
    }).catch(() => {
        loadIndicator.innerHTML = 'Refresh Your Browser Please...'
    })

