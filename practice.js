// Add an item to the list 

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemClear = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formButton = itemForm.querySelector('button');
let isEditMode = false;


function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    });

    checkItemsVisibility();
}


function createDelButton(className) {
    // Create a del button 
    const delButton = document.createElement('button');
    delButton.className = className;    
    // Append the i ele into the button
    delButton.appendChild(createIcon('fa-solid fa-xmark'));
    return delButton;
}

function createIcon(className) {
    // Create i class
    const iIcon = document.createElement('i');
    iIcon.className = className;

    return iIcon;
}

function createLiEle(name) {
     // Create a new li ele - the value of this newly created li is the newItem
     const li = document.createElement('li');
     li.appendChild(document.createTextNode(name));
     li.appendChild(createDelButton('remove-item btn-link text-red'));
     return li;
}


function onAddItemSubmit(e) {
    // We don't want the form to submit the item, we want to stop that and do whatever we want
    e.preventDefault();
    // We don't want to add an empty item 
    const newItem =  itemInput.value;
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    // Update an item steps: 
    // 1- We select an item that is in edit-mode
    // 2- Remove the item from localStorage
    // 3- Remove the edit-mode attribute that read from the .css file
    // 4- Remove the item from the DOM
    // 5- Set the isEditMode = false
    
    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('Item already exists!');
            return;
        }
    }

    // Append the newly created li into the mainList
    // itemList.appendChild(createLiEle(newItem));
    addItemToDOM(newItem);

    // Add item to localStorage
    addItemToStorage(newItem);

    // When we add an item, check for the visibility of items in order to display the clearAll button and Filter box
    checkItemsVisibility();

    // Clear the value after added 
    itemInput.value = '';

    
}


function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        // Click on the button outside of the x icon, the text should be grey out
        setItemToEditMode(e.target);
        // The form button should change to `Edit Item`
        formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
        formButton.style.backgroundColor = '#228B22';
        // Put the textContent of the item into the input form
        itemInput.value = e.target.textContent;
        itemInput.focus(); 
    }
}


function setItemToEditMode(item) {
    isEditMode = true;
    // item.style.color = "#ccc";
    // Remove all clicked items that was in edit-mode, only allow click item at run time to be in edit-mode
    itemList.querySelectorAll('li')
            .forEach(i => i.classList.remove('edit-mode'))

    item.classList.add('edit-mode'); // Get edit-mode class from .css file
}

function removeItem(item) {
    if (confirm(`Are you sure you want to delete: ${item.textContent} `)) {
        item.remove();
    }

    // remove item from storage
    removeItemFromStorage(item.textContent);

    checkItemsVisibility();

}


function updateItem(item) {

}


function removeItems() {
    document.querySelectorAll('li').forEach(item => item.remove());
}


function removeItemsWhile() {
    // Remove all items from DOM
    confirm('Are you sure you want to remove all?')
    while (itemList.firstChild) {
        itemList.firstChild.remove();
        // itemList.removeChild(itemList.firstChild);
    }
    
    // Remove all Items from LocalStorage
    // localStorage.clear(); beware because it will get rid of all storage
    localStorage.removeItem('items');

    // Check UI
    checkItemsVisibility();
}

// In case there is no item available, the clearAll button should be disabled


function checkItemsVisibility() {
    const items = document.querySelectorAll('li');
    if (items.length === 0) {
        itemClear.style.display = 'none';
        itemFilter.style.display = 'none';
    
    } else {
        itemClear.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    // The form button should change back to `Add Item` after updated 
    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formButton.style.backgroundColor = 'black';
    isEditMode = false;
}

function filterItem(e) {
    const input = e.target.value.toLowerCase();
    const items = document.querySelectorAll('li');

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();
        if (itemName.indexOf(input) != -1) {
            console.log(true);
            item.style.display = 'flex';

        }else {
            console.log(false);
            item.style.display = 'none';
        }
    })
}

function addItemToDOM(item) {
    itemList.appendChild(createLiEle(item));
}


function addItemToStorage(item) {
    // create an emtpy array 
    let itemsFromStorage = getItemFromStorage();

    // put items into the array
    itemsFromStorage.push(item);
    // covert to JSON string and set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    // Filter out item to be removed 
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set the localStorage with removed items from itemsFromStorage 
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function getItemFromStorage() {
    // create an emtpy array 
    let itemsFromStorage;

    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}


function checkIfItemExists(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);

    /* if(itemsFromStorage.includes(item)) {
        return true;

    } else { return false; } */
}


// Initialize app
function initApp() {
    // Event Listener
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    itemClear.addEventListener('click', removeItemsWhile);
    itemFilter.addEventListener('input', filterItem);

    // Display items from storage to the DOM
    document.addEventListener('DOMContentLoaded', displayItems);
}

initApp();

checkItemsVisibility();


