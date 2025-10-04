# 🍎 Image Classifier for Fruits

A simple, client-side web application that uses the Google Gemini API to identify fruits from an uploaded image or a photo taken with your device's camera.


## ✨ Features

-   **File Upload**: Upload fruit images directly from your device.
-   **Drag & Drop**: Easily drag and drop image files into the upload area.
-   **Camera Access**: Use your device's camera to take a photo for identification.
-   **AI-Powered Identification**: Leverages the powerful Google Gemini model for accurate fruit recognition.
-   **Responsive Design**: Clean, modern, and user-friendly interface that works on both desktop and mobile devices.
-   **Light/Dark Mode**: The UI automatically adapts to your system's color scheme.

## 🚀 Getting Started

To run this project locally, follow these simple steps.

### Prerequisites

-   A modern web browser (like Chrome, Firefox, or Safari).
-   A Google AI API Key.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/fruit-classifier-app.git](https://github.com/YOUR_USERNAME/fruit-classifier-app.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd fruit-classifier-app
    ```

3.  **Get your Google AI API Key:**
    -   Visit [Google AI Studio](https://aistudio.google.com/) to create your free API key.

4.  **Add the API Key to the project:**
    -   Open the `app.js` file.
    -   Find the following line (around line 140):
        ```javascript
        const apiKey = 'AIzaSyDVE8QRzZugasTiYPsp1tQmMl4_dPuJ4ZE';// <-- PASTE YOUR KEY HERE
        ```
    -   Replace the placeholder key with your actual Google AI API key.

5.  **Open the application:**
    -   Simply open the `index.html` file in your web browser.

## 🛠️ Technologies Used

-   **HTML5**: For the structure of the web application.
-   **CSS3**: For custom styling and responsive design.
-   **JavaScript (ES6+)**: For application logic, camera interaction, and API calls.
-   **Google Gemini API**: For the core image recognition functionality.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
