const formInputs = document.querySelectorAll("input")

const projectTitle = document.querySelector('#project-title')
const projectDesc = document.querySelector('#description')

const todoTitle = document.querySelector('#todo-title')
const priority = document.querySelector('#priority')
const dueDate = document.querySelector('#due-date')

const projectTitleError = document.querySelector('#project-title + span.error')
const projectDescError = document.querySelector('#description + span.error')
const todoTitleError = document.querySelector('#todo-title + span.error')
const priorityError = document.querySelector('#priority + span.error')
const dueDateError = document.querySelector('#due-date + span.error')


function showError() {
    if (projectTitle.validity.valueMissing) {
        projectTitleError.textContent = "Please enter the project title"
    } else if(projectTitle.validity.tooShort) {
        projectTitleError.textContent = "The project title must be at least three characters"
    }

    if (projectDesc.validity.valueMissing) {
        projectDescError.textContent = "Please enter the project description"
    } else if (projectDesc.validity.tooShort) {
        projectDescError.textContent = "The project description must be at least three characters"
    }

    if (todoTitle.validity.valueMissing) {
        todoTitleError.textContent = "Please enter the todo title"
    } else if (todoTitle.validity.tooShort) {
        todoTitleError.textContent = "The todo title must be at least three characters"
    }

    if (priority.validity.valueMissing) {
        priorityError.textContent = "Please select the todo priority"
    }

    if (dueDate.validity.valueMissing) {
        dueDateError.textContent = "Please select the todo due date"
    } else if (new Date(dueDate.value) < new Date()) {
        dueDateError.textContent = "Please enter a date from tomorrow."
    }
}

function validateInputs() {
    projectDesc.addEventListener("input", (event) => {
        if (event.target.validity.valid) {
            projectDescError.textContent = ""
        } else {
            showError()
        }
    })

    formInputs.forEach(input => {
        input.addEventListener("input", (event) => {
            const id = event.target.id
            
            switch (id) {
                case "project-title":
                    if (event.target.validity.valid) {
                        projectTitleError.textContent = ""
                    } else {
                        showError()
                    }
                    break;
                case "description":
                    if (event.target.validity.valid) {
                        projectDescError.textContent = ""
                    } else {
                        showError()
                    }
                    break;
                case "todo-title":
                    if (event.target.validity.valid) {
                        todoTitleError.textContent = ""
                    } else {
                        showError()
                    }
                    break;
                case "priority":
                    if (event.target.validity.valid) {
                        priorityError.textContent = ""
                    } else {
                        showError()
                    }
                    break;
                case "due-date":
                    if (event.target.validity.valid) {
                        dueDateError.textContent = ""
                    } else {
                        showError()
                    }
                    break;
            }
        })
    })
}

export { validateInputs, showError }