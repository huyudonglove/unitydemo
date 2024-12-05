//判断渠道号和官方号的区别
let allToken={
    sl_token:'',
    sl_userId:'',
    sl_user:{},
    sl_qudao_token:'',
    sl_qudao_roleId:'',
    sl_qudao_user:{},
    activityMsg:''
};


function enCrypto(data, secret = 'bluepoch') {
  const newData = JSON.stringify(data)
  return CryptoJS.AES.encrypt(newData, secret).toString()
}
function deCrypto(cipherText, secret = 'bluepoch') {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  if (originalText) return JSON.parse(originalText)

  return null
}
function md5Hex(cipherText) {
  return CryptoJS.MD5(cipherText).toString()
}
//console.log(deCrypto(`U2FsdGVkX1/nuZZwDPnStv+d7bWvCTfdbQik24AA9zHzeDk/UFtaV9lPzXIeOc8lKs/tF0X0lKLvcBdeAFWD4USe/2lZt4lSMBqEUMHXMao=`),5555)
function getUserToken(){
    allToken.sl_token=deCrypto(window.localStorage.getItem("sl_token")).value;
    allToken.sl_userId=deCrypto(window.localStorage.getItem("sl_userId")).value;
    allToken.sl_qudao_token=deCrypto(window.localStorage.getItem("sl_qudao_token")).value;
    allToken.sl_qudao_roleId=deCrypto(window.localStorage.getItem("sl_qudao_roleId")).value;
}

function setUserToken(key,val){
    let t={
       expire:'',
       value:val
    }
    window.localStorage.setItem(key, enCrypto(t))
}
function removeAllToken(){
      let t=Object.keys(allToken);
      t.map(v=>{
        window.localStorage.removeItem(v)
      })  
}
function getCurrentToken(val){
    return deCrypto(window.localStorage.getItem(val)).value
}

$.ajaxSetup({
        complete:function(xhr){
            //console.log(xhr)
            if(xhr.responseJSON.code==4080||xhr.responseJSON.code==4004||xhr.responseJSON.code==4002||xhr.responseJSON.code==5095){ 
               removeAllToken()
               history.replaceState(null, '', window.location.href.split("?")[0]);
               window.location.reload();
               
            }
        }
    })
$.ajaxSetup();




function loginPhone(phone,code){
    $.ajax('/account/web/sms/login',{
        type:"POST",
        dataType:"json",
        data:JSON.stringify({
            account:phone,
            captcha:code,
            channelId:100,
            // requestType:"12"
        }),
        contentType:"application/json; charset=utf-8",
        success:(res)=>{
            //console.log(res);
            if(res.code!=200){
               alertShow(res.msg) 
            }else{
                h5Event.closeLoading();
                setUserToken('sl_token',res.data.token);
                setUserToken('sl_userId',res.data.userId)
                h5Event.token=res.data.token;
                h5Event.uid=res.data.userId;
                h5Event.tokenType=1;
                // roleMsgApi().then(res=>{
                //     let t={
                //         type:"login",
                //         data:res.data
                //     }
                //     h5Event.frame.postMessage(t,"*");
                // })
                // getDetailMsg().then(res=>{
                //     let t={
                //         type:"detail",
                //         data:res.data
                //     }
                //     h5Event.frame.postMessage(t,"*");
                // })
                h5Event.getDetail()
            }
        },
        error:(err)=>{
            alertShow(err)
        }
   }) 
}
function loginRole(id,code){
        $.ajax('/activity/m1/common/channel/login',{
        type:"POST",
        dataType:"json",
        data:JSON.stringify({
            roleId:id,
            captcha:code
        }),
        contentType:"application/json; charset=utf-8",
        success:(res)=>{
            //console.log(res);
            if(res.code!=200){
               alertShow(res.msg) 
            }else{
                // console.log(res)
                // window.localStorage.setItem("userInfo",JSON.stringify(res.data));
                // postMsg("login",res.data)

                h5Event.closeLoading();
                setUserToken('sl_qudao_token',res.data.token);
                setUserToken('sl_qudao_roleId',res.data.roleId);
                h5Event.token=res.data.token;
                h5Event.uid=res.data.roleId;
                h5Event.tokenType=2;
                // roleMsgApi().then(res=>{
                //     let t={
                //         type:"loginQudao",
                //         data:res.data
                //     }
                //     h5Event.frame.postMessage(t,"*");
                // })
                // getDetailMsg().then(res=>{
                //     let t={
                //         type:"detail",
                //         data:res.data
                //     }
                //     h5Event.frame.postMessage(t,"*");
                // })
                h5Event.getDetail()
            }
        },
        error:(err)=>{
            alertShow(err)
        }
   }) 
}
function loginPass(phone,pwd){
    $.ajax('/account/web/pwd/login',{
        type:"POST",
        dataType:"json",
        data:JSON.stringify({
            account:phone,
            pwd:md5.create().update(pwd).hex(),
            // requestType:"12"
        }),
        contentType:"application/json; charset=utf-8",
        success:(res)=>{
            //console.log(res);
            if(res.code!=200){
               alertShow(res.msg) 
            }else{
                h5Event.closeLoading();
                setUserToken('sl_token',res.data.token);
                setUserToken('sl_userId',res.data.userId)
                h5Event.token=res.data.token;
                h5Event.uid=res.data.userId;
                h5Event.tokenType=1;
                // roleMsgApi()
                // getDetailMsg().then(res=>{
                //     let t={
                //         type:"detail",
                //         data:res.data
                //     }
                //     h5Event.frame.postMessage(t,"*");
                // })
               h5Event.getDetail() 
            }
        },
        error:(err)=>{
            alertShow(err)
        }
   }) 
}
function getPhoneCode(phone){
     $.ajax('/account/web/mobile/captcha/send',{
        type:"POST",
        dataType:"json",
        data:JSON.stringify({
            account:phone,
            captchaType:1
        }),
        headers:{
            'X-nic':true
        },
        contentType:"application/json; charset=utf-8",
        success:(res)=>{
            //console.log(res);
            if(res.code!=200){
               alertShow(res.msg) 
            }else{
                alertShow(`发送成功！`)
            }
        },
        error:(err)=>{
            alertShow(err)
        }
   }) 

}
//获取当前角色信息
function roleMsgApi(){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/common/role',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                   alertShow(res.msg);
                   removeAllToken();
                }else{
                    if(h5Event.tokenType==1){
                        window.localStorage.setItem("sl_user",JSON.stringify(res.data));
                        
                    }else{
                        window.localStorage.setItem("sl_qudao_user",JSON.stringify(res.data));
                       
                    }

                    rev(res);
                    
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
}
function getDetailMsg(from){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/common/activity/status?activityId=19',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                from:from,
                tokenType:h5Event.tokenType,
                activityId:19,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                //renwuListApi()
                if(res.code!=200){
                   alertShow(res.msg);
                   rev(res) 
                }else{
                    rev(res)
                    window.localStorage.setItem("activityMsg",JSON.stringify(res.data));
                    h5Event.activitySelf.sendResult=res.data.sendResult;
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
        
}
//游戏登录
function autoLoginApi(params){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/common/game/auto-login',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                ...params,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                //renwuListApi()
                if(res.code!=200){
                   alertShow(res.msg);
                   rev(res) 
                }else{
                    rev(res)
                    
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
}
function juanApi(num){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/translate/donate',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
                score:num
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  rev(res) 
                }else{  
                  alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
}
//获取进度
function getProgress(){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/translate/progress',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                }else{
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
}
function sendBonus(){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/h5/common/sendBonus',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
                "requestType":"12"
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                    //debugger
                  alertShow(res.msg);
                }else{
                  alertShow(`奖励已发放至邮箱`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
}
function submitScore(num){
    return new Promise((rev,rej)=>{
        $.ajax('/activity/m1/star/submitScore',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
                score:num
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        })
    })
}
//查询抽奖次数
function getCiShuApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/numbers/queryDrawNum',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//增加抽奖次数
function addDrawNumApi(type){
  return new Promise((rev, rej) => {
         $.ajax('/activity/numbers/addDrawNum',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
                addDrawType:type
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                rev(res)
                
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })  
}
//抽奖
function drawApi(){
  return new Promise((rev, rej) => {
         $.ajax('/activity/numbers/draw',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })  
}
//获取抽奖记录
function getPrizeDetailApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/numbers/drawPrizeDetail',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:JSON.parse(window.localStorage.getItem("userInfo")).token,
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    }) 
}
//获取抽奖详情
function renwuListApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v18/tasks',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    }) 
}
//获取头像解锁
function touxiangApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v18/unlockDetail',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//解锁角色
function jiesuoApi(name){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v18/unlock',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                ...name
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}

function fajiangApi(id){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/common/getBonus',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                activityId:19,
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                taskId:id
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//获取图片md5
function getMd5(){
    let md5=SparkMD5.hashBinary(h5Event.shareBaseImg);
    return md5;
}
//判断是否为ios
function isIOS() {
    var userAgent = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    return isIOS;
}
//获取直传秘钥
function getCosId(){
    return new Promise((resolve,reject)=>{
         $.ajax('/activity/m1/common/cos/tempKeys',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                md5:getMd5(),
                activityId:19
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                resolve(res)
                //console.log(res);
                
            },
            error:(err)=>{
                reject(err)
                alertShow(err)
            }
        })
    })
   
}
//base64转file
function base64toFile(dataurl, filename = 'file'){
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      // suffix是该文件的后缀
      let suffix = mime.split('/')[1];
      // atob 对经过 base-64 编码的字符串进行解码
      let bstr = atob(arr[1]);
      // n 是解码后的长度
      let n = bstr.length;
      // Uint8Array 数组类型表示一个 8 位无符号整型数组 初始值都是 数子0
      let u8arr = new Uint8Array(n);
      // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // new File返回File对象 第一个参数是 ArraryBuffer 或 Bolb 或Arrary 第二个参数是文件名
      // 第三个参数是 要放到文件中的内容的 MIME 类型
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    }
var camSafeUrlEncode = function (str) {
            return encodeURIComponent(str)
                .replace(/!/g, '%21')
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\*/g, '%2A');
        };
//上传文件
function uploadShareImg(){
    let fileSelf=base64toFile(h5Event.shareBaseImg);
    //console.log(fileSelf)
    //console.log(cosMsg,666666);
    let token =h5Event.cosMsg.tst;
    let Authorization=CosAuth({
                            SecretId: h5Event.cosMsg.tid,
                            SecretKey: h5Event.cosMsg.tk,
                            Method: "PUT",
                            Pathname: h5Event.cosMsg.url,
                        });
    //console.log(Authorization,3331154);
    let url=h5Event.cosMsg.host+camSafeUrlEncode(h5Event.cosMsg.url).replace(/%2F/g, '/');
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);                    
    xhr.setRequestHeader('Authorization', Authorization);
    xhr.setRequestHeader('x-cos-security-token', token);
    xhr.send(fileSelf);
    xhr.onload = function () {
                   // console.log("success")
                    $(".loadingSelf").hide();
                    //let str=`https://service.weibo.com/share/share.php?pic=https://re.bluepoch.com/event/NotesOnShuori/img/PC.png&url=https://re.bluepoch.com/event/NotesOnShuori&title=《重返未来：1999》#&source=web&content=utf-8`
                    let str=`https://service.weibo.com/share/share.php?pic=${h5Event.cosMsg.dhost}${h5Event.cosMsg.url}&url=https://re.bluepoch.com/event/1stanniversary/&title=《重返未来：1999》周年庆版本「孤独之歌」正式开启！参与活动领取100纯雨滴！！`
                    isIOS() ? (window.location.href = str) : window.open(str);
                   // console.log("end")
    };
    xhr.onerror = function () {
                    $(".loadingSelf").hide();
                    let url=`https://re.bluepoch.com/event/1stanniversary/img/PC.png`
                    let str=`https://service.weibo.com/share/share.php?pic=${url}&url=https://re.bluepoch.com/event/1stanniversary/&title=《重返未来：1999》周年庆版本「孤独之歌」正式开启！参与活动领取100纯雨滴！！`
                    isIOS() ? (window.location.href = str) : window.open(str);
    };                    
}
//渠道分享
function getQuDaoShareApi(type){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/share',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                shareSource:type.source,
                shareChannel:type.channel,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//角色登录
function getRoleCodeApi(id){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/common/channel/gameCaptcha',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                roleId:id
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//获取年报数据
function getYearReportApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/yearReport',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                  let t ={
                        type:'year',
                        data:null
                  }
                  t.data=res.data;
                  h5Event.frame.postMessage(t,"*")
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//绳结任务详情
function getKnotTaskDetailApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/knotTaskDetail',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//绳结完成情况
function getKnotDetailApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/knotDetail',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//完成年报
function readReportApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/readReport',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//解锁绳结
function completedKnotApi(num){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/completedKnot',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                knotName:num,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//领取绳结
function receiveKnotApi(id){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/receiveKnot',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                taskId:id,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//领取奖励
function receiveBonusApi(id){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/receiveBonus',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                bonusType:id
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//获取当且个性化配置
function getTitleApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/titles',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//保存个性化配置
function setTitlesApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v19/setTitles',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                heroName:data.heroName,
                playerTitles:data.playerTitles
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.3任务详情
function taskDetailApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/common/getTasks',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                activityId:19,
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.3解锁进度
function unlockDetailApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v23/getUnlockDetails',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.1新手引导
function updateGuideApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v21/updateGuide',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                guide:data,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.1解锁物品
function updatePropsApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v21/updateProps',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                props:[data],
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.3解锁人物
function unlockApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v23/unlock',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                unlockCharacter:{
                    characterName:data.characterName?data.characterName:undefined,
                    endingName:data.endingName?data.endingName:undefined
                },
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  //alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.3解锁任务
function unlockRenWuApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v23/unlock',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                mirrorTask:{
                    task1Status:data.task1Status?data.task1Status:undefined,
                    task2Status:data.task2Status?data.task2Status:undefined
                },
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  //alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.1领取奖励
function getBonusApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/common/getBonus',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                activityId:19,
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                taskId:data,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.3分享任务
function shareApi(data){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/common/share',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                activityId:19,
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                shareChannel:data.shareChannel,
                shareSource:data.shareSource,
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
//2.1喇叭
function updateThingApi(){
    return new Promise((rev, rej) => {
         $.ajax('/activity/m1/h5/v21/updateThing',{
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                token:h5Event.token,
                uid:h5Event.uid,
                tokenType:h5Event.tokenType,
                unlockThing:'la',
                webBaseRequest:{
                    webDeviceInfo:taData,
                    webUserInfo:{}
                }
            }),
            contentType:"application/json; charset=utf-8",
            success:(res)=>{
                //console.log(res);
                if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
                }else{  
                  //alertShow(`捐赠成功`);
                  rev(res)
                }
            },
            error:(err)=>{
                rej(err)
                alertShow(err)
            }
        }) 
    })
}
