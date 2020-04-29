export default function generatePost(postObject){

    // Create Elements
    const rowWrap = generateElement('div', 'row mt-3');
    const card = generateElement('div', 'card m-auto col-10');
    const cardTitle = generateElement('div', 'card-title p-2 d-flex justify-content-between')
    const cardTitleText = generateElement('h4', 'd-inline mr-1');
    const cardTitleDate = generateElement('span', 'text-muted');
    const cardBody = generateElement('div', 'card-body pb-2 pt-0 pl-2');
    const cardBodyContent = generateElement('p');
    const separator = generateElement('hr');
    const likeHatePanel = generateElement('div', 'card-body p-0 d-flex justify-content-between');
    const buttonsWrap = generateElement('div');
    const likeButton = generateElement('button', 'btn btn-outline-success mb-2 mr-2');
    const likeButtonText = generateElement('span');
    const likeButtonIcon = generateElement('i', 'far fa-laugh-wink');
    const hateButton = generateElement('button', 'btn btn-outline-danger mb-2');
    const hateButtonText = generateElement('span');
    const hateButtonIcon = generateElement('i', 'far fa-angry');
    const authorWrapper = generateElement('div', 'align-self-center');
    const authorText = generateElement('h4', 'lead');
    const authorProfileLink = generateElement('a');

    // Embed Elements
    rowWrap.appendChild(card);                          // Card 
    card.appendChild(cardTitle);                        // Card Title
    cardTitle.appendChild(cardTitleText);
    cardTitleText.innerHTML = postObject.title
    cardTitle.appendChild(cardTitleDate);

    card.appendChild(cardBody);                         // Card Body
    cardBody.appendChild(cardBodyContent);
    cardBodyContent.innerHTML = postObject.content;

    card.appendChild(separator);                        // Separator

    card.appendChild(likeHatePanel);                    // Like Hate Panel
    likeHatePanel.appendChild(buttonsWrap);

    buttonsWrap.appendChild(likeButton);                // Like Button
    likeButton.id = `like:${postObject.id}`
    likeButton.addEventListener('click', likeHateClick);
    likeButton.appendChild(likeButtonText);
    likeButtonText.innerHTML = `${postObject.likers} Love It! `;
    likeButton.appendChild(likeButtonIcon);

    buttonsWrap.appendChild(hateButton);                // Hate Button
    hateButton.id = `hate:${postObject.id}`
    hateButton.addEventListener('click', likeHateClick);
    hateButton.appendChild(hateButtonText);
    hateButtonText.innerHTML = `${postObject.haters} Hate It! `;
    hateButton.appendChild(hateButtonIcon);

    likeHatePanel.appendChild(authorWrapper);           // Author
    authorWrapper.appendChild(authorText);
    authorText.appendChild(authorProfileLink);
    authorProfileLink.setAttribute('href', `/dashboard/profile/user/${postObject.author.id}`);
    authorProfileLink.innerHTML = postObject.author.username;

    // Like Hate Button Appearance Logic
    if (postObject.userLike) {
        likeButton.className = 'btn btn-success mb-2 mr-2';
    }

    if(postObject.userHate) {
        hateButton.className = 'btn btn-danger mb-2'
    }

    return rowWrap;
}

function generateElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }

    return element;
}

function likeHateClick() {
    const action = this.id.split(':');
    const partnerAction = (action[0] == 'like' ? 'hate' : 'like');
    const partnerButton = document.getElementById(`${partnerAction}:${action[1]}`);
    const isSelected = !this.className.includes('outline');
    const ownNumber = Number(this.innerHTML.match(/\d/)[0]);
    const partnerNumber = Number(partnerButton.innerHTML.match(/\d/)[0]);
    let route = '';

    if(action[0] === 'like') {
        route = 'likePost'
    } else if(action[0] === 'hate') {
        route = 'hatePost'
    }

    const partnerType = partnerButton.className.match(/(danger|success)/)[0];
    if(!isSelected){
        this.innerHTML = this.innerHTML.replace(/\d/, ownNumber + 1);
        if(partnerNumber != 0) {
            partnerButton.innerHTML = partnerButton.innerHTML.replace(/\d/, partnerNumber - 1)
        }

        this.className = this.className.replace('-outline', '');
        partnerButton.className = partnerButton.className.replace(/btn-(danger|success)|btn-outline-(danger|success)/, `btn-outline-${partnerType}`)
    } else {
        if(partnerType != 'danger'){
            this.className = this.className.replace(/btn-danger/, 'btn-outline-danger');
        } else {
            this.className = this.className.replace(/btn-success/, 'btn-outline-success');
        }

        this.innerHTML = this.innerHTML.replace(/\d/, ownNumber - 1);
    }

    fetch(`/dashboard/${route}/${action[1]}`, {method: 'POST'})
}
