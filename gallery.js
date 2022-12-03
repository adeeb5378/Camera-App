let galleryCont = document.querySelector(".gallery-cont");
setTimeout(()=>{
    if(db)
    {
        // Video retrival
        let videoDbTransaction = db.transaction("video","readonly");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();

        videoRequest.onsuccess = (e) =>{
            let videoResult = videoRequest.result;
            videoResult.forEach(videoObj => {

                let url = URL.createObjectURL(videoObj.blobData);

                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class","media-cont");
                mediaElement.setAttribute("id",videoObj.id);
                mediaElement.innerHTML =`
                <div class="media">
                    <video loop autoplay muted class="video" src="${url}"></video>
                </div>
                <div class="download">Download</div>
                <div class="delete">Delete</div>`;
                
                galleryCont.appendChild(mediaElement);

                let deleteBtn = mediaElement.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListner);
                let downloadBtn = mediaElement.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);

                
            });
        }

        // Image retrival
        let imageDbTransaction = db.transaction("image","readonly");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();

        imageRequest.onsuccess = (e) =>{
            let imageResult = imageRequest.result;
            imageResult.forEach(imageObj => {

                let url = imageObj.url;

                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class","media-cont");
                mediaElement.setAttribute("id",imageObj.id);
                mediaElement.innerHTML =`
                <div class="media">
                    <img src="${url}"/>
                </div>
                <div class="download">Download</div>
                <div class="delete">Delete</div>`;
                galleryCont.appendChild(mediaElement);

                let deleteBtn = mediaElement.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListner);
                let downloadBtn = mediaElement.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);

               
            });
        }
    }
},1000);

function deleteListner(e)
{
    // Db Removal
    let parent = e.target.parentElement;
    let id = parent.getAttribute("id");
    // Check if it is image or video
    if(id.slice(0,3) == "img")
    {
        let imageDbTransaction = db.transaction("image","readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        imageStore.delete(id);
    }
    else
    {
        let videoDbTransaction = db.transaction("video","readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        videoStore.delete(id);
    }

    // UI removal
    parent.remove();
}
function downloadListener(e)
{
    let parent = e.target.parentElement;
    let id = parent.getAttribute("id");
    // Check if it is image or video
    if(id.slice(0,3) == "img")
    {
        let imageDbTransaction = db.transaction("image","readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) =>{
            let imageResult = imageRequest.result;
            imageUrl = imageResult.url;
            // To download the image
            let a = document.createElement("a");
            a.href = imageUrl;
            a.download="myImage.jpg";
            a.click();
        }

    }
    else
    {
        let videoDbTransaction = db.transaction("video","readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) =>{
            let videoResult = videoRequest.result;
            let videoUrl = URL.createObjectURL(videoResult.blobData);
            //  To download the video
             let a = document.createElement("a");
             a.href = videoUrl;
             a.download="myVideo.mp4"
             a.click();
            
        }
    }
    
}
