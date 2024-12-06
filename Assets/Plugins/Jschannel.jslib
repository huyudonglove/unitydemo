
function Hello () {
    console.log("Hello, world!");
    //window.alert("Hello, world!");
  }

 function HelloString(str) {
  window.alert(UTF8ToString(str));
}

mergeInto(LibraryManager.library, {Hello});