// 实现扫雷程序的流程如下
// 1, 生成扫雷数据
// 2, 根据扫雷数据画图
// 3, 点击的时候根据情况判断
//      因为展开的时候需要对周围的数字进行处理, 所以最好能在地图上记录下标
//
// 为了方便, 我们跳过第一步, 直接用下面给定的数据即可, 这样方便测试
// 直接写死数据
let square = markedSquare(square09())
// let s = ' [[9,1,0,0,0,1,1,1,0],[1,1,0,0,1,2,9,1,0],[1,1,1,0,1,9,2,1,0],[1,9,2,1,1,1,1,0,0],[1,2,9,1,0,0,1,1,1],[1,2,1,1,0,1,2,9,1],[9,1,0,0,1,2,9,2,1],[1,2,1,1,1,9,2,1,0],[0,1,9,1,1,1,1,0,0]]'
// 把字符串转成数组
// let square = JSON.parse(s)


let mime = e('#id-div-mime')

mime.oncontextmenu = function(event){
    let self = event.target
    self.classList.add('sweeper')
    //点击右键后要执行的代码
    //.......
    return false;//阻止浏览器的默认弹窗行为
}

const gameover = function() {
    let mines = es('.cell')
    for (let i = 0; i < mines.length; i++) {
        let m = mines[i].dataset.number
        let n = Number(m)
        if (n === 9) {
            // log('number', mines[i].dataset.number)
            mines[i].classList.add('cell-mine')
        }
    }
    // alert('GAMEOVER','',function(){
    //     location.reload()
    // })
    window.setTimeout("alert('GAMEOVER')",500)
}
// 以我们这个数据为例, 网页布局实际上应该 9 * 9 的格子
// cell 用 float 完成布局, clearfix 是用来解决浮动的方案
// 每一行处理成下面的形式
// data-number 是数字, data-x 和 data-y 分别是数组中的下标
// data-x="0" data-y="3" 表示 square[0][3], 也就是第 1 行第 4 列的格子
// <div class="row clearfix">
//     <div class="cell" data-number="9" data-x="0" data-y="0">9</div>
//     <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
//     <div class="cell" data-number="0" data-x="0" data-y="2">0</div>
//     <div class="cell" data-number="0" data-x="0" data-y="3">0</div>
//     <div class="cell" data-number="0" data-x="0" data-y="4">0</div>
//     <div class="cell" data-number="1" data-x="0" data-y="5">1</div>
//     <div class="cell" data-number="1" data-x="0" data-y="6">1</div>
//     <div class="cell" data-number="1" data-x="0" data-y="7">1</div>
//     <div class="cell" data-number="0" data-x="0" data-y="8">0</div>
// </div>

// 1. templateCell 函数, 参数为数组 line 和变量 x, x 表示第几行
// 返回 line.length 个 cell 拼接的字符串
const templateCell = function(line, x) {
    let r = ''
    for (let i = 0; i < line.length; i++) {
        r += `<div class="cell" data-number="${line[i]}" data-x="${x}" data-y="${i}" id="${x}${i}">${line[i]}</div>`
    }
    return r
}

// 2. templateRow 的参数 square 是二维数组, 用来表示雷相关的数据
// 返回 square.length 个 row 拼接的字符串
// row 的内容由 templateCell 函数生成
const templateRow = function(square) {
    let row = ''
    for(let i = 0; i < square.length; i++) {
        let line = square[i]
        row += templateCell(line, i)
    }
    return row
}

// 3. square 是二维数组, 用来表示雷相关的数据
// 用 square 生成 9 * 9 的格子, 然后插入到页面中
// div container 是 <div id="id-div-mime"></div>
const renderSquare = function(square) {
    let row = templateRow(square)
    appendHtml(mime, row)
}

// 4. 实现 bindEventDelegate 函数, 只处理格子, 也就是 .cell 元素
const bindEventDelegate = function(square) {
    vjkl('.cell', square)
}

// 5. vjkl 是点击格子的函数
// 要注意的是我们在初始情况下就把数字写到了 html 中
// <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
// 而初始情况下数字不应该显示出来的, 可以直接用 font-size: 0; 来隐藏文字
// 点击的时候根据情况用 font-size: 14px;
// (当然这一步应该用 class 来完成, 比如添加 opened class) 的方式显示文字
// 如果已经显示过, 则不做任何处理
// 如果没有显示过, 判断下列情况
// 1. 如果点击的是 9, 展开, 游戏结束
// 2. 如果点击的是 0, 展开并且调用 vjklAround 函数
// 3. 如果点击的是其他数字, 展开
const vjkl = function(cell, square) {
    // log('click')
    // removeClassAll('cell')
    bindAll('.cell', 'click', function(event) {
        let self = event.target
        // log('self', self)
        if (!(self.classList.contains('cell-opened'))) {
            let number = Number(self.dataset.number)
            if (number === 9) {
                self.classList.add('cell-mine')
                gameover()
            } else if (number === 0) {
                self.classList.add('cell-blank')
                let x = Number(self.dataset.x)
                let y = Number(self.dataset.y)
                vjklAround(square, x, y)
            } else {
                self.classList.add('cell-opened')
            }
        }
    })
}

// 6. vjklAround 展开周围 cell 周围 8 个元素,
// x 和 y 分别是下标
// 展开周围的元素通过调用 vjkl1 来解决
const vjklAround = function(square, x, y) {
    if (square[x][y] === 0) {
    // 先标记左边 3 个
    vjkl1(square, x - 1, y - 1)
    vjkl1(square, x, y - 1)
    vjkl1(square, x + 1, y - 1)

    // 标记上下 2 个
    vjkl1(square, x - 1, y)
    vjkl1(square, x + 1, y)

    // 标记右边 3 个
    vjkl1(square, x - 1, y + 1)
    vjkl1(square, x, y + 1)
    vjkl1(square, x + 1, y + 1)
    }
}

// 7. vjkl1 是重点函数
// 如果满足边界调节, 则继续
// 因为 vjkl1 这个函数是展开格子, 所以如果已经展开过, 那么就不展开元素
// 根据 x 和 y 还有属性选择器选择出格子, 具体可以参考
// https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
// 如果没有展开过, 判断下列情况
// 如果碰到的是 9, 什么都不做.
// 注意, 这里 9 的处理方式和直接点击格子 9 的处理方式不一样
// 如果碰到的是 0, 递归调用 vjklAround 函数
// 如果碰到的是其他元素, 展开
const vjkl1 = function(square, x, y) {
    // let self = event.target
    // let number = Number(self.dataset.number)
    let n = square.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        // log('ok01', square[x][y])
        // let squ = square[x][y]
        let are = e(`[data-x="${x}"][data-y="${y}"]`)
        // log ('xy', `[data-x="${x}"][data-y="${y}"]`)
        // log('are', are)
        if (!(are.classList.contains('cell-opened') || (are.classList.contains('cell-blank')))) {
            if (!(square[x][y] === 9)) {
                // log('ok02')
                if (square[x][y] === 0) {
                    // log('ok03')
                    are.classList.add('cell-blank')
                    vjklAround(square, x, y)
                } else {
                    // log('ok04')
                    are.classList.add('cell-opened')
                }
            }
        }
    }
}

const __main = function() {

    renderSquare(square)
    bindEventDelegate(square)
}

__main()