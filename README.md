
# Portfolio Generator 🚀

A comprehensive React TypeScript application that helps professionals create stunning portfolios and resumes with AI assistance, GitHub integration, and LinkedIn synchronization.

![Portfolio Generator](https://img.shields.io/badge/Portfolio-Generator-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178c6)
![Material-UI](https://img.shields.io/badge/MUI-5+-0081cb)

## ✨ Features

### 🔗 Integrations
- **GitHub Integration**: Automatically sync repositories, commits, and project data
- **LinkedIn Sync**: Import professional experience and education
- **AI-Powered Content**: Optimize descriptions and generate professional content
- **WhatsApp Contact**: Direct professional communication integration

### 📱 Portfolio Builder
- Modern, responsive design templates
- Real-time preview and editing
- Drag-and-drop interface (coming soon)
- SEO optimization
- Custom domain support

### 📄 Resume Generator
- Multiple professional templates:
  - Modern Tech
  - Classic Professional  
  - Creative Designer
  - ATS-Optimized
- PDF export functionality
- AI content optimization
- Market-standard formatting

### 🎨 User Experience
- Beautiful, modern UI with Material-UI
- Smooth animations with Framer Motion
- Dark/Light theme support
- Mobile-responsive design
- Accessibility features

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- GitHub Personal Access Token (optional)
- LinkedIn API credentials (optional)
- OpenAI API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-generator.git
   cd portfolio-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### GitHub Integration
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` and `user` scopes
3. Enter the token in the Dashboard when prompted

### LinkedIn Integration
1. Create a LinkedIn App at [LinkedIn Developer Console](https://developer.linkedin.com/)
2. Configure OAuth 2.0 settings
3. Use the access token in the application

### AI Assistant Setup
1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Enter the API key in Settings > AI Assistant

## 📁 Project Structure

```
portfolio-generator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── portfolio/       # Portfolio-specific components
│   │   ├── resume/          # Resume generator components
│   │   ├── github/          # GitHub integration components
│   │   ├── linkedin/        # LinkedIn integration components
│   │   └── ai/              # AI assistant components
│   ├── pages/               # Main application pages
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API and external service integrations
│   ├── store/               # State management (Zustand)
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles and themes
├── package.json
└── README.md
```

## 🛠️ Available Scripts

### Development
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production

### Deployment
- `npm run predeploy` - Build the app for deployment
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 Deployment

### GitHub Pages
1. **Update package.json homepage**
   ```json
   "homepage": "https://yourusername.github.io/portfolio-generator"
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages** in repository settings

### Custom Domain
1. Add a `CNAME` file in the `public` folder
2. Configure DNS settings with your domain provider
3. Update the homepage in package.json

### Other Hosting Platforms
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `build` folder
- **Heroku**: Use the Node.js buildpack

## 🔑 API Keys and Environment Variables

Create a `.env` file in the root directory:

```env
# Optional - for development
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

> **Note**: Never commit API keys to version control. Use environment variables for production.

## 📚 Usage Guide

### Getting Started
1. **Connect GitHub**: Use your personal access token to sync repositories
2. **Import LinkedIn**: Connect your LinkedIn profile for professional data
3. **Setup AI**: Add OpenAI API key for content optimization
4. **Build Portfolio**: Use the portfolio builder to create your site
5. **Generate Resume**: Create professional resumes with AI assistance

### Portfolio Building
- Choose from multiple themes and layouts
- Customize colors, fonts, and styling
- Add sections: About, Experience, Projects, Skills, Contact
- Preview in real-time
- Export or deploy directly

### Resume Creation
- Select from professional templates
- Auto-populate from GitHub and LinkedIn data
- Use AI to optimize content for ATS systems
- Export as PDF
- Multiple format options

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components consistently
- Write tests for new features
- Maintain responsive design
- Follow accessibility guidelines

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all dependencies are installed: `npm install`
- Clear cache: `npm start --reset-cache`
- Check TypeScript errors: `npm run build`

**GitHub Integration**
- Verify personal access token has correct permissions
- Check token expiration date
- Ensure repository access is granted

**LinkedIn API**
- Verify app configuration in LinkedIn Developer Console
- Check redirect URI settings
- Ensure proper OAuth 2.0 flow

**AI Features**
- Verify OpenAI API key is valid
- Check API usage limits
- Ensure proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Material-UI](https://mui.com/) - React component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [GitHub API](https://docs.github.com/en/rest) - Repository integration
- [LinkedIn API](https://docs.microsoft.com/en-us/linkedin/) - Professional data
- [OpenAI API](https://openai.com/api/) - AI assistance

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@portfoliogen.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/portfolio-generator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/portfolio-generator/discussions)

---

**Made with ❤️ by developers, for developers**

*Help us build the future of professional portfolios!*

