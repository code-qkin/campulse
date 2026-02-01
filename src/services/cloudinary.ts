export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'campulse_upload'); 
  formData.append('cloud_name', 'dlja9z9x0'); 

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dlja9z9x0/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url; // This is the link we save to Firestore
};