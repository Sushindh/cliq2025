import { MessageCircle } from 'lucide-react';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <MessageCircle size={24} />
          # Cliqtrix Announcements
        </h1>
      </div>
      <div className="flex-1 p-4 text-sm text-gray-400">
        <div className="text-xs text-gray-500 mb-2 uppercase font-semibold">Announcement Channel</div>
        <p>This channel is only for announcements.<br />You can't post messages here.</p>
      </div>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>🚀 Pro Tips:</p>
        <ul className="mt-2 space-y-1">
          <li>✓ Use AI Draft for long messages</li>
          <li>✓ Press Tab to accept suggestions</li>
          <li>✓ Hover to fix sent messages</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
