class numbers{
    constructor(){
        this.qudaoNum=0;
        this.qudaoType=0;
        this.frame=null;
        this.userinfo=null;
        this.endCore=0;
        this.activitySelf={
            sendResult:0,
            name:'',
            progress:0,
            per:""
        }
        this.shareImg={
            color:"red",
            num:0,
            img:""
        }
        this.loginType="code";
        this.shareBaseImg=``;
        this.cosMsg=null;
        this.currentShareChannel=``;
        this.lihuiSrc=``;
        this.token=``;
        this.tokenType=0;

    }
    init(){
        this.frame=window.frames[0];
        
    }
    async getDetail(){
        let self=this;
        let isNei =await this.isYouxiLogin();
        if(isNei){
            console.log(isNei,88888)
            return
        }
        let sl_qudao_token= window.localStorage.getItem("sl_qudao_token");
        let sl_token=window.localStorage.getItem("sl_token");
        if(sl_qudao_token){
            this.slQuDaoLogin();
        }else{
            if(sl_token){ 
                this.slGuanWangLogin(); 
            }
        }
        
    }
    //渠道登录
    async slQuDaoLogin(from){
        let self=this;
        this.token=getCurrentToken("sl_qudao_token");
        this.tokenType=2;
        try {
            this.uid=getCurrentToken("sl_qudao_roleId");
        } catch (error) {
            this.uid=null;
        }
        await roleMsgApi(); 
        this.userinfo=JSON.parse(window.localStorage.getItem("sl_qudao_user"));   
        await getDetailMsg(from);
        self.activitySelf.name=self.userinfo.roleName?self.userinfo.roleName:self.userinfo.roleId;
        let t={
            type:'loginQudao',
            data:null
        }
        this.frame.postMessage(t,"*");
        //await getYearReportApi();
        await taskDetailApi();
        await this.WunlockDetailApi();
    }
    //官网登录
    async slGuanWangLogin(from){
        let self=this;
        this.token=getCurrentToken("sl_token");
        this.tokenType=1;
        try{
            this.uid=getCurrentToken("sl_userId");
        }catch(e){
            this.uid=null;
        }
        await  roleMsgApi();
        this.userinfo=JSON.parse(window.localStorage.getItem("sl_user"));
        await getDetailMsg(from);
        self.activitySelf.name=self.userinfo.roleName?self.userinfo.roleName:self.userinfo.roleId;
        let t={
            type:'login',
            data:null
        }
        this.frame.postMessage(t,"*");
        //await getYearReportApi();
        await taskDetailApi();
        await this.WunlockDetailApi();
    }
    //增加游戏内登录
    async isYouxiLogin(){
        let youxinei = false
        let url = new URL(window.location.href);
        //console.log(url,555)
        let token =url.searchParams.get(`token`);
        if(token){
            youxinei = true;
            //console.log(token,555);
            let par={
                token:token,
                userId:url.searchParams.get(`channelUserId`),
                gameBaseInfo:{
                    gameId:url.searchParams.get(`gameId`),
                    deviceId:url.searchParams.get(`deviceId`),
                    deviceModel:url.searchParams.get(`deviceModel`),
                    os:url.searchParams.get(`os`),
                    gameRoleId:url.searchParams.get(`gameRoleId`),
                    channelUserId:url.searchParams.get(`channelUserId`),
                    timestamp:url.searchParams.get(`timestamp`),
                }
            }
            let data = await autoLoginApi(par);
            //console.log(data,2234);
            if(data.data.tokenType==1){
                setUserToken('sl_token',data.data.token);
                setUserToken('sl_userId',data.data.userId);
                this.slGuanWangLogin(1);
                history.replaceState(null, '', window.location.href.split("?")[0]);
            }else if(data.data.tokenType==2){
                setUserToken('sl_qudao_token',data.data.token);
                setUserToken('sl_qudao_roleId',data.data.roleId);
                this.slQuDaoLogin(1);
                history.replaceState(null, '', window.location.href.split("?")[0]);
            }
            
        }
        return youxinei;
    }
    login(){
        //console.log(235);
        $(".loading").show();
        $(".choose").show();
        $(".qudao").show();
    }
    codeOrPass(type){
        this.loginType=type;
        if(type=="code"){
            $(".title-code").addClass("title-active");
            $(".title-pass").removeClass("title-active");
            $(".loPhone").show();
            $(".passContent").hide();
            
        }else{
            $(".title-pass").addClass("title-active");
            $(".title-code").removeClass("title-active");
            $(".loPhone").hide();
            $(".passContent").show();
        }
    }
    logout(){
            //console.log(454646);
            $(".loading").show();
            $(".logout").show();
    }
    juan(e){
        console.log(e,555555);
        this.endCore=e.data.data;
        console.log(this,666)
        $(".juanfenLoading").show();
    }
    closeJuan(){
        $(".juanfenLoading").hide();
    }
    juanPost(){
        let t={
            type:"chong",
            data:null
        }
        this.frame.postMessage(t,"*");
        $("#shareImg").hide();
        $(".juanfenLoading").hide();
        window._hmt.push(['_trackEvent', `btn_repeat_click`, 'click']);
    }
    saveImg(e){
        $("#shareImg").show();
        console.log(e);
        
        let img1=new Image();
        img1.src=`./img/end/${e.data.data.endName}.jpg`;
        img1.onload=()=>{
            console.log(img1.height,img1.width);
            this.createC(img1.width,img1.height,img1)
        }
    }
    createC(width,height,img){
        let canvas=document.createElement("canvas");
        canvas.width=width;
        canvas.height=height;
        var context = canvas.getContext("2d");
        context.drawImage(img,0,0);
        context.font="32px 微软雅黑 bolder";
        context.fillStyle = "rgba(128, 112, 64, 1)"; 
        context.fillText(`${this.activitySelf.name}，你为`, 260, 50);
        var imgData=canvas.toDataURL("image/png");
        let shareI=new Image();
        shareI.className="shareI";
        shareI.src=imgData;
        $("#shareImg").append(shareI);
        
    }
    chooseType(e,num){
        this.qudaoNum=event.target.dataset.index;
        $(".btn-self")[0].innerText=e.innerHTML;
        this.qudaoType=num;
    }
    denglu(num){
        $(".qudao").hide();
        this.qudaoType=num;
        if(this.qudaoType==1){
            $(".phone").show();
        }else{
            $(".roleId").show();
        }
    }
    closeLoading(){
        $(".loading").hide();
        $(".choose").hide();
        $(".qudao").hide();
        $(".phone").hide();
        $(".roleId").hide();
        $(".waringQ").hide();
        $(".logout").hide();
    }
    getCode(){
        if(!$(".phoneNum").val()){
            $(".phoneWaring").html("请输入手机号");
        }else{
            $(".phoneWaring").html(``);
            if(this.checkModbile($(".phoneNum").val())){
                let phoneNo= $(".phoneNum").val();
                this.showLimitTime();
                getPhoneCode(phoneNo);
            }
        }
    }
    showLimitTime(type){  
        if(type){
            let time=window.localStorage.getItem("time");
            $(".login-code-time").show();
            $(".login-code-button").hide();
            var codeTime=setInterval(()=>{
            time--;
            window.localStorage.setItem("time",time);
            $(".time-code").html(time);
            if(time<1){
                $(".login-code-time").hide();
                $(".login-code-button").show();
                clearTimeout(codeTime);
                $(".time-code").html(60);
                window.localStorage.removeItem("time");
            }
            },1000)
        }else{
            let time=60;
            $(".login-code-time").show();
            $(".login-code-button").hide();
            var codeTime=setInterval(()=>{
            time--;
            window.localStorage.setItem("time",time);
            $(".time-code").html(time);
            if(time<1){
                $(".login-code-time").hide();
                $(".login-code-button").show();
                clearTimeout(codeTime);
                $(".time-code").html(60);
                window.localStorage.removeItem("time");
            }
            },1000)
        } 
    }
    checkModbile(mobile) {
		var re = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
		var result = re.test(mobile); 
		if(!result) {
              $(".phoneWaring").html("手机号码格式不正确！");
			  return false;//若手机号码格式不正确则返回false
			}
		return true;
    }
    loginButton(){
        if(this.loginType=="code"){
            $(".loPhone").show();
            $(".passContent").hide();
            if(!$(".phoneNum").val()){       
                $(".phoneWaring").html("请输入手机号");
            }else{
                $(".phoneWaring").html(``);
            } 
            if(!$(".code").val()){
                $(".codeWaring").html("请输入验证码");
            }else{
                $(".codeWaring").html(``);
            }
            if(this.judgeAgree()&&$(".phoneNum").val()&&$(".code").val()){
                loginPhone($(".phoneNum").val(),$(".code").val())
            }  
        }else{
            $(".loPhone").hide();
            $(".passContent").show();
            if(!$(".account").val()){
                $(".accountWaring").html("请输入您的账号")
            }else{
                $(".accountWaring").html("")
            }
            if(!$(".password").val()){
                $(".passWaring").html("请输入您的密码")
            }
            if(this.judgeAgree()&&$(".account").val()&&$(".password").val()){
                loginPass($(".account").val(),$(".password").val())
            }  
        }
            
    }
    judgeAgree(){
        if($(".loginAgree-icon-g").is(":visible")){
            return true
        }else{
            alertShow("请先同意深蓝用户协议和隐私协议");
            return false
        }  
    }
    agreeSelf(){
        $(".loginAgree-icon-g").toggle();  
    }
    start(){
        alertShow("请先登录")
        setTimeout(()=>{
            this.login()
        },1000)  
    }
    fenxiang(){
        $(".fenxiang").show();
    }
    hideFenxiang(){
        if(event.target.nodeName!="IMG"){
            $(".fenxiang").hide();
        } 
    }
    alert(s){
        alertShow(s.data.data)
    }
    zhoubian(){
       addDrawNumApi(1).then(res=>{
            $(".zhoubian").show();
            if(res.code!=200){
                  alertShow(res.msg);
                  //rev(res) 
            }
       }) 
      
      
    } 
    closeZhoubian(){
        $(".zhoubian").hide();
    }
    logoutButton(){
        removeAllToken();
        window.location.reload();
    }
    getProgress(e){
        this.activitySelf.progress=e.data.data;
    }
    loginRoleJudge(){
        if($(".roleNum").val()){
            if($(".role-input").val()){
                if(this.judgeAgree()){
                    loginRole($(".roleNum").val(),$(".role-input").val())
                }
            }else{
                $(".codeWaring").show();
                $(".roleWaring").hide();
            }
            
        }else{
            //console.log(222)
            $(".roleWaring").show();
        }

    }
    hidePv(){
        if(event.target.nodeName!="VIDEO"){
            $(".pvVideo").hide();
            $("#pvV")[0].pause();
            let t={
                type:"bgm",
                data:null
            }
            this.frame.postMessage(t,"*");
        }
    }
    playPv(){
        $(".pvVideo").show();
        $("#pvV")[0].play();
    }
    chong(){
        $(".juanfenLoading").show()
    }
    sendBonusMethod(){
        sendBonus().then(()=>{
            getDetailMsg();
        });
    }
    submitScoreMethod(e){
        this.endCore=e.data.data;
        console.log(this.endCore,666)
        submitScore(this.endCore).then((res)=>{
            console.log(777)
            this.activitySelf.per=res.data.percent;
            let t={
                type:"percent",
                data:res.data
            }
            this.frame.postMessage(t,"*")
        })
    }
    getCiShu(){
        getCiShuApi().then(res=>{
            console.log(res);
            let t={
                type:"cishu",
                data:res.data 
            }
            this.frame.postMessage(t,"*");
        })
        
    }
    drawEvent(){
        drawApi().then(res=>{
            if(res.code==200){
                let t={
                    type:"jiangpin",
                    data:res.data.prizeCode
                }
                this.frame.postMessage(t,"*");
            } 
            this.getCiShu();
        })
    }
    jiangListEvent(){
        getPrizeDetailApi().then(res=>{
            let t={
                type:"jiangpinList",
                data:res.data
            }
            this.frame.postMessage(t,"*");
        })
    }
    copyUrl(){
        let url=`https://re.bluepoch.com/event/numbers`;
        addDrawNumApi(2).then(res=>{
            if(res.code==200){
                  alertShow(`您已获得抽奖次数x1`);
                  //rev(res) 
            }else{
                alertShow(`复制成功！`);
            }
        });
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.innerHTML = url;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
    zhoubianButton(type){
        $(".zhoubian").hide();
        $("#shareImg").hide();
        let t={
                type:type,
                data:null
            }
        this.frame.postMessage(t,"*");    
    }
    showShareImg(e){
        if(e.data.data!="yin"){
            $("#shareImg").show();
        }
        
    }
    saveLiHui(e){
        let str=`https://webres.bluepoch.com/img/share0526/${e.data.data}.png`;
        $("#endImg").attr("src",str);
        $("#shareImg").show();
        
    }
    saveImg(e){
        this.shareBaseImg=e.data.data;
        $("#endImg").attr("src",e.data.data);
        $("#shareImg").show();
        $("#endImgQudao").show();
        this.currentShareChannel=`jieju`;
        //this.getQuDaoShare()
    }
    hideSave(){
        //console.log(window.event.target.nodeName)
        if(window.event.target.nodeName!="IMG"){
            $("#shareImg").hide();
        }
    } 
    getRenwuList(){
        renwuListApi().then(res=>{
            let t={
                type:'renWu',
                data:res.data
            }
            this.frame.postMessage(t,"*");  
        })
    }
    getRenwuListStatus(){
        renwuListApi().then(res=>{
            let t={
                type:'judgeRenwuListStatus',
                data:res.data
            }
            this.frame.postMessage(t,"*");  
        })  
    }
    getTouxiangList(){
        touxiangApi().then(res=>{
           
            let t={
                type:"jin",
                data:res.data
            }
            this.frame.postMessage(t,"*");
        })
    }
    qudao(e){
        $("#qudaoShare").show();
        if(e.data.data){
            this.shareBaseImg=e.data.data;
        }
        //window._hmt.push(['_trackEvent', 'btn_share_click', 'click']);
    }
    hideQudao(){
        if(window.event.target.nodeName!="IMG"){
            $("#qudaoShare").hide();
        }
    }
    jiesuo(e){
        jiesuoApi(e.data.data).then(res=>{

        })
    }
    allSelected(){
        touxiangApi().then(res=>{
            let t={
                type:"allSelected",
                data:res.data
            }
            this.frame.postMessage(t,"*");
        })
    }
    fajiang(e){
        fajiangApi(e.data.data).then(res=>{
            this.getRenwuList();
            this.getRenwuListStatus();
        }).catch(err=>{
            this.getRenwuList();
            this.getRenwuListStatus();
        })
    }
    copyShare(){
        this.jsCopyLink();
        alertShow("复制成功，分享给朋友吧~");
        //window._hmt.push(['_trackEvent', type, 'btn_sharecopy_click']);
    }
    jsCopyLink(){
        let inputDom = document.createElement('input');
        inputDom.value = `《重返未来：1999》2.3版本「圣火纪行：东区黎明」预热网页活动正式开启，参与领取60纯雨滴！https://re.bluepoch.com/event/Londondawning/`;
        document.body.appendChild(inputDom);
        inputDom.select();
        document.execCommand('Copy');
        document.body.removeChild(inputDom);
    }
    judgeShareSina(){
        let t={
            source:1,
            channel:1
        }
        this.shareSinaPCImg();
        this.getQuDaoShare(t) 
    }
    shareSina(e){
        this.shareBaseImg=e.data.data;
        $(".loadingSelf").show();
        getCosId().then(res=>{
                this.cosMsg=res.data;
                uploadShareImg();
        })        
        let t={
            source:2,
            channel:1
        }
        this.getQuDaoShare(t)
    }
    sharBili3(){
       let url =`https://t.bilibili.com/`;
        isIOS() ? (window.location.href = url) : window.open(url);
        let t={
            source:1,
            channel:2
        }
        this.getQuDaoShare(t) 
    }
    shareSinaPCImg(){
        let url=`https://webres.bluepoch.com/img/share1023/PC.jpg`
        let str=`https://service.weibo.com/share/share.php?pic=${url}&url=https://re.bluepoch.com/event/Londondawning/&title=《重返未来：1999》2.3版本「圣火纪行：东区黎明」预热网页活动正式开启，参与领取60纯雨滴！`
        isIOS() ? (window.location.href = str) : window.open(str);
    }
    NsaveLiHui(e){
        let t ={
            shareSource:'结果页',
            shareChannel:'保存图片'
        }
        this.getQuDaoShare(t)
        let str=`https://webres.bluepoch.com/img/share1023/${e.data.data}.jpg`;
        $("#endImg").attr("src",str);
        $("#shareImg").show();
        
    }
    NcopyShare(){
        let t ={
            shareSource:'结果页',
            shareChannel:' 复制链接'
        }
        this.getQuDaoShare(t)
        this.jsCopyLink();
        alertShow("复制成功，分享给朋友吧~");
        
    }
    NshareWibo(e){
        let t ={
            shareSource:'结果页',
            shareChannel:' 微博'
        }
        this.getQuDaoShare(t)
        let url=`https://webres.bluepoch.com/img/share1023/${e.data.data}.jpg`
        let str=`https://service.weibo.com/share/share.php?pic=${url}&url=https://re.bluepoch.com/event/Londondawning/&title=《重返未来：1999》2.3版本「圣火纪行：东区黎明」预热网页活动正式开启，参与领取60纯雨滴！`
        isIOS() ? (window.location.href = str) : window.open(str);
        
    }
    Nbzhan(){
        let t ={
            shareSource:'结果页',
            shareChannel:'b站'
        }
        this.getQuDaoShare(t)
        let url =`https://t.bilibili.com/`;
        isIOS() ? (window.location.href = url) : window.open(url);
        
    }
    Nqq(){
        let t ={
            shareSource:'结果页',
            shareChannel:' qq空间'
        }
        this.getQuDaoShare(t)
        var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        _shareUrl += 'url=' + encodeURIComponent(`https://re.bluepoch.com/event/Londondawning/`);   //参数url设置分享的内容链接|默认当前页location
        _shareUrl += '&desc=' + encodeURIComponent(`《重返未来：1999》2.3版本「圣火纪行：东区黎明」预热网页活动正式开启，参与领取60纯雨滴！`);    //参数desc设置分享的描述，可选参数
        _shareUrl += '&pics=' + encodeURIComponent('https://webres.bluepoch.com/img/share1023/PC.jpg');
        isIOS() ? (window.location.href = _shareUrl) : window.open(_shareUrl);
    }
    ZsaveLiHui(){
        let t ={
            shareSource:'主页',
            shareChannel:'保存图片'
        }
        this.getQuDaoShare(t)
        let str=`https://webres.bluepoch.com/img/share1023/PC.jpg`;
        $("#endImg").attr("src",str);
        $("#shareImg").show();
        
        
    }
    ZcopyShare(){
        let t ={
            shareSource:'主页',
            shareChannel:'复制链接'
        }
        this.getQuDaoShare(t)
        this.jsCopyLink();
        alertShow("复制成功，分享给朋友吧~");
       
        
    }
    ZshareWibo(){
        let t ={
            shareSource:'主页',
            shareChannel:'微博'
        }
        this.getQuDaoShare(t)
        let url=`https://webres.bluepoch.com/img/share1023/PC.jpg`
        let str=`https://service.weibo.com/share/share.php?pic=${url}&url=https://re.bluepoch.com/event/Londondawning/&title=《重返未来：1999》2.3版本「圣火纪行：东区黎明」预热网页活动正式开启，参与领取60纯雨滴！`
        isIOS() ? (window.location.href = str) : window.open(str);
        
        
    }
    Zbzhan(){
        let t ={
            shareSource:'主页',
            shareChannel:'b站'
        }
        this.getQuDaoShare(t)
        let url =`https://t.bilibili.com/`;
        isIOS() ? (window.location.href = url) : window.open(url);
        
        
    }
    Zqq(){
        let t ={
            shareSource:'主页',
            shareChannel:'qq空间'
        }
        this.getQuDaoShare(t)
        var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        _shareUrl += 'url=' + encodeURIComponent(`https://re.bluepoch.com/event/Londondawning/`);   //参数url设置分享的内容链接|默认当前页location
        _shareUrl += '&desc=' + encodeURIComponent(`《重返未来：1999》2.3版本「圣火纪行：东区黎明」预热网页活动正式开启，参与领取60纯雨滴！`);    //参数desc设置分享的描述，可选参数
        _shareUrl += '&pics=' + encodeURIComponent('https://webres.bluepoch.com/img/share1023/PC.jpg');
        isIOS() ? (window.location.href = _shareUrl) : window.open(_shareUrl);
        
    }
    //渠道分享增加次数
    getQuDaoShare(type){
        shareApi(type).then(()=>{
            //this.WrenWuStatus()
        })
    }
    senDBaiduMaiDian(e){
        //window._hmt.push(['_trackEvent', e.data.data, 'click']);
    }
    //获取角色登录验证码
    getRoleCode(){
        if($(".roleNum").val()){
            $(".roleWaring").hide();
            this.showRoleLimitTime();
            getRoleCodeApi($(".roleNum").val()).then(res=>{
                console.log(res)
            })
        }else{
            //console.log(222)
            $(".roleWaring").show();
        }
    }
     showRoleLimitTime(type){  
        if(type){
            let time=window.localStorage.getItem("time");
            $(".role-code-time").show();
            $(".role-code-button").hide();
            var codeTime=setInterval(()=>{
            time--;
            window.localStorage.setItem("time",time);
            $(".role-time-code").html(time);
            if(time<1){
                $(".lrole-code-time").hide();
                $(".role-code-button").show();
                clearTimeout(codeTime);
                $(".role-time-code").html(60);
                window.localStorage.removeItem("time");
            }
            },1000)
        }else{
            let time=60;
            $(".role-code-time").show();
            $(".role-code-button").hide();
            var codeTime=setInterval(()=>{
            time--;
            window.localStorage.setItem("timeRole",time);
            $(".role-time-code").html(time);
            if(time<1){
                $(".role-code-time").hide();
                $(".role-code-button").show();
                clearTimeout(codeTime);
                $(".role-time-code").html(60);
                window.localStorage.removeItem("timeRole");
            }
            },1000)
        } 
    }
    //1.8解锁地点和魔精
    unlockEnd(e){
        //console.log(e,777);
        jiesuoApi(e.data.data).then(res=>{
            this.getRenwuListStatus()
        })
    }
    getKnotTaskDetail(){

    }
    async getKnotDetail(){
        let data= await getKnotDetailApi();
        let t={
            type:'KnotDetail',
            data:null  
        };
        t.data=data.data; 
        this.frame.postMessage(t,"*");
    }
    WreadReport(){
        readReportApi()
    }
    WgetKnotTaskDetail(){
        getKnotTaskDetailApi().then(res=>{
            let t={
                    type:'YearStatus',
                    data:null  
            }
            t.data=res.data;
            this.frame.postMessage(t,"*");
        });
    }
    WcompletedKnotApi(e){
        completedKnotApi(e.data.data)
    }
    WgetKnotTaskDetailList(){
        getKnotTaskDetailApi().then(res=>{
            let t={
                type:'RenwuList',
                data:null
            }
            t.data=res.data;
            this.frame.postMessage(t,"*");
        });
    }
    async WreceiveKnot(e){
        await receiveKnotApi(e.data.data);
        await this.WgetKnotTaskDetailList();
        this.getKnotDetail();
    }
    async WreceiveBonus(e){
        await receiveBonusApi(e.data.data);
        this.getKnotDetail();
    }
    async WgetTitleApi(){
        let data = await getTitleApi();
        let t ={
            type:'CchangeInitChenghao',
            data:null
        }
        t.data = data.data;
        this.frame.postMessage(t,"*");
    }
    async WsetTitlesApi(e){
        await setTitlesApi(e.data.data)
    }
    shareWeibo(){
        this.shareSinaPCImg();
        let t={
            source:3,
            channel:1
        }
        this.getQuDaoShare(t)
        

    }
    shareBili(){
        let url =`https://t.bilibili.com/`;
        isIOS() ? (window.location.href = url) : window.open(url);
        let t={
            source:2,
            channel:2
        }
        this.getQuDaoShare(t)
        
    }
    shareBili2(){
        let url =`https://t.bilibili.com/`;
        isIOS() ? (window.location.href = url) : window.open(url);
        let t={
            source:3,
            channel:2
        }
        this.getQuDaoShare(t)
        
    }
    copyUrl(){
        let t={
            source:2,
            channel:3
        }
        this.copyShare()
        this.getQuDaoShare(t)
        
    }
    copyUrl2(){
        let t={
            source:3,
            channel:3
        }
        this.copyShare()
        this.getQuDaoShare(t)
        
    }
    copyUrl3(){
        let t={
            source:1,
            channel:3
        }
        this.copyShare()
        this.getQuDaoShare(t)
        
    }
    WshushuMaidian(e){
        let shushuType={
            completeNianbao:{
                name:'completeNianbao',
                data:null
            },
            nianbaoPage:{
                name:`nianbaoPage`,
                data:0
            },
            nianbaoSheng:{
                name:'nianbaoSheng',
                data:0
            },
            ninbaoShareButton:{
                name:`ninbaoShareButton`,
                data:''
            }
        }
        let n =shushuType[e.data.data.type];
        n.data=e.data.data.data;
        n.accountId =this.userinfo.accountId;
        n.roleId=this.userinfo.roleId;
        uploadShuShu(n)
    }
    NshushuMaidian(n){
        let t={
            name:'',
            data:null
        }
        t.name=n;
        uploadShuShu(t)
    }
    async WunlockDetailApi(){
        unlockDetailApi().then(res=>{
            console.log(res,5555)
            let t={
                type:`Cjiesuojindu`,
                data:res.data
            }
            this.frame.postMessage(t,"*");
        })
    }
    WupdateGuideApi(e){
        updateGuideApi(e.data.data)
    }
    WupdatePropsApi(e){
        updatePropsApi(e.data.data).then(()=>{
            this.WrenWuStatus()
        })
    }
    WunlockApi(e){
        unlockApi(e.data.data).then(()=>{
            this.WunlockDetailApi()
        })
    }
    WrenWuStatus(){
        taskDetailApi().then(res=>{
            let t ={
                type:'CrenwuStatus',
                data:res.data
            }
            this.frame.postMessage(t,"*");
        })
    }
    WgetBonusApi(e){
        getBonusApi(e.data.data).then(res=>{
            this.WrenWuStatus()
        })
    }
    WupdateThingApi(){
        updateThingApi()
    }
    playPvRenwu(){
        $(".pvVideo").show();
        $("#pvV")[0].play(); 
        let data={
            task1Status:1
        }
        unlockRenWuApi(data).then(()=>{
            this.WunlockDetailApi()
        })
    }
    gotoQQ(){
        let data={
            task2Status:1
        }
        unlockRenWuApi(data).then(()=>{
            this.WunlockDetailApi()
        })
        window.location.href =`https://re.bluepoch.com/qq/`;
    }
}
