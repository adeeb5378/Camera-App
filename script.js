let recordBtn=document.querySelector(".record-btn")
let recordBtnCont=document.querySelector(".record-btn-cont")
let captureBtn=document.querySelector(".capture-btn")
let captureBtnCont=document.querySelector(".capture-btn-cont")
let timerCont = document.querySelector(".timer-cont");
let timer = document.querySelector(".timer");
let video = document.querySelector("video");

// For generation of unique id
var uid = new ShortUniqueId();

// Color to be set to the filter color
let color = "transparent";

let constraints = {
    video: true,
    audio: true
}
let mediaRecorder;
//this will store the video mediastream 
let chunks = []; //Media data in chunks
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data); 
    });

    mediaRecorder.addEventListener("start", (e) => {
        startTimer();
        // console.log("rec started");
        chunks = [];
        
    });

     mediaRecorder.addEventListener("stop", () => {
        stopTimer();
        //  console.log("rec stopped");
        // Blob is used to merge all chunks
         let blob = new Blob(chunks, { type: "video/mp4" });
         let videoURL = URL.createObjectURL(blob);
         // console.log(videoURL);

         //  To download the video
         //  let a = document.createElement("a");
        //  a.href = videoURL;
        //  a.download="myVideo.mp4"
        //  a.click();

        //  Store video to indexDb
         if(db)
         {
            let videoId = uid();
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id : `vid-${videoId}`,
                blobData : blob
            }
            videoStore.add(videoEntry);
         }

        
        
     });
})

let isRecording = false;
recordBtnCont.addEventListener("click", function () {
    // if mediaRecorder put in a promise, so it may be give underfined
    if(!mediaRecorder) return;

    // Start recording
    if (!isRecording) 
    {
        //we have to record 
        mediaRecorder.start();
        recordBtn.classList.add("scale-record");
        timer.style.display = "block";
    }
    // Stop Recording
    else
    {
        //stop the recording 
        mediaRecorder.stop();
        recordBtn.classList.remove("scale-record");
        timer.style.display = "none";
    }
    
    isRecording = !isRecording;
  
});

let timerId;
let counter = 0; // Represent total seconds
function startTimer()
{
    function displayTimer()
    {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerHTML = `${hours}:${minutes}:${seconds}`;

        counter++; 
    }
    timerId = setInterval(displayTimer,1000);

}
function stopTimer()
{
    clearInterval(timerId);
    timer.innerHTML = "00:00:00";
}

captureBtnCont.addEventListener("click", function(){
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    //Apply Filter
    tool.fillStyle = color;  
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageUrl = canvas.toDataURL();

    // To download the image
    // let a = document.createElement("a");
    // a.href = imageUrl;
    // a.download="myImage.jpg";
    // a.click();

    //  Store image to indexDb
    if(db)
    {
       let imageId = uid();
       let dbTransaction = db.transaction("image","readwrite");
       let imageStore = dbTransaction.objectStore("image");
       let imageEntry = {
           id : `img-${imageId}`,
           url : imageUrl
       }
       imageStore.add(imageEntry);
    }
    

    captureBtn.classList.add("scale-capture");
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture")
    },1000)
})

// Filtering logic
let filterLayer = document.querySelector(".filter-layer")
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach(filterElement => {
    filterElement.addEventListener("click",function(){
    // Get  
    let cssObj = getComputedStyle(filterElement);
    color = cssObj.getPropertyValue("background-color");
    filterLayer.style.backgroundColor = color;
    // console.log(color);
    })
});