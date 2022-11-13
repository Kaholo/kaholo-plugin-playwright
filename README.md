# Kaholo Playwright Plugin
This plugin extends Kaholo to run Playwright tests in headless mode. Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API. Playwright was created specifically to accommodate the needs of end-to-end testing. Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation. Playwright supports tests written in node.js, Python, .NET, and Java.

The plugin has only one method, "Execute .NET Test", specifically to support tests written in .NET, running them using the Microsoft (R) Test Execution Command Line Tool (`dotnet test`). If you wish to run tests written in node.js, Python, or Java, please [let us know](https://kaholo.io/contact/).

## Prerequisites
A Playwright test written in .NET must be on the Kaholo agent running the Playwright plugin. This is commonly accomplished using the Git plugin to clone a repository as an earlier action in the Kaholo pipeline.

## Access and Authentication
No special Access or Authentication is required to run Playwright tests, other than those used by the test itself, e.g. to log into a website.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Settings
There are no plugin-level settings for the Playwright plugin.

## Method: Execute .NET Test
This method runs command `dotnet test` in the Project Directory Path to execute all tests within the project.

### Parameters
Only the project directory path is strictly required. Other parameters may be left empty.
* Project Directory Path - a location containing a file matching `*.csproj`, where the plugin will run `dotnet test`
* Docker Image Tag - the the method uses by default `mcr.microsoft.com/playwright/dotnet:latest`. If for some reason a version other than `latest` is required it may be specified here, e.g. `v1.20.1-amd64`.
* Additional Command Arguments - additional arguments specified here will be added onto the command `dotnet test`.
