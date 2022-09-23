# Kaholo Playwright Plugin
This plugin extends Kaholo to run Playwright tests in headless mode. Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API. Playwright was created specifically to accommodate the needs of end-to-end testing. Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation. Playwright supports tests written in node.js, Python, .NET, or Java.

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
* Docker Image - the docker image to use, including specific tags if necessary, should the default `mcr.microsoft.com/playwright/dotnet` for some reason be insufficient.
* Additional Command Arguments - more command line options to tack onto `dotnet test`, should that be desired.