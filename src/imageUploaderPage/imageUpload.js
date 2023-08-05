import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React, { useRef, useState } from 'react';
import { ReactCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import Tesseract from 'tesseract.js';
import NavBar from '../navbar/navBar';
import "./imageUploader.css";

export default function ImageUploadCmp() {
  const inputRef = useRef(null);
  const [loading , setLoading] = useState(false);
  const [image , setImage] = useState(null);
  const [text , setCropText] = useState("");
  const [Fulltext , setFullText] = useState("");
  const [progress , setProgress] = useState(0);
  const [filled, setFilled] = useState(100);
  const [isRunning , setIsRunning] = useState(false);
  const [src, setSrc] = useState("");
  const [crop , setCrop] = useState({aspect: 1/1});
  const [cropedImage , setCropedImage] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [language, setLanguage] = useState({
    lang: "",
  });
  const [cropedImageClicked, setCropedImageClicked] = useState(false);


  const handleChangeSelect = (event) => {
    const {name , value} = event.target;
    setProgress(0);
    setLanguage(prevLang => {
      return {
        ...prevLang,
        [name] : value
      }
    })
  }

  const handleClickEvent = () => {
    inputRef.current.click();
  }

  const handleImageChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
    setProgress(0);
  }

  const handleClickCrop = () => {
    setLoading(true);
      setIsRunning(true);
    if(cropedImage === null) {
      alert("Crop the image first");
    }else {
      if(language.lang === 'Hindi') {
      Tesseract.recognize(
        cropedImage,
        "hin",
        { logger: m => {console.log(m);
        if(m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100))
        }
        } }
      ).then(({ data: { text } }) => {
  
          setCropText(text);
          setLoading(false);
        
      })
    }else {
      Tesseract.recognize(
        cropedImage,
        "eng",
        { logger: m => {console.log(m);
        if(m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100))
        }
        } }
      ).then(({ data: { text } }) => {
  
          setCropText(text);
          setLoading(false);
        
      })
    }
  }
  }

  const handleClick = () => {
      setLoading(true);
      setIsRunning(true);
      if(language.lang === 'Hindi') {
        Tesseract.recognize(
          image,
          "hin",
          { logger: m => {console.log(m);
          if(m.status === "recognizing text") {
            setProgress(parseInt(m.progress * 100))
          }
          } }
        ).then(({ data: { text } }) => {
    
          setFullText(text);
            setLoading(false);
          
        })
      }else {
        Tesseract.recognize(
          image,
          "eng",
          { logger: m => {console.log(m);
          if(m.status === "recognizing text") {
            setProgress(parseInt(m.progress * 100))
          }
          } }
        ).then(({ data: { text } }) => {
    
          setFullText(text);
            setLoading(false);
          
        })
      }
  }

  const handleDeleteCrop = () => {
    setIsRunning(false);
      setLoading(false);
      setCropText("");
      setCropedImage(null);
      setProgress(0);
  }

  const handleDeleteFull = () => {
    setIsRunning(false);
      setLoading(false);
      setFullText("");
      setProgress(0);
  }


    function getCroppedImg() {
      const canvas = document.createElement('canvas');
        const scaleX = imageRef?.naturalWidth / imageRef?.width;
        const scaleY = imageRef?.naturalHeight / imageRef?.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
      
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
      
        ctx.drawImage(
          imageRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        setCropedImage(base64Image);

        if(cropedImage === null) {
          setCropedImageClicked(false);
          alert("FIRST CROP THE IMAGE FROM UPLOADED IMAGE")
        }else {
          setCropedImageClicked(true);
        }
    }
    
  

  return (
    <div>
      <NavBar />
    
    <div className='image-wrapper'>
      <input type='file' ref={inputRef} style={{display: "none"}} onChange={handleImageChange} />
      {/* after image uploadation starts */}
      <div className='image-uploader-wrapper'>
      {image ?
      <div className='upload-wrapper'>
      <ReactCrop
    crop={crop}
    onChange={setCrop}
>
    <img
       src={image}
       onComplete={setSrc}
       onLoad={(e) => {
        setImageRef(e.target);
       }}
    />
</ReactCrop>
      <span className='select-upload-text'>SELECT AND UPLOAD THE IMAGE</span>
      <div className='upload-convert-wrapper'>
      <button className="upload-button" onClick={getCroppedImg}>Crop</button>
      <button onClick={handleClickEvent} className='upload-button'>UPLOAD(Upload new image)</button>
      <button onClick={handleClickCrop} className='upload-button'>Cropped Image (Convert to text)</button>
      <button onClick={handleClick} className='upload-button'>Convert whole Image to text</button>
      </div>
      
      <select 
              className="selectTag"
              id="lang"
              value={language.lang}
              onChange={handleChangeSelect}
              name="lang"
      >
        <option value="Hindi">Hindi</option>
        <option value="English">English</option>
      </select>
      {/* after image uploadation ends */}
      </div>
      : 
      // before image upload starts
      <div className='before-uploadation-wrapper' >
        <span className='select-upload-text'>SELECT AND UPLOAD THE IMAGE</span>
      <button onClick={handleClickEvent} className='before-upload-delete-button'>UPLOAD</button>
      </div>
      // before image upload ends
  }
  {loading &&  (
    // progress bar starts
     <div className='progressBar'>
            <div style={{
              height:"100%",
              width: `${filled}%`,
              backgroundColor: "#1976d2",
              transition: "width 0.5s"
            }}></div>
            <span className="progressPercentage">{progress}%</span>
        </div> 
        // progress bar ends
  )}
  
      </div>
      {/* image cropping starts */}
      <div className="croped-image-text-wrapper">
      <div className="cropped-text-wrapper">
        <div className="cropped-text">
      {cropedImage && cropedImageClicked &&
      <div style={{display: "flex", flexDirection: "column"}}>
      <span className="cropped-image-full-text">Cropped Image</span>
      <img className="cropped-image" src={cropedImage}  />
      </div>
      }
      {/* {cropedImageClicked &&<p>CROP THE IMAGE FROM THE UPLOADED IMAGE FIRST</p>} */}
      </div>
      <div className="cropped-text">
      {!loading && text && (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <textarea style={{width: "500px", marginTop: "20%"}} value={text} onChange={(e) => setCropText(e.target.value)} rows={10}></textarea>
      </div>
      )}
      </div>
  </div>
  {cropedImage && cropedImageClicked  && <button onClick={handleDeleteCrop} className="before-upload-delete-button">Delete</button>}
  </div>
  {/* image cropping ends */}
  {/* whoke image to text starts */}
  {image && 
  <div style={{display: "flex", flexDirection: "column", marginTop: "40px", justifyContent: "center", alignItems: "center"}}>
  {!loading && Fulltext && 
  <>
  <span className="cropped-image-full-text">Uploaded Image-Text Conversion</span>
   <textarea style={{width: "500px"}} value={Fulltext} onChange={(e) => setFullText(e.target.value)} rows={10}></textarea> 
   <button onClick={handleDeleteFull} className="before-upload-delete-button">Delete</button>
   </>
  }
      </div>
  }
  {/* whoke image to text ends */}
    </div>
    </div>
  )
}