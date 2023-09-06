import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React, { useRef, useState } from 'react';
import { ReactCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import Tesseract from 'tesseract.js';
import NavBar from '../navbar/navBar';
import "./imageUploader.css";

export default function ImageUploadCmp() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [text, setCropText] = useState("");
  const [Fulltext, setFullText] = useState("");
  const [progress, setProgress] = useState(0);
  const [filled, setFilled] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [src, setSrc] = useState("");
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [cropedImage, setCropedImage] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [language, setLanguage] = useState({
    lang: "",
  });


  const handleChangeSelect = (event) => {
    const { name, value } = event.target;
    setProgress(0);
    setLanguage(prevLang => {
      return {
        ...prevLang,
        [name]: value
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
    if (cropedImage === null) {
      alert("CROP THE IMAGE FIRST");
    } else {
      if (language.lang === 'Hindi') {
        Tesseract.recognize(
          cropedImage,
          "hin",
          {
            logger: m => {
              console.log(m);
              if (m.status === "recognizing text") {
                setProgress(parseInt(m.progress * 100))
              }
            }
          }
        ).then(({ data: { text } }) => {

          setCropText(text);
          setLoading(false);

        })
      } else {
        Tesseract.recognize(
          cropedImage,
          "eng",
          {
            logger: m => {
              console.log(m);
              if (m.status === "recognizing text") {
                setProgress(parseInt(m.progress * 100))
              }
            }
          }
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
    if (language.lang === 'Hindi') {
      Tesseract.recognize(
        image,
        "hin",
        {
          logger: m => {
            console.log(m);
            if (m.status === "recognizing text") {
              setProgress(parseInt(m.progress * 100))
            }
          }
        }
      ).then(({ data: { text } }) => {

        setFullText(text);
        setLoading(false);

      })
    } else {
      Tesseract.recognize(
        image,
        "eng",
        {
          logger: m => {
            console.log(m);
            if (m.status === "recognizing text") {
              setProgress(parseInt(m.progress * 100))
            }
          }
        }
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
    setLanguage({ lang: "English" })
  }

  const handleDeleteFull = () => {
    setIsRunning(false);
    setLoading(false);
    setFullText("");
    setProgress(0);
    setLanguage({ lang: "English" })
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

    if (cropedImage === null && canvas.width === 0) {
      alert("FIRST CROP THE IMAGE FROM THE UPLOADED IMAGE \nUSE THE MOUSE TO CROP THE IMAGE \nDOUBLE CLICK , HOLD AND CROP THE IMAGE \nOR HOLD LEFT CLICK AND CROP THE IMAGE")
    } else {
      const base64Image = canvas.toDataURL('image/jpeg');
      setCropedImage(base64Image);
    }
  }





  return (
    <div>
      <NavBar />

      <div className='image-wrapper'>
        <input type='file' ref={inputRef} style={{ display: "none" }} onChange={handleImageChange} />
        {/* after image uploadation starts */}
        <div className='image-uploader-wrapper'>
          {image ?
            <div className='upload-wrapper'>
              {/* <span className='select-upload-text'>SELECT AND UPLOAD THE IMAGE</span> */}

              <div className="image-outer-wrapper">
                <div className="uploaded-image-wrapper">
                  <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                  >
                    <img
                      style={{ width: "100%", height: "100%" }}
                      src={image}
                      onComplete={setSrc}
                      onLoad={(e) => {
                        setImageRef(e.target);
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>
              <div className="buttons-outer-wrapper">
                <div className='upload-convert-wrapper'>
                  <button className="upload-button" onClick={getCroppedImg}>Crop</button>
                  <>
                  </>
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
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              {/* after image uploadation ends */}
            </div>
            :
            // before image upload starts
            <div className='before-uploadation-wrapper' >
              <span className='select-upload-text'>SELECT AND UPLOAD THE IMAGE</span>
              <button onClick={handleClickEvent} className='after-upload-delete-button'>UPLOAD</button>
            </div>
            // before image upload ends
          }
          {loading && (
            // progress bar starts
            <div className='progressBar'>
              <div style={{
                height: "100%",
                width: `${filled}%`,
                backgroundColor: "#5963fb",
                transition: "width 0.5s"
              }}></div>
              <span className="progressPercentage">{progress}%</span>
            </div>
            // progress bar ends
          )}

        </div>
        {/* image cropping starts */}

        {/* image cropping ends */}
        {/* whoke image to text starts */}
        {image && !loading && Fulltext &&
          <div className="full-text-image-wrapper">
            <div className="fullimg-text">
              <div className="full-image-wrapper">
                <img className="full-img-conversion" src={image} />
              </div>
              {/* <span className="cropped-image-full-text">Uploaded Image-Text Conversion</span> */}
              <textarea className="textarea-component2" placeholder="Your text will apppear here" value={Fulltext} onChange={(e) => setFullText(e.target.value)} rows={10}></textarea>
            </div>
            <div></div>
            <button onClick={handleDeleteFull} className="after-upload-delete-button">Delete</button>
          </div>
        }
        <div style={{ marginTop: "8%" }}></div>
        {/* whoke image to text ends */}
        {cropedImage &&

          <div className="croped-image-text-wrapper">
            <div className="fullimg-text1">
              <div className="cropped-img">
                <span className="cropped-image-full-text">Cropped Image</span>
                <img className="cropped-image" src={cropedImage} />
              </div>
              <textarea className="textarea-component1" placeholder="Your cropped image text will appear here" value={text} onChange={(e) => setCropText(e.target.value)} rows={10}></textarea>
            </div>
            <button onClick={handleDeleteCrop} className="after-upload-delete-button">Delete</button>
          </div>
        }
      </div>
    </div>
  )
}