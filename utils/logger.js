const info = (...params) => {
    console.log(...params)
}

const erro = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}