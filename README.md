# Nightly Incidents Dashboard

A beautiful React dashboard that monitors and displays the reliability of Langflow's nightly build pipeline. Track days without failures, success rates, and recent build history with real-time updates.

## ✨ Features

- **Days Without Incident Counter**: Animated counter showing consecutive days without build failures
- **Real-time Statistics**: Success rate, total builds, and last incident date
- **Recent Build History**: Visual grid showing the last 10 builds with status indicators
- **Smart Caching**: Scheduled data updates at 6am, 1pm, 7pm, and 11pm to minimize API calls
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Powered by Framer Motion for fluid UI transitions
- **Dark Theme**: Beautiful glassmorphism design with gradient backgrounds

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Source**: GitHub Actions API

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Cristhianzl/nightly-check-lf.git
   cd nightly-check-lf
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint checks
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── IncidentCounter.tsx    # Main dashboard component
│   ├── Counter.tsx            # Animated number counter
│   └── LangflowLogo.tsx      # SVG logo component
├── services/
│   └── buildStatusService.ts  # GitHub API integration & caching
├── App.tsx                    # Root component
├── App.css                    # Global styles
├── index.css                  # Tailwind imports
└── main.tsx                   # Entry point
```

## ⚙️ Configuration

### GitHub API Integration

The dashboard monitors the "Nightly Build" workflow from the `langflow-ai/langflow` repository. You can customize this by modifying the constants in `src/services/buildStatusService.ts`:

```typescript
const REPO_OWNER = "langflow-ai";
const REPO_NAME = "langflow";
const UPDATE_HOURS = [6, 13, 19, 23]; // 6am, 1pm, 7pm, 11pm
```

### Scheduled Updates

Data refreshes automatically at:

- 6:00 AM
- 1:00 PM
- 7:00 PM
- 11:00 PM

This minimizes API calls while keeping data reasonably fresh.

## 🎨 Customization

### Styling

The project uses Tailwind CSS with custom color schemes. Key design elements:

- **Background**: Gradient from gray-900 via purple-900 to violet-900
- **Success Colors**: Green variants for successful builds
- **Error Colors**: Red variants for failed builds
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur

### Animation Settings

Counter animations and transitions can be customized in the `Counter` component:

```typescript
<Counter
  value={stats.daysWithoutIncident}
  fontSize={120}
  padding={10}
  places={[100, 10, 1]}
  gap={15}
  // ... other props
/>
```

## 🔄 Data Flow

1. **Initial Load**: App checks for cached data in localStorage
2. **API Fetch**: If cache is expired, fetches from GitHub Actions API
3. **Data Processing**: Calculates incident streaks and statistics
4. **Caching**: Stores data with next update timestamp
5. **Display**: Renders dashboard with smooth animations

## 📊 Metrics Calculated

### Days Without Incident

- **Calculation**: Counts consecutive days since the last build failure
- **Method**: Iterates through recent builds from newest to oldest, stopping at the first failure
- **Display**: Shows the maximum number of days since any successful build if no failures found in recent history

### Success Rate

- **Calculation**: `(Successful Builds / Total Builds) × 100`
- **Data Source**: Based on the last 50 completed workflow runs from GitHub Actions API
- **Classification**:
  - ✅ **Success**: `run.conclusion === "success"`
  - ❌ **Failure**: All other conclusions (failure, cancelled, etc.)
- **Scope**: Recent snapshot (last 50 runs) rather than all-time historical average

### Total Builds

- **Source**: Total count from GitHub Actions API (`runsData.total_count`)
- **Fallback**: Uses `builds.length` if total count is unavailable
- **Simulated Data**: Shows 672 total builds when API is unavailable

### Last Incident Date

- **Definition**: Date of the most recent build failure
- **Format**: Full date (e.g., "July 16, 2024")
- **Display**: Shows "Never" if no failures found in recent builds

### Current Streak

- **Calculation**: Number of consecutive successful builds starting from the most recent
- **Method**: Counts successful builds until the first failure is encountered
- **Purpose**: Shows ongoing reliability trend

## 🔧 Technical Rules & Constraints

### API Limitations

- **Rate Limits**: GitHub API has rate limits (5000 requests/hour for authenticated users)
- **Data Scope**: Fetches last 50 completed workflow runs (`per_page=50`)
- **Workflow Filter**: Only monitors "Nightly Build" workflow (searches by name or path containing "nightly_build")

### Caching Strategy

- **Update Schedule**: Data refreshes only at 6am, 1pm, 7pm, and 11pm
- **Storage**: Uses browser localStorage for persistence
- **Cache Key**: `langflow_incident_data`
- **Validation**: Cache expires automatically at next scheduled update time

### Fallback Behavior

- **API Failure**: Falls back to simulated data matching the GitHub screenshot
- **Simulated Pattern**: 4 recent successes, 1 failure 4 days ago, then more successes
- **Error Handling**: Shows error message if both API and fallback fail

### Build Status Classification

- **Success**: Only builds with `conclusion: "success"`
- **Failure**: All other conclusions including:
  - `"failure"`
  - `"cancelled"`
  - `"timed_out"`
  - `"action_required"`
  - `"neutral"`
  - `"skipped"`

### Recent Builds Display

- **Count**: Shows last 10 builds
- **Layout**: Grid layout (2 cols mobile, 3 cols tablet, 5 cols desktop)
- **Information**: Date, run number, status icon, and status text
- **Format**: "Jul 16 - #672" (date and run number)

## 🚀 Deployment

### Static Hosting

Build the project and deploy the `dist/` folder to any static hosting service:

```bash
npm run build
```

### Popular Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload to S3 bucket with static website hosting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Langflow](https://github.com/langflow-ai/langflow) for the amazing open-source project
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Cristhianzl/nightly-check-lf/issues) page
2. Create a new issue if your problem isn't already reported
3. Include as much detail as possible in your issue

---

**Built with ❤️**

_Monitoring build reliability, one day at a time._
