export default function camelize(str) {
    // return str
    //     .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    //         return index === 0 ? word.toUpperCase() : word.toUpperCase()
    //     })
    //     .replace(/\s+/g, '')

    return str.charAt(0).toUpperCase() + str.replace(/_./g, str=>str[1].toUpperCase()).slice(1)
}
