# Contributing to TimeFlow

Thank you for your interest in contributing to TimeFlow! 🎉

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/timeflow.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes locally
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (Prettier formatting)
- Use functional components with hooks in React
- Keep components small and focused (< 200 lines)
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines

- Place reusable components in `src/react-app/components/`
- Place page components in `src/react-app/pages/`
- Use TypeScript interfaces for props
- Extract repeated UI patterns into components

### Backend Guidelines

- Use Hono for all API endpoints
- Validate inputs with Zod schemas
- Use parameterized SQL queries
- Add proper error handling
- Protect routes with `authMiddleware` when needed

### Database Guidelines

- Never use foreign key constraints (D1 limitation)
- Keep schemas simple
- Use nullable fields by default
- Add indexes for frequently queried columns
- Always include `created_at` and `updated_at` timestamps

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the glassmorphism design pattern
- Add smooth transitions and animations
- Ensure responsive design (mobile-first)
- Use emoji accents where appropriate

## 🧪 Testing

Before submitting a PR:

1. Run TypeScript type checking: `npx tsc --noEmit`
2. Test the app locally: `npm run dev`
3. Test all user flows:
   - Login/Logout
   - Create/Edit/Delete activities
   - View analytics
   - Date selection
   - Category filtering

## 📝 Commit Messages

Use clear and descriptive commit messages:

- `feat: Add new feature`
- `fix: Fix bug in component`
- `style: Update UI styling`
- `refactor: Refactor code structure`
- `docs: Update documentation`
- `test: Add tests`
- `chore: Update dependencies`

## 🐛 Bug Reports

When reporting bugs, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/device information

## 💡 Feature Requests

When requesting features, please include:

- Clear description of the feature
- Use case and benefits
- Mockups or examples (if applicable)
- Implementation suggestions (optional)

## 📞 Questions?

If you have questions, feel free to:
- Open an issue with the "question" label
- Reach out to the maintainers

## 🎯 Priority Areas

We're especially interested in contributions for:

- 🧪 Adding tests
- 📱 Improving mobile responsiveness
- ♿ Enhancing accessibility
- 🌍 Adding internationalization
- 📊 New analytics visualizations
- 🎨 UI/UX improvements
- 📝 Documentation improvements

Thank you for contributing! 🙏
