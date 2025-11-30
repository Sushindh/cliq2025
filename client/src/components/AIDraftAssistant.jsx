import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';

function AIDraftAssistant({ isOpen, onClose, onSendMessage }) {
  const [draftInput, setDraftInput] = useState('');
  const [inlineRecommendation, setInlineRecommendation] = useState(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const recommendationTimeoutRef = useRef(null);

  // Get inline recommendation for current sentence
  const getInlineRecommendation = async (text, cursor) => {
    if (!text.trim() || text.length < 8) {
      setInlineRecommendation(null);
      return;
    }

    // Extract current sentence (from last period/newline to cursor)
    const lastSentenceBreak = Math.max(
      text.lastIndexOf('.', cursor - 1),
      text.lastIndexOf('\n', cursor - 1)
    );
    const currentSentence = text.substring(lastSentenceBreak + 1, cursor).trim();

    if (currentSentence.length < 8) {
      setInlineRecommendation(null);
      return;
    }

    // Clear previous timeout
    if (recommendationTimeoutRef.current) {
      clearTimeout(recommendationTimeoutRef.current);
    }

    setIsLoadingRecommendation(true);

    recommendationTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.post('https://cliq2025.onrender.com/api/fix-text', { text: currentSentence }, { timeout: 8000 });
        const corrected = res.data.corrected.replace(/ \(fixed by AI\)$/, '');

        if (corrected !== currentSentence) {
          setInlineRecommendation({
            original: currentSentence,
            suggestion: corrected,
            cursorPosition: cursor
          });
        } else {
          setInlineRecommendation(null);
        }
      } catch (err) {
        setInlineRecommendation(null);
      } finally {
        setIsLoadingRecommendation(false);
      }
    }, 1500); // Wait 1.5 seconds after user stops typing
  };

  const handleTextareaChange = (e) => {
    const newText = e.target.value;
    const newCursor = e.target.selectionStart;
    
    setDraftInput(newText);
    setCursorPosition(newCursor);
    getInlineRecommendation(newText, newCursor);
  };

  const acceptInlineRecommendation = () => {
    if (!inlineRecommendation) return;

    const { original, suggestion, cursorPosition } = inlineRecommendation;
    const lastSentenceBreak = Math.max(
      draftInput.lastIndexOf('.', cursorPosition - 1),
      draftInput.lastIndexOf('\n', cursorPosition - 1)
    );

    const beforeSentence = draftInput.substring(0, lastSentenceBreak + 1);
    const afterSentence = draftInput.substring(cursorPosition);

    const newText = (beforeSentence ? beforeSentence + ' ' : '') + suggestion + (afterSentence ? ' ' + afterSentence : '');
    setDraftInput(newText);
    setInlineRecommendation(null);

    // Focus textarea and move cursor after suggestion
    if (textareaRef.current) {
      setTimeout(() => {
        const newCursorPos = beforeSentence.length + 1 + suggestion.length + 1;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }, 0);
    }
  };

  const dismissInlineRecommendation = () => {
    setInlineRecommendation(null);
  };

  const handleKeyDown = (e) => {
    // Tab to accept recommendation
    if (e.key === 'Tab' && inlineRecommendation) {
      e.preventDefault();
      acceptInlineRecommendation();
      return;
    }

    // Escape to dismiss recommendation
    if (e.key === 'Escape' && inlineRecommendation) {
      e.preventDefault();
      dismissInlineRecommendation();
      return;
    }
  };

  const sendDraft = () => {
    if (!draftInput.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      user: "You",
      text: draftInput + " (crafted with AI)",
      timestamp: "Just now",
      isOwn: true
    };
    
    onSendMessage(newMsg);
    setDraftInput('');
    setInlineRecommendation(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="w-96 bg-gradient-to-b from-cliqtrix-dark to-cliqtrix-darker border-l border-cliqtrix-accent/20 flex flex-col h-screen shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-cliqtrix-accent/20 flex justify-between items-center bg-cliqtrix-darker sticky top-0">
        <h3 className="font-bold text-lg flex items-center gap-2 text-cliqtrix-textLight">
          <Sparkles className="text-cliqtrix-accent" size={20} />
          AI Draft Assistant
        </h3>
        <button 
          onClick={onClose} 
          className="text-cliqtrix-textMuted hover:text-cliqtrix-textLight transition p-1 hover:bg-cliqtrix-accent/10 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tips Section */}
      <div className="px-4 py-3 bg-cliqtrix-accent/10 border-b border-cliqtrix-accent/20 text-xs text-cliqtrix-accentLight">
        <p className="font-semibold mb-2 flex items-center gap-1">
          <Lightbulb size={14} />
          Tips:
        </p>
        <ul className="space-y-1 text-cliqtrix-textMuted">
          <li>✓ Type long paragraphs with AI assistance</li>
          <li>✓ Press <kbd className="bg-cliqtrix-darker px-1.5 py-0.5 rounded text-xs font-mono border border-cliqtrix-accent/30">Tab</kbd> to accept suggestions</li>
          <li>✓ Press <kbd className="bg-cliqtrix-darker px-1.5 py-0.5 rounded text-xs font-mono border border-cliqtrix-accent/30">Esc</kbd> to dismiss</li>
        </ul>
      </div>

      {/* Textarea */}
      <div className="flex-1 p-4 flex flex-col relative">
        <textarea
          ref={textareaRef}
          value={draftInput}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing your message... AI will suggest corrections for each sentence as you write."
          className="flex-1 bg-cliqtrix-darker rounded-lg p-4 text-sm text-cliqtrix-textLight placeholder-cliqtrix-textMuted border border-cliqtrix-accent/30 focus:outline-none focus:border-cliqtrix-accent/60 resize-none"
        />

        {/* Inline Recommendation Popup */}
        {inlineRecommendation && (
          <div className="absolute bottom-24 left-4 right-4 bg-gradient-to-r from-cliqtrix-accent/30 to-cliqtrix-accent/20 border border-cliqtrix-accent/50 rounded-lg p-4 shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-3">
              <Lightbulb size={18} className="text-cliqtrix-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cliqtrix-accentLight font-semibold mb-2">AI Suggestion:</p>
                <p className="text-cliqtrix-textLight text-sm leading-relaxed break-words">
                  {inlineRecommendation.suggestion}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={acceptInlineRecommendation}
                className="flex-1 bg-gradient-to-r from-cliqtrix-accent to-cliqtrix-accentLight hover:from-cliqtrix-accentLight hover:to-cliqtrix-accent text-cliqtrix-dark px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <CheckCircle size={14} />
                Accept (Tab)
              </button>
              <button
                onClick={dismissInlineRecommendation}
                className="bg-cliqtrix-darker hover:bg-cliqtrix-darker/80 text-cliqtrix-textMuted border border-cliqtrix-accent/30 px-3 py-2 rounded-lg text-xs font-semibold transition"
              >
                Dismiss (Esc)
              </button>
            </div>
          </div>
        )}

        {isLoadingRecommendation && (
          <div className="absolute bottom-24 left-4 right-4 bg-cliqtrix-darker border border-cliqtrix-accent/30 rounded-lg p-3 text-xs text-cliqtrix-textMuted">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-cliqtrix-accent border-t-transparent rounded-full"></div>
              <span>Analyzing your sentence...</span>
            </div>
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="px-4 py-2 text-xs text-cliqtrix-textMuted text-right">
        {draftInput.length} characters
      </div>

      {/* Send Button */}
      <div className="p-4 border-t border-cliqtrix-accent/20 bg-cliqtrix-darker sticky bottom-0">
        <button
          onClick={sendDraft}
          disabled={!draftInput.trim()}
          className="w-full bg-gradient-to-r from-cliqtrix-accent to-cliqtrix-accentLight hover:from-cliqtrix-accentLight hover:to-cliqtrix-accent disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition active:scale-95 text-cliqtrix-dark"
        >
          <CheckCircle size={20} />
          Send to Channel
        </button>
      </div>
    </div>
  );
}

export default AIDraftAssistant;
