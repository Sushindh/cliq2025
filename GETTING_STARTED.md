# 🚀 Getting Started Checklist

> **New to the project?** Follow this checklist to get up and running in minutes!

---

## ⚡ 5-Minute Quick Start

### Step 1: Clone & Install Backend (2 minutes)
```powershell
cd server
npm install
```

✅ Check: `npm` installed? If error, install Node.js from nodejs.org

### Step 2: Configure API Key (1 minute)
Create `server/.env`:
```env
GEMINI_API_KEY=your_key_here
```

Get key from: https://aistudio.google.com/app/apikey

✅ Check: File created at `server/.env`?

### Step 3: Install & Start Frontend (2 minutes)
```powershell
cd ../client
npm install
npm run dev
```

✅ Check: See "Local: http://localhost:5173"?

### Step 4: Start Backend Server (Terminal 2)
```powershell
cd server
npm start
```

✅ Check: See "Server running on port 5000"?

### Step 5: Open Browser
Go to: **http://localhost:5173**

✅ Check: See chat interface with Sidebar?

---

## 📋 Pre-Flight Checklist

Before doing anything, verify you have:

### System Requirements
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] 2 terminal windows open
- [ ] Text editor or IDE (VSCode recommended)
- [ ] Modern web browser (Chrome, Firefox, Edge, Safari)
- [ ] Internet connection

### Project Files
- [ ] `client/` folder exists
- [ ] `server/` folder exists
- [ ] `package.json` in both folders
- [ ] All documentation files present

### API Setup
- [ ] Google account active
- [ ] Gemini API key generated
- [ ] `.env` file created in `/server/`
- [ ] API key pasted into `.env`

---

## ✅ First-Time User Setup (10 minutes)

### Terminal 1: Backend Server Setup
```powershell
# Navigate to server
cd D:\BTECH_CSEcore\Projects\zoho\server

# Install dependencies
npm install
# ✅ Wait for "added XX packages"

# Verify .env file exists
dir .env
# ✅ Should show .env file

# Start server
npm start
# ✅ Should show "Server running on port 5000"
```

### Terminal 2: Frontend Client Setup
```powershell
# Navigate to client
cd D:\BTECH_CSEcore\Projects\zoho\client

# Install dependencies
npm install
# ✅ Wait for "added XX packages"

# Start development server
npm run dev
# ✅ Should show "Local: http://localhost:5173"
```

### Browser: Open Application
1. Click or open: **http://localhost:5173**
2. Should see chat interface
3. Can now send messages!

---

## 🧪 First-Time User Testing (5 minutes)

### Test 1: Send a Message ✅
```
1. Click in the message input field
2. Type: "Hello, this is my first message"
3. Press Enter
4. ✅ Message appears in chat above
5. ✅ No errors in console (F12)
```

### Test 2: Get AI Correction ✅
```
1. Click in message input
2. Type: "i shoudl meet teh clients"
3. Wait 3 seconds...
4. ✅ Blue suggestion appears: "I should meet the clients"
5. Click "Use"
6. ✅ Input field updated
7. Press Enter to send
```

### Test 3: Open AI Draft ✅
```
1. Click [AI Draft] button (top right)
2. ✅ Right panel opens
3. Type: "This is my longer message"
4. Wait 1.5 seconds
5. ✅ Blue suggestion appears below
6. Press Tab
7. ✅ Suggestion merged into text
8. Click [Send to Channel]
9. ✅ Message appears in chat
```

### Test 4: Keyboard Shortcuts ✅
```
In AI Draft:
1. Type: "hello wrld"
2. Wait for suggestion
3. Press Esc
4. ✅ Suggestion disappears

Try again:
1. Type: "hello wrld"
2. Wait for suggestion
3. Press Tab
4. ✅ Suggestion merged
```

---

## 🐛 Troubleshooting First-Time Issues

### "npm is not recognized"
**Problem:** npm command not found
**Solution:**
1. Install Node.js: https://nodejs.org (LTS version)
2. Restart terminal
3. Try `npm --version` again

### "API key not valid (400)"
**Problem:** API key invalid or missing
**Solution:**
1. Get new key: https://aistudio.google.com/app/apikey
2. Copy exact key
3. Paste into `server/.env` after `=`
4. Save file
5. Restart server (`npm start`)

### "Port 5000 already in use"
**Problem:** Server already running or port in use
**Solution:**
1. Find and close previous server terminal
2. Or run: `netstat -ano | findstr :5000` (to see what's using port)
3. Restart server

### "localhost:5173 won't load"
**Problem:** Client not running or wrong port
**Solution:**
1. Check Terminal 2 shows "Local: http://localhost:5173"
2. If port different, use that port instead
3. Verify no typos in URL
4. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### "Suggestion not appearing"
**Problem:** API not responding
**Solution:**
1. Check server terminal for errors
2. Verify API key in `.env`
3. Type at least 8 characters
4. Wait 3 full seconds
5. Check browser console (F12 → Console) for errors

### "Tab key doesn't work"
**Problem:** Tab opens draft or doesn't merge suggestion
**Solution:**
1. Click in the textarea first
2. Type a short sentence with typo
3. Wait 1.5 seconds for suggestion
4. Then press Tab
5. Check if suggestion merged

---

## 📚 Learning Path (Choose One)

### Path A: I Just Want to Use It (10 minutes)
1. ✅ Complete "5-Minute Quick Start" above
2. ✅ Complete "First-Time User Testing"
3. ✅ Read QUICK_REFERENCE.md (keyboard shortcuts)
4. Done! Start chatting!

### Path B: I Want to Understand Code (90 minutes)
1. ✅ Complete setup (5 min)
2. ✅ Read README.md (20 min)
3. ✅ Read ARCHITECTURE.md (25 min)
4. ✅ Browse component files (20 min)
5. ✅ Read DIAGRAMS.md (20 min)

### Path C: I Want to Deploy (120 minutes)
1. ✅ Complete setup (5 min)
2. ✅ Read DEPLOYMENT_GUIDE.md (60 min)
3. ✅ Complete pre-deployment checklist (30 min)
4. ✅ Deploy to Vercel/Render (25 min)

### Path D: I Want to Test Everything (90 minutes)
1. ✅ Complete setup (5 min)
2. ✅ Read TESTING_GUIDE.md (10 min)
3. ✅ Run all 11 test cases (60 min)
4. ✅ Check success criteria (15 min)

---

## ✨ Getting to Know the Features

### Feature 1: Real-Time Chat
**What:** Send messages that instantly appear for all users
**How:** Type message → Press Enter → See it appear
**Where:** Main chat area
**When:** Use for quick communication

### Feature 2: Quick Corrections
**What:** AI suggests corrections while typing
**How:** Type incorrect text → Wait 3s → See suggestion
**Where:** Below main input field
**When:** Use for quick fixes before sending

### Feature 3: AI Draft Assistant
**What:** Full-featured editor with inline suggestions
**How:** Click [AI Draft] → Type long message → Get sentence suggestions
**Where:** Right side panel
**When:** Use for longer, more carefully-written messages

### Feature 4: Keyboard Shortcuts
**What:** Quick keys to control suggestions
**How:** Press Tab (accept) or Esc (dismiss)
**Where:** In AI Draft panel
**When:** Use for speed and efficiency

---

## 🎯 Common Tasks Cheat Sheet

### Send a Message
```
Click input field
Type message
Press Enter
✅ Done!
```

### Get Correction Suggestion
```
Type incorrect text
Wait 3 seconds
Click "Use" button
✅ Done!
```

### Use AI Draft for Long Message
```
Click [AI Draft] button
Type your message
Suggestions appear (wait 1.5s per sentence)
Press Tab to accept (or just keep typing)
Click [Send to Channel]
✅ Done!
```

### Fix a Message You Already Sent
```
Hover over your message
Click [Fix with AI]
Message updates automatically
✅ Done!
```

### Close AI Draft Panel
```
Click X button in top-right of panel
✅ Done!
```

---

## 🔍 First Look Navigation

### Main Chat Area
```
┌─────────────────────────────────────────┐
│ ChatHeader                              │
│ [Channel Name] [Member Count] [AI Draft]│
├─────────────────────────────────────────┤
│ MessageList                             │
│ [Previous messages appear here]         │
│                                         │
│ [Your messages appear on right]         │
├─────────────────────────────────────────┤
│ InputBar                                │
│ [Type message here...] [Send]           │
│ [Suggestion appears here if typo]       │
└─────────────────────────────────────────┘
```

### Sidebar (Left)
```
┌──────────────────┐
│ # Cliqtrix       │
│ Announcements    │
│                  │
│ 9,559 members    │
│                  │
│ Pro Tips:        │
│ • Use AI Draft   │
│ • Press Tab      │
│ • Hover to fix   │
└──────────────────┘
```

### AI Draft Panel (Right - When Open)
```
┌──────────────────────┐
│ 💡 AI Draft [X]      │
├──────────────────────┤
│ Type your message... │
│ (textarea)           │
│                      │
│ 💡 Suggestion:       │
│ [corrected text]     │
│ [Accept] [Dismiss]   │
├──────────────────────┤
│ [Send to Channel]    │
└──────────────────────┘
```

---

## 📱 Quick Key Reference

| Key | What It Does | Where |
|-----|--------------|-------|
| Enter | Send message | Main input |
| Tab | Accept suggestion | Draft panel |
| Esc | Dismiss suggestion | Draft panel |
| F12 | Developer console | Browser |
| Ctrl+Shift+R | Hard refresh | Browser |

---

## 🚨 Emergency Troubleshooting

### "Everything is broken!"
1. Stop both servers (Ctrl+C in terminals)
2. Close browser tab
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart Terminal 1: `cd server && npm start`
5. Restart Terminal 2: `cd client && npm run dev`
6. Open http://localhost:5173 in new tab

### "I see errors in console"
1. Press F12 to open developer tools
2. Go to "Console" tab
3. Look for red error messages
4. Take note of error text
5. Check QUICK_REFERENCE.md for that error
6. Follow solution listed

### "Messages not syncing between windows"
1. Check both clients showing same URL (localhost:5173)
2. Check server is running (see "Server running..." in Terminal 1)
3. Check network tab (F12 → Network) shows WebSocket connection
4. Refresh both pages (F5)
5. Try sending message again

### "Can't type anything"
1. Click in the message input field
2. Check for focus (blue border?)
3. Check browser console for JavaScript errors (F12)
4. Refresh page (F5)
5. Try again

---

## ✅ Success Indicators

### Server Started Successfully
```
✅ Terminal shows: "Server running on port 5000"
✅ No error messages
✅ Terminal waiting for requests (not exited)
```

### Client Started Successfully
```
✅ Terminal shows: "Local: http://localhost:5173"
✅ Browser loads page (no blank page)
✅ Chat interface visible with Sidebar
```

### Message Send Works
```
✅ Can type in input field
✅ Send button visible and clickable
✅ Message appears in chat after Enter
✅ Appears in correct order
```

### AI Works
```
✅ Type incorrect text
✅ Wait 3 seconds
✅ Blue suggestion box appears
✅ Suggestion text is correct
```

### Draft Panel Works
```
✅ [AI Draft] button visible
✅ Clicking opens right panel
✅ Can type in panel
✅ Suggestions appear for sentences
✅ Tab key merges suggestions
```

---

## 🎓 Next Steps After Setup

### After Getting Comfortable (15 minutes)
1. Read QUICK_REFERENCE.md (shortcuts & commands)
2. Try all keyboard shortcuts
3. Test error scenarios (intentional typos)
4. Send multi-user messages (open in 2 windows)

### After Comfortable with Features (30 minutes)
1. Read README.md (full overview)
2. Read TESTING_GUIDE.md (understand test cases)
3. Check all features are working
4. Note any issues or improvements

### After Confident with App (1 hour)
1. Read ARCHITECTURE.md (understand design)
2. Look at component code in `/client/src/components/`
3. Review server code in `/server/server.js`
4. Understand data flow

### When Ready to Deploy (2+ hours)
1. Read DEPLOYMENT_GUIDE.md
2. Follow pre-deployment checklist
3. Build client: `npm run build` in `/client`
4. Deploy to Vercel (frontend) and Render (backend)

---

## 📞 Where to Get Help

| Question | Answer Is Here |
|----------|-----------------|
| How do I use shortcuts? | QUICK_REFERENCE.md |
| Why isn't it working? | TESTING_GUIDE.md → Troubleshooting |
| I got an error | QUICK_REFERENCE.md → Error Messages |
| How do I deploy? | DEPLOYMENT_GUIDE.md |
| How does it work? | ARCHITECTURE.md |
| What should I test? | TESTING_GUIDE.md |
| Where do I start? | This file! |
| All the docs | DOCUMENTATION_INDEX.md |

---

## 🎉 You're Ready!

Congratulations! You now have everything you need to:
- ✅ Run the chat application
- ✅ Send messages in real-time
- ✅ Get AI corrections
- ✅ Use the draft assistant
- ✅ Understand how it works
- ✅ Deploy to production
- ✅ Help others learn it

**Now go build something amazing! 🚀**

---

## 📝 Checklist Template (Copy for Ongoing Use)

```
Date: ________

Startup Checklist:
□ Servers running (both terminals)
□ Browser at localhost:5173
□ Chat interface visible
□ Can send message
□ API correction working
□ Draft panel functional
□ No console errors

Setup Notes:
□ API key configured
□ .env file created
□ Dependencies installed
□ No port conflicts

Testing Results:
□ Test 1: Message send ✓
□ Test 2: Correction ✓
□ Test 3: Draft panel ✓
□ Test 4: Keyboard shortcuts ✓

Issues Found:
□ None
□ ____________
□ ____________

Next Steps:
□ Deploy to production
□ Add database
□ Add authentication
□ ____________
```

---

**Welcome to Zoho! Enjoy! 🎉**

**Quick Links:**
- Running? → Try QUICK_REFERENCE.md
- Issues? → Check TESTING_GUIDE.md
- Curious? → Read ARCHITECTURE.md
- Deploying? → See DEPLOYMENT_GUIDE.md
- Lost? → Visit DOCUMENTATION_INDEX.md

