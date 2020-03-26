let over = false; //表示是否有人赢了
let isPlayer = true; //用来存储下一个棋子的颜色，true为玩家，默认为玩家先下
let chessMap = []; //存储棋盘的棋子，0代表当前位置没有棋子，1代表玩家，2代表电脑
let wins = [];  //赢法数组      [x][y][k]   x y 代表棋盘上的一个点 k代表第几种赢法
let myWin = []; //我方的赢法统计数组
let comWin = [];//计算机方的赢法统计数组
let count = 0;      //代表有多少种赢法
/** wins start **/
//初始化数组
for (let x = 0; x < 15; x++) {
    wins[x] = [];
    for (let y = 0; y < 15; y++) {
        wins[x][y] = [];
    }
}

//横排的赢法
for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 11; y++) {
        for (let k = 0; k < 5; k++) {
            wins[x][y + k][count] = true;
        }
        count++;
    }
}

//竖排的赢法
for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 11; y++) {
        for (let k = 0; k < 5; k++) {
            wins[y + k][x][count] = true;
        }
        count++;
    }
}

//正斜线的赢法
for (let x = 0; x < 11; x++) {
    for (let y = 0; y < 11; y++) {
        for (let k = 0; k < 5; k++) {
            wins[x + k][y + k][count] = true;
        }
        count++;
    }
}

//反斜线的赢法
for (let x = 0; x < 11; x++) {
    for (let y = 14; y > 3; y--) {
        for (let k = 0; k < 5; k++) {
            wins[x + k][y - k][count] = true;
        }
        count++;
    }
}
/** wins end **/

/** 赢法统计数组初始化开始 **/

for (let i = 0; i < count; i++) {
    myWin[i] = 0;
    comWin[i] = 0;
}

/** 赢法统计数组初始化结束 **/

console.log("五子棋一共有 " + count + "种赢法");     //打印日志

window.onload = function () {
    initChessMap();
    drawChess();
};

function initChessMap() {
    for (let x = 0; x < 15; x++) {
        chessMap[x] = [];
        for (let y = 0; y < 15; y++) {
            chessMap[x][y] = 0;
        }
    }
}

function drawChess() {
    document.body.innerHTML = '';
    chessMap.forEach((item, index) => {
        for (let i in item) {
            if (item[i] === 2) {
                document.write(`<div style="display:inline-block;width: 32px;height: 32px;line-height: 32px;text-align: center;color: black;font-size: 24px;cursor:pointer">●</div>`)
            } else if (item[i] === 1) {
                document.write(`<div style="display:inline-block;width: 32px;height: 32px;line-height: 32px;text-align: center;font-size: 24px;cursor:pointer">○</div>`)
            } else {
                document.write(`<div onclick="playerAction(${index},Number(${i}))" style="display:inline-block;width: 32px;height: 32px;line-height: 32px;text-align: center;font-size: 24px;cursor:pointer">·</div>`)
            }
        }
        document.write(`<br>`);
    })
}

function goBangStart(first) {
    if (first) {
        return;
    }
    chessMap[7][7] = 2;
    drawChess();
}

function playerAction(x, y) {
    //如果已经有人获胜，就不处理
    if (over) {
        return;
    }
    //只有玩家才能手动下棋
    if (!isPlayer) {
        return;
    }
    if (chessMap[x][y] === 0) {
        chessMap[x][y] = 1;    //玩家
        drawChess();
    } else {
        return;
    }
    //遍历所有的赢法
    for (let k = 0; k < count; k++) {
        //如果为true说明我们在K种赢法上面胜算大了一步
        if (wins[x][y][k]) {
            myWin[k]++; //我方胜算统计增加
            comWin[k] = 6;  //计算机在这种赢法就不可能赢，设置一个异常的值6
            //说明玩家已经赢了
            if (Number(myWin[k]) === 5) {
                window.alert("恭喜你获胜！");
                over = true;
            }
        }
    }
    //如果还没有结束，我们让计算机下棋
    if (!over) {
        isPlayer = !isPlayer;    //下一个棋
        computerAI();
    }
}

function computerAI() {
    let myScore = [];   //用户棋盘上点的得分
    let comScore = [];  //电脑棋盘上点的得分
    let max = 0;        //保存最高的分数
    let maxX = 0, maxY = 0;       //最高分的点的坐标
    let myK = 0;    //用户下了某一个点之后，将会产生多少个符合赢得条件
    let comK = 0;   //计算机下了某一个点之后，将会产生多少个符合赢得条件
    let ruleCount = 0;

    for (let x = 0; x < 15; x++) {
        myScore[x] = [];
        comScore[x] = [];
        for (let y = 0; y < 15; y++) {
            myScore[x][y] = 0;
            comScore[x][y] = 0;
        }
    }

    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
            //如果棋盘上这个点没有子
            if (chessMap[x][y] === 0) {

                //检查是否有符合规则的棋子
                if (upAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (downAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (leftAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (rightAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (upLeftAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (rightDownAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (rightUpAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                if (leftDownAspect(x, y, 0, -1, 1)) {
                    ruleCount++;
                }

                //规则至少要有两个成立才可以
                if (ruleCount >= 2) {
                    myScore[x][y] += 4000;
                    ruleCount = 0;
                } else {
                    ruleCount = 0;
                }

                //电脑落子
                //检查是否有符合规则的棋子
                if (upAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (downAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (leftAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (rightAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (upLeftAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (rightDownAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (rightUpAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                if (leftDownAspect(x, y, 0, -1, 2)) {
                    ruleCount++;
                }

                //规则至少要有两个成立才可以
                if (ruleCount >= 2) {
                    comScore[x][y] += 8000;
                    ruleCount = 0;
                } else {
                    ruleCount = 0;
                }

                for (let k = 0; k < count; k++) {
                    if (wins[x][y][k]) {
                        //判断玩家的子，然后判断如何拦截
                        if (myWin[k] === 1) {
                            myScore[x][y] += 200;
                        } else if (myWin[k] === 2) {
                            myScore[x][y] += 400;
                        } else if (myWin[k] === 3) {
                            myScore[x][y] += 2000;
                        } else if (myWin[k] === 4) {
                            myScore[x][y] += 10000;
                        }

                        //判断计算机棋盘子每一步的分数
                        if (comWin[k] === 1) {
                            comScore[x][y] += 220;
                        } else if (comWin[k] === 2) {
                            comScore[x][y] += 420
                        } else if (comWin[k] === 3) {
                            comScore[x][y] += 2100
                        } else if (comWin[k] === 4) {
                            comScore[x][y] += 20000
                        }
                    }
                }

                //判断拦截用户位置的分数最高
                if (myScore[x][y] > max) {
                    max = myScore[x][y];
                    maxX = x;
                    maxY = y;
                } else if (myScore[x][y] === max) {
                    if (comScore[x][y] > comScore[maxX][maxY]) {
                        maxX = x;
                        maxY = y;
                    }
                }

                //判断自己下哪里分数最高
                if (comScore[x][y] > max) {
                    max = comScore[x][y];
                    maxX = x;
                    maxY = y;
                } else if (comScore[x][y] === max) {
                    if (myScore[x][y] > myScore[maxX][maxY]) {
                        maxX = x;
                        maxY = y;
                    }
                }
            }
        }
    }
    //把棋盘上的一个点设置为计算机落了子
    chessMap[maxX][maxY] = 2;
    drawChess();

    //遍历所有的赢法
    for (let k = 0; k < count; k++) {
        //如果为true说明我们在K种赢法上面胜算大了一步
        if (wins[maxX][maxY][k]) {
            comWin[k]++; //我方胜算统计增加
            myWin[k] = 6;  //计算机在这种赢法就不可能赢，设置一个异常的值6
            //说明玩家已经赢了
            if (Number(comWin[k]) === 5) {
                over = true;
                window.alert("很遗憾，你输了！");
            }
        }
    }
    //如果还没有结束，我们让计算机下棋
    if (!over) {
        isPlayer = !isPlayer;    //下一个棋
    }
}

/**
 检测棋盘上一个点的上方有多少个黑子
 x = 棋子的纵坐标 0 - 14
 y = 棋子的横坐标 0 - 14
 isNull = 0 为没有棋子
 isNull = 1 为有玩家棋
 isNull = 2 为有电脑棋
 isNull 初始化为 -1 代表到达边界
 chessType = 1 代表玩家棋
 chessType = 2 代表电脑棋
 **/
function upAspect(x, y, flag, isNull, chessType) {

    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (y === -1) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    y--;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {

        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (y === -1) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    y--;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的下方有多少个黑子
function downAspect(x, y, flag, isNull, chessType) {

    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (y === 15) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    y++;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {

        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (y === 15) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    y++;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的左方有多少个黑子
//y轴不变，x--
function leftAspect(x, y, flag, isNull, chessType) {

    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (x === -1) {//x的本身就在左方的边界，左方不存在任何东西，直接返回
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    x--;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {

        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (x === -1) {//x的本身就在左方的边界，左方不存在任何东西，直接返回
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    x--;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的右方有多少个黑子
//y轴不变，x++
function rightAspect(x, y, flag, isNull, chessType) {

    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (x === 15) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    x++;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (x === 15) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    x++;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的左上方有多少个黑子
// x--  y--
function upLeftAspect(x, y, flag, isNull, chessType) {
    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (x === -1 || y === -1) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    x--;
                    y--;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {

        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (x === -1 || y === -1) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    x--;
                    y--;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的右上方有多少个黑子
//x++ y--
function rightUpAspect(x, y, flag, isNull, chessType) {
    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (x === 15 || y === -1) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    x++;
                    y--;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (x === 15 || y === -1) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    x++;
                    y--;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的左下方有多少个黑子
//x-- y++
function leftDownAspect(x, y, flag, isNull, chessType) {
    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (x === -1 || y === 15) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    x--;
                    y++;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (x === -1 || y === 15) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    x--;
                    y++;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

//检测棋盘上一个点的右下方有多少个黑子
//x++ y++
function rightDownAspect(x, y, flag, isNull, chessType) {
    let thisX = x;
    let thisY = y;
    //玩家用户
    if (chessType === 1) {
        for (let i = 0; i < myGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < myGain[i].length; j++) {
                if (x === 15 || y === 15) {
                    return false;
                }
                if (chessMap[x][y] === myGain[i][j]) {
                    winCount++;
                    x++;
                    y++;
                }
            }
            if (winCount === myGain[i].length) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < comGain.length; i++) {
            x = thisX;
            y = thisY;
            let winCount = 0;
            for (let j = 0; j < comGain[i].length; j++) {
                if (x === 15 || y === 15) {
                    return false;
                }
                if (chessMap[x][y] === comGain[i][j]) {
                    winCount++;
                    x++;
                    y++;
                }
            }
            if (winCount === comGain[i].length) {
                return true;
            }
        }
        return false;
    }
}

