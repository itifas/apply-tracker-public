Apply Tracker {{VERSION}} for Windows, macOS and Linux. Your data stays on your computer, and the app installs new versions itself when they're released.

### Windows 10 and 11

Download **[Apply-Tracker-Setup-{{V}}.exe]({{URL}}/Apply-Tracker-Setup-{{V}}.exe)** and run it. Windows may say "Windows protected your PC" because the app isn't code-signed yet; choose **More info**, then **Run anyway**.

### macOS

- Apple Silicon (M1 to M4): **[Apply-Tracker-{{V}}-mac-arm64.dmg]({{URL}}/Apply-Tracker-{{V}}-mac-arm64.dmg)**
- Intel: **[Apply-Tracker-{{V}}-mac-x64.dmg]({{URL}}/Apply-Tracker-{{V}}-mac-x64.dmg)**

To check which you have, open the Apple menu and choose About This Mac. Drag the app into Applications. The first time, right-click it and choose Open, because it isn't notarized yet. Updates on macOS are manual for now: download the new version from this page.

### Linux

- Debian, Ubuntu, Mint: **[.deb]({{URL}}/Apply-Tracker-{{V}}-linux-amd64.deb)**, then `sudo apt install ./Apply-Tracker-{{V}}-linux-amd64.deb`
- Fedora, RHEL, openSUSE: **[.rpm]({{URL}}/Apply-Tracker-{{V}}-linux-x86_64.rpm)**, then `sudo dnf install ./Apply-Tracker-{{V}}-linux-x86_64.rpm`
- Any distribution: **[.AppImage]({{URL}}/Apply-Tracker-{{V}}-linux-x86_64.AppImage)**, then `chmod +x` it and run it

### Without installing

Try the web demo at https://tracker.iakovostifas.com. It runs in your browser with sample data.

The `.yml`, `.blockmap` and `.zip` files below are used by automatic updates, so you can ignore them.
