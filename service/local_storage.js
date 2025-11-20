let projects = []
let todos = []


export const save = (data, key='todos') => {
    if (key === 'todos') {
        todos = retrieve(key)
        todos.push(data)
        localStorage.setItem(key, JSON.stringify(todos))
    } else {
        projects = retrieve(key)
        projects.push(data)
        localStorage.setItem(key, JSON.stringify(projects))
    }
    
}

export const retrieve = (key) => {
    return JSON.parse(localStorage.getItem(key)) ? JSON.parse(localStorage.getItem(key)) : []
}

export const update = (id, data, key="todos") => {
    if (key === 'todos') {
        todos = retrieve(key)
        const todo = todos.find(todo => todo.id === id)
        todo.title = data.title
        todo.dueDate = data.dueDate
        todo.priority = data.priority
        todo.status = data.status
        localStorage.setItem(key, JSON.stringify(todos))
    } else {
        projects = retrieve(key)
        const project = projects.find(project => project.id === id)
        project.title = data.title
        project.description = data.description
        localStorage.setItem(key, JSON.stringify(projects))
    }
}

export const deleteItem = (id, key='todos') => {
    if (key === 'todos') {
        todos = retrieve(key)
        todos = todos.filter(todo => todo.id !== id)
        localStorage.setItem(key, JSON.stringify(todos))
    } else {
        todos = retrieve(key)
        projects = retrieve(key)
        todos = todos.filter(todo => todo.projectId !== id)
        projects = projects.filter(project => project.id !== id)
        localStorage.setItem('todos', JSON.stringify(todos))
        localStorage.setItem(key, JSON.stringify(projects))
    }
}