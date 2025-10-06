import React, { useState } from 'react';
import { QrCode, CreditCard, Package, Monitor, ChevronRight, ChevronDown, Copy, Maximize2, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import QrisModal from './QrisModal';
import CustomToast from './CustomToast';

const ServiceMenu = () => {
  const [expandedService, setExpandedService] = useState(null);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCustomToast, setShowCustomToast] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setShowCustomToast(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "📱 Nomor DANA",
        description: "082298902274 (Tap untuk highlight)",
        duration: 5000,
      });
    }
  };

  const openQrisModal = () => {
    setIsQrisModalOpen(true);
  };

  const services = [
    {
      id: 1,
      title: 'PAYMENT QRIS',
      icon: QrCode,
      description: 'Pembayaran menggunakan QRIS',
      gradient: 'from-blue-600 via-blue-700 to-indigo-800',
      glowColor: 'shadow-blue-500/15 sm:shadow-blue-500/25 lg:shadow-blue-500/30',
      iconBg: 'bg-blue-600 group-hover:bg-blue-500',
      borderColor: 'border-blue-500/20 hover:border-blue-400/40',
      content: (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950/90 via-blue-950/40 to-black/90 rounded-2xl sm:rounded-3xl border border-blue-500/15 shadow-xl lg:shadow-2xl shadow-blue-500/10">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="bg-white/95 p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl inline-block border border-blue-200/50">
              <img 
                src="https://files.catbox.moe/pa0iwo.png" 
                alt="QRIS WalzShop" 
                className="w-40 sm:w-48 lg:w-56 h-auto mx-auto rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg"
              />
            </div>
            <button
              onClick={openQrisModal}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg flex items-center mx-auto space-x-3 transition-all duration-500 transform hover:scale-105 shadow-lg lg:shadow-2xl shadow-blue-500/30 hover:shadow-blue-400/50 border border-blue-400/20"
            >
              <Maximize2 size={18} className="sm:w-5 sm:h-5" />
              <span>Perbesar QRIS</span>
            </button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'PAYMENT DANA',
      icon: CreditCard,
      description: 'Pembayaran menggunakan DANA',
      gradient: 'from-emerald-600 via-green-700 to-teal-800',
      glowColor: 'shadow-emerald-500/15 sm:shadow-emerald-500/25 lg:shadow-emerald-500/30',
      iconBg: 'bg-emerald-600 group-hover:bg-emerald-500',
      borderColor: 'border-emerald-500/20 hover:border-emerald-400/40',
      content: (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950/90 via-emerald-950/40 to-black/90 rounded-2xl sm:rounded-3xl border border-emerald-500/15 shadow-xl lg:shadow-2xl shadow-emerald-500/10">
          <div className="text-center space-y-6 lg:space-y-8">
            <div className="bg-gradient-to-br from-slate-800/80 via-emerald-900/30 to-slate-900/80 p-6 sm:p-7 lg:p-8 rounded-2xl lg:rounded-3xl border border-emerald-600/20 shadow-xl lg:shadow-2xl backdrop-blur-sm">
              <p className="text-emerald-300 text-sm sm:text-base mb-3 font-medium tracking-wide">Nama Penerima</p>
              <p className="text-white text-2xl sm:text-3xl lg:text-4xl font-black mb-6 lg:mb-8 tracking-wide drop-shadow-lg">walzlonely</p>
              
              <p className="text-emerald-300 text-sm sm:text-base mb-3 font-medium tracking-wide">Nomor DANA</p>
              
              <div 
                className="relative group cursor-pointer mb-4"
                onClick={() => copyToClipboard('082298902274')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl lg:rounded-2xl opacity-10 sm:opacity-15 lg:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-35 lg:group-hover:opacity-40 transition-all duration-500 blur-lg lg:blur-xl"></div>
                
                <div className="relative text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-wide lg:tracking-widest bg-gradient-to-r from-slate-700/80 via-emerald-800/40 to-slate-700/80 p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border-2 lg:border-3 border-emerald-500/50 group-hover:border-emerald-400/70 transition-all duration-500 select-all transform group-hover:scale-[1.01] lg:group-hover:scale-[1.02] shadow-lg lg:shadow-xl shadow-emerald-500/15 backdrop-blur-sm">
                  <span className="bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent drop-shadow-sm lg:drop-shadow-lg">
                    082298902274
                  </span>
                  
                  <div className="absolute inset-0 rounded-xl lg:rounded-2xl border border-emerald-400/20 group-hover:border-emerald-300/50 transition-all duration-500"></div>
                  
                  <div className="absolute top-2 right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse delay-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-emerald-400/70 font-medium animate-pulse">
                ✨ Tap nomor di atas untuk menyalin otomatis ✨
              </p>
            </div>
            
            <button
              onClick={() => copyToClipboard('082298902274')}
              disabled={copied}
              className={`w-full px-8 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all duration-500 transform hover:scale-105 shadow-lg lg:shadow-2xl border ${
                copied 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-green-500/40 lg:shadow-green-500/60 border-green-400/40' 
                  : 'bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-800 hover:from-emerald-700 hover:via-green-800 hover:to-teal-900 text-white shadow-emerald-500/30 lg:shadow-emerald-500/40 hover:shadow-emerald-400/50 border-emerald-400/20'
              }`}
            >
              {copied ? <Check size={18} className="sm:w-5 sm:h-5 animate-bounce" /> : <Copy size={18} className="sm:w-5 sm:h-5" />}
              <span>{copied ? 'Tersalin! ✅' : 'Salin Nomor'}</span>
            </button>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'LAYANAN WALZSHOP',
      icon: Package,
      description: 'Layanan khusus WalzShop',
      gradient: 'from-purple-600 via-violet-700 to-indigo-800',
      glowColor: 'shadow-purple-500/15 sm:shadow-purple-500/25 lg:shadow-purple-500/30',
      iconBg: 'bg-purple-600 group-hover:bg-purple-500',
      borderColor: 'border-purple-500/20 hover:border-purple-400/40',
      content: (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950/90 via-purple-950/40 to-black/90 rounded-2xl sm:rounded-3xl border border-purple-500/15 shadow-xl lg:shadow-2xl shadow-purple-500/10">
          <div className="text-center text-white">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 lg:mb-8 bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-lg">
              🚀 WalzShop Melayani:
            </h3>
            <div className="grid gap-4 sm:gap-5 lg:gap-6">
              {[
                { text: 'LOGO BEBAS REQUEST', icon: '🎨' },
                { text: 'PANEL RUN BOT 1GB - UNLI', icon: '🤖' }, 
                { text: 'RESELLER PANEL & ADMIN PANEL', icon: '⚙️' },
                { text: 'JASA PEMBUATAN WEBSITE', icon: '💻' }
              ].map((service, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl lg:rounded-2xl opacity-10 sm:opacity-15 lg:opacity-20 group-hover:opacity-20 sm:group-hover:opacity-25 lg:group-hover:opacity-30 transition-all duration-500 blur-lg"></div>
                  <div className="relative bg-gradient-to-r from-slate-800/70 via-purple-900/30 to-slate-800/70 p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 transform hover:scale-[1.01] lg:hover:scale-[1.02] shadow-lg lg:shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                      <span className="text-xl sm:text-2xl">{service.icon}</span>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-purple-100 text-center sm:text-left">{service.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'PRODUK PANEL',
      icon: Monitor,
      description: 'Manajemen produk dan panel',
      gradient: 'from-orange-600 via-red-600 to-pink-700',
      glowColor: 'shadow-orange-500/15 sm:shadow-orange-500/25 lg:shadow-orange-500/30',
      iconBg: 'bg-orange-600 group-hover:bg-orange-500',
      borderColor: 'border-orange-500/20 hover:border-orange-400/40',
      content: (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950/90 via-orange-950/40 to-black/90 rounded-2xl sm:rounded-3xl border border-orange-500/15 shadow-xl lg:shadow-2xl shadow-orange-500/10">
          <div className="text-white">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 lg:mb-8 text-center bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              🖥️ PANEL PTERODACTYL
            </h3>
            <div className="grid gap-3 sm:gap-4 lg:gap-5">
              {[
                { ram: '1GB', price: 'Rp1.000', popular: false },
                { ram: '2GB', price: 'Rp2.000', popular: false },
                { ram: '3GB', price: 'Rp3.000', popular: true },
                { ram: '4GB', price: 'Rp4.000', popular: false },
                { ram: '5GB', price: 'Rp5.000', popular: false },
                { ram: '6GB', price: 'Rp6.000', popular: false },
                { ram: '7GB', price: 'Rp7.000', popular: false },
                { ram: '8GB', price: 'Rp8.000', popular: true },
                { ram: '9GB', price: 'Rp9.000', popular: false },
                { ram: 'UNLI', price: 'Rp10.000', popular: true }
              ].map((item, index) => (
                <div key={index} className={`relative group ${item.popular ? 'transform scale-[1.01] sm:scale-[1.02] lg:scale-[1.03]' : ''}`}>
                  {item.popular && (
                    <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-2 sm:px-3 py-1 rounded-full z-10 animate-pulse shadow-md lg:shadow-lg">
                      <span className="hidden sm:inline">POPULER ⭐</span>
                      <span className="sm:hidden">⭐</span>
                    </div>
                  )}
                  
                  <div className={`relative flex justify-between items-center p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl transition-all duration-500 transform group-hover:scale-[1.01] lg:group-hover:scale-[1.02] shadow-lg lg:shadow-xl backdrop-blur-sm ${
                    item.popular 
                      ? 'bg-gradient-to-r from-orange-700/80 via-red-700/80 to-pink-700/80 border border-yellow-400/50 lg:border-2 shadow-yellow-500/15 lg:shadow-yellow-500/25' 
                      : 'bg-gradient-to-r from-slate-800/60 via-orange-900/30 to-slate-800/60 border border-orange-500/30 hover:border-orange-400/60'
                  }`}>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-orange-300 font-bold text-base sm:text-lg">•</span>
                      <span className={`font-bold text-sm sm:text-base lg:text-lg ${item.popular ? 'text-yellow-200' : 'text-orange-200'}`}>
                        RAM {item.ram}
                      </span>
                    </div>
                    <span className={`font-black text-lg sm:text-xl lg:text-2xl ${
                      item.popular 
                        ? 'text-yellow-300 drop-shadow-lg' 
                        : 'text-orange-300'
                    }`}>
                      {item.price}
                    </span>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-10 sm:group-hover:opacity-15 lg:group-hover:opacity-20 transition-all duration-500 blur-lg lg:blur-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-5 lg:px-6 py-8 sm:py-10 lg:py-12">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {services.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedService === service.id;
            
            return (
              <div
                key={service.id}
                className={`bg-gradient-to-r ${service.gradient} rounded-2xl sm:rounded-3xl lg:rounded-[2rem] border ${service.borderColor} overflow-hidden ${service.glowColor} shadow-xl lg:shadow-2xl transform transition-all duration-500 hover:scale-[1.005] sm:hover:scale-[1.01] lg:hover:scale-[1.015] hover:shadow-2xl lg:hover:shadow-3xl`}
              >
                <div
                  className="p-5 sm:p-6 lg:p-8 cursor-pointer transition-all duration-500 hover:bg-black/15 group relative overflow-hidden"
                  onClick={() => toggleService(service.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4 sm:space-x-5 lg:space-x-6">
                      <div className={`${service.iconBg} p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl transition-all duration-500 shadow-lg lg:shadow-2xl group-hover:shadow-2xl lg:group-hover:shadow-3xl transform group-hover:scale-105 lg:group-hover:scale-110`}>
                        <Icon size={28} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
                      </div>
                      <div>
                        <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-wide drop-shadow-lg">
                          {service.title}
                        </h3>
                        <p className="text-white/75 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 font-medium">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="transition-transform duration-500 transform group-hover:scale-105 lg:group-hover:scale-110">
                      {isExpanded ? (
                        <ChevronDown size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white/75 group-hover:text-white transform rotate-180 transition-all duration-300" />
                      ) : (
                        <ChevronRight size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white/75 group-hover:text-white transition-all duration-300" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-white/15 animate-accordion-down overflow-hidden">
                    {service.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modals */}
      <QrisModal 
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        qrisUrl="https://files.catbox.moe/pa0iwo.png"
      />
      
      <CustomToast
        show={showCustomToast}
        onClose={() => setShowCustomToast(false)}
        message="Nomor DANA berhasil disalin!"
        type="copy"
      />
    </>
  );
};

export default ServiceMenu;
