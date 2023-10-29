import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";

function App() {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [status, setStatus] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", image.data);
    const response = await fetch("http://localhost:5000/image", {
      method: "POST",
      body: formData,
    });

    if (response) setStatus(response.statusText);
  };

  const uploadHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", image.data);

    const response = await fetch("http://localhost:5000/image2", {
      method: "POST",
      body: formData,
    });

    if (response) setStatus(response.statusText);
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  const downloadHandler = async (e) => {
    const { data } = await axios.get("http://localhost:5000/image");
    //if (data?.success) {
    console.log(data);
    //}
    if (data) setImages(data);
  };

  return (
    <div className="App">
      <h1>Upload to server</h1>
      {image.preview && <img src={image.preview} width="100" height="100" />}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange}></input>
        <button type="submit">Submit</button>
        <button onClick={uploadHandler}>AnotherSubmit</button>
      </form>
      {status && <h4>{status}</h4>}
      <hr></hr>
      <div>
        <button onClick={downloadHandler}>Download</button>

        {images[0] && images[0].imgcontent && (
          <img
            src={`data:${images[0].contentType};base64, ${Buffer.from(
              images[0].imgcontent
            ).toString("base64")}`}
          ></img>
        )}

        {images && <h4>Files Count: {images.length}</h4>}
        {images[0] && images[0].imgname && (
          <h4>File Name: {images[0].imgname}</h4>
        )}
      </div>
    </div>
  );
}

export default App;
