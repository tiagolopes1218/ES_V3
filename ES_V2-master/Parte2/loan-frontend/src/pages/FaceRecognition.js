import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const FaceRecognition = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    const capture = (webcamRef) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    const sendImage = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/recognize-face/", {
                image: image.split(",")[1],
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Recognition failed.");
        }
    };

    return (
        <div>
            <h1>Facial Recognition</h1>
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width={320}
                ref={(webcam) => (this.webcam = webcam)}
            />
            <button onClick={() => capture(this.webcam)}>Capture</button>
            <button onClick={sendImage}>Submit</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FaceRecognition;
