//获得棋盘
var chess = document.getElementById("canvas");
//获得棋盘权限
var context = chess.getContext("2d");
//规定线条的颜色
context.strokeStyle = "#aaaaaa";
//绘制棋盘的方法
var drawChessBoard = function () {
    for (var i = 0; i < 15; i++) {
        //起点
        context.moveTo(15 + i * 30, 15);
        //终点
        context.lineTo(15 + i * 30, 435);
        //连竖线
        context.stroke();

        //起点
        context.moveTo(15, 15 + i * 30);
        //终点
        context.lineTo(435, 15 + i * 30);
        //连横线
        context.stroke();
    }
}
drawChessBoard();

var onStep = function (i, j, me) {
    //绘制棋子 圆心 半径
    context.beginPath(); //开始路径
    context.arc(15 + 30 * i, 15 + 30 * j, 13, 0, Math.PI * 2);
    context.closePath(); //结束路径
    context.stroke();
    //设置渐变色 径向渐变
    var gradient = context.createRadialGradient(15 + 30 * i + 2, 15 + 30 * j - 2, 13, 15 + 30 * i + 2, 15 + 30 * j - 2, 0);

    if (me) {
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636767");
    } else {
        gradient.addColorStop(0, "#d1d1d1");
        gradient.addColorStop(1, "#f9f9f9");
    }
    context.fillStyle = gradient; //设置填充色
    context.fill(); //填充

}

//下棋
var me = true;
var chessBoard = [];
for (var i = 0; i < 15; i++) { //遍历棋盘上所有的点
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
}
var over = false;
chess.onclick = function (e) {
    if (over) return;
    if (!me) return;
    //获取鼠标点击的位置
    var x = e.offsetX;
    var y = e.offsetY;

    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //只有没下棋的点才能落子
    if (chessBoard[i][j] == 0) {
        onStep(i, j, me);
        chessBoard[i][j] = 1;
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;
                if (myWin[k] == 5) {
                    window.alert("恭喜，你赢了");
                    over = true;
                }
            }
        }

        if (!over) {
            me = !me;
            computerAI();
        }

    }
}

//定义规则 赢法数组
var wins = [];
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}
var count = 0; //赢法的索引

//横线赢的算法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

//console.log(count);	//572种赢法

//赢法统计数组
var myWin = [];
var computerWin = [];
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

//计算机的AI算法
var computerAI = function () {
    var mySource = []; //我方分数
    var computerSource = []; //计算机分数
    var max = 0; //保存最高点分数
    var u = 0,
        v = 0; //保存最高点分数坐标
    //初始化分数
    for (var i = 0; i < 15; i++) {
        mySource[i] = [];
        computerSource[i] = [];
        for (var j = 0; j < 15; j++) {
            mySource[i][j] = 0;
            computerSource[i][j] = 0;
        }
    }

    //计算计算机下棋的位置
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        //我方积分
                        if (myWin[k] == 1) {
                            mySource[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            mySource[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            mySource[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            mySource[i][j] += 10000;
                        }
                        //计算机积分
                        if (computerWin[k] == 1) {
                            computerSource[i][j] += 200;
                        } else if (computerWin[k] == 2) {
                            computerSource[i][j] += 400;
                        } else if (computerWin[k] == 3) {
                            computerSource[i][j] += 2000;
                        } else if (computerWin[k] == 4) {
                            computerSource[i][j] += 10000;
                        }
                    }
                }

                if (mySource[i][j] > max) {
                    max = mySource[i][j]; //保存最高分数和坐标
                    u = i;
                    v = j;
                } else if (mySource[i][j] == max) {
                    if (computerSource[i][j] > computerSource[u][v]) {
                        u = i;
                        v = j;
                    }
                }

                if (computerSource[i][j] > max) {
                    max = computerSource[i][j]; //保存最高分数和坐标
                    u = i;
                    v = j;
                } else if (computerSource[i][j] == max) {
                    if (mySource[i][j] > mySource[u][v]) {
                        u = i;
                        v = j;
                    }
                }


            }
        }
    }

    onStep(u, v, false);
    chessBoard[u][v] = 2;
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            if (computerWin[k] == 5) {
                window.alert("很抱歉，您输了");
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }
}