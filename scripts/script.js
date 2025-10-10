import { Project, Todo } from "../modal/modals"
import { retrieve, save } from "../service/local_storage"

let projects = []
let todos = []

const proj1 = new Project('Todo Application', 'An application which saves todos')
projects.push(proj1)
save('projects', JSON.stringify(projects))
const proj2 = new Project('Mic Courier Website', 'A static website which display information')
projects.push(proj2)
save('projects', JSON.stringify(projects))

const todo1 = new Todo(projects[0].id, 'Prepare pseudocode', '11/10/2025', 'High')
todos.push(todo1)
save('todos', JSON.stringify(todos))
const todo2 = new Todo(projects[1].id, 'Set a project scheleton', '11/10/2025', 'Medium')
todos.push(todo2)
save('todos', JSON.stringify(todos))

projects = JSON.parse(retrieve('projects'))
todos = JSON.parse(retrieve('todos'))

projects.forEach(project => {
    console.log(`Project Title: ${project.title}`)
    console.log('Todos')
    const projectTodos = todos.filter(todo => todo.projectId === project.id)
    projectTodos.forEach(todo => {
        console.log(`Title: ${todo.title} due on ${todo.dueDate}`)
    })
});