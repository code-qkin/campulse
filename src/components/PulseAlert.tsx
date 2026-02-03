import { useEffect } from 'react';
import { 
  CheckmarkCircle02Icon, 
  AlertCircleIcon, 
  Cancel01Icon 
} from 'hugeicons-react';

interface Props {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const PulseAlert = ({ message, type, onClose }: Props) => {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyles = {
    success: 'bg-white border-green-100 text-green-600',
    error: 'bg-white border-red-100 text-red-600',
    info: 'bg-white border-blue-100 text-blue-600'
  };

  const Icon = {
    success: CheckmarkCircle02Icon,
    error: AlertCircleIcon,
    info: AlertCircleIcon
  }[type];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-bounce-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${bgStyles[type]} min-w-[300px]`}>
        <Icon size={24}  />
        <p className="flex-1 font-black text-xs uppercase tracking-wider">{message}</p>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
          <Cancel01Icon size={20} />
        </button>
      </div>
    </div>
  );
};

export default PulseAlert;