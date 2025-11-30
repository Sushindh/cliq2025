import { Edit3, Smile } from 'lucide-react';

function MessageList({ messages, editingMessageId, onFixMessage }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-cliqtrix-dark to-cliqtrix-darker">
      {messages.map(msg => (
        <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : ''}`}>
          <div className={`max-w-2xl group`}>
            <div className="flex items-center gap-3 mb-2">
              {!msg.isOwn && (
                <div className="w-8 h-8 rounded-full bg-cliqtrix-accent/30 flex items-center justify-center text-cliqtrix-accent font-semibold text-xs flex-shrink-0">
                  {msg.user.charAt(0)}
                </div>
              )}
              <div className="flex items-center gap-2">
                {!msg.isOwn && <span className="font-semibold text-cliqtrix-textLight">{msg.user}</span>}
                <span className="text-xs text-cliqtrix-textMuted">{msg.timestamp}</span>
              </div>
            </div>

            <div className="bg-cliqtrix-messageLight text-gray-900 rounded-lg p-4 relative shadow-sm hover:shadow-md transition group/message">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.text}</pre>

              {msg.isOwn && (
                <div className="flex gap-2 mt-3 opacity-0 group-hover/message:opacity-100 transition-opacity pt-2 border-t border-gray-300/50">
                  <button
                    onClick={() => onFixMessage(msg.id, msg.text.replace(/ \(.*\)$/, ''))}
                    className="flex items-center gap-1 bg-cliqtrix-accent hover:bg-cliqtrix-accentLight text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={editingMessageId === msg.id}
                    title="Fix text with AI"
                  >
                    {editingMessageId === msg.id ? 'Fixing...' : (
                      <>
                        <Edit3 size={14} />
                        Fix with AI
                      </>
                    )}
                  </button>
                  <button className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap" title="Add reaction">
                    <Smile size={14} />
                    React
                  </button>
                </div>
              )}

              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-300">
                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                    <span key={emoji} className="bg-yellow-100 hover:bg-yellow-200 text-gray-800 px-2.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition flex items-center gap-1">
                      {emoji} <span className="text-gray-700">{count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
