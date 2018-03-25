var deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach(function(button){

  button.addEventListener('click', function(ev){

    // Show a confirm dialog
    var okToDelete = confirm('Delete task - are you sure?');

    //If user presses no, prevent the form submit
    if (!okToDelete) {
      ev.preventDefault(); //Prevent the click event propagating
    }

  })
});
