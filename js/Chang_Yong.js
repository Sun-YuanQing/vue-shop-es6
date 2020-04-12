//3.3 1-28
//初始化
mui.init();

//用户输入账号密码
//用户点击登录
//捕获登录点击事件
document.getElementById('login').addEventListener('tap',function(){
	//alert('触发');
//获取到账号密码文本框对象
var usernameInput=document.querySelector('input[name="username"]');
var passwordInput=document.querySelector('input[name="password"]');
//获取到账号密码z值
var usernamevlaue=usernameInput.value;
var passwordvlaue=passwordInput.value;
console.info("账号是",usernamevlaue,"   密码是",passwordvlaue);
       if (!usernamevlaue||!passwordvlaue) {
         mui.toast('用户名或密码不能为空');
         return;
       } 
       if (usernamevlaue==='admin'&&passwordvlaue==='123456') {
        console.info('登录成功，跳转页面。');
       	  mui.openWindow('../main/main.html','main');
       } else{
        mui.toast('账号或密码不正确!');
       }
        var scan = null;
        var isOpen = false; // 闪光灯是否开始标志 true:闪光灯已经开启 false:闪光灯关闭 
       //扫码开启scan闪光灯
       
          if( isOpen_scan !=null){  //判断有没有扫码对象
          	//将isOpen相反赋值。
              isOpen = !isOpen;
               if(isOpen){
                 scan.setFlash(true);
                 }else{
                  scan.setFlash(false);
                 }
            }
});