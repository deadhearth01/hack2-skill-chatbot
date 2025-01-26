## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

This project is configured to deploy to GitHub Pages automatically when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

To deploy manually:

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory

3. The GitHub Action will automatically deploy the contents of the `dist` directory to GitHub Pages.

Visit your deployed site at: https://[your-github-username].github.io/smart-chat-llama/