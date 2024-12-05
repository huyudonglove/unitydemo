
// 创建 SDK 配置对象
function getAppId(){
    if(window.location.origin!="https://re.bluepoch.com"){
        return 'debug-appid'
    }else{
        return 'fe1942e7d17f45dfa77dc93d3fe2e864'
    }
}
var config = {
    appId: getAppId(),
    serverUrl: 'https://datacollection.sl916.com',
    autoTrack: {
     pageShow: true, //开启页面展示事件，事件名ta_page_show
     pageHide: true, //开启页面隐藏事件，事件名ta_page_hide
    }
};
// 将 SDK 实例赋给全局变量 ta，或者其他您指定的变量
window.ta = thinkingdata;
// 用配置对象初始化 SDK
ta.init(config);
ta.login("slh5");
// 设置公共事件属性，所有数据事件中都会带有这些属性
var apple=ta.getPresetProperties().toEventPresetProperties();
apple["#url"]=window.location.href;
apple["#distinctId"]="slh5";
const formatToHump = (value) => {
  return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
}

var taData={};
for(let key in apple){
    taData[formatToHump(key.split("#")[1])]=apple[key] 
}


//console.log(taData,2222);
function uploadShuShu(t){
    
    ta.track(
        t.name, 
            {
                buttontype:t.name,
                url:window.location.href,
                buttonMsg:t.data,
                account_id:t.accountId,
                role_id:t.roleId,
                "#device_id":ta.getPresetProperties().deviceId
            }
        ); 
}
function download_click(name){
    console.log(name)
     
}
function judgePosition(){
    return new URL(window.location.href).searchParams.get("bpsrc")
}
