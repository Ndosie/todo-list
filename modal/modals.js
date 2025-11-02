export class Project {
    constructor(title, description) {
        this.id = crypto.randomUUID()
        this.title = title
        this.description = description
    }
}

export class Todo {
    constructor(projectId, title, priority, dueDate, status=false) {
        this.id = crypto.randomUUID()
        this.projectId = projectId
        this.title = title
        this.dueDate = dueDate
        this.priority = priority
        this.status = status
    }

    toggleStatus() {
        this.status = this.status ? false : true
    }
}