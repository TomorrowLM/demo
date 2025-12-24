/**
 * Git 相关信息获取脚本
 */

var exec = require('child_process').exec;

class GitMsg {

  constructor () {
    this.states = {
      scriptPath: null,
      gitHEAD: null,
      gitRef: null,
      gitDevelop: null,
      gitBranch: null,
      gitVersion: null,
      buildCompileTime: null,
      gitTime: null
    }
  }

  init(){ // 初始化
    this.getCurScriptPath();
    this.readGitHEADFile();
    this.getGitRef();
    this.getGitDevelop();
    this.getGitBranch();
    this.getGitVersion();
    this.getCuCompileTime();
    this.getGitTime();
  }

  // 获取当前脚本工作目录路径
  getCurScriptPath(){
    this.states.scriptPath = '"' + process.cwd() + '"'
  }

  // 读取.git/HEAD目录
  readGitHEADFile(){
    this.states.gitHEAD = this._readFileSync('.git/HEAD','utf-8').trim();
  }

  // 获取gitRef
  getGitRef(){
    this.states.gitRef = this.states.gitHEAD.split(': ')[1];
  }

  // 获取git当前分支
  getGitBranch(){
    this.states.gitBranch = this.states.gitHEAD.split('/')[2]+'/'+this.states.gitHEAD.split('/')[3];
  }

  // 获取git当前环境
  getGitDevelop(){
    this.states.gitDevelop = this.states.gitHEAD.split('/')[2];
  }

  // 获取当前分支的最新版本号
  getGitVersion(){
    this.states.gitVersion = this._readFileSync(`.git/${this.states.gitRef}`,'utf-8').trim();
  }

  // 获取当前打包编译时间
  getCuCompileTime(){
    this.states.buildCompileTime = new Date().getTime();
  }
   // 获取最后一次git更新时间
  getGitTime(){
    let _this = this
    exec('git log -1 --pretty=format:%cd', function(err, stdout, stderr) {
        if(err) {
            console.log(err);
        } else {
          _this.states.gitTime = stdout;
        }
    });
  }
  _getString(command,callback){
    //return refrence to the child process
    return exec(
        command,
        (
          function(){
              return function(err,data,stderr){
                  if(!callback)
                      return;

                  callback(err, data, stderr);
              }
          }
        )(callback)
    );
  }

  _readFileSync(path,options){
    const fs = require('fs');
    return fs.readFileSync(path,options); // 同步读取文件
  }
}

module.exports = new GitMsg();
