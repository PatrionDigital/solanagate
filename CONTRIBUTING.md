# Contributing to SolanaGate

Thank you for your interest in contributing to SolanaGate! We welcome all contributions, whether they're bug reports, feature requests, documentation improvements, or code contributions.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Issues

Before creating a new issue, please:

1. Check if the issue has already been reported in the [GitHub Issues](https://github.com/your-username/solana-token-gate/issues) section.
2. Provide as much detail as possible, including:
   - Steps to reproduce the issue
   - Expected vs. actual behavior
   - Screenshots or error messages (if applicable)
   - Browser/OS version
   - Any relevant console logs

### Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Clearly describe the feature and why it would be valuable
3. Include any relevant use cases or examples

### Pull Requests

1. **Fork** the repository and create your branch from `main`
2. **Install dependencies**: Run `npm install`
3. **Make your changes**
4. **Test your changes**: Run `npm test`
5. **Lint your code**: Run `npm run lint`
6. **Format your code**: Run `npm run format`
7. **Commit your changes** with a descriptive commit message
8. **Push** to your fork and submit a pull request

### Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with login"
   ```

3. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```

4. Open a Pull Request against the `main` branch

## Code Style

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use [Prettier](https://prettier.io/) for code formatting
- Write meaningful commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification

## Testing

Please ensure all new code is covered by appropriate tests. Run the test suite with:

```bash
npm test
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Questions?

If you have any questions, feel free to open an issue or reach out to the maintainers.
