<p>
  <a href="https://github.com/abhi1693/setup-browser/actions"><img alt="action status" src="https://github.com/abhi1693/setup-browser/workflows/action%20ci/badge.svg"></a>
</p>

# setup-browser

This action sets various different browsers for use:

- [x] Install and setup latest Chrome
- [ ] Install and setup latest Edge
- [ ] Install and setup latest Firefox
- [x] Cross platform runner (macOS, Linux, Windows)
- [x] Install by channel (stable, beta, dev, and canary)
- [x] Install by version number (88.0.4324, or 88.0)

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
## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| browser | The browser to install [chrome, edge, firefox]. | N/A | true |
| version | The version to install. | latest | false |

## Outputs

| Name | Description |
|------|-------------|
| binary | The name of the installed binary. |
<!--- END_ACTION_DOCS --->

## License

[MIT](LICENSE)
