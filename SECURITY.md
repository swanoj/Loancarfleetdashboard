# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 0.0.1 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing the maintainer or creating a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if you have one)
5. **Your contact information** for follow-up

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Varies by severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Within 90 days

## Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables for sensitive data
2. **Keep dependencies updated** - Regularly run `npm audit` and `npm outdated`
3. **Use HTTPS** - Always use HTTPS in production environments
4. **Validate user input** - Sanitize all user inputs before processing
5. **Follow least privilege** - Grant minimal permissions necessary

### For Deployment

1. **Use environment variables** - Never hardcode credentials
2. **Enable HTTPS** - Required for camera API and production use
3. **Set CSP headers** - Content Security Policy for XSS protection
4. **Regular backups** - Maintain regular database backups
5. **Monitor logs** - Track errors and suspicious activities

## Known Security Considerations

### Camera API
- Requires HTTPS to function
- Browser will request user permission
- Photos are stored in browser memory temporarily

### AI Integration
- Mock implementation in current version
- Real implementation should use secure API keys
- Validate and sanitize all image uploads

### Data Storage
- LocalStorage used for draft persistence
- No sensitive data should be stored in LocalStorage
- Consider encryption for sensitive data

## Security Audit History

See [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) for detailed audit results.

### Recent Audits
- **January 3, 2026** - Comprehensive security and dependency audit
  - Fixed Vite security vulnerabilities (GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3, GHSA-93m4-6634-74q7)
  - Added security workflows and Dependabot configuration

## Automated Security

This repository uses:
- **Dependabot** - Automated dependency updates
- **npm audit** - Regular security scans
- **GitHub Actions** - CI/CD security checks

## Contact

For security concerns, please contact the repository maintainer.
