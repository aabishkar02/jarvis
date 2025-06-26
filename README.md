# 🤖 J.A.R.V.I.S - Just A Rather Very Intelligent System

*"Sometimes you gotta run before you can walk." - Tony Stark*

Welcome to your personal AI assistant, because apparently everyone needs their own JARVIS these days. This isn't just another chatbot - this is a full-fledged AI companion with a sleek HUD interface, voice recognition, and enough sass to make Tony Stark proud.

## 🚀 What This Thing Actually Does

- **Voice Recognition**: Talk to it like you would to the real JARVIS (results may vary)
- **AI-Powered Responses**: Powered by Google's Generative AI (because we're not all billionaire geniuses)
- **Cinematic UI**: Complete with loading sequences, sound effects, and that satisfying JARVIS aesthetic
- **Text-to-Speech**: It talks back with a British accent (or tries to)
- **Real-time Processing**: Handles your requests faster than you can say "I am Iron Man"

## 🛠️ Tech Stack (For the Curious)

**Frontend (The Pretty Stuff):**
- React 19.1.0 - Because we like our components fresh
- Framer Motion - For those smooth animations that make you feel like a superhero
- Web Speech API - So you can actually talk to your computer like it's 2024

**Backend (The Brain):**
- Node.js + Express - The reliable workhorses
- Google Generative AI - The actual intelligence (we're not that smart)
- CORS - Because browsers are paranoid these days

## 📋 Prerequisites (Don't Skip This Part)

Before you start feeling like Tony Stark, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A Google API Key** - [Get one here](https://makersuite.google.com/app/apikey)
- **A modern browser** (Chrome, Firefox, Safari - basically anything from this decade)
- **WSL** (if you're on Windows and want to feel fancy)

## 🚀 Installation (The "Some Assembly Required" Part)

### Step 1: Clone This Masterpiece
```bash
git clone https://github.com/aabishkar02/jarvis.git
cd jarvis
```

### Step 2: Set Up the Server (The Backend Magic)
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
GOOGLE_API_KEY=your_actual_api_key_here
```
*Pro tip: Don't commit your API key to GitHub unless you want the internet to use your credits*

### Step 3: Set Up the Client (The Pretty Frontend)
```bash
cd ../client
npm install
```

## 🎬 Running Your Personal JARVIS

### The Easy Way (Two Terminals)

**Terminal 1 - Start the Server:**
```bash
cd server
npm run dev
```
*Server should start on http://localhost:5000*

**Terminal 2 - Start the Client:**
```bash
cd client
npm start
```
*Client should start on http://localhost:3000*

### The WSL Way (Because You're Fancy)
```bash
# In WSL
cd server && npm run dev &
cd ../client && npm start
```

## 🎯 How to Use (User Manual for Dummies)

1. **Open your browser** and go to `http://localhost:3000`
2. **Click "Enable Audio"** (because browsers are weird about audio)
3. **Watch the epic loading sequence** (we spent way too much time on this)
4. **Click the microphone** or type your commands
5. **Talk to JARVIS** like you own a billion-dollar tech company
6. **Enjoy the responses** and pretend you're saving the world

### Voice Commands Examples:
- "What's the weather like?"
- "Tell me a joke"
- "What can you do?"
- "How do I become Iron Man?" (Results not guaranteed)

## 🐛 Troubleshooting (When Things Go Wrong)

### "My client won't start!"
- **PowerShell Users**: Use `;` instead of `&&`
  ```powershell
  cd client; npm start
  ```
- **Check if port 3000 is free**: `lsof -ti:3000` (WSL/Mac) or `netstat -ano | findstr :3000` (Windows)

### "My server won't start!"
- **Check your API key** in the `.env` file
- **Make sure port 5000 is free**: `lsof -ti:5000` (WSL/Mac)
- **Kill existing processes**: `kill -9 $(lsof -ti:5000)` (WSL/Mac)

### "JARVIS isn't responding to my voice!"
- **Check browser permissions** for microphone access
- **Make sure you clicked "Enable Audio"**
- **Try using Chrome** (it has the best Web Speech API support)
- **Speak clearly** (JARVIS isn't magic... yet)

### "The app works but my server is off!"
That's normal! The frontend works independently. You'll just get error messages instead of AI responses. It's like having a fancy car with no engine - looks great, doesn't go anywhere.

## 🎨 Features That Make You Feel Like Tony Stark

- **🎵 Cinematic Loading Sequence**: Complete with sound effects
- **🎤 Voice Recognition**: Talk naturally to your AI
- **🔊 Text-to-Speech**: JARVIS talks back (with attitude)
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎯 Real-time Processing**: Instant responses (when the server is running)
- **🎨 Sleek UI**: HUD-style interface that screams "I'm a genius billionaire"

## 🔧 Development Commands

```bash
# Server commands
npm start          # Production mode
npm run dev        # Development mode with nodemon

# Client commands
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests (if we had any)
```

## 🤝 Contributing (Join the Team)

Found a bug? Want to add a feature? Think you can make JARVIS even more sarcastic? 

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test everything (seriously, test it)
5. Submit a pull request

## 📝 License

This project is licensed under the "Don't Sue Me" License. Use it, modify it, make it better, just don't blame us if it doesn't actually make you Iron Man.

## 🙏 Acknowledgments

- **Tony Stark** - For the inspiration (and the ego)
- **Google** - For the AI that makes this actually work
- **The React Team** - For making frontend development bearable
- **Coffee** - For making this project possible

## ⚠️ Disclaimer

This JARVIS will not:
- Control your house (yet)
- Manage your Iron Man suit
- Save the world from aliens
- Make you a billionaire genius philanthropist

But it will make you feel pretty cool while you're coding.

---

*"I am inevitable... I am Iron Man... I am... still just a chatbot."* - JARVIS (probably)

**Built with ❤️ and an unhealthy obsession with Marvel movies**
