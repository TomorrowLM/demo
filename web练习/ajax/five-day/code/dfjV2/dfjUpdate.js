(function (window, undefined) {
    //服务器端的player，加一个属性，标示是否在线，是否正在游戏
    var _theGame = function (playerName, vsPlayerName, containerId, isRemotePlayer) {
        this.isNetWork = false; //是单机 还是在线
        this.chat4dfj = null;
      

        this.playerCanvas = null;
        this.vsPlayerCanvas = null;
        this.initCanvas.call(this, containerId);

        this.context = this.playerCanvas.getContext('2d');
        this.vsContext = this.vsPlayerCanvas.getContext('2d');
        this.isRemotePlayer = isRemotePlayer;
        //如果是自己或机器人直接初始化vs，如果是联机对手，初始化为null
        if (this.isRemotePlayer) {
            this.vsPlayer = null;
            this.vsChessboard = null; //棋盘对象
        }
        else {
            this.vsPlayer = new Player(vsPlayerName);
            this.vsChessboard = new Chessboard(this.vsContext, this.vsPlayer.planes);
        }
        this.player = new Player(playerName);
        this.chessboard = new Chessboard(this.context, this.player.planes);
        return this;
    }

    _theGame.prototype = {
        initCanvas: function (containerId) {
            function _createCanvas(id) {
                var canvas = document.createElement("canvas");
                canvas.id = id;
                canvas.width = 300;
                canvas.height = 300;
                canvas.style.border = '1px solid gray';
                return canvas;
            }

            this.playerCanvas = _createCanvas('playerCanvas');
            this.vsPlayerCanvas = _createCanvas('vsPlayerCanvas');
            var container = document.getElementById(containerId);
            container.appendChild(this.playerCanvas);
            container.appendChild(document.createElement('br'));
            container.appendChild(document.createElement('br'));
            container.appendChild(this.vsPlayerCanvas);
            var self = this;

            //注册单击事件
            self.vsPlayerCanvas.onclick = function (e) {
				e.preventDefault();
                var unitWidth = self.playerCanvas.width / 10;
                var unitHeight = self.playerCanvas.height / 10;
                //根据鼠标的坐标，计算出方格的位置
                var point = new Point(Math.ceil(e.offsetX / unitWidth), Math.ceil(e.offsetY / unitHeight));
                //玩家点
                var result = self.playerPlay(point);

                if (result == -100) {
                    alert("亲你点过这个点了，重来");
                    return;
                } else if (result == 1) {
                    self.vsChessboard.drawPlanes();
                    alert("亲，你赢了");
                    self.vsPlayerCanvas.onclick = null;
                    return;
                }

                //电脑点
                result = self.robotPlay(point);
                if (result == 1) {
                    self.vsChessboard.drawPlanes();
                    alert("亲，电脑赢了");
                    self.vsPlayerCanvas.onclick = null;
                }
            }
        },
        ////返回false point已经点击过。不再画点，应该重新来
        playerPlay: function (point) {
            var isHit = this.player.playPlane(point, this.vsPlayer.planes);
            if (isHit == -100)//此点已经打过
            {
                return -100;
            }
            this.vsChessboard.drawPoint(point, isHit);
            //判断输赢
            var success = this.vsPlayer.planes.every(function (x) {
                return !x.isAlive;
            })
            return success ? 1 : 0;
        },
        robotPlay: function () {
            var point = new Point(Math.ceil(Math.random() * 10), Math.ceil(Math.random() * 10));
            var isHit = this.vsPlayer.playPlane(point, this.player.planes);
            while (isHit == -100) {
                point = new Point(Math.ceil(Math.random() * 10), Math.ceil(Math.random() * 10));
                isHit = this.vsPlayer.playPlane(point, this.player.planes);
            }
            this.chessboard.drawPoint(point, isHit);

            //判断输赢
            var success = this.player.planes.every(function (x) {
                return !x.isAlive;
            })
            return success ? 1 : 0;
        },
        //联网游戏  fnmessage 接收到消息之后的回调函数
        connect: function (url,fnmessage) {
            this.chat4dfj = new Chat4DFJ(url);
            this.chat4dfj.connect(fnmessage);
            //MsgType  1 新用户连接，返回给用户sessionID  发送在线人员列表
            //MsgType  2 新用户 提交用户信息，服务器记录所有 的用户信息
            //MsgType  3 新用户 把此用户的信息群发
            //MsgType  4 用户退出，把用户退出的信息群发
            //MsgType  5 发送文字聊天信息  其中如果 接收到的sessionId为-1 群发
        }
    };

    //飞机类
    function Plane(head, direction) {
        //{"wing":[],"body":[],"tail",[]}  
        //head 机头  wing 机翼  body 机身  tail机尾
        this.head = head;
        this.points = { "wing": [], "body": [], "tail": [] };
        this.direction = direction;
        this.isAlive = true;
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    //父类 ， 玩家自己  机器人  远程玩家
    function Player(name) {
        this.name = name;
        this.planes = []; //[]; //this._createPlanes();  //三架飞机
        this.played = [];  //10*10的棋盘上被点击过的点
        this._createPlanes.call(this);
    }
    //生成三架飞机   内部调用_checkHead和_createPlane
    Player.prototype._createPlanes = function () {
        var point,//机头坐标 ，随机生成
            direction, //飞机生成方向
            isCheck,//随机生成的机头是否合法
            plane,//生成的飞机
            planesNum = 3,
            directions = ["left", "right", "top", "bottom"];
        //循环生成三架飞机
        do {
            //循环，随机生成机头坐标
            do {
                //机头坐标
                point = new Point(Math.ceil(Math.random() * 10), Math.ceil(Math.random() * 10));
                //随机生成  机头的方向
                direction = directions[Math.floor(Math.random() * 4)];
                //检查机头是否合法
                isCheck = this._checkHead(point, direction);
            } while (!isCheck);

            plane = this._createPlane.call(this, point, direction);

            if (plane) {
                this.planes[this.planes.length] = plane;
            }
            //debug
            //console.log(point.x + "++" + point.y + "++++" + direction);
        } while (this.planes.length != planesNum);
    }
    //检查随机生成的机头坐标是否合法
    Player.prototype._checkHead = function (point, direction) {
        var isCheck = true;
        switch (direction) {
            case "left":
                if (point.x > 6 || point.y < 3 || point.y > 7) {
                    isCheck = false;
                }
                break;
            case "right":
                if (point.x < 4 || point.y < 3 || point.y > 7) {
                    isCheck = false;
                }
                break;
            case "top":
                if (point.y > 6 || point.x < 3 || point.x > 7) {
                    isCheck = false;
                }
                break;
            case "bottom":
                if (point.y < 4 || point.x < 3 || point.x > 7) {
                    isCheck = false;
                }
                break;
        }
        return isCheck;
    }

    //根据机头和方向生成一架飞机  内部调用_checkPoint
    Player.prototype._createPlane = function (head, direction) {
        var plane = new Plane(head, direction);
        var p, //随机的点
            i; //循环变量
        //飞机有三个属性  head,direction,points={"wing":[],"body":[],"tail":[]}飞机上的点
        //下面要计算 飞机上的所有点

        switch (direction) {
            case "left":
                //机身  --->
                for (i = 0; i < 4; i++) {
                    p = new Point(head.x + i, head.y);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.body[i] = p;
                    }
                    else {
                        return null;
                    }

                }
                //机翼
                for (i = 0; i < 5; i++) {
                    p = new Point(head.x + 1, (head.y - 2) + i);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.wing[i] = p;
                    } else {
                        return null;
                    }

                }
                //机尾
                for (i = 0; i < 3; i++) {
                    p = new Point(head.x + 3, (head.y - 1) + i);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.tail[i] = p;
                    } else {
                        return null;
                    }
                }
                break;
            case "right":
                for (i = 0; i < 4; i++) {
                    p = new Point(head.x - i, head.y);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.body[i] = p;
                    } else {
                        return null;
                    }
                }
                for (i = 0; i < 5; i++) {
                    p = new Point(head.x - 1, (head.y - 2) + i);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.wing[i] = p;
                    } else {
                        return null;
                    }
                }
                for (i = 0; i < 3; i++) {
                    p = new Point(head.x - 3, (head.y - 1) + i);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.tail[i] = p;
                    } else {
                        return null;
                    }
                }
                break;
            case "top":
                for (i = 0; i < 4; i++) {
                    p = new Point(head.x, head.y + i);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.body[i] = p;
                    } else {
                        return null;
                    }
                }
                for (i = 0; i < 5; i++) {
                    p = new Point(head.x - 2 + i, head.y + 1);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.wing[i] = p;
                    } else {
                        return null;
                    }
                }
                for (i = 0; i < 3; i++) {
                    p = new Point(head.x - 1 + i, head.y + 3);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.tail[i] = p;
                    } else {
                        return null;
                    }
                }
                break;
            case "bottom":
                for (i = 0; i < 4; i++) {
                    p = new Point(head.x, head.y - i);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.body[i] = p;
                    } else {
                        return null;
                    }
                }
                for (i = 0; i < 5; i++) {
                    p = new Point(head.x - 2 + i, head.y - 1);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.wing[i] = p;
                    } else {
                        return null;
                    }
                }
                for (i = 0; i < 3; i++) {

                    p = new Point(head.x - 1 + i, head.y - 3);
                    if (this._checkPoint.call(this, p, this.planes)) {
                        plane.points.tail[i] = p;
                    } else {
                        return null;
                    }
                }
                break;
        }
        return plane;
    }
    //检查生成的点是否已经属于某个飞机
    Player.prototype._checkPoint = function (point) {
        //判断点是否在数据中,不在数组中返回true
        function __check(point, array) {
            var isCheck = !array.some(function (x) {
                return x.x == point.x && x.y == point.y;
            })
            return isCheck;
        }
        var isCheck = true;
        for (var i = 0; i < this.planes.length; i++) {
            isCheck = __check(point, this.planes[i].points.body);
            if (!isCheck) {
                return false;
            }
            isCheck = __check(point, this.planes[i].points.wing);
            if (!isCheck) {
                return false;
            }
            isCheck = __check(point, this.planes[i].points.tail);
            if (!isCheck) {
                return false;
            }
        }
        return isCheck;
    }

    //打飞机，内部判断点是否已经在飞机上， 如果不在记录到飞机对象内部的属性中
    //打飞机是打别人的飞机，所以把飞机数组传过来
    //内部调用_judge
    //方法返回 0 击中机头  1 击中机身  2 未击中   -100 点已经在飞机上，需要重新打飞机
    Player.prototype.playPlane = function (point, planes) {
        var check, isHit;
        //返回true 点已经在飞机上存在
        check = this.played.some(function (x) {
            return point.x == x.x && point.y == x.y;
        })

        if (!check) {
            //判断是否击中飞机
            isHit = this._judge(point, planes);
            this.played.push(point);  //把点击过的点记录下来。判断是否点过
            return isHit;
        } else {
            return -100;
        }
    };
    //判断点是否在飞机中，是否命中机头
    //是否命中，命中返回1  打中机头返回0  未命中返回2
    Player.prototype._judge = function (point, planes) {
        //planes  敌人的飞机 ，判断是否击中了敌人的飞机

        //判断是否击中机头
        function __isHitHead(p1, p2) {
            if (p1.x == p2.x && p1.y == p2.y) {
                return true;
            } else {
                return false;
            }
        }
        var isHit = 2,//是否命中，命中机身返回1  打中机头返回0  未命中返回2
            i  //循环变量
        ;

        for (i = 0; i < planes.length; i++) {

            //判断是否击中机头
            if (__isHitHead(point, planes[i].head)) {
                isHit = 0;
                planes[i].isAlive = false;
                break;
            }

            //判断是否击中机身
            var h = planes[i].points.body.some(function (x) {
                if (x.x == point.x && x.y == point.y) {
                    return true;
                } else {
                    return false;
                }
            });

            if (h) {
                isHit = 1;
                break;
            }

            h = planes[i].points.wing.some(function (x) {
                if (x.x == point.x && x.y == point.y) {
                    return true;
                } else {
                    return false;
                }
            });

            if (h) {
                isHit = 1;
                break;
            }
            h = planes[i].points.tail.some(function (x) {
                if (x.x == point.x && x.y == point.y) {
                    return true;
                } else {
                    return false;
                }
            });

            if (h) {
                isHit = 1;
                break;
            }
        }


        return isHit;
    }


    ////继承的写法
    //function Player1(name) {
    //    Player.call(this, name);
    //}
    //Player1.prototype = new Person();
    //Player1.prototype.playPlane = function (point) {
    //}

    //棋盘，负责绘制棋盘，和画飞机
    function Chessboard(context, planes) {
        this.unitWidth = context.canvas.width / 10;
        this.unitHeight = context.canvas.height / 10;
        this.width = context.canvas.width;
        this.height = context.canvas.height;
        this.planes = planes;
        this.context = context;
        //画棋盘
        this._drawChessboard();
    }
    //画10*10的棋盘
    Chessboard.prototype._drawChessboard = function () {
        this.context.beginPath();
        this.context.strokeStyle = "gray";
        for (var i = 1; i < 10; i++) {
            this.context.moveTo(0.5, this.unitWidth * i + 0.5);
            this.context.lineTo(this.width + 0.5, this.unitHeight * i + 0.5);
        }
        for (var i = 1; i < 10; i++) {
            this.context.moveTo(this.unitWidth * i + 0.5, 0 + 0.5);
            this.context.lineTo(this.unitWidth * i + 0.5, this.height + 0.5);
        }

        this.context.stroke();
    }
    //画飞机
    Chessboard.prototype.drawPlanes = function () {
        //wing 机翼 body 机身  tail 机尾
        //  机身<----机头
        function drawRight() {

            //计算body 画的位置  body的顶点坐标
            var x = (plane.points.tail[1].x - 1) * unitWidth;
            var y = (plane.points.tail[1].y - 1) * unitHeight;

            var width = plane.points.body.length * unitWidth;
            var height = unitHeight;

            context.fillStyle = color;
            context.fillRect(x, y, width, height);


            //画wing
            x = (plane.points.wing[0].x - 1) * unitWidth;
            y = (plane.points.wing[0].y - 1) * unitHeight;
            width = unitWidth;
            height = plane.points.wing.length * unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);

            //画tail
            x = (plane.points.tail[0].x - 1) * unitWidth;
            y = (plane.points.tail[0].y - 1) * unitHeight;
            width = unitWidth;
            height = plane.points.tail.length * unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }
        function drawLeft() {
            //计算body 画的位置  
            var x = (plane.points.body[0].x - 1) * unitWidth;
            var y = (plane.points.body[0].y - 1) * unitHeight;

            var width = plane.points.body.length * unitWidth;
            var height = unitHeight;

            context.fillStyle = color;
            context.fillRect(x, y, width, height);


            //画wing
            x = (plane.points.wing[0].x - 1) * unitWidth
            y = (plane.points.wing[0].y - 1) * unitHeight;
            width = unitWidth
            height = plane.points.wing.length * unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);

            //画tail
            x = (plane.points.tail[0].x - 1) * unitWidth;
            y = (plane.points.tail[0].y - 1) * unitHeight;
            width = unitWidth;
            height = plane.points.tail.length * unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }
        function drawBottom() {
            //计算body
            var x = (plane.points.tail[1].x - 1) * unitWidth; //(p.line1[0].x - 1) * plane.width / 10;
            var y = (plane.points.tail[1].y - 1) * unitHeight;  //(p.line1[0].y) * plane.height / 10;

            var width = unitWidth;
            var height = plane.points.body.length * unitHeight;

            context.fillStyle = color;
            context.fillRect(x, y, width, height);


            //画wing
            x = (plane.points.wing[0].x - 1) * unitWidth;
            y = (plane.points.wing[0].y - 1) * unitHeight;
            width = plane.points.wing.length * unitWidth;
            height = unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);

            //画Line3
            x = (plane.points.tail[0].x - 1) * unitWidth;
            y = (plane.points.tail[0].y - 1) * unitHeight;
            width = plane.points.tail.length * unitWidth;
            height = unitWidth;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }
        function drawTop() {
            //计算body
            var x = (plane.points.body[0].x - 1) * unitWidth;
            var y = (plane.points.body[0].y - 1) * unitHeight;

            var width = unitWidth;
            var height = plane.points.body.length * unitHeight;

            context.fillStyle = color;
            context.fillRect(x, y, width, height);


            //画wing
            x = (plane.points.wing[0].x - 1) * unitWidth;
            y = (plane.points.wing[0].y - 1) * unitHeight;
            width = plane.points.wing.length * unitWidth;
            height = unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);

            //画Line3
            x = (plane.points.tail[0].x - 1) * unitWidth;
            y = (plane.points.tail[0].y - 1) * unitHeight;
            width = plane.points.tail.length * unitWidth;
            height = unitHeight;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }


        var unitWidth = this.unitWidth;
        var unitHeight = this.unitHeight;
        var context = this.context;
        var color, plane, colors = ['red', 'yellow', 'blue'];
        context.save();
        context.globalCompositeOperation = "destination-over";

        for (var i = 0; i < this.planes.length; i++) {
            plane = this.planes[i];

            color = colors.pop();

            if (plane.direction == "top") {
                drawTop();
            } else if (plane.direction == "bottom") {
                drawBottom();
            } else if (plane.direction == "left") {
                drawLeft();
            } else if (plane.direction == "right") {
                drawRight();
            }
        }
        context.restore();
    }

    //把打飞机的结果画到棋盘上，画点
    Chessboard.prototype.drawPoint = function (point, isHit) {
        //把10*10的点转换成画图的坐标(对应方框的 上右下左)
        function __translatePoints(point, unitWidth, unitHeigth) {
            var points = [];
            var p = new Point((point.x - 1) * unitWidth, (point.y - 1) * unitHeigth);
            points.push(p);

            p = new Point((point.x) * unitWidth, (point.y - 1) * unitHeigth);
            points.push(p);

            p = new Point((point.x) * unitWidth, (point.y) * unitHeigth);
            points.push(p);

            p = new Point((point.x - 1) * unitWidth, (point.y) * unitHeigth);
            points.push(p);
            return points;
        }
        //命中返回1  打中机头返回0  未命中返回2
        var colors = ['black', 'green', 'gray'];
        var color = colors[isHit];
        //把10*10的点转换成画图的坐标(对应方框的 上右下左)
        var points = __translatePoints(point, this.unitWidth, this.unitHeight);

        this.context.beginPath();
        this.context.moveTo(points[0].x + 5, points[0].y + 5);
        this.context.lineTo(points[2].x - 5, points[2].y - 5);

        this.context.moveTo(points[1].x - 5, points[1].y + 5);
        this.context.lineTo(points[3].x + 5, points[3].y - 5);

        this.context.fillStyle = color;
        this.context.fillRect(points[0].x + 5, points[0].y + 5, this.unitWidth - 10, this.unitHeight - 10);

        this.context.lineWidth = 2;
        this.context.strokeStyle = "white";
        this.context.stroke();
    }

    //封装的websocket
    function Socket(address) {
        this.address = address;
        this.connected = false;
        this.isLogin = false;
        this.webSocket;
    }
    Socket.prototype.connect = function (fnMessage, fnError, fnOpen, fnClose) {
        if (!this.connected) {
            try {
                if ("WebSocket" in window) {
                    this.webSocket = new WebSocket("ws://" + this.address);
                    this.connected = true;
                }
                else if ("MozWebSocket" in window) {
                    this.webSocket = new MozWebSocket("ws://" + this.address);
                    this.connected = true;
                }

                this.webSocket.onopen = fnOpen ? fnOpen : function () {

                };
                this.webSocket.onclose = fnClose ? fnClose : function () {
                };
                this.webSocket.onerror = fnError ? fnError : function () {
                    console.log("连接异常，请重新连接");
                };
                this.webSocket.onmessage = fnMessage;
            } catch (ex) {
                console.log(ex);
                return;
            }
        }
        else {
            console.log("亲，你已经连接过了")
        }
    }
    Socket.prototype.send = function (msg) {
        if (this.connected) {
            this.webSocket.send(msg);
        } else {
            console.log("发送信息，请先连接服务器");
        }
    }
    Socket.prototype.close = function () {
        this.connected = false;
        this.webSocket.close();
    }

    //这个类有点多余，不过还是带着了
    function Chat4DFJ(url) {
        //ws服务器的地址
        this.socket = new Socket(url);
        this.sessionID = null;

        this.users = null;  //当前在线的所有玩家
        this.vsUser = null;//远程玩家信息
        this.user = null; //当前玩家信息
    }
    Chat4DFJ.prototype = {
        connect: function (fnmessage) {
            var self = this;
            //4个参数，分别是 fnMessage,fnError,fnOpen,fnClose
            this.socket.connect(function (e) {
                try {
                    var json = JSON.parse(e.data);
                    fnmessage(json);
                } catch (e) {
                    console.log(e);
                }
               
            }, function () {
                console.log("出错了，亲");
            }, function () {
                console.log("建立了连接");
            }, function () {
                console.log("关闭了连接");
            })
        },
        close: function () {
            if (this.socket.connected) {
                this.socket.close();
            }
        },
        //把json转换成字符串发送
        send: function (json) {
            if (this.socket.connected) {
                this.socket.send(JSON.stringify(json));
            }
        },
        //点击对战按钮，请求对方接收挑战
        playOnLine: function () {
            
        },
        receiveNewUser: function (json) {

        },
        receiveNewMsg: function (json) {

        },
        userLogoff: function (json) {

        },
        sendMsg: function (json) {
            this.send(json);
        },
        sendSelfInfo: function (json) {

        },
        //接收对手的所有飞机
        receiveVsPlayerPlanes: function (json) {

        },
        //接收对手打过来的点
        receiveVsPlayerPoint: function () {

        }
    };

    //查询url上的参数 内部方法
    function __queryString() {
        var url = location.search; //获取url中？符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    window.dfjGame = function (playerName, vsPlayerName, context, vsContext, isRemotePlayer) {
        return new _theGame(playerName, vsPlayerName, context, vsContext, isRemotePlayer);
    }
})(window, undefined)