# 🎮 Colorful Tetris

A modern, responsive Tetris game built with HTML5 Canvas and vanilla JavaScript. Features beautiful graphics, progressive difficulty levels, and smooth gameplay.

## ✨ Features

- **Beautiful Graphics**: Modern UI with gradients, shadows, and smooth animations
- **Progressive Difficulty**: Speed increases with each level (every 10 lines cleared)
- **Score System**: Points based on lines cleared and current level
- **Local Storage**: High scores are saved locally
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Level Progress Bar**: Visual indicator showing progress to next level
- **Game Over Modal**: Beautiful end-game screen with final statistics
- **Smooth Controls**: Responsive keyboard controls with visual feedback
- **Audio System**: High-quality sound effects and chiptune background music
- **Volume Controls**: Adjustable volume and mute functionality

## 🎯 How to Play

### Controls
- **← → Arrow Keys**: Move piece left/right
- **↑ Arrow Key**: Rotate piece clockwise
- **↓ Arrow Key**: Soft drop (move down faster)
- **Spacebar**: Hard drop (instant drop)
- **P Key**: Pause/Resume game
- **N Key**: Start new game

### Audio Controls
- **Volume Slider**: Adjust game volume from 0% to 100%
- **Mute Button**: Toggle all audio on/off
- **Background Music**: Chiptune-style music that loops during gameplay
- **Sound Effects**: Different sounds for move, rotate, drop, line clear, level up, and game over

### Scoring System
- **1 Line**: 100 × Level points
- **2 Lines**: 300 × Level points
- **3 Lines**: 500 × Level points
- **4 Lines**: 800 × Level points

### Level Progression
- Each level requires 10 lines to be cleared
- Speed increases with each level
- Maximum speed is reached at level 10

## 🚀 Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- No additional dependencies required

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start playing immediately!

### Landing Page
The project includes a beautiful landing page (`landing.html`) that showcases:
- Game features and highlights
- Beautiful gradient design
- Responsive layout
- "Made by Rajat" credit
- Direct link to start playing

### Deployment
The game is ready for deployment on any static hosting service:

- **GitHub Pages**: Push to a repository and enable GitHub Pages
- **Netlify**: Drag and drop the folder to deploy
- **Vercel**: Import the repository for automatic deployment
- **Any Web Server**: Upload files to your web server

## 🏗️ Project Structure

```
tetris-game/
├── landing.html        # Landing page with game introduction
├── index.html          # Main HTML file with game structure
├── script.js           # Game logic and mechanics
├── styles.css          # Styling and responsive design
├── netlify.toml        # Netlify deployment configuration
└── README.md           # This file
```

## 🎨 Customization

### Colors
The game uses CSS custom properties for easy color customization. Edit the `:root` section in `styles.css`:

```css
:root {
  --bg-1: #0f1020;      /* Background primary */
  --bg-2: #0b0c19;      /* Background secondary */
  --accent: #7c4dff;    /* Primary accent color */
  --success: #00e676;    /* Success/green color */
  --warning: #ffd166;    /* Warning/yellow color */
  --danger: #ff5252;     /* Danger/red color */
}
```

### Game Settings
Modify game constants in `script.js`:

```javascript
const COLS = 10;         // Board width
const ROWS = 20;         // Board height
const BLOCK = 30;        // Block size in pixels
```

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimization

The game is fully responsive and optimized for mobile devices:
- Touch-friendly controls
- Responsive layout that adapts to screen size
- Optimized canvas sizing for mobile performance

## 🔧 Performance Features

- **RequestAnimationFrame**: Smooth 60fps gameplay
- **Canvas Optimization**: Efficient rendering with minimal redraws
- **Local Storage**: Fast score persistence
- **CSS Transitions**: Hardware-accelerated animations

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Hold piece functionality
- [ ] Multiple difficulty modes
- [ ] Sound effects and music
- [ ] Particle effects for line clears
- [ ] Multiplayer support
- [ ] Custom themes and skins

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the classic Tetris game
- Built with modern web technologies
- Designed for accessibility and user experience

---

**Enjoy playing Colorful Tetris! 🎮✨**

For questions or support, please open an issue on the project repository.
