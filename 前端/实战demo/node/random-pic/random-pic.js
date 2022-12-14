const fs = require('fs');
var args = process.argv.splice(2);
var fileDirectory = args[0] || './';


 //判断路径是否存在
if (fs.existsSync(fileDirectory)) {
    //读取目录的内容
    var files = fs.readdirSync(fileDirectory);
    files.forEach(function(file) {
        var filePath = fileDirectory + file;
        var isDirectory;
        var files1;
        new Promise((resolved)=>{
            //判断文件是否是文件夹
            fs.stat(filePath, function(err, data){ 
                isDirectory =  data.isDirectory()
                resolved()
            })
        }).then(()=>{
            if(isDirectory){
                 //读取目录的内容
                 files1 = fs.readdirSync(filePath);
            }
            for(let i=0;i<files1.length;i++){
                    if (/\.png$/.test(files1[i])) {
                        //随机生成6位数
                        const randomWord = () => {
                            let code = ''
                            for (var i = 0; i < 6; i++) {
                              var type = getRandom(1, 3)
                              switch (type) {
                                case 1:
                                  code += String.fromCharCode(getRandom(48, 57))// 数字
                                  break
                                case 2:
                                  code += String.fromCharCode(getRandom(65, 90))// 大写字母
                                  break
                                case 3:
                                  code += String.fromCharCode(getRandom(97, 122))// 小写字母
                                  break
                              }
                            }
                            return code
                        }
                        function getRandom (min, max) {
                            return Math.round(Math.random() * (max - min) + min)
                        }
                        //保存之前的文件信息
                        let old = files1[i]
                        files1[i]=  randomWord()+'.png';                       
                        fs.rename(filePath+'/'+old, filePath+'/'+files1[i], function(err) {
                            if (err) throw err;            
                            console.log(' ok~');
                        });
                    } 
 
            }
 
        })
        // console.log(filePath) 

    });
   
  } else {
      console.log(fileDirectory + "  Not Found!");
  }