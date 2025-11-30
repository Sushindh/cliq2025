import { MessageCircle, Hash, Heart, Clock, FileText, Network, ChevronDown } from 'lucide-react';

function Sidebar() {
  const sections = [
    { icon: Hash, label: 'CHANNELS', items: ['# Cliqtrix Announcements', '# general', '# random'] },
    { icon: Heart, label: 'CHATS', items: ['Harsha Singh', 'Sarah Mike', 'Project Team'] },
    { icon: Clock, label: 'HISTORY', items: ['Recent', 'Pinned Messages', 'Saved Items'] },
    { icon: FileText, label: 'FILES', items: ['Documents', 'Images', 'Code Snippets'] },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-cliqtrix-sidebar to-cliqtrix-dark border-r border-cliqtrix-accent/20 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-cliqtrix-accent/20 bg-cliqtrix-darker">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-cliqtrix-textLight flex items-center gap-2">
            <MessageCircle size={24} className="text-cliqtrix-accent" />
            Cliqtrix
          </h1>
          <div className="text-cliqtrix-textMuted hover:text-cliqtrix-textLight cursor-pointer transition">≡</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-cliqtrix-accent/20">
        <input
          type="text"
          placeholder="Search channels..."
          className="w-full bg-cliqtrix-dark text-cliqtrix-textLight placeholder-cliqtrix-textMuted px-3 py-2 rounded border border-cliqtrix-accent/30 focus:outline-none focus:border-cliqtrix-accent/60 text-sm"
        />
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {sections.map((section, idx) => {
          const IconComponent = section.icon;
          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2">
                  <IconComponent size={16} className="text-cliqtrix-accent" />
                  <span className="text-xs font-bold text-cliqtrix-textMuted uppercase tracking-wider">{section.label}</span>
                </div>
                <ChevronDown size={14} className="text-cliqtrix-textMuted hover:text-cliqtrix-accent cursor-pointer" />
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm text-cliqtrix-textLight px-4 py-2 rounded cursor-pointer hover:bg-cliqtrix-accent/10 transition">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-cliqtrix-accent/20 bg-cliqtrix-darker">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cliqtrix-accent/30 flex items-center justify-center text-cliqtrix-accent font-bold">YS</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cliqtrix-textLight truncate">You</p>
            <p className="text-xs text-cliqtrix-textMuted truncate">@yourhandle</p>
          </div>
          <div className="text-cliqtrix-textMuted hover:text-cliqtrix-accent cursor-pointer">⋮</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
