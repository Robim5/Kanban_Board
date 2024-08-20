//DOM
//sections
const backlogSection = document.getElementById('backlogsection');
const doingSection = document.getElementById('doingsection');
const reviewSection = document.getElementById('reviewsection');
const doneSection = document.getElementById('donesection');
//buttons
const AddWindowWrite = document.getElementById('addnewtask');
const AddNewTaskTable = document.getElementById('addtotable');
const closeNote = document.getElementById('closenote');
const deleteNote = document.getElementById('deletenote');
const editNote = document.getElementById('editnotedesc');
//windows
const windowWrite = document.querySelector('.windowwrite');
const windowNote = document.querySelector('.seewindow');
const overlay = document.getElementById('overlay');
//closes
const closeWindowWrite = document.getElementById('closewindowwrite');

//variables

//show window to write the task
AddWindowWrite.addEventListener('click', () => {
    windowWrite.style.display = 'block';
    overlay.style.display = 'block';
});
//close window write
closeWindowWrite.addEventListener('click', () => {
    windowWrite.style.display = 'none';
    overlay.style.display = 'none';
});
//close window see
closeNote.addEventListener('click', () => {
    windowNote.style.display = 'none';
    overlay.style.display = 'none';
});

//function image of tasks
function imageTask(task) {
    switch(task) {
        case 'backlog':
            return 'prio/backlog.png';
        case 'doing':
            return 'prio/doing.png';
        case'review':
            return'prio/review.png';
        case 'done':
            return 'prio/done.png';
        default:
            return '';
    }
}

//function to create a task with an image
function createTaskHtml(taskType, taskId) {
    const imgSrc = imageTask(taskType); // Get image 

    return `
    <img src="${imgSrc}" alt="${taskType} task" class="task-image" data-id="${taskId}">
    `;
}

// add task or editing
AddNewTaskTable.addEventListener('click', () => {

    // get task description and title
    const taskDescription = document.getElementById('descrInput').value;
    const taskTitle = document.getElementById('titleInput').value;

    // get task section
    const selectedSection = document.getElementById('stateselect').value;
    const taskSection = document.getElementById(`${selectedSection}section`);

    // create a unique ID for the task
    const taskID = Date.now(); // simple unique ID

    // create new task HTML and append it to the section
    const newTaskHtml = createTaskHtml(selectedSection, taskID);
    const newTask = document.createElement('div');
    newTask.classList.add('tasks');
    newTask.innerHTML = newTaskHtml;
    taskSection.appendChild(newTask);

    // save task info to local storage
    saveTaskInfo({ id: taskID, title: taskTitle, description: taskDescription, section: selectedSection });

    // clear input fields
    document.getElementById('descrInput').value = '';
    document.getElementById('titleInput').value = '';

    if (isediting) {
        
        //delete the old task
        const oldTaskImage = document.querySelector(`.task-image[data-id="${editingtask}"]`);
        if (oldTaskImage) {
            oldTaskImage.parentElement.remove(); // remove the old task div
        }

        //reset mode
        isediting = false;
        editingtask = null;
    } 

    // close window write
    windowWrite.style.display = 'none';
    overlay.style.display = 'none';
    
});


//function to save task information
function saveTaskInfo(task) {
    // save task information
    localStorage.setItem(`task-${task.id}`, JSON.stringify({
        title: task.title,
        description: task.description,
        section: task.section
    }));
}

//function to delete note 
function deleteTask(taskId) {
    //delete the task from local store
    localStorage.removeItem(`task-${taskId}`);

    //remive task from the Dom
    const taskImage = document.querySelector(`.task-image[data-id="${taskId}"]`);
    if (taskImage) {
        taskImage.parentElement.remove(); // remove the task div
    }

    // close window see
    windowNote.style.display = 'none';
    overlay.style.display = 'none';
}

//event listener to delete
deleteNote.addEventListener('click', () => {
    const taskId = windowNote.getAttribute('data-id'); //id task viewing
    deleteTask(taskId);
});

//function to handle image click and show task details
function handleImageClick(event) {
    const image = event.target;
    const taskId = image.getAttribute('data-id'); // retrieve ID from image

    // retrieve task info from local storage
    const taskData = JSON.parse(localStorage.getItem(`task-${taskId}`));

    if (taskData) {
        // show window with task details
        document.getElementById('notetitle').textContent = taskData.title;
        document.getElementById('notetext').textContent = taskData.description;

        // save the task ID in the view window for later
        windowNote.setAttribute('data-id', taskId);

        windowNote.style.display = 'block';
        overlay.style.display = 'block';
    }
}


// Attach to all images
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('task-image')) {
        handleImageClick(event);
    }
});

let isediting = false;
let editingtask = null; //to store the id of task being edited
//edit thing
editNote.addEventListener('click', () => {
    
    //get task info
    const taskId = windowNote.getAttribute('data-id'); // retrieve ID from image
    const taskData = JSON.parse(localStorage.getItem(`task-${taskId}`));
    
    //fill input fields with data
    document.getElementById('titleInput').value = taskData.title;
    document.getElementById('descrInput').value = taskData.description;
    document.getElementById('stateselect').value = taskData.section;

    //open write window
    windowWrite.style.display = 'block';
    overlay.style.display = 'block';

    //set editing mode
    isediting = true;
    editingtask = taskId; //store the id of task being edited

    //close window see
    windowNote.style.display = 'none';
    overlay.style.display = 'none';
});
