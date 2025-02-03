# AI-Assisted Communication (AAC) App

An innovative communication assistance tool designed to empower autistic individuals and people with speech difficulties. Built with Next.js 14, this project aims to make assisted communication more accessible, natural, and effective.

## 🌎 Background

This project was inspired by my younger brother, who is autistic and uses AAC (Augmentative and Alternative Communication) tools to communicate effectively. While exploring existing AAC solutions, I noticed that many were expensive and cumbersome to use. This motivated me to create a more accessible, user-friendly alternative that leverages modern AI technology to enhance the communication experience.

The impact of AAC tools can be transformative - I've witnessed firsthand how access to better communication tools can help individuals progress academically and express themselves more fully. This project aims to make such tools more accessible to everyone who needs them.

## 🌟 Features

- **Smart Letter Board**: Intuitive typing interface optimized for accessibility
- **Advanced Voice Synthesis**: Integration with Eleven Labs and OpenAI for natural-sounding speech output, moving beyond traditional robotic AAC voices
- **Customizable Word Banks**: Parents can create topic-specific word banks (e.g., neuroscience terminology) for faster, more relevant communication
- **Predictive Text**: AI-powered contextual word suggestions using customized word banks
- **Document History**: Save and export conversations as PDFs for review and sharing
- **Customizable Interface**: Personalize the look and feel to match user preferences
- **Accessibility-First Design**: Built following WCAG guidelines

## Data Model

![Data Model](./Data-Model.png)

## 🚀 Live Demo

[Try the app](https://your-demo-url.com) | [Watch Demo Video](your-video-url)

## 💻 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Zustand
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase with SDK
- **AI Integration**: OpenAI API
- **Voice Synthesis**: Eleven Labs API
- **Analytics**: PostHog (User analytics + Session replays)
- **Deployment**: Vercel

## 🛠️ Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/project-name.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---
Built with ❤️ for accessibility and inclusion
