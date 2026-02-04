import { useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Cancel01Icon, 
  ImageUploadIcon, 
  Money03Icon, 
  TextIcon, 
  Tag01Icon,
  Delete02Icon 
} from 'hugeicons-react';
import PulseAlert from './PulseAlert';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userUni: string;
}

const PostItemModal = ({ isOpen, onClose, userUni }: Props) => {
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Textbooks');
  const [description, setDescription] = useState('');
  
  // Image State
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // UI State
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // 1. Handle File Selection (Max 4 images)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      if (images.length + newFiles.length > 4) {
        setAlert({ msg: "Maximum 4 images allowed", type: "error" });
        return;
      }

      setImages(prev => [...prev, ...newFiles]);

      // Generate previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // 2. Remove Image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Submit Form
  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return setAlert({ msg: "Please add at least 1 image", type: "error" });
    if (!auth.currentUser) return;

    setUploading(true);

    try {
      // Step A: Upload Images to Cloudinary
      const uploadPromises = images.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "campulse_uploads"); // Must match "Unsigned" preset in Cloudinary
        
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          
          if (!res.ok) throw new Error(data.error?.message || "Upload failed");
          
          return data.secure_url;
        } catch (err) {
          console.error("Image upload failed:", err);
          return null; // Return null so we can filter it out later
        }
      });

      const rawUrls = await Promise.all(uploadPromises);
      
      // Step B: Filter out failed uploads
      const validImageUrls = rawUrls.filter((url) => url !== null && url !== undefined);

      if (validImageUrls.length === 0) {
        throw new Error("Image upload failed. Please check your internet connection.");
      }

      // Step C: Save to Firestore
      await addDoc(collection(db, "products"), {
        title: title.trim() || "Untitled Item",
        price: Number(price) || 0,
        category: category || "General",
        description: description.trim() || "",
        images: validImageUrls, 
        university: userUni || "Unknown Campus", 
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName || "Student", 
        createdAt: Date.now(),
        isSold: false,
      });

      // Step D: Success & Reset
      setAlert({ msg: "Item listed successfully!", type: "success" });
      setTimeout(() => {
        onClose();
        setTitle(''); 
        setPrice(''); 
        setDescription(''); 
        setImages([]); 
        setPreviews([]);
      }, 2000);

    } catch (error: any) {
      console.error("Error listing item:", error);
      setAlert({ msg: "Failed to post: " + error.message, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      {alert && <PulseAlert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Sell Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <Cancel01Icon size={24} />
          </button>
        </div>

        <form onSubmit={handlePostItem} className="space-y-5">
          {/* Title Input */}
          <div className="relative">
            <span className="absolute top-4 left-4 text-slate-400"><TextIcon size={20} /></span>
            <input 
              required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
              placeholder="What are you selling?"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute top-4 left-4 text-slate-400"><Money03Icon size={20} /></span>
              <input 
                type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
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
                  <option>Fashion</option>
                  <option>Services</option>
               </select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <p className="text-xs font-black uppercase text-slate-400 mb-2 ml-1">Photos ({images.length}/4)</p>
            <div className="grid grid-cols-4 gap-2">
              {/* Image Previews */}
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={src} className="h-full w-full object-cover" alt="preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Delete02Icon size={20} />
                  </button>
                </div>
              ))}
              
              {/* Add Button */}
              {images.length < 4 && (
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-400 hover:text-blue-500">
                  <ImageUploadIcon size={24} />
                  <span className="text-[10px] font-bold mt-1">Add</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          {/* Description */}
          <textarea 
            className="w-full rounded-2xl bg-slate-50 p-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px] placeholder:text-slate-400"
            placeholder="Describe the condition, defects, or reason for selling..."
            value={description} onChange={(e) => setDescription(e.target.value)}
          />

          {/* Submit Button */}
          <button 
            disabled={uploading}
            className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white shadow-xl hover:bg-blue-600 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>Uploading <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></>
            ) : "List Item Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItemModal;