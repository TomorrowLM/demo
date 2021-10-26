const utils ={
    readCookie:function(name) { 
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]); 
        }else{
            return null;
        }       
    },
    setCookie:function(name,value) { 
        var days = 1; 
        var exp = new Date(); 
        exp.setTime(exp.getTime() + days*24*60*60*1000); 
        document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString(); 
    },
    delCookie:function(name) { 
        var cval=this.readCookie(name); 
        if(cval!=null){
            document.cookie= name + "=;path=/;expires="+(new Date(0)).toGMTString();
        }
    },  
};
export default utils
