function partition(array, n) {
    return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    partition,
    sleep
}