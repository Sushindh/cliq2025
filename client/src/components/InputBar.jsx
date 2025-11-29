import { Send, Lightbulb, Check } from 'lucide-react';

function InputBar({ input, correction, isLoadingCorrection, onInputChange, onSendMessage, onAcceptCorrection }) {
  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Type a quick message..."
          className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          onClick={onSendMessage} 
          className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Correction Suggestion */}
      {correction && (
        <div className="bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <Lightbulb size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="text-gray-300 mb-2">Suggested correction:</p>
            <p className="text-blue-100 font-medium">{correction}</p>
          </div>
          <button
            onClick={onAcceptCorrection}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 flex-shrink-0 transition"
          >
            <Check size={14} />
            Use
          </button>
        </div>
      )}
    </div>
  );
}

export default InputBar;
