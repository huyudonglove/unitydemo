function alertShow(str){
    if(str){
        $(".allAlert-str").html(str)
    }
    $(".allAlert").show();
    setTimeout(()=>{
        $(".allAlert").hide();
    },2000)
}
var h5Event=new numbers();
h5Event.init();
window.addEventListener('message',(e)=>{
   // console.log(e.data.type,7777);
    if(h5Event[e.data.type]){
        h5Event[e.data.type](e);
    }
        
},false);
