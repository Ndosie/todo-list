export const save = (key, value) => {
    localStorage.setItem(key, value)
}

export const retrieve = (key) => {
    return localStorage.getItem(key)
}