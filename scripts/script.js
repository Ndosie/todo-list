import { Project, Todo } from "../modal/modals.js"
import { deleteItem, update, retrieve, save } from "../service/local_storage.js"

const proj1 = new Project('Todo Application', 'An application which saves todos')
save(proj1, 'projects')
const proj2 = new Project('Mic Courier Website', 'A static website which display information')
save(proj2, 'projects')

let projects = retrieve('projects')

const todo1 = new Todo(projects[0].id, 'Prepare pseudocode', '11/10/2025', 'High')
save(todo1)
const todo2 = new Todo(projects[1].id, 'Set a project scheleton', '11/10/2025', 'Medium')
save(todo2)
const todo3 = new Todo(projects[0].id, 'Prepare Designs', '16/10/2025', 'Medium')
save(todo3)
let todos = retrieve('todos')

function printReport() {
    projects = retrieve('projects')
    todos = retrieve('todos')
    projects.forEach(project => {
        console.log(`Project Title: ${project.title}`)
        console.log('Todos')
        const projectTodos = todos.filter(todo => todo.projectId === project.id)
        projectTodos.forEach(todo => {
            console.log(`Title: ${todo.title} due on ${todo.dueDate}`)
        })
    });
}
console.log('Start')
printReport()

update('projects', projects[0].id, {title:'I have changed a project', description: 'do you see me?'})

console.log('After updating a project')
printReport()

update('todos', todos[1].id, {title:'I have changed a todo', description: 'do you see me as a todo?'})
console.log('After updating a todo')
printReport()

deleteItem('projects', projects[1].id)

console.log('After deleting a project')
printReport()

deleteItem('todos', todos[0].id)

console.log('After deleting a todo')
printReport()