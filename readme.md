# Custom Hue Popup for Home Assistant

A customizable, Hue-inspired popup card for Home Assistant, designed to provide an intuitive interface for controlling your lights.

![Custom Hue Popup](https://github.com/Navypixel/custom_hue_popup/raw/main/images/hue-popup-screenshot.png)

---

## Features

- **Intuitive Light Controls**: Adjust brightness, color, and color temperature with ease.
- **Scene Activation**: Quickly activate predefined lighting scenes.
- **Multi-Light Support**: Control multiple lights simultaneously.
- **Customizable UI**: Tailor the appearance to match your dashboard's theme.

---

## Installation

### HACS (Home Assistant Community Store)

1. Open Home Assistant and navigate to **HACS**.
2. Go to the **Frontend** section.
3. Click the **"+"** button to add a new repository.
4. Enter the repository URL:  
   `https://github.com/Navypixel/custom_hue_popup`
5. Select **"Dashboard"** as the category.
6. Click **"Add"** and then **"Install"**.

### Manual Installation

1. Download the latest release from the [Releases](https://github.com/Navypixel/custom_hue_popup/releases) page.
2. Save the `custom_hue_popup.js` file to your Home Assistant's `/config/www/community/custom_hue_popup/` directory.
3. Add the following resource to your Lovelace configuration:

   ```yaml
   url: /local/community/custom_hue_popup/custom_hue_popup.js
   type: module
