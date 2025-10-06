import React from 'react';

const Header = () => {
  return (
    <header className="bg-black p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] flex items-center">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-gray-900"></div>
        
        {/* Animated Orbs - Properly sized for each breakpoint */}
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 lg:w-96 h-32 sm:h-64 lg:h-96 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-8 sm:opacity-12 lg:opacity-15 rounded-full blur-xl sm:blur-2xl lg:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-28 sm:w-56 lg:w-80 h-28 sm:h-56 lg:h-80 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 opacity-6 sm:opacity-10 lg:opacity-12 rounded-full blur-lg sm:blur-xl lg:blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-48 lg:w-64 h-24 sm:h-48 lg:h-64 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-4 sm:opacity-6 lg:opacity-8 rounded-full blur-md sm:blur-lg lg:blur-xl animate-pulse delay-500"></div>
        
        {/* Floating Particles */}
        <div className="hidden sm:block absolute top-16 left-8 w-2 h-2 lg:w-3 lg:h-3 bg-cyan-400 rounded-full opacity-50 animate-bounce"></div>
        <div className="hidden sm:block absolute top-24 right-16 w-1 h-1 lg:w-2 lg:h-2 bg-emerald-400 rounded-full opacity-40 animate-ping delay-300"></div>
        <div className="hidden lg:block absolute bottom-20 left-12 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse delay-700"></div>
        <div className="hidden lg:block absolute bottom-24 right-20 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-bounce delay-1000"></div>
      </div>
      
      <div className="container mx-auto relative z-10 px-3 sm:px-4 lg:px-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-800/70 via-gray-900/80 to-black/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-12 relative overflow-hidden border border-slate-600/40 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-16 sm:w-32 lg:w-40 h-16 sm:h-32 lg:h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-transparent opacity-12 sm:opacity-20 lg:opacity-25 rounded-full -translate-y-4 sm:-translate-y-8 lg:-translate-y-10 translate-x-4 sm:translate-x-8 lg:translate-x-10 blur-lg sm:blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-12 sm:w-24 lg:w-32 h-12 sm:h-24 lg:h-32 bg-gradient-to-tr from-emerald-400 via-teal-500 to-transparent opacity-8 sm:opacity-15 lg:opacity-20 rounded-full translate-y-3 sm:translate-y-6 lg:translate-y-8 -translate-x-3 sm:-translate-x-6 lg:-translate-x-8 blur-md sm:blur-lg animate-pulse delay-500"></div>
          
          <div className="relative z-10 text-center">
            {/* Logo Section */}
            <div className="mb-6 sm:mb-8 lg:mb-10 relative">
              <div className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 mx-auto relative group">
                {/* Glow Layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-15 sm:opacity-25 lg:opacity-30 group-hover:opacity-35 sm:group-hover:opacity-45 lg:group-hover:opacity-50 transition-all duration-500 animate-pulse blur-sm sm:blur-md lg:blur-lg"></div>
                <div className="absolute inset-1 sm:inset-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-10 sm:opacity-15 lg:opacity-20 group-hover:opacity-20 sm:group-hover:opacity-25 lg:group-hover:opacity-30 transition-all duration-500 animate-pulse delay-200 blur-sm"></div>
                
                <img 
                  src="https://files.catbox.moe/hrtpys.jpg" 
                  alt="WalzShop Logo" 
                  className="w-full h-full rounded-full object-cover border-2 sm:border-3 lg:border-4 border-slate-500/40 shadow-xl sm:shadow-2xl relative z-10 transition-all duration-500 group-hover:scale-105 lg:group-hover:scale-110 group-hover:border-cyan-400/60"
                />
                
                {/* Rotating Ring - Desktop only */}
                <div className="hidden lg:block absolute inset-0 rounded-full border-2 border-transparent transition-all duration-500" style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(34, 211, 238, 0.2), transparent)',
                  animation: 'spin 8s linear infinite'
                }}></div>
              </div>
            </div>
            
            {/* Brand Name - Perfectly Responsive */}
            <div className="relative mb-6 sm:mb-8 lg:mb-10">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-wide sm:tracking-wider lg:tracking-widest relative inline-block leading-tight">
                {/* Background Glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent blur-sm sm:blur-md lg:blur-lg opacity-30 sm:opacity-50 lg:opacity-60 animate-pulse">
                  WALZSHOP
                </span>
                
                {/* Main Text */}
                <span className="relative bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-lg lg:drop-shadow-2xl">
                  WALZ
                </span>
                <span className="relative bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg lg:drop-shadow-2xl">
                  SHOP
                </span>
                
                {/* Underline Glow */}
                <div className="absolute -bottom-2 sm:-bottom-4 lg:-bottom-6 left-1/2 transform -translate-x-1/2 w-full h-1 sm:h-2 lg:h-3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 sm:opacity-50 lg:opacity-60 blur-sm sm:blur-md animate-pulse"></div>
              </h1>
              
              {/* Floating Elements - Large screens only */}
              <div className="hidden xl:block absolute top-0 left-0 w-full h-full pointer-events-none">
                <span className="absolute top-4 left-12 text-cyan-400 opacity-25 animate-bounce text-sm">✨</span>
                <span className="absolute top-6 right-16 text-blue-400 opacity-35 animate-pulse text-lg">💫</span>
                <span className="absolute bottom-4 left-20 text-purple-400 opacity-20 animate-ping text-xs">⭐</span>
              </div>
            </div>
            
            {/* Multi-Layer Underline */}
            <div className="relative mx-auto w-32 sm:w-40 lg:w-48 mb-6 sm:mb-8">
              <div className="h-1 sm:h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-60 sm:opacity-80 shadow-sm sm:shadow-md lg:shadow-lg"></div>
              <div className="h-0.5 sm:h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full mt-1 w-20 sm:w-28 lg:w-32 mx-auto animate-pulse shadow-cyan-500/30 lg:shadow-cyan-500/50 shadow-sm sm:shadow-md"></div>
              <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-1 w-12 sm:w-16 lg:w-20 mx-auto animate-pulse delay-300 shadow-emerald-500/20 lg:shadow-emerald-500/30 shadow-sm"></div>
            </div>
            
            {/* Subtitle */}
            <div className="relative mb-4 sm:mb-6">
              <p className="text-slate-200 text-base sm:text-lg lg:text-xl font-medium sm:font-semibold tracking-wide drop-shadow-sm lg:drop-shadow-lg">
                <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  Your Digital Solution Partner
                </span>
              </p>
              <span className="inline-block w-0.5 h-5 sm:h-6 bg-cyan-400 ml-1 animate-pulse"></span>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-emerald-400 rounded-full animate-pulse shadow-emerald-400/40 sm:shadow-emerald-400/50 shadow-sm sm:shadow-md lg:shadow-lg"></div>
              <span className="text-slate-300 text-sm sm:text-base font-medium">Online & Ready to Serve</span>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
