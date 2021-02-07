<p>
  <a href="https://github.com/abhi1693/setup-browser/actions"><img alt="action status" src="https://github.com/abhi1693/setup-browser/workflows/build-test/badge.svg"></a>
</p>

# setup-browser

This action sets various different browsers for use:

- [ ] Install and setup latest Chrome
- [ ] Install and setup latest Edge
- [ ] Install and setup latest Firefox
- [ ] Cross platform runner (macOS, Linux, Windows)
- [ ] Install by channel (stable, beta, dev, and canary)
- [ ] Install by version number (88.0.4324, or 88.0)

## Usage

See [action.yml](action.yml)

Basic usage:

```yaml
steps:
  - uses: abhi1693/setup-browser@latest
    with:
      browser: chrome
      version: latest
```

**Note that the installed binary is `chrome` but not `chromium` on Linux and
Windows.** Be sure to pass a full-path to `chrome` to your test system if the
system expects that `chromium` exists in PATH such as [karma-chromium-runner][]:

[karma-chromium-runner]: https://github.com/karma-runner/karma-chrome-launcher

```sh
CHROMIUM_BIN=$(which chrome) npm run test
```

## Parameters

- `browser`:
  *(Required)* The browser to be installed.  Available options are `chrome`, `edge` and `firefox`.
  
- `version`:
  *(Optional)* The browser version to be installed.  Available value is commit position like `848897` or `latest`.
  Default: `latest`

## License

[MIT](LICENSE)