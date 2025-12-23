import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/getCroppedImg';

export default function PhotoUpload({ onUpload, currentPhoto }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const cloudName = 'dr1xnzptv';
  const uploadPreset = 'photo_profile1';

  // buka file picker
  const handleUploadClick = () => fileInputRef.current.click();
  // hapus foto
  const handleRemoveClick = () => {
    onUpload(null);
    setImageSrc(null);
  };

  // pilih file
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('file', croppedBlob);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload gagal');
      const data = await res.json();
      onUpload(data.secure_url);
      setImageSrc(null);
    } catch (err) {
      console.error(err);
      alert('Upload gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: 16 }}>
      {/* Foto profile */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: '#ccc',
          backgroundImage: imageSrc ? `url(${imageSrc})` : currentPhoto ? `url(${currentPhoto})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '4px solid #facc15',
          margin: '0 auto 10px',
          cursor: 'pointer',
        }}
      ></div>

      {/* Tombol selalu terlihat */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
        <button onClick={handleUploadClick} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>
          Upload
        </button>
        <button onClick={handleRemoveClick} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>
          Remove
        </button>
      </div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} accept="image/*" />

      {/* Cropper muncul setelah pilih file */}
      {imageSrc && (
        <div style={{ marginTop: 12 }}>
          <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto' }}>
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
          </div>
          <button
            onClick={uploadCroppedImage}
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
}
