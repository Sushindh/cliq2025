# Testing Guide

## Setup for Testing

### Prerequisites
1. Both servers running:
   ```powershell
   # Terminal 1: Client
   cd D:\BTECH_CSEcore\Projects\zoho\client
   npm run dev

   # Terminal 2: Server
   cd D:\BTECH_CSEcore\Projects\zoho\server
   npm start
   ```

2. Valid Gemini API key in `.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Browser open to `http://localhost:5173` (or port shown by Vite)

---

## Test Case 1: Quick Message Correction

### Steps
1. Click in the main message input field
2. Type: "i shoudl meet teh clients"
3. Wait 3 seconds
4. Verify: Blue suggestion box appears below input
5. Verify suggestion text shows: "I should meet the clients"
6. Click the "Use" button
7. Verify: Input field shows corrected text
8. Press Enter to send
9. Verify: Message appears in chat with corrected text

### Expected Results
- ✅ Suggestion appears after 3-second debounce
- ✅ Suggestion text is grammatically correct
- ✅ Clicking "Use" populates input with correction
- ✅ Suggestion box disappears after acceptance
- ✅ Message sends successfully

### Troubleshooting
- If suggestion doesn't appear: Check if API key is valid (check server logs)
- If suggestion is wrong: The Gemini model may have different interpretations
- If nothing happens: Check browser console for errors (F12)

---

## Test Case 2: AI Draft Assistant Panel

### Steps
1. Click the "[AI Draft]" button in the top right
2. Verify: Right panel appears with "AI Draft Assistant" header
3. Verify: Tips section visible with keyboard shortcuts
4. Verify: Textarea with placeholder "Start typing..."
5. Click the X button
6. Verify: Panel closes

### Expected Results
- ✅ Panel slides in smoothly from the right
- ✅ Dark theme matches main chat
- ✅ All UI elements visible and properly styled
- ✅ Closing works with X button

---

## Test Case 3: Inline Sentence Recommendations

### Steps
1. Open AI Draft Assistant (click "[AI Draft]")
2. Type in the textarea: "I shoudl"
3. Wait 1.5 seconds
4. Verify: Blue suggestion popup appears with corrected text
5. Verify: Suggestion shows "should" (corrected from "shoudl")
6. Press **Tab** key
7. Verify: Text in textarea updates to include correction
8. Verify: Suggestion popup disappears

### Expected Results
- ✅ Suggestion appears after 1.5-second debounce
- ✅ Only current sentence is analyzed (from last period/newline to cursor)
- ✅ Tab key accepts suggestion without typing it
- ✅ Textarea updates correctly

### Test Case 3b: Multiple Sentences
1. Open AI Draft Assistant
2. Type: "Hello. I shoudl meet teh clients."
3. Position cursor after "meet"
4. Wait 1.5 seconds
5. Verify: Suggestion only shows for "I shoudl meet" portion
6. Press Tab
7. Verify: Only the current sentence updates

---

## Test Case 4: Dismissing Suggestions

### Steps
1. Open AI Draft Assistant
2. Type: "teh quick brown fox"
3. Wait 1.5 seconds for suggestion
4. Verify: Suggestion appears
5. Press **Esc** key
6. Verify: Suggestion disappears without inserting text
7. Verify: Textarea still contains original typo: "teh"

### Expected Results
- ✅ Esc key dismisses suggestion without action
- ✅ Cursor position unchanged
- ✅ No text is modified

---

## Test Case 5: Sending Draft Message

### Steps
1. Open AI Draft Assistant
2. Type: "This is a longer message that I want to send from the draft assistant"
3. Verify: Character counter shows correct count
4. Verify: No unwanted suggestions
5. Click "[Send to Channel]" button
6. Verify: Message appears in chat area
7. Verify: Draft panel remains open for next message
8. Verify: Textarea clears for new message

### Expected Results
- ✅ Message sends successfully to all connected users
- ✅ Character counter works accurately
- ✅ Draft panel stays open (not auto-closed)
- ✅ Textarea clears for new draft

---

## Test Case 6: Message Editing with AI

### Steps
1. Send a message: "i need to fix this text"
2. In the chat area, hover over your message
3. Verify: "Fix with AI" button appears
4. Click "Fix with AI"
5. Verify: Message text updates with corrected version
6. Verify: "I need to fix this text" appears

### Expected Results
- ✅ Hover action reveals edit button
- ✅ Message updates in real-time
- ✅ Correction is grammatically correct

---

## Test Case 7: Rate Limiting (Server-Side)

### Steps
1. Open browser developer console (F12)
2. Go to Network tab
3. Quickly type many characters in the main input
4. Observe requests sent
5. Send 15+ quick messages in rapid succession
6. Monitor server console for rate limit messages
7. Check that 429 responses don't crash the app

### Expected Results
- ✅ Debouncing prevents excessive requests (max ~1-2 per 3 seconds)
- ✅ Server enforces 10 requests/minute limit
- ✅ App handles rate limit gracefully without crashing
- ✅ User can still use app normally after rate limit

### Verification
Check server console should show something like:
```
✓ GET /api/fix-text - Request 1/10
✓ GET /api/fix-text - Request 2/10
...
✓ GET /api/fix-text - Request 10/10
✗ GET /api/fix-text - Rate limit exceeded (429)
```

---

## Test Case 8: Caching Behavior

### Steps
1. Type the exact same text twice in quick succession in draft: "hello world"
2. Monitor network tab (F12 → Network)
3. First request should hit the API
4. Second request should be cached (no actual network request)
5. Verify: Both show the same suggestion
6. Wait 5+ minutes
7. Type same text again
8. Verify: Cache expired, API called again

### Expected Results
- ✅ Identical corrections use cache (no redundant API calls)
- ✅ Cache expires after 5 minutes
- ✅ Network tab shows fewer requests than expected

### Cache Performance
- Expected cache hit rate: 70% (users often type similar messages)
- Memory usage: ~50MB for typical cache size

---

## Test Case 9: Multi-User Real-Time Sync

### Steps (Requires 2 Browser Windows)
1. Open `http://localhost:5173` in Browser Window A
2. Open same URL in Browser Window B
3. In Window A: Send message "Hello from A"
4. Verify in Window B: Message appears immediately
5. In Window B: Send message "Hello from B"
6. Verify in Window A: Message appears immediately
7. Test with corrections enabled

### Expected Results
- ✅ Messages sync across all connected clients in real-time
- ✅ Socket.io connection stable
- ✅ No message loss

---

## Test Case 10: Error Handling

### Test 10a: Invalid API Key
1. Modify `.env`: Set `GEMINI_API_KEY=invalid_key_12345`
2. Restart server
3. Try to get correction
4. Verify: Error message shown (check console)
5. Server should return 400 error

### Test 10b: Network Timeout
1. Disconnect internet while typing
2. Wait 8 seconds for timeout
3. Verify: App doesn't crash
4. Reconnect internet
5. Verify: Corrections work again

### Test 10c: Large Messages
1. Paste a 5000+ character message into draft
2. Verify: Character counter updates
3. Click Send
4. Verify: Message sends without truncation
5. Verify: No performance issues

### Expected Results
- ✅ App handles errors gracefully
- ✅ Helpful error messages shown to user
- ✅ No crashes or infinite loops
- ✅ Recovery is automatic

---

## Test Case 11: Browser Compatibility

### Browsers to Test
- [ ] Google Chrome (Latest)
- [ ] Microsoft Edge (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (if on Mac)

### Steps for Each Browser
1. Open `http://localhost:5173`
2. Complete Test Cases 1-5
3. Verify all features work identically

### Known Issues
- None at this time

---

## Performance Testing

### Metrics to Monitor (F12 → Performance)
```
Quick Input Correction:
├── Time to first suggestion:  2-4 seconds (1s debounce + API latency)
├── Time to render suggestion: <100ms
└── Memory usage:              ~10-15MB

Draft Assistant Suggestion:
├── Time to first suggestion:  1-3 seconds (0.5s debounce + API latency)
├── Time to accept (Tab):      <50ms (instant)
└── Memory usage:              ~15-20MB
```

### How to Measure
1. Press F12 (Developer Tools)
2. Go to "Performance" tab
3. Click Record circle
4. Type a message and wait for suggestion
5. Click Record again to stop
6. Analyze timeline for bottlenecks

---

## Regression Testing Checklist

Before each deployment, verify:
- [ ] Main input corrections still work
- [ ] Draft panel opens/closes without errors
- [ ] Inline suggestions appear correctly
- [ ] Tab key accepts suggestion
- [ ] Esc key dismisses suggestion
- [ ] Messages send successfully
- [ ] Multi-user sync works
- [ ] No console errors (F12)
- [ ] Rate limiting still active
- [ ] Cache is clearing after 5 minutes
- [ ] API key validation works
- [ ] Responsive design on mobile (optional)

---

## Debug Checklist

If something isn't working:

1. **Check Browser Console** (F12 → Console)
   - Look for red error messages
   - Note exact error text

2. **Check Server Logs**
   - Terminal where `npm start` is running
   - Look for error messages
   - Check request counts

3. **Verify Configuration**
   - Confirm `.env` has valid API key
   - Confirm both servers running on correct ports
   - Confirm API key permissions in Google AI Studio

4. **Test Basic Connectivity**
   - Send a message (doesn't require AI)
   - If message appears, Socket.io is working
   - If not, check firewall/network

5. **Test API Directly** (Advanced)
   ```powershell
   # Test if API is working
   curl -X POST http://localhost:5000/api/fix-text `
     -H "Content-Type: application/json" `
     -d '{"text": "hello wrld"}'
   ```

---

## Success Criteria

### All Tests Pass When:
- ✅ Quick corrections appear in 3 seconds
- ✅ Draft suggestions appear in 1.5 seconds
- ✅ Tab key accepts suggestions without errors
- ✅ Esc key dismisses suggestions properly
- ✅ Messages send to all users in real-time
- ✅ Rate limiting prevents 429 errors
- ✅ No console errors in browser
- ✅ No crashes when handling large messages
- ✅ Cache works and expires correctly
- ✅ Mobile view is usable (future)

