let projects = []
let todos = []


export const save = (data, type='todos') => {
    if (type === 'todos') {
        todos.push(data)
        localStorage.setItem(type, JSON.stringify(todos))
    } else {
        projects.push(data)
        localStorage.setItem(type, JSON.stringify(projects))
    }
    
}

export const retrieve = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

export const update = (key, id, data) => {
    if (key === 'todos') {
        const index = todos.findIndex(todo => todo.id === id)
        todos[index].title = data.title
        todos[index].dueDate = data.dueDate
        todos[index].priority = data.priority
        localStorage.setItem(key, JSON.stringify(todos))
    } else {
        const index = projects.findIndex(project => project.id === id)
        projects[index].title = data.title
        projects[index].description = data.description
        localStorage.setItem(key, JSON.stringify(projects))
    }
}

export const deleteItem = (key, id) => {
    if (key === 'todos') {
        todos = todos.filter(todo => todo.id !== id)
        localStorage.setItem(key, JSON.stringify(todos))
    } else {
        todos = todos.filter(todo => todo.projectId !== id)
        projects = projects.filter(project => project.id !== id)
        localStorage.setItem('todos', JSON.stringify(todos))
        localStorage.setItem(key, JSON.stringify(projects))
    }
}