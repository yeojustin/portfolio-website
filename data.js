// Data for the portfolio
const portfolioData = {
  home: [
    { type: 'folder', name: 'Projects', target: 'projects', date: '2026-05-01', size: '' },
    // { type: 'folder', name: 'Profile', target: 'profile', date: '2026-05-02', size: '' },
    { type: 'folder', name: 'Contact', target: 'contact', date: '2026-05-04', size: '' },
    // { type: 'pdf', name: 'Resume_JustinYeo.pdf', target: 'modal_resume', date: '2026-05-06', size: '245 KB' }
  ],
  projects: [
    { 
      type: 'app', 
      isProject: true,
      name: 'ArchGen — Agentic Architecture Diagram Generator', 
      iconEmoji: '🏗️',
      category: 'Agentic Workflow',
      status: 'Not Live Yet, able to run locally!',
      statusColor: 'orange',
      description: 'An agentic AI workflow that transforms natural language descriptions into professional architecture diagrams and detailed blueprints. Powered by Google ADK.',
      stack: ['FastAPI', 'React Flow', 'Google Gemini', 'Google ADK', 'Agentic Workflows'],
      date: '2026-05-11',
      appUrl: '',
      githubUrl: 'https://github.com/yeojustin/Archgen-Agentic-Architecture-Diagram-Generator',
      contentFile: 'projects/archgen.html'
    },
    { 
      type: 'app', 
      isProject: true,
      name: 'Relative Market Matrix Dashboard', 
      iconEmoji: '📈',
      category: 'Web App',
      status: 'Live',
      statusColor: 'green',
      description: 'An interactive Streamlit dashboard for cross-asset relative performance analysis. Build a custom symbol set (crypto, indices, equities, futures, FX), choose a benchmark, and compare each asset against either that benchmark or the peer-group average.',
      stack: ['Streamlit', 'Pandas', 'Altair', 'yfinance', 'Data Analysis'],
      date: '2026-04-10',
      appUrl: 'https://relative-market-matrix-dashboard-demo.streamlit.app',
      githubUrl: 'https://github.com/yeojustin/Relative-Market-Matrix-Dashboard',
      embedHtml: `<iframe src="https://relative-market-matrix-dashboard-demo.streamlit.app/?embed=true&symbols=ETH-USD%2CSOL-USD%2CAAPL%2C%5EGSPC%2CNVDA" class="w-full h-full border-none"></iframe>`
    },
    { 
      type: 'CLI', 
      isProject: true,
      name: 'Order Book Price Direction Predictor', 
      iconEmoji: '📄',
      category: 'Algorithmic Trading',
      status: 'Local App',
      statusColor: 'blue',
      description: 'Real-time Binance L2 order book pipeline that engineers microstructure features and predicts short-horizon BTC price direction. Currently WIP for batch inference prediction.',
      stack: ['Binance API & Websocket', 'CLI', 'L2 Orderbook', 'Prediction Model', 'Python', 'Fintech', 'Algorithmic Trading'],
      date: '2026-02-22',
      appUrl: '',
      githubUrl: 'https://github.com/yeojustin/OrderBook-Price-Direction-Predictor',
      contentFile: 'projects/order-book-predictor.html'
    },
    { 
      type: 'CLI', 
      isProject: true,
      name: 'L2 Order Book Quoting Simulator', 
      iconEmoji: '⚡',
      category: 'Algorithmic Trading',
      status: 'Local App',
      statusColor: 'blue',
      description: 'A proof of concept L2 Order Book quoting simulation using Python and websockets. This is not a trading bot: public Binance Spot depth only. Pulls a snapshot, streams diffs, keeps a local book. Simulator mode: OBI-ish score, fake quotes, fake fills when quotes actually cross the touch.',
      stack: ['Python', 'Websocket', 'CLI', 'Algorithmic Trading', 'Data Engineering', 'Proof of Concept'],
      date: '2026-01-14',
      appUrl: '',
      githubUrl: 'https://github.com/yeojustin/L2-Order-Book-Quote-Simulator',
      contentFile: 'projects/l2-order-book-quote-simulator.html'
    }
  ],
  // profile: [
  //   { type: 'doc', name: 'about_me.txt', target: 'modal_about', date: '2026-01-10', size: '2 KB' },
  //   { type: 'doc', name: 'experience.md', target: 'modal_exp', date: '2026-04-20', size: '5 KB' },
  //   { type: 'doc', name: 'skills.json', target: 'modal_skills', date: '2026-05-05', size: '1 KB' },
  //   { type: 'pdf', name: 'Resume_JustinYeo.pdf', target: 'modal_resume', date: '2026-05-06', size: '245 KB' }
  // ],
  thoughts: [
    { type: 'doc', name: 'vibe_coding.md', target: 'modal_blog_vibe', date: '2026-04-28', size: '12 KB' },
    { type: 'doc', name: 'agentic_workflows.txt', target: 'modal_blog_agent', date: '2026-03-15', size: '8 KB' },
    { type: 'doc', name: 'hackathon_tips.md', target: 'modal_blog_hack', date: '2026-02-05', size: '6 KB' }
  ],
  contact: [
    { type: 'email', name: 'Email Me!', target: 'link_email', date: '2026-01-01', size: '1 KB' },
    { type: 'linkedin', name: 'LinkedIn', target: 'link_linkedin', date: '2026-01-01', size: '1 KB' },
    { type: 'github', name: 'GitHub', target: 'link_github', date: '2026-01-01', size: '1 KB' },
    { type: 'medium', name: 'Medium', target: 'link_medium', date: '2026-01-01', size: '1 KB' }
  ]
};

const modalContents = {
  modal_about: {
    title: 'about_me.txt',
    icon: '📄',
    content: `<div class="font-mono text-sm whitespace-pre-wrap leading-relaxed text-white-700">
Hi, I'm Justin Yeo.

I build products from concept to launch at AI-speed. As a "technical vibe coder", I leverage LLMs and agentic tools to bypass traditional bottlenecks, shipping high-fidelity MVPs with efficiency.

Currently exploring Algorithmic trading tools, Agentic Workflows, GenAI, and building cool stuff with AI tools.
</div>`
  },
  modal_exp: {
    title: 'experience.md',
    icon: '📝',
    content: `<div class="prose prose-sm max-w-none font-sans text-gray-800">
      <h2 class="text-xl font-bold mb-4">Experience</h2>
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-blue-600">Google Cloud</h3>
        <p class="text-gray-500 text-sm">AI/ML Solutions Engineer Trainee</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Architected an internal agentic AI solution.</li>
          <li>Delivered PRD + Google ADK architecture + GTM strategy.</li>
          <li>Reduced manual workflows by 50% and secured VP-level alignment.</li>
        </ul>
      </div>
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-blue-600">Central Provident Fund Board (CPFB)</h3>
        <p class="text-gray-500 text-sm">Machine Learning Engineer / Data Analytics</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Worked on sentiment analysis, topic modeling, and text classification.</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-blue-600">Hackathons & Enterprise POCs</h3>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>2x hackathon winner (2nd runner-up out of 300+ teams APAC-wide).</li>
          <li>Delivered 7 enterprise AI POCs for Tier-1 global banks.</li>
        </ul>
      </div>
    </div>`
  },
  modal_skills: {
    title: 'skills.json',
    icon: '{ }',
    content: `<pre class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-inner">
{
  "cloud": ["Google Cloud Platform (GCP)", "Vertex AI"],
  "ai_ml": ["Gemini 1.5", "RAG Pipelines", "Agentic Workflows", "Prompt Engineering"],
  "languages": ["TypeScript", "Python", "C++", "C", "JavaScript"],
  "frameworks": ["Next.js", "FastAPI", "Flask", "React", "Tailwind CSS"],
  "tools": ["Google ADK", "Supabase", "Git"],
  "domains": ["FinTech", "Data Analytics", "0 -> 1 Product Building"]
}
</pre>`
  },
  modal_project_resume: {
    title: 'Better Resume Builder',
    icon: '📁',
    content: `<div class="text-center">
      <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm border border-blue-200">📄</div>
      <h2 class="text-2xl font-bold mb-2">Better Resume Builder</h2>
      <p class="text-gray-600 mb-6">TypeScript + LaTeX + Agentic Workflows (ADK)</p>
      <p class="text-sm text-left bg-gray-50 p-4 rounded border border-gray-200 text-gray-700 leading-relaxed shadow-inner">A production-ready, minimalist web application that uses an agentic LaTeX workflow to tailor a "Master CV" to specific job descriptions. Features a dynamic live PDF preview.</p>
    </div>`
  },
  modal_project_twodo: {
    title: 'Two-Do List',
    icon: '📁',
    content: `<div class="text-center">
      <div class="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm border border-green-200">✅</div>
      <h2 class="text-2xl font-bold mb-2">Two-Do List</h2>
      <p class="text-gray-600 mb-6">Next.js + Tailwind CSS + FastAPI</p>
      <p class="text-sm text-left bg-gray-50 p-4 rounded border border-gray-200 text-gray-700 leading-relaxed shadow-inner">A mobile-first, Trello-inspired task management application. Features hybrid segmented lists, a "Paste & Parse" inbox, and RAG-powered backend for duplicate detection.</p>
    </div>`
  },
  modal_project_cpp: {
    title: 'Large-DF-Reader',
    icon: '📁',
    content: `<div class="text-center">
      <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm border border-purple-200">⚡</div>
      <h2 class="text-2xl font-bold mb-2">Large-DF-Reader</h2>
      <p class="text-gray-600 mb-6">C++ CLI Tool</p>
      <p class="text-sm text-left bg-gray-50 p-4 rounded border border-gray-200 text-gray-700 leading-relaxed shadow-inner">A high-performance C++ command-line tool designed for rapidly reading and processing large DataFrame/CSV files, minimizing memory overhead.</p>
    </div>`
  },
  modal_project_shell: {
    title: 'Unix-Shell-V4',
    icon: '📁',
    content: `<div class="text-center">
      <div class="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm border border-gray-700">🐚</div>
      <h2 class="text-2xl font-bold mb-2">Unix-Shell-V4</h2>
      <p class="text-gray-600 mb-6">C Systems Programming</p>
      <p class="text-sm text-left bg-gray-50 p-4 rounded border border-gray-200 text-gray-700 leading-relaxed shadow-inner">A custom Unix shell built entirely in C, implementing advanced features like process management, piping, I/O redirection, and signal handling.</p>
    </div>`
  },
  // modal_resume: {
  //   title: 'Resume_JustinYeo.pdf',
  //   icon: '📕',
  //   content: `<div class="flex flex-col items-center justify-center h-full py-10">
  //     <div class="text-6xl mb-4 drop-shadow-md">📄</div>
  //     <h3 class="text-xl font-semibold mb-2 text-gray-800">Justin_Yeo_Resume.pdf</h3>
  //     <p class="text-gray-500 mb-8 text-sm">245 KB • PDF Document</p>
  //     <a href="https://drive.google.com/file/d/1i0R7KawB4l4v5WFFYbwySkblLhCRkFfp/view?usp=sharing" target="_blank" class="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm font-medium">
  //       Open Document externally
  //     </a>
  //   </div>`
  // },
  modal_blog_vibe: {
    title: 'vibe_coding.md',
    icon: '📝',
    content: `<div class="prose prose-sm font-sans text-gray-800">
      <h1 class="text-2xl font-bold mb-4">The Art of Vibe Coding</h1>
      <p class="mb-4">As a "technical vibe coder", I don't just write code; I orchestrate it using LLMs and agentic tools.</p>
      <p class="mb-4">The traditional bottlenecks of setting up boilerplate, wrestling with obscure API syntax, and manual refactoring are gone. Instead, the focus shifts to architecture, user experience, and rapid execution.</p>
      <p class="mb-4">It's about having the technical intuition to guide the AI, course-correcting when it drifts, and moving from 0 to 1 at unprecedented speed.</p>
    </div>`
  },
};

const EXTERNAL_LINKS = {
  link_email: "mailto:yeojustinnn@gmail.com",
  link_linkedin: "https://www.linkedin.com/in/justinyeo177",
  link_github: "https://github.com/yeojustin",
  link_medium: "https://medium.com/@unemployedbanana"
};

