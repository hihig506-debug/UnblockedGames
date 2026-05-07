import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, Zap } from 'lucide-react';
import gamesData from './games.json';

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Idle', 'Runner'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (activeGame) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeGame]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-purple-500/30 selection:text-white bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            ARCADE<span className="text-blue-500 font-black">UNBLOCKED</span>
          </h1>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search for a title..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-600/20">
            Get Pro
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Categories */}
        <aside className="w-full md:w-64 border-r border-white/5 p-6 space-y-6 md:block hidden">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-2">Navigation</h2>
            <nav className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-500/10 text-blue-400 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Category Scroll */}
        <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b border-white/5 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <section className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">
              {selectedCategory === 'All' ? 'Discover' : `${selectedCategory}`}
            </h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveGame(game)}
                className="group bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-blue-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-4">
                    <span className="bg-zinc-950/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-white/10">
                      {game.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                      <Gamepad2 className="text-black w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{game.title}</h3>
                  <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <Search className="text-zinc-700 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-300">No results found</h3>
              <p className="text-zinc-500 text-sm">Try searching for something else</p>
            </div>
          )}
        </section>
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-xl"
          >
            <motion.div
              layoutId={`game-${activeGame.id}`}
              className={`bg-zinc-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 ${
                isFullScreen ? 'w-full h-full' : 'w-full max-w-5xl h-[80vh]'
              }`}
            >
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="font-bold text-lg leading-tight uppercase tracking-tight">{activeGame.title}</h2>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Running</span>
                       <span className="w-1 h-1 rounded-full bg-zinc-700" />
                       <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{activeGame.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all border border-white/10"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{isFullScreen ? 'Small Screen' : 'Cinema Mode'}</span>
                </button>
              </div>

              <div className="flex-1 bg-black overflow-hidden">
                <iframe
                  src={activeGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={activeGame.title}
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>

              {!isFullScreen && (
                <div className="p-6 bg-zinc-900/50 flex flex-col md:flex-row gap-6 border-t border-white/5">
                  <div className="flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{activeGame.description}</p>
                  </div>
                  <div className="md:w-64 space-y-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                      Favorite Game
                    </button>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">
                       <span>Trusted Source</span>
                       <span className="text-green-500">Secure</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-8 px-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold tracking-widest text-zinc-600 mt-auto uppercase">
        <div className="flex items-center gap-8">
           <p>&copy; 2026 UNBLOCKED ARCADE</p>
           <p className="hidden sm:block">Built for speed</p>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="text-white">Request Game</a>
        </div>
      </footer>
    </div>
  );
}
