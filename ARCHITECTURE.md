# UI Component Architecture

## Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  SIDEBAR                              CHAT AREA                │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐ │
│  │ # Cliqtrix   │  │ ChatHeader                              │ │
│  │ Announce...  │  │ ┌───────────────────────────────────────┤ │
│  │              │  │ │ # Cliqtrix Announcements   [AI Draft]  │ │
│  │ 9,559        │  │ │ 9,559 members                         │ │
│  │ members      │  │ └───────────────────────────────────────┘ │
│  │              │  │                                           │ │
│  │ Pro Tips:    │  │ MessageList                             │ │
│  │ ✓ Use AI     │  │ ┌───────────────────────────────────────┤ │
│  │   Draft for  │  │ │ [Harsha] Yesterday                    │ │
│  │   long msgs  │  │ │ Deadline Loading... 30th November...  │ │
│  │ ✓ Press Tab  │  │ │ 😀 13  🎉 3  🔥 3  ❤️ 2              │ │
│  │   to accept  │  │ │                                       │ │
│  │ ✓ Hover to   │  │ │ [You] Just now                        │ │
│  │   fix sent   │  │ │ Hello, this is my message             │ │
│  │   messages   │  │ │ [Fix with AI] ⋮                       │ │
│  │              │  │ └───────────────────────────────────────┘ │
│  │              │  │                                           │ │
│  │              │  │ InputBar                                │ │
│  │              │  │ ┌───────────────────────────────────────┤ │
│  │              │  │ │ Type a quick message...        [Send] │ │
│  │              │  │ │                                       │ │
│  │              │  │ │ [💡] Suggested correction:           │ │
│  │              │  │ │ I should meet the clients tomorrow    │ │
│  │              │  │ │                              [Use]    │ │
│  │              │  │ └───────────────────────────────────────┘ │
│  └──────────────┘  └─────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Draft Assistant (Side Panel)

```
┌──────────────────────────────┐
│ 💡 AI Draft Assistant    [X] │
├──────────────────────────────┤
│ 💡 Tips:                     │
│ ✓ Type long paragraphs      │
│ ✓ Press Tab to accept       │
│ ✓ Press Esc to dismiss      │
├──────────────────────────────┤
│                              │
│ ┌──────────────────────────┐ │
│ │ Start typing your        │ │
│ │ message...               │ │
│ │                          │ │
│ │ I shoudl meet teh        │ │
│ │                          │ │
│ │ (cursor here)            │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 💡 AI Suggestion:        │ │
│ │ I should meet the        │ │
│ │                          │ │
│ │ [Accept (Tab)] [Dismiss] │ │
│ └──────────────────────────┘ │
│                              │
│ 45 characters               │
├──────────────────────────────┤
│  [Send to Channel]           │
└──────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Sidebar
│   ├── Channel info
│   └── Pro tips
├── ChatHeader
│   ├── Title
│   └── [AI Draft Button]
├── MessageList
│   ├── Message
│   │   ├── Avatar/Username
│   │   ├── Content
│   │   ├── [More Actions]
│   │   │   └── [Fix with AI]
│   │   └── Reactions
│   └── ... (more messages)
├── InputBar
│   ├── Input field
│   ├── [Send button]
│   └── Correction Popup (conditional)
│       ├── Lightbulb icon
│       ├── Suggestion text
│       └── [Use button]
└── AIDraftAssistant (conditional)
    ├── Header
    ├── Tips section
    ├── Textarea
    ├── Inline suggestion (conditional)
    │   ├── Lightbulb icon
    │   ├── Suggestion
    │   └── [Accept] [Dismiss]
    ├── Character counter
    └── [Send to Channel]
```

---

## State Management (App.jsx)

```
State Variables:
├── messages          [array]    - All chat messages
├── input            [string]    - Quick message input
├── correction       [string]    - AI correction suggestion
├── isLoadingCorrection [bool]  - Correction API loading state
├── isAIDraftOpen    [bool]    - Draft panel visibility
└── editingMessageId [number]  - Current message being fixed

Refs:
├── messagesEndRef   - Auto-scroll to latest
└── correctionTimeoutRef - Debounce timer

Handlers:
├── sendMessage()
├── sendDraftMessage()
├── getInputCorrection()
├── handleInputChange()
├── acceptCorrection()
└── fixMessageWithAI()
```

---

## Data Flow

### Quick Message Correction Flow
```
User Types → handleInputChange() 
  → Clear previous timeout
  → Wait 3 seconds (debounce)
  → If text length >= 8:
    → POST /api/fix-text
    → setCorrection(result)
    → Show correction popup
  → User clicks "Use"
    → acceptCorrection()
    → setInput(correction)
    → setCorrection(null)
    → Hide popup
```

### Draft Assistant Inline Suggestion Flow
```
User Opens AI Draft
  → setIsAIDraftOpen(true)
  → AIDraftAssistant renders

User Types in Textarea
  → handleTextareaChange()
  → Extract current sentence
  → Wait 1.5 seconds (debounce)
  → POST /api/fix-text for current sentence
  → setInlineRecommendation(suggestion)
  → Show popup below textarea

User Presses Tab
  → preventDefault()
  → acceptInlineRecommendation()
  → Replace sentence in textarea
  → Move cursor
  → Focus textarea
  → Clear suggestion

User Presses Esc
  → preventDefault()
  → dismissInlineRecommendation()
  → Clear suggestion popup
```

### Message Send & Sync
```
User clicks Send
  → sendMessage() / sendDraftMessage()
  → socket.emit('message', msg)
  → setMessages([...prev, msg])
  → Reset state (input, correction, etc.)

Server receives via Socket.io
  → io.on('message', (msg) => { ... })
  → Store in messages array
  → io.emit('message', msg) - broadcast to all

All connected clients
  → socket.on('message', (msg) => { ... })
  → setMessages(prev => [...prev, msg])
  → Auto-scroll to new message
```

---

## Component Props Interface

### Sidebar
```jsx
<Sidebar />
// No props - stateless component
```

### ChatHeader
```jsx
<ChatHeader onOpenAIDraft={() => setIsAIDraftOpen(true)} />

Props:
- onOpenAIDraft: function - Called when user clicks AI Draft button
```

### MessageList
```jsx
<MessageList
  messages={messages}
  editingMessageId={editingMessageId}
  onFixMessage={fixMessageWithAI}
/>

Props:
- messages: array - Chat messages to display
- editingMessageId: number - ID of message being fixed
- onFixMessage: function - Called with (messageId, originalText)
```

### InputBar
```jsx
<InputBar
  input={input}
  correction={correction}
  isLoadingCorrection={isLoadingCorrection}
  onInputChange={handleInputChange}
  onSendMessage={sendMessage}
  onAcceptCorrection={acceptCorrection}
/>

Props:
- input: string - Current input text
- correction: string | null - Suggested correction
- isLoadingCorrection: boolean - Loading state
- onInputChange: function - Called with (e)
- onSendMessage: function - Called to send
- onAcceptCorrection: function - Called to accept suggestion
```

### AIDraftAssistant
```jsx
<AIDraftAssistant
  isOpen={isAIDraftOpen}
  onClose={() => setIsAIDraftOpen(false)}
  onSendMessage={sendDraftMessage}
/>

Props:
- isOpen: boolean - Panel visibility
- onClose: function - Called when user clicks close/X
- onSendMessage: function - Called with (messageObj) to send draft
```

---

## Styling System

### Color Scheme
```
Background:     bg-gray-900  (Dark background)
Primary:        bg-gray-800  (Cards, panels)
Border:         border-gray-700
Text Primary:   text-white
Text Secondary: text-gray-400
Text Tertiary:  text-gray-500

Accent Colors:
- Purple:       from-purple-600 to-pink-600
- Blue:         bg-blue-900 / border-blue-500 (Corrections)
- Success:      Green (future use)
```

### Responsive Behavior
```
Sidebar:      Fixed width (w-64)
Chat Area:    Flex-1 (responsive)
Draft Panel:  Fixed width (w-96), appears on right
Mobile:       Sidebar may collapse (future enhancement)
```

---

## Error States

### API Errors Handled
```
429 Rate Limit
├── Server: Return 429 status
├── Client: Suppress UI error, show generic message
└── Action: Disable input temporarily

400 Invalid Key
├── Server: Return 400 status
├── Client: Show "Invalid API key" message
└── Action: Point to .env setup

500 Server Error
├── Server: Return 500 status
├── Client: Show "Service unavailable" message
└── Action: Suggest retry

Timeout (8 seconds)
├── Server: Request hangs
├── Client: Silently fail, continue
└── Action: No correction shown
```

---

## Performance Optimizations

### Caching
```
Cache Layer (Server):
├── Cache key: original text
├── Cache value: corrected text
├── TTL: 5 minutes (auto-cleared)
└── Hit rate: ~70% for common sentences
```

### Debouncing
```
Main Input:     3000ms delay
Draft Input:    1500ms delay
Purpose:        Reduce API calls while typing
```

### Component Optimization
```
React.memo:     Not used (components are simple)
useMemo:        Not needed (no heavy computations)
useCallback:    Not needed (handlers defined in App)
Key prop:       Used for message lists
```

