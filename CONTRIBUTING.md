# Contributing to Lean Storytelling App

Welcome! We're excited you're interested in contributing to the Lean Storytelling App. This guide will help you get started.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the behavior we expect from all contributors.

## How to Contribute

### Reporting Issues

Before reporting an issue, please:

1. Check if the issue already exists in our [issue tracker](https://github.com/your-org/lean-storytelling-app/issues)
2. Ensure you're using the latest version of the software
3. Provide clear reproduction steps

### Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Explain the use case and why it would be valuable
3. Provide any relevant examples or mockups

### Pull Requests

We follow the [GitHub Flow](https://guides.github.com/introduction/flow/) workflow:

1. **Fork the repository** and create your branch from `master`
2. **Install dependencies**: Run `npm install` in both `backend/` and `frontend/` directories
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit your pull request** to the `master` branch

## Development Setup

### Prerequisites

- Node.js v20+
- PostgreSQL 15+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/lean-storytelling-app.git
cd lean-storytelling-app

# Set up backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Set up frontend
cd ../frontend
npm install

# Run database migrations
cd ../backend
node src/db/migrate.js
```

### Running the Application

```bash
# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

The backend will be available at `http://localhost:3000` and the frontend at `http://localhost:5173`.

## Coding Standards

### JavaScript/TypeScript

- Use ES6+ features
- Follow [Standard JS](https://standardjs.com/) style guide
- Use async/await for asynchronous code
- Write meaningful commit messages

### Backend (Fastify)

- Route files in `backend/src/routes/`
- Service files in `backend/src/services/`
- Use proper error handling and validation
- Follow RESTful conventions for API endpoints

### Frontend (React)

- Components in `frontend/src/components/`
- Pages in `frontend/src/pages/`
- Use functional components with hooks
- Follow React best practices

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Writing Tests

- Test files should be colocated with the code they test
- Use descriptive test names
- Test both happy paths and edge cases
- Aim for high test coverage

## Documentation

### Code Documentation

- Use JSDoc comments for functions and classes
- Document complex logic with inline comments
- Keep README files up to date

### API Documentation

- API endpoints should be documented in the route files
- Include request/response examples
- Document authentication requirements

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

<body>

<footer>
```

Common types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

Examples:
- `feat(auth): add JWT authentication`
- `fix(stories): handle null version data`
- `docs(readme): update installation instructions`

## Review Process

1. All pull requests require at least one approval
2. CI must pass (tests, linting, build)
3. Changes should be small and focused
4. Address review feedback promptly

## Community

- Join our [Discussions](https://github.com/your-org/lean-storytelling-app/discussions) for questions and ideas
- Follow us on [Twitter](https://twitter.com/yourhandle) for updates
- Check our [roadmap](https://github.com/your-org/lean-storytelling-app/projects) for upcoming features

## License

By contributing to this project, you agree that your contributions will be licensed under the [AGPLv3 License](LICENSE).

Thank you for contributing to Lean Storytelling App! Your help makes this project better for everyone.