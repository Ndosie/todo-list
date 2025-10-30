import { Project, Todo } from "../modal/modals.js"
import { deleteItem, update, retrieve, save } from "../service/local_storage.js"
import { validateInputs, showError} from "./validate_form.js"

let projects = []
let todos = []

function printReport() {
    projects = retrieve('projects')
    todos = retrieve('todos')
    projects.forEach(project => {
        console.log(`Project Title: ${project.title}`)
        console.log('Todos')
        const projectTodos = todos.filter(todo => todo.projectId === project.id)
        if (projectTodos.length !== 0) {
            projectTodos.forEach(todo => {
                console.log(`Title: ${todo.title} due on ${todo.dueDate}`)
            })
        } else {
            console.log('No todos.')
        }
    });
}

function setProjects() {
    const cardsDiv = document.querySelector('.cards')
    projects = retrieve('projects')
    todos = retrieve('todos')

    let projectsContent = ``
    projects.forEach(project => {
        projectsContent += `<div class="card">
                <button type="button" class="collapsible">${project.title}</button>`
        projectsContent += `<div class="todos">`
        const projectTodos = todos.filter(todo => todo.projectId === project.id)
        if (projectTodos.length !== 0) {
            projectTodos.forEach(todo => {
                projectsContent += `<p id=${todo.id} class="todo">${todo.title} by ${todo.dueDate}</p>`
            })
        } else {
            projectsContent += `<div>No todos for this project, Please add one.</div>`
        }
        projectsContent += `<button type="button" class="add-todo" id=${project.id}>Add todo</button></div></div>`            
    })
    cardsDiv.innerHTML = projectsContent
}

printReport()
setProjects()

const collapseBtns = document.querySelectorAll('.collapsible')
const addProjectBtn = document.querySelector('#add-project')
const addProjectDlg = document.querySelector('#project-form')
const cancelProjectDlg = document.querySelector('#project-cancel-dia')
const addTodoBtns = document.querySelectorAll('.add-todo')
const addTodoDlg = document.querySelector('#todo-form')
const cancelTodoDlg = document.querySelector('#todo-cancel-dia')
const todoPars = document.querySelectorAll('.todos p')
const detailsDlg = document.querySelector('#todo-details')
const closeIcon =document.querySelector('#close-icon')
const addProjectForm = document.querySelector('#add-project-form')
const addTodoForm = document.querySelector('#add-todo-form')
let projectId = ""

collapseBtns.forEach((btn) => {
    btn.addEventListener('click', function() {
        this.classList.toggle("active");
        let card = this.nextElementSibling;
        if (card.style.display === "block") {
            card.style.display = "none"
        } else {
            card.style.display = "block"
        }
    })
})

addProjectBtn.addEventListener('click', () => {
    addProjectDlg.showModal()
})

cancelProjectDlg.addEventListener('click', () => {
    addProjectDlg.close()
})

addTodoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        projectId = e.target.id
        addTodoDlg.showModal()
    })
})

cancelTodoDlg.addEventListener('click', () => {
    addTodoDlg.close()
})

todoPars.forEach(par => {
    par.addEventListener('click', (e) => {
        detailsDlg.showModal()
        const detailsDiv = document.querySelector(".dia-details")
        const titleH3 = document.querySelector('.dia-header-todo h3')
        const todo = todos.find(todo => todo.id === e.target.id)
        const project = projects.find(project => project.id === todo.projectId)

        titleH3.textContent = project.title
        detailsDiv.innerHTML = `
            <h4>${todo.title}</h4>
            <p>Priority: ${todo.priority}</p>
            <p>Due Date: ${todo.dueDate}</p>
            <p>Done?<input type="checkbox" id="${todo.id}"/></p>
        `
    })
})

closeIcon.addEventListener('click', () => {
    detailsDlg.close()
})

validateInputs()

addProjectForm.addEventListener('submit', (event) => {
    if (!addProjectForm.checkValidity()) {
        event.preventDefault()
        showError()
        return
    } else {
        const formData = new FormData(addProjectForm)
        const projectTitle = formData.get("project-title")
        const description = formData.get("description")
        const project = new Project(projectTitle, description)
        
        save(project, 'projects')
        addProjectForm.reset()
        addProjectDlg.close()
        printReport()
        setProjects()
    }
})

addTodoForm.addEventListener('submit', (event) => {
    if (!addTodoForm.checkValidity()) {
        event.preventDefault()
        showError()
        return
    } else {
        const formData = new FormData(addTodoForm)
        const todoTitle = formData.get("todo-title")
        const priority = formData.get("priority")
        const dueDate = formData.get("due-date")
        const todo = new Todo(projectId, todoTitle, priority, dueDate)
        
        save(todo)
        addTodoForm.reset()
        addTodoDlg.close()
        printReport()
        setProjects()
    }
})