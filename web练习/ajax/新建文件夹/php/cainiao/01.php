<?php
//$username = $_POST['username'];
//$username = $_POST['username'];
//$password = $_POST['password'];
//echo '用户名:'.$username.'密码:'.$password;
//echo $username;

//echo date("Y/m/d");

$file=$_FILES['file'];
$filename=$file['name'];
$temp=explode(".",$filename);//把字符串打散为数组
$extension=end($temp);//将数组的内部指针指向最后一个元素。


if(isset($_POST['submit'])){
echo $_FILES['file']['error'];
}
if ($file["error"] > 0)
       {
       echo "Error: " . $file["error"] . "<br />";
       }
else
       {
       echo "Upload: " .$filename . "<br />";
       echo "Type: " . $extension . "<br />";
       echo "Size: " . ($file["size"] / 1024) . " Kb<br />";
       echo "Stored in: " . $file["tmp_name"].'<br />';
       echo 'name:'.$_POST['username'].'<br />';
       }

//存储上传的文件
 if (file_exists("/upload/" .$filename))
      {
      echo $_FILES["file"]["name"] . " already exists. ";
      }
    else
      {
      $name = iconv("UTF-8", "gb2312", $file['name']);
      move_uploaded_file($_FILES["file"]["tmp_name"],
      "upload/".$filename);
      echo "Stored in: " . "upload/" . $_FILES["file"]["name"];
      }

?>