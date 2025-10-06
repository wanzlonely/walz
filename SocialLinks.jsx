import React from 'react';

const SocialLinks = () => {
  const socialLinks = [
    {
      id: 1,
      name: 'WhatsApp',
      url: 'https://wa.me/082298902274',
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700',
      textColor: 'text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
        </svg>
      )
    },
    {
      id: 2,
      name: 'Telegram',
      url: 'https://t.me/walzlonely',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      textColor: 'text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 fill-current">
          <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.787L24 5.674c.321-1.54-.541-2.233-1.335-1.957z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-5 lg:px-6 pb-10 sm:pb-12 lg:pb-16">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {socialLinks.map((social) => {
          return (
            <button
              key={social.id}
              className={`w-full bg-gradient-to-r ${social.gradient} ${social.hoverGradient} ${social.textColor} rounded-2xl sm:rounded-3xl lg:rounded-[2rem] p-5 sm:p-6 lg:p-7 transition-all duration-500 transform hover:scale-[1.005] sm:hover:scale-[1.01] lg:hover:scale-[1.015] hover:shadow-xl lg:hover:shadow-2xl font-bold text-lg sm:text-xl lg:text-2xl tracking-wide border-2 border-transparent hover:border-white/15 relative overflow-hidden group`}
              onClick={() => window.open(social.url, '_blank')}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center justify-center space-x-4 sm:space-x-5 lg:space-x-6 relative z-10">
                <div className="transform transition-transform duration-300 group-hover:scale-105 lg:group-hover:scale-110">
                  {social.icon}
                </div>
                <span className="drop-shadow-lg">{social.name}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Footer Info */}
      <div className="text-center mt-8 sm:mt-10 lg:mt-12 text-gray-400 space-y-3 sm:space-y-4">
        <p className="text-sm sm:text-base font-medium">Hubungi kami untuk layanan terbaik</p>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-green-500 rounded-full animate-pulse shadow-green-500/50 shadow-sm lg:shadow-md"></div>
          <span className="text-sm sm:text-base font-medium">Online 24/7</span>
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></div>
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full"></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
