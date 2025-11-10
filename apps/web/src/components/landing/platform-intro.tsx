"use client";

export function PlatformIntro() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Platform Introduction
            </h2>
            
            <div className="space-y-4 text-foreground-dimmed leading-relaxed">
              <p>
                Optcoin Exchange Global Professional Station is an innovative digital asset trading platform that serves 
                professional trading users around the world and is committed to discovering high-quality and innovative 
                digital asset investment opportunities.
              </p>
              
              <p>
                Currently, it provides more than 40 digital asset product trading and investment services. Headquartered 
                in the United States, it is operated by the Optcoin exchange global professional station team. Optcoin 
                exchange is one of the world's leading digital asset financial service provider.
              </p>
              
              <p>
                It has provided high-quality services to millions of users in more than 130 countries around the world. 
                It has independent offices, trading operations and operation centers in Singapore, South Korea, Hong Kong, 
                and medium-sized countries and regions.
              </p>
              
              <p>
                Optcoin exchange and its sub-brands are in a leading position in the world in terms of technology platform, 
                product line, security risk control system, operation and customer service system.
              </p>
            </div>
          </div>
          
          {/* Right side - Illustration */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Phone mockup */}
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 border-4 border-gray-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-black rounded-2xl p-4 aspect-[9/16]">
                    {/* Phone screen content */}
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      {/* Euro symbol */}
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                        <span className="text-4xl text-primary font-bold">€</span>
                      </div>
                      
                      {/* Bitcoin symbol */}
                      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                        <span className="text-4xl text-black font-bold">₿</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-1/4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-float" />
              <div className="absolute bottom-1/4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-primary/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
