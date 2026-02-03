import { useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Cancel01Icon, ImageUploadIcon, Money03Icon, TextIcon, Tag01Icon } from 'hugeicons-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userUni: string;
}

const PostItemModal = ({ isOpen, onClose, userUni }: Props) => {
  const CLOUD_NAME = "dlja9z9x0"; 
  const UPLOAD_PRESET = "campulse_upload";

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Textbooks');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !auth.currentUser) return alert("Please select an image");

    setUploading(true);
    try {
      // 1. Upload to Cloudinary using a FormData request
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      const imageUrl = data.secure_url;

      if (!imageUrl) throw new Error("Cloudinary upload failed");

      // 2. Save everything to Firestore
      await addDoc(collection(db, "products"), {
        title,
        price: Number(price),
        category,
        description,
        images: [imageUrl], 
        university: userUni,
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName,
        createdAt: Date.now(),
        isSold: false
      });

      alert("Item posted successfully!");
      onClose(); 
    } catch (error) {
      console.error(error);
      alert("Error posting item. Check your Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">Sell Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <Cancel01Icon size={24} />
          </button>
        </div>

        <form onSubmit={handlePostItem} className="space-y-6">
          {/* Title */}
          <div className="relative">
            <span className="absolute top-4 left-4 text-slate-400"><TextIcon size={20} /></span>
            <input 
              required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              placeholder="What are you selling?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute top-4 left-4 text-slate-400"><Money03Icon size={20} /></span>
              <input 
                type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Price (₦)"
              />
            </div>
            <div className="relative">
               <span className="absolute top-4 left-4 text-slate-400"><Tag01Icon size={20} /></span>
               <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-slate-50 py-4 pl-12 pr-8 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                >
                  <option>Textbooks</option>
                  <option>Dorm Essentials</option>
                  <option>Electronics</option>
                  <option>Services</option>
               </select>
            </div>
          </div>

          {/* Custom Image Upload UI */}
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group">
             <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {image ? (
                   <div className="text-center">
                      <p className="text-sm font-black text-green-600 mb-1">Image Selected!</p>
                      <p className="text-xs text-slate-400">{image.name}</p>
                   </div>
                ) : (
                   <>
                      <ImageUploadIcon size={32} className="text-slate-300 group-hover:text-blue-500 mb-3 transition-colors"  />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">Click to upload photo</p>
                   </>
                )}
             </div>
             <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
          </label>

          <textarea 
            className="w-full rounded-2xl bg-slate-50 p-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px]"
            placeholder="Describe the condition..."
            value={description} onChange={(e) => setDescription(e.target.value)}
          />

          <button 
            disabled={uploading}
            className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white shadow-xl hover:bg-blue-600 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
          >
            {uploading ? "Uploading..." : "List Item Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItemModal;