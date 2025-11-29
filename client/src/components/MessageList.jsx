import { MoreVertical, Edit3 } from 'lucide-react';

function MessageList({ messages, editingMessageId, onFixMessage }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map(msg => (
        <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : ''}`}>
          <div className={`max-w-2xl ${msg.isOwn ? 'order-2' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              {!msg.isOwn && <span className="font-semibold">{msg.user}</span>}
              <span className="text-xs text-gray-500">{msg.timestamp}</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 relative group">
              <pre className="whitespace-pre-wrap font-sans text-sm">{msg.text}</pre>

              {msg.isOwn && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <MoreVertical size={16} />
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-10">
                    <button
                      onClick={() => onFixMessage(msg.id, msg.text.replace(/ \(.*\)$/, ''))}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center gap-2 text-sm"
                      disabled={editingMessageId === msg.id}
                    >
                      {editingMessageId === msg.id ? 'Fixing...' : (
                        <>
                          <Edit3 size={14} />
                          Fix Text with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {msg.reactions && (
                <div className="flex gap-2 mt-3">
                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                    <span key={emoji} className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                      {emoji} {count}
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
