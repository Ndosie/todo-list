import { Project, Todo } from "../modal/modals.js"
import { deleteItem, update, retrieve, save } from "../service/local_storage.js"
import { validateInputs, showError} from "./validate_form.js"

let projects = []
let todos = []

function setCollapseBtns() {
    const collapseBtns = document.querySelectorAll('.collapsible')
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
}

function setProjects(todos) {
    const cardsDiv = document.querySelector('.cards')
    projects = retrieve('projects')

    if (!todos.length) {
        todos = retrieve('todos')
    }

    if (projects.length) {
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
        setCollapseBtns()
    } else {
        cardsDiv.innerHTML = '<p>There is no projects. Please add one.</p>'
    }
    
}

function filterTodos(id) {
    todos = retrieve('todos')

    switch(id) {
        case 'overdue':
            return todos.filter(todo => {
                const today = new Date()
                return !todo.status && new Date(todo.dueDate) < today;
            })
        case 'today':
            return todos.filter(todo => {
                const today = new Date()
                const dueDate = new Date(todo.dueDate)
                const date1 = new Date(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}T00:00:00Z`);
                const date2 = new Date(`${dueDate.getFullYear()}-${dueDate.getMonth()}-${dueDate.getDate()}T00:00:00Z`);
                return !todo.status && date1.getTime() === date2.getTime();
            })
        case 'week':
            return todos.filter(todo => {
                const today = new Date()
                const dueDate = new Date(todo.dueDate)
                const lastDayWeek = new Date(today)
                lastDayWeek.setDate(today.getDate() + 7)
                return !todo.status && dueDate > today && dueDate <= lastDayWeek
            })
        case 'month':
            return todos.filter(todo => {
                const today = new Date();
                const dueDate = new Date(todo.dueDate)
                const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
                const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)
                return !todo.status && dueDate >= firstDayNextMonth && dueDate <= lastDayNextMonth
            })
        case 'done':
            return todos.filter(todo => todo.status === true)
        default:
            return todos
    }
}

function setNotifications() {
    const overdueSpan = document.querySelector('#overdue > span.notification')
    const todaySpan = document.querySelector('#today > span.notification')
    const weekSpan = document.querySelector('#week > span.notification')
    const monthSpan = document.querySelector('#month > span.notification')
    const doneSpan = document.querySelector('#done > span.notification')
    const allSpan = document.querySelector('#all > span.notification')
    overdueSpan.textContent = filterTodos('overdue').length
    todaySpan.textContent = filterTodos('today').length
    weekSpan.textContent = filterTodos('week').length
    monthSpan.textContent = filterTodos('month').length
    doneSpan.textContent = filterTodos('done').length
    allSpan.textContent = filterTodos('all').length
}

setProjects(todos)

const addProjectBtn = document.querySelector('#add-project')
const addProjectDlg = document.querySelector('#project-form')
const cancelProjectDlg = document.querySelector('#project-cancel-dia')
const addTodoBtns = document.querySelectorAll('.add-todo')
const addTodoDlg = document.querySelector('#todo-form')
const cancelTodoDlg = document.querySelector('#todo-cancel-dia')
const todoPars = document.querySelectorAll('.todos p')
const detailsDlg = document.querySelector('#todo-details')
const closeIcon = document.querySelector('#close-icon')
const addProjectForm = document.querySelector('#add-project-form')
const addTodoForm = document.querySelector('#add-todo-form')
const notificationPars = document.querySelectorAll('.links p')
let projectId = ""

setNotifications()

notificationPars.forEach((para) => {
    para.addEventListener('click', (e) => {
        const id = e.target.id
        todos = filterTodos(id)
        setProjects(todos)
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
            <p>Done?<input type="checkbox" id="check_${todo.id}" ${todo.status ? "checked" : ""}/></p>
        `
        const checkbox = document.querySelector(`#check_${todo.id}`)
        checkbox.addEventListener('change', () => {
            todo.status = todo.status ? false : true
            update(todo.id, todo)
            setNotifications()
        })
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
        setProjects()
    }
})