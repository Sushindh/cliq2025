import { Sparkles, Search, Bell, ShoppingCart, User, Menu } from 'lucide-react';

function ChatHeader({ onOpenAIDraft }) {
  return (
    <div className="bg-gradient-to-r from-cliqtrix-dark to-cliqtrix-sidebar border-b border-cliqtrix-accent/20 px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left: Channel Info */}
      <div className="flex-1">
        <h2 className="font-bold text-lg text-cliqtrix-textLight"># Cliqtrix Announcements</h2>
        <p className="text-xs text-cliqtrix-textMuted">9,612 members</p>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 mx-8 max-w-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cliqtrix-textMuted" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-cliqtrix-darker text-cliqtrix-textLight placeholder-cliqtrix-textMuted pl-9 pr-3 py-2 rounded-lg border border-cliqtrix-accent/30 focus:outline-none focus:border-cliqtrix-accent/60 text-sm"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenAIDraft}
          className="bg-gradient-to-r from-cliqtrix-accent to-cliqtrix-accentLight hover:from-cliqtrix-accentLight hover:to-cliqtrix-accent px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition hover:shadow-lg text-white"
        >
          <Sparkles size={18} />
          AI Draft
        </button>
        
        <button className="p-2 hover:bg-cliqtrix-accent/10 rounded-lg text-cliqtrix-textLight transition hover:text-cliqtrix-accent">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-cliqtrix-accent/10 rounded-lg text-cliqtrix-textLight transition hover:text-cliqtrix-accent">
          <ShoppingCart size={20} />
        </button>
        <button className="p-2 hover:bg-cliqtrix-accent/10 rounded-lg text-cliqtrix-textLight transition hover:text-cliqtrix-accent">
          <User size={20} />
        </button>
        <button className="p-2 hover:bg-cliqtrix-accent/10 rounded-lg text-cliqtrix-textLight transition hover:text-cliqtrix-accent">
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
