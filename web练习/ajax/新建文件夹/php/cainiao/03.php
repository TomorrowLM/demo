<?php
    //连接
    $servername='localhost:8000';
    $username='root';
    $password='123456';
    //创建连接
    $conn=mysql_connect($servername,$username,$password);
    //检测链接
    if(!$conn){
        die("connection failed:".mysqli_connect_error());

    }
    echo "连接成功";

    //创建数据库
//    $sql="CREATE DATABASE li";
//发送sql语法    mysql_query($sql,$conn)
//    $result = mysql_query($sql,$conn);
//   if($result){
//        echo "数据库创建成功";
//    }
//    else{
//        echo "Error creating database:". mysql_error($conn);
//    }

// 使用 sql 创建数据表
//在创建表之前，必须首先选择数据库。通过 mysql_select_db() 函数选取数据库。
mysql_select_db("li", $conn);
$sql = "CREATE TABLE MyGuests (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
email VARCHAR(50),
reg_date TIMESTAMP
)";

if (mysql_query($sql,$conn)) {
    echo "数据表 MyGuests 创建成功";
} else {
    echo "创建数据表错误: " . mysql_error($conn);
}

//添加数据
//获取数据
$first=$_POST['first'];
$second=$_POST['second'];
$email=$_POST['email'];
$sql = "INSERT INTO MyGuests (firstname, lastname, email)
VALUES ('" .$first. "','".$second."','".$email."')";

if (mysql_query($sql,$conn)) {
    echo "新记录插入成功";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

?>