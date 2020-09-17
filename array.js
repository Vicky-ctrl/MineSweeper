const clonedArray = function(array) {
    return array.slice(0)
}
const clonedSquare = function(array) {
    let l = []
    for (let i = 0; i < array.length; i++) {
        let e = array[i]
        let line = clonedArray(e)
        l.push(line)
    }
    return l
}

const random01 = function() {
    let n = Math.random()
    // n 是 0 - 10 之间的小数
    n = n * 10
    // 取整, n 是 0 - 10 之间的整数
    n = Math.floor(n)
    // 用余数来取得范围
    return n % 2
}

const randomLine01 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let e = random01()
        l.push(e)
    }
    return l
}

//0 和 1 的二维数组
const randomSquare01 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let e = randomLine01(n)
        l.push(e)
    }
    return l
}

//生成09的行数组
const randomLine09 = function(n) {
    let line = randomLine01(n)
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 1) {
            line[i] = 9
        }
    }
    return line
}

//生成09的二维数组
const randomSquare09 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let e = randomLine09(n)
        l.push(e)
    }
    return l
}

//上面不对，现在是随机的 0 和 9，怎么生成只有 10 个 9 的数组呢

//尝试
//1 先建立一个都是 00 的数组
const Line00 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        l.push(0)
    }
    return l
}
const Square00 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let e = Line00(n)
        l.push(e)
    }
    return l
}

//2 随机两个数作为坐标，随机十个
const random_ij = function(m) {
    let n = Math.random()
    // n 是 0 - 10 之间的小数
    n = n * m
    // 取整, n 是 0 - 10 之间的整数
    n = Math.floor(n)
    // 用余数来取得范围
    return n
}

const random_i = function(n) {
    let r = []
    for (let i = 0; i < n; i++) {
        let n = random_ij(9)
        r.push(n)
    }
    return r
}

//3 让坐标等于 9
const unique = function(array) {
    let s = new Set(array)
    let a = Array.from(s)
    return a
}

const square09 = function() {
    let coord_i = clonedArray(random_i(10))
    let coord_j = clonedArray(random_i(10))
    let s = clonedSquare(Square00(9))
    let r = []
    for (let i = 0; i < 10; i++) {
        let n = coord_i[i]
        let m = coord_j[i]
        s[n][m] = 9
        r.push(`${n}${m}`)
    }
    let r_set = unique(r)
    log('r_set.length', r_set.length)
    if (r_set.length < 10) {
        log('you')
        square09()
    }
    return s
}
log('result is', square09())

//以下为生成周围 8 个格子加一的函数

const plus1 = function(array, x, y) {
    // 1. array[x][y] 不能是 9
    // x 和 y 符合边界条件
    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

const markAround = function(array, x, y) {
    if (array[x][y] === 9) {
        // 先标记左边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x, y - 1)
        plus1(array, x + 1, y - 1)
        // 标记上下 2 个
        plus1(array, x - 1, y)
        plus1(array, x + 1, y)
        // 标记右边 3 个
        plus1(array, x - 1, y + 1)
        plus1(array, x, y + 1)
        plus1(array, x + 1, y + 1)
    }
}

const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}

