// Task 1. Open a DataBase
let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success",(e)=>{
    // console.log("Db Success");
    db = openRequest.result; 
});
openRequest.addEventListener("error",(e)=>{
    // console.log("Db Error");
})
openRequest.addEventListener("upgradeneeded",(e)=>{
    // console.log("Db upgraded and also for initial db creation");
    db = openRequest.result; 
    
    // Task 2. Create ObjectStore
    db.createObjectStore("video",{keyPath : "id"});
    db.createObjectStore("image",{keyPath : "id"});
}) 


 

