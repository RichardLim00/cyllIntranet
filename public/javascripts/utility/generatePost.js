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
    likeButton.appendChild(likeButtonText);
    likeButtonText.innerHTML = `${postObject.likers} Love It! `;
    likeButton.appendChild(likeButtonIcon);

    buttonsWrap.appendChild(hateButton);                // Hate Button
    hateButton.appendChild(hateButtonText);
    hateButtonText.innerHTML = `${postObject.haters} Love It! `;
    hateButton.appendChild(hateButtonIcon);

    likeHatePanel.appendChild(authorWrapper);           // Author
    authorWrapper.appendChild(authorText);
    authorText.appendChild(authorProfileLink);
    authorProfileLink.setAttribute('href', `/dashboard/profile/user/${postObject.author.id}`);
    authorProfileLink.innerHTML = postObject.author.username;

    return rowWrap;
}

function generateElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }

    return element;
}
