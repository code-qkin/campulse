import { useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
        images: [imageUrl], // We store the Cloudinary URL here
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-slate-900">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight italic">
            Post to <span className="text-blue-600 uppercase">{userUni}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
        </div>

        <form onSubmit={handlePostItem} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item Name</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 transition-all"
              placeholder="e.g. iPhone 13 or Physics Note"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (₦)</label>
              <input 
                type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            {/* Category */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
              <select 
                className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                value={category} onChange={(e) => setCategory(e.target.value)}
              >
                <option>Textbooks</option>
                <option>Dorm Essentials</option>
                <option>Electronics</option>
                <option>Services</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Photo</label>
            <div className="mt-1 flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                  <p className="text-sm font-medium">{image ? image.name : "Click to select image"}</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brief Description</label>
            <textarea 
              className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 min-h-[80px]"
              placeholder="Tell other students about the condition..."
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            disabled={uploading}
            className="w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all"
          >
            {uploading ? "Listing on Campus..." : "Post Item Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItemModal;