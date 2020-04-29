const addFriendButton = document.getElementById('addFriendButton');

addFriendButton.addEventListener('click', (e) => {
    const friendId = document.location.href.split('/').pop();

    fetch(`/dashboard/profile/user/add/${friendId}`, {method:'POST'})
        .then((response) => {
            if(response.status == 200){
                document.getElementById('addFriendButton').remove();
            }
        })
})