"use client";

export function MobileApp() {
  return (
    <section className="py-16 bg-background-elevated">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text & QR */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Trade anytime, anywhere!
            </h2>
            
            <div className="flex items-center gap-8">
              {/* QR Code */}
              <div className="card-dark p-6">
                <div className="w-32 h-32 bg-white flex items-center justify-center rounded-lg">
                  {/* Placeholder QR code pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="10" y="10" width="15" height="15" fill="black"/>
                    <rect x="35" y="10" width="5" height="5" fill="black"/>
                    <rect x="45" y="10" width="10" height="10" fill="black"/>
                    <rect x="65" y="10" width="5" height="5" fill="black"/>
                    <rect x="75" y="10" width="15" height="15" fill="black"/>
                    
                    <rect x="10" y="35" width="5" height="5" fill="black"/>
                    <rect x="20" y="35" width="5" height="10" fill="black"/>
                    <rect x="35" y="35" width="15" height="5" fill="black"/>
                    <rect x="55" y="35" width="10" height="15" fill="black"/>
                    <rect x="75" y="35" width="5" height="5" fill="black"/>
                    <rect x="85" y="35" width="5" height="10" fill="black"/>
                    
                    <rect x="10" y="55" width="10" height="10" fill="black"/>
                    <rect x="30" y="55" width="5" height="15" fill="black"/>
                    <rect x="45" y="55" width="15" height="5" fill="black"/>
                    <rect x="70" y="55" width="10" height="15" fill="black"/>
                    
                    <rect x="10" y="75" width="15" height="15" fill="black"/>
                    <rect x="35" y="75" width="10" height="5" fill="black"/>
                    <rect x="55" y="75" width="5" height="15" fill="black"/>
                    <rect x="75" y="75" width="15" height="15" fill="black"/>
                  </svg>
                </div>
              </div>
              
              <div>
                <p className="text-foreground-dimmed mb-4">Scan the code to download now</p>
                <p className="text-2xl font-bold text-white">IOS & ANDROID</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-3 px-6 py-3 card-dark card-hover rounded-lg">
                <svg className="w-6 h-6 text-foreground-dimmed" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-white font-semibold">Apple</span>
              </button>
              
              <button className="flex items-center gap-3 px-6 py-3 card-dark card-hover rounded-lg">
                <svg className="w-6 h-6 text-foreground-dimmed" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
                </svg>
                <span className="text-white font-semibold">Android</span>
              </button>
            </div>
          </div>
          
          {/* Right side - Device Illustration */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto">
              {/* Laptop mockup */}
              <div className="relative z-10">
                <div className="bg-gray-800 rounded-t-2xl p-3 border-4 border-gray-700">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                    {/* Floating crypto symbols */}
                    <div className="relative w-full h-full flex items-center justify-center gap-8">
                      {/* Ethereum */}
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border-2 border-purple-500/50 animate-float">
                        <span className="text-3xl text-purple-400 font-bold">Ξ</span>
                      </div>
                      
                      {/* Bitcoin */}
                      <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/50 animate-float" style={{ animationDelay: '0.5s' }}>
                        <span className="text-4xl text-black font-bold">₿</span>
                      </div>
                      
                      {/* Dash */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center border-2 border-blue-500/50 animate-float" style={{ animationDelay: '1s' }}>
                        <span className="text-2xl text-blue-400 font-bold">D</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 h-3 rounded-b-2xl border-x-4 border-b-4 border-gray-700"></div>
                <div className="bg-gray-700 h-1 w-1/3 mx-auto rounded-b-lg"></div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 border-4 border-primary/30 transform rotate-45" style={{ borderRadius: '20%' }} />
              <div className="absolute bottom-1/4 left-0 w-12 h-12 border-4 border-primary/20 transform rotate-12" style={{ borderRadius: '30%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
