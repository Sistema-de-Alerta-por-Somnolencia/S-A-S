// Select the elements from the DOM
var addButton = document.getElementById('add-item-button');
var itemInput = document.getElementById('new-item-input');
var dynamicList = document.getElementById('dynamic-list');

// Define the function to add a new item to the list
function addNewItem() {
  // Get the value from the input field
  var newItemValue = itemInput.value.trim();

  // Check if the input is not empty
  if (newItemValue) {
    // Create a new list item element
    var listItem = document.createElement('li');
    listItem.textContent = newItemValue;

    // Append the new list item to the dynamic list
    dynamicList.appendChild(listItem);

    // Clear the input field for the next item
    itemInput.value = '';
  } else {
    alert('Please enter an item.');
  }
}

// Add an event listener to the 'Add Item' button
addButton.addEventListener('click', addNewItem);

// Optional: Add an event listener for the Enter key in the input field
itemInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    addNewItem();
  }
});
