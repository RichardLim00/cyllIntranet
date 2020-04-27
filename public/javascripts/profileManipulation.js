let manipulationPanel = document.getElementById('manipulationPanel')
let editButton = document.getElementById('profileEditButton');
let deleteButton = document.getElementById('profileDeleteButton');
const biographyElement = document.getElementById('profileBiography');

editButton.addEventListener('click', (e) => {

    // Generate Confirm Button
    const confirmEditCol = generateConfirmCol();
    manipulationPanel.appendChild(confirmEditCol);

    // Disable Edit Button
    editButton.setAttribute('disabled', '');

    // Turns attributes value into inputs
    const biographyInput = document.createElement('textarea');
    biographyInput.id = 'biographyInput';
    biographyInput.value = biographyElement.innerHTML.trim();
    biographyInput.className = 'form-control'
    biographyElement.replaceWith(biographyInput);
})

deleteButton.addEventListener ('click' , async (e) => {
    await fetch ('/dashboard/profile/delete', { method: 'POST' })
        .then ((response) => {
            console.log(response)
            if(response.status == 200){
                window.location.href = '/'
            } else if(response.status == 500) {
                // May be optimized to use a modal instead.
                alert('Account Delete Failed');
            }
        })

})


function generateConfirmCol(){
    // Div Wrapper
    const colWrap = document.createElement('div');
    colWrap.className = 'col';
    colWrap.id = 'confirmButtonWrapper';

    // Button
    const confirmEditButton = document.createElement('button');
    confirmEditButton.className = 'col btn btn-success';
    confirmEditButton.addEventListener('click', saveBiography);
    
    // Check Icon
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check';

    colWrap.appendChild(confirmEditButton);
    confirmEditButton.appendChild(checkIcon);

    return colWrap;
}

async function saveBiography() {
    const biographyInput = document.getElementById('biographyInput');
    const newBioContent = biographyInput.value;

    // Validation
    if(newBioContent.trim() === ''){
        // Alert Invalid Input
        return;
    }


    // Submit New Profile to Server
    const newProfileAttribute = new FormData();
    newProfileAttribute.append('bio', newBioContent);
    let responseStatus;

    await fetch('/dashboard/profile/update', {
        method: 'POST',
        body: newProfileAttribute
    }).then((response) => {
        if(response.status == 200){
            alert('Update Success!')
        } else if(response.status == 406){
            alert('Inputs is not accepted');
        } else if(response.status == 500) {
            alert('Something is wrong with the Server... Try again...')
        }

        responseStatus = response.status;
    })

    // Revert Input into elements
    if(responseStatus == 200){
        biographyElement.innerHTML = newBioContent;
    }

    biographyInput.replaceWith(biographyElement);

    // Revert Manipulation Panel
    editButton.removeAttribute('disabled')
    document.getElementById('confirmButtonWrapper').remove();
}