
import React, { useRef } from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-screen bg-secondary text-accent overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-40 h-40 md:w-64 md:h-64 bg-primary rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[5%] w-56 h-56 md:w-80 md:h-80 bg-accent/30 rounded-full blur-[130px] animate-pulse delay-700" />
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80" className="absolute top-16 right-6 md:right-10 w-28 h-28 md:w-44 md:h-44 object-cover rounded-full opacity-30 mix-blend-overlay rotate-12" />
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" className="absolute bottom-16 left-6 md:left-10 w-36 h-36 md:w-56 md:h-56 object-cover rounded-full opacity-20 mix-blend-overlay -rotate-12" />
        </div>

        <div className="z-10 text-center max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display font-bold italic tracking-tight text-glow leading-none mb-4 md:mb-6">
            FRINDER
          </h1>
          <p className="text-sm sm:text-base md:text-2xl font-black uppercase tracking-[0.24em] sm:tracking-[0.32em] md:tracking-[0.45em] mb-8 md:mb-10 opacity-80">
            EL PARAÍSO DE LOS GAMERS
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-primary text-white font-black text-lg md:text-2xl rounded-3xl md:rounded-[36px] shadow-[0_20px_60px_rgba(161,24,24,0.6)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.16em] md:tracking-[0.22em] border-4 border-white/10"
            >
              EMPIEZA A JUGAR
            </button>
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 glass border-4 border-accent/20 text-accent font-black text-lg md:text-2xl rounded-3xl md:rounded-[36px] hover:bg-accent/10 transition-all uppercase tracking-[0.16em] md:tracking-[0.22em]"
            >
              SABER MÁS
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-40">
            <span className="text-4xl">↓</span>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        <div className="glass p-6 md:p-10 rounded-3xl md:rounded-[44px] border-accent/10 hover:border-primary/50 transition-all card-depth group">
            <div className="text-5xl md:text-6xl mb-5 md:mb-7 group-hover:scale-110 transition-transform inline-block">🔍</div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">DESCUBRE</h3>
            <p className="text-base md:text-lg text-accent/60 leading-relaxed italic">
              Algoritmo inteligente basado en tu estilo de juego, rango y toxicidad. Encuentra a tu dúo perfecto en segundos.
            </p>
        </div>
        <div className="glass p-6 md:p-10 rounded-3xl md:rounded-[44px] border-accent/10 hover:border-primary/50 transition-all card-depth group">
            <div className="text-5xl md:text-6xl mb-5 md:mb-7 group-hover:scale-110 transition-transform inline-block">🛡️</div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">SQUADS</h3>
            <p className="text-base md:text-lg text-accent/60 leading-relaxed italic">
              Únete a comunidades organizadas, torneos semanales y clanes con tus mismos objetivos competitivos.
            </p>
        </div>
        <div className="glass p-6 md:p-10 rounded-3xl md:rounded-[44px] border-accent/10 hover:border-primary/50 transition-all card-depth group">
            <div className="text-5xl md:text-6xl mb-5 md:mb-7 group-hover:scale-110 transition-transform inline-block">🏆</div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">RECOMPENSAS</h3>
            <p className="text-base md:text-lg text-accent/60 leading-relaxed italic">
              Gana Frins por jugar, colaborar y ganar torneos. Canjéalos por periféricos, skins y suscripciones.
            </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-14 md:py-20 px-4 sm:px-6 md:px-10 bg-black/20">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10 md:mb-14 italic tracking-tight">NUESTRA COMUNIDAD</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&q=80" className="w-full h-36 md:h-56 object-cover rounded-2xl md:rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80" className="w-full h-36 md:h-56 object-cover rounded-2xl md:rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer md:mt-8" />
          <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80" className="w-full h-36 md:h-56 object-cover rounded-2xl md:rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=80" className="w-full h-36 md:h-56 object-cover rounded-2xl md:rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer md:mt-8" />
        </div>
      </section>

      {/* Visual Showcase */}
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 space-y-6 md:space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold italic tracking-tight text-glow leading-none">LA EVOLUCIÓN SOCIAL</h2>
            <p className="text-lg md:text-xl text-accent/70 leading-relaxed">
                    Frinder no es solo una app, es el punto de encuentro definitivo para la nueva generación de jugadores. Olvídate de los lobbys solitarios.
                </p>
                <div className="flex gap-4">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" className="w-1/2 h-40 md:h-56 object-cover rounded-3xl border-4 border-primary/20 hover:scale-105 transition-transform shadow-2xl" />
              <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80" className="w-1/2 h-40 md:h-56 object-cover rounded-3xl border-4 border-accent/20 hover:scale-105 transition-transform shadow-2xl" />
                </div>
            </div>
            <div className="flex-1 relative">
            <div className="glass p-3 md:p-4 rounded-[36px] md:rounded-[50px] border-primary/30 rotate-2 md:rotate-3 card-depth">
              <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80" className="w-full h-[320px] md:h-[500px] object-cover rounded-[30px] md:rounded-[42px] shadow-2xl" />
                </div>
            <div className="absolute -top-6 -left-4 md:-top-10 md:-left-10 w-20 h-20 md:w-28 md:h-28 bg-primary rounded-full flex items-center justify-center text-2xl md:text-3xl animate-bounce shadow-2xl border-2 border-white/20">🔥</div>
            <img src="https://images.unsplash.com/photo-1560253023-3ee5d6428ad7?w=400&q=80" className="absolute -bottom-6 -right-3 md:-bottom-10 md:-right-8 w-28 h-28 md:w-40 md:h-40 object-cover rounded-2xl md:rounded-[26px] border-4 border-accent shadow-2xl rotate-12" />
            </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 md:py-28 flex flex-col items-center bg-gradient-to-t from-black/50 to-transparent px-4">
        <h2 className="text-4xl md:text-6xl font-display font-bold italic text-accent mb-8 md:mb-10 text-center tracking-tight">¿LISTO PARA EL NIVEL 2?</h2>
        <button 
          onClick={onEnterApp}
          className="px-10 md:px-16 py-4 md:py-6 bg-accent text-secondary font-black text-xl md:text-3xl rounded-3xl md:rounded-[42px] shadow-2xl hover:scale-110 active:scale-95 transition-all uppercase tracking-[0.16em] md:tracking-[0.25em] border-4 border-white/20"
        >
          ¡VAMOS!
        </button>
        <p className="mt-10 md:mt-16 text-accent/30 font-bold uppercase tracking-[0.18em] md:tracking-[0.35em] text-[10px] md:text-xs text-center">FRINDER © 2024 • THE GAMER NETWORK</p>
      </footer>
    </div>
  );
};

export default LandingPage;
