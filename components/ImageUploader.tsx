import { useState } from "react";
import { auth, storage, stateChanged } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the file
    console.log(e.target.files);

    const fileName = Array.from(e.target.files)[0];
    const extension = fileName.type.split("/")[1];

    // make reference to the storage containing files like 1234567890.png
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // upload file
    const task = ref.put(fileName);
    task.on(stateChanged, (snapshot) => {
      const uploadPercentage = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(+uploadPercentage);

      // get downloadURL AFTER task resolves
      task
        .then(() => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div>
      <Loader show={uploading} />
      {uploading ? (
        <h3>{progress}</h3>
      ) : (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={handleUploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && <code>{`![alt](${downloadURL})`}</code>}
    </div>
  );
}
