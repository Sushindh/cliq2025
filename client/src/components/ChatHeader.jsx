import { Sparkles } from 'lucide-react';

function ChatHeader({ onOpenAIDraft }) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
      <div>
        <h2 className="font-semibold"># Cliqtrix Announcements</h2>
        <p className="text-xs text-gray-400">9,559 members</p>
      </div>
      <button
        onClick={onOpenAIDraft}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition active:scale-95"
      >
        <Sparkles size={18} />
        AI Draft Assistant
      </button>
    </div>
  );
}

export default ChatHeader;
