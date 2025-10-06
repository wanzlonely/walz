import React, { useState, useEffect } from 'react';
import { Check, Copy, Phone, X } from 'lucide-react';

const CustomToast = ({ show, onClose, message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none w-full max-w-sm px-4">
      <div className={`transform transition-all duration-500 ease-out ${
        isAnimating 
          ? 'translate-y-0 opacity-100 scale-100' 
          : '-translate-y-full opacity-0 scale-95'
      }`}>
        <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-green-400/50 w-full relative overflow-hidden">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-4 w-2 sm:w-4 h-2 sm:h-4 bg-white bg-opacity-30 rounded-full animate-ping"></div>
            <div className="absolute top-3 right-6 w-1 sm:w-2 h-1 sm:h-2 bg-white bg-opacity-40 rounded-full animate-pulse delay-100"></div>
            <div className="absolute bottom-3 left-8 w-2 sm:w-3 h-2 sm:h-3 bg-white bg-opacity-20 rounded-full animate-bounce delay-200"></div>
            <div className="absolute bottom-2 right-4 w-1 h-1 bg-white bg-opacity-30 rounded-full animate-ping delay-300"></div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 300);
            }}
            className="absolute top-2 right-2 p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors pointer-events-auto z-20"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
          
          {/* Content */}
          <div className="flex items-center space-x-4 relative z-10">
            {/* Icon with Animation */}
            <div className="flex-shrink-0">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse border-2 border-white/30">
                {type === 'success' && <Check size={20} className="sm:w-7 sm:h-7 text-white animate-bounce" />}
                {type === 'copy' && <Copy size={20} className="sm:w-7 sm:h-7 text-white animate-pulse" />}
                {type === 'phone' && <Phone size={20} className="sm:w-7 sm:h-7 text-white animate-pulse" />}
              </div>
            </div>
            
            {/* Message Content */}
            <div className="flex-1">
              <h4 className="font-black text-lg sm:text-xl mb-2 drop-shadow-lg flex items-center">
                <span>🎉 Berhasil Disalin!</span>
              </h4>
              
              <div className="space-y-2">
                <p className="text-sm sm:text-base opacity-95 leading-relaxed drop-shadow-md">
                  Nomor DANA: <span className="font-black bg-white/20 px-2 py-1 rounded-md">082298902274</span>
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs sm:text-sm opacity-90 font-medium">Siap untuk pembayaran</span>
                  </div>
                  
                  <div className="text-xs sm:text-sm opacity-80 font-medium">
                    ✅ Tersimpan di clipboard
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 sm:h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden w-full">
            <div 
              className="h-full bg-gradient-to-r from-white via-green-200 to-white rounded-full shadow-lg" 
              style={{
                animation: 'progress 3s linear forwards'
              }}
            ></div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-500/20 to-green-600/20 rounded-2xl sm:rounded-3xl blur-xl opacity-50"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default CustomToast;
