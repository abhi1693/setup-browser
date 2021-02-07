<p>
  <a href="https://github.com/abhi1693/setup-browser/actions"><img alt="action status" src="https://github.com/abhi1693/setup-browser/workflows/ci/badge.svg"></a>
</p>

# setup-browser

This action sets various different browsers for use:

- [x] Install and setup latest Chrome
- [ ] Install and setup latest Edge
- [ ] Install and setup latest Firefox
- [x] Cross platform runner (macOS, Linux, Windows)
- [ ] Install by channel (stable, beta, dev, and canary)
- [ ] Install by version number (88.0.4324, or 88.0)

## Usage

Basic usage:

```yaml
steps:
  - uses: abhi1693/setup-browser@latest
    with:
      browser: chrome
      version: latest
```

<!--- BEGIN_ACTION_DOCS --->
<!--- END_ACTION_DOCS --->

## License

[MIT](LICENSE)