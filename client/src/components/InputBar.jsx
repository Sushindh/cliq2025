import { Send, Lightbulb, Check, Paperclip, Smile } from 'lucide-react';

function InputBar({ input, correction, isLoadingCorrection, onInputChange, onSendMessage, onAcceptCorrection }) {
  return (
    <div className="p-4 bg-gradient-to-r from-cliqtrix-dark to-cliqtrix-darker border-t border-cliqtrix-accent/20 space-y-3">
      {/* Correction Suggestion */}
      {correction && (
        <div className="bg-gradient-to-r from-cliqtrix-accent/20 to-cliqtrix-accent/10 border border-cliqtrix-accent/40 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <Lightbulb size={18} className="text-cliqtrix-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="text-cliqtrix-textMuted mb-2">AI Suggestion:</p>
            <p className="text-cliqtrix-accentLight font-medium">{correction}</p>
          </div>
          <button
            onClick={onAcceptCorrection}
            className="bg-cliqtrix-accent hover:bg-cliqtrix-accentLight px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition text-cliqtrix-dark"
            disabled={isLoadingCorrection}
          >
            <Check size={14} />
            {isLoadingCorrection ? 'Applying...' : 'Apply'}
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3 items-end">
        <button className="p-2.5 hover:bg-cliqtrix-accent/10 rounded-lg text-cliqtrix-textMuted hover:text-cliqtrix-accent transition flex-shrink-0">
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-cliqtrix-darker rounded-lg px-4 py-3 text-sm text-cliqtrix-textLight placeholder-cliqtrix-textMuted border border-cliqtrix-accent/30 focus:outline-none focus:border-cliqtrix-accent/60 transition"
        />

        <button className="p-2.5 hover:bg-cliqtrix-accent/10 rounded-lg text-cliqtrix-textMuted hover:text-cliqtrix-accent transition flex-shrink-0">
          <Smile size={20} />
        </button>

        <button 
          onClick={onSendMessage}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-cliqtrix-accent to-cliqtrix-accentLight hover:from-cliqtrix-accentLight hover:to-cliqtrix-accent p-3 rounded-lg transition active:scale-95 text-white font-semibold flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default InputBar;
