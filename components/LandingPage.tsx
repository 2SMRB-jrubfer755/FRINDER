
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
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/30 rounded-full blur-[150px] animate-pulse delay-700" />
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80" className="absolute top-20 right-10 w-48 h-48 object-cover rounded-full opacity-30 mix-blend-overlay rotate-12" />
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" className="absolute bottom-20 left-10 w-64 h-64 object-cover rounded-full opacity-20 mix-blend-overlay -rotate-12" />
        </div>

        <div className="z-10 text-center max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-[12rem] md:text-[18rem] font-display font-bold italic tracking-tighter text-glow leading-none mb-6">
            FRINDER
          </h1>
          <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.5em] mb-12 opacity-80">
            EL PARAÍSO DE LOS GAMERS
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={onEnterApp}
              className="px-16 py-8 bg-primary text-white font-black text-3xl rounded-[40px] shadow-[0_20px_60px_rgba(161,24,24,0.6)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-4 border-white/10"
            >
              EMPIEZA A JUGAR
            </button>
            <button 
              onClick={scrollToFeatures}
              className="px-16 py-8 glass border-4 border-accent/20 text-accent font-black text-3xl rounded-[40px] hover:bg-accent/10 transition-all uppercase tracking-widest"
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
      <section ref={featuresRef} className="py-32 px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="glass p-12 rounded-[60px] border-accent/10 hover:border-primary/50 transition-all card-depth group">
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform inline-block">🔍</div>
            <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter">DESCUBRE</h3>
            <p className="text-xl text-accent/60 leading-relaxed italic">
              Algoritmo inteligente basado en tu estilo de juego, rango y toxicidad. Encuentra a tu dúo perfecto en segundos.
            </p>
        </div>
        <div className="glass p-12 rounded-[60px] border-accent/10 hover:border-primary/50 transition-all card-depth group">
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform inline-block">🛡️</div>
            <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter">SQUADS</h3>
            <p className="text-xl text-accent/60 leading-relaxed italic">
              Únete a comunidades organizadas, torneos semanales y clanes con tus mismos objetivos competitivos.
            </p>
        </div>
        <div className="glass p-12 rounded-[60px] border-accent/10 hover:border-primary/50 transition-all card-depth group">
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform inline-block">🏆</div>
            <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter">RECOMPENSAS</h3>
            <p className="text-xl text-accent/60 leading-relaxed italic">
              Gana Frins por jugar, colaborar y ganar torneos. Canjéalos por periféricos, skins y suscripciones.
            </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-10 bg-black/20">
        <h2 className="text-5xl font-display font-bold text-center mb-16 italic tracking-tighter">NUESTRA COMUNIDAD</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&q=80" className="w-full h-64 object-cover rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80" className="w-full h-64 object-cover rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer mt-8" />
          <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80" className="w-full h-64 object-cover rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=80" className="w-full h-64 object-cover rounded-3xl border-2 border-accent/10 hover:scale-105 transition-all cursor-pointer mt-8" />
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-32 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
                <h2 className="text-7xl font-display font-bold italic tracking-tighter text-glow leading-none">LA EVOLUCIÓN SOCIAL</h2>
                <p className="text-2xl text-accent/70 leading-relaxed">
                    Frinder no es solo una app, es el punto de encuentro definitivo para la nueva generación de jugadores. Olvídate de los lobbys solitarios.
                </p>
                <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" className="w-1/2 h-64 object-cover rounded-[40px] border-4 border-primary/20 hover:scale-105 transition-transform shadow-2xl" />
                    <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80" className="w-1/2 h-64 object-cover rounded-[40px] border-4 border-accent/20 hover:scale-105 transition-transform shadow-2xl" />
                </div>
            </div>
            <div className="flex-1 relative">
                <div className="glass p-4 rounded-[60px] border-primary/30 rotate-3 card-depth">
                    <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80" className="w-full h-[600px] object-cover rounded-[50px] shadow-2xl" />
                </div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-4xl animate-bounce shadow-2xl border-2 border-white/20">🔥</div>
                <img src="https://images.unsplash.com/photo-1560253023-3ee5d6428ad7?w=400&q=80" className="absolute -bottom-10 -right-10 w-48 h-48 object-cover rounded-[30px] border-4 border-accent shadow-2xl rotate-12" />
            </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-40 flex flex-col items-center bg-gradient-to-t from-black/50 to-transparent">
        <h2 className="text-8xl font-display font-bold italic text-accent mb-12 text-center tracking-tighter">¿LISTO PARA EL NIVEL 2?</h2>
        <button 
          onClick={onEnterApp}
          className="px-24 py-10 bg-accent text-secondary font-black text-4xl rounded-[50px] shadow-2xl hover:scale-110 active:scale-95 transition-all uppercase tracking-widest border-4 border-white/20"
        >
          ¡VAMOS!
        </button>
        <p className="mt-20 text-accent/30 font-bold uppercase tracking-[0.5em]">FRINDER © 2024 • THE GAMER NETWORK</p>
      </footer>
    </div>
  );
};

export default LandingPage;
