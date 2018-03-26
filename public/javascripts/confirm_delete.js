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
// Create a function to clear all tasks from completed list
var deleteCheck = document.querySelectorAll('.clear-all-button');

deleteCheck.forEach(function(button){
// Add a listener for when 'clear-all-button' button is clicked
  button.addEventListener('click', function(eve){

    // Show a confirm dialog box/window
    var clearList = confirm('Are you sure you want to delete list?');

    //If user presses no, prevent the form submit
    if (!clearList) {
      eve.preventDefault(); //Prevent the click event propagating
    }

  })
});
