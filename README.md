🚀 Project Setup Guide
📌 Project Overview

This project is built using a modern frontend toolchain with:

Vite

React

TypeScript

shadcn/ui

Tailwind CSS

It supports fast development, hot reloading, and easy deployment.

🛠 How to Work With This Project

You can edit and run the project locally using any IDE (VS Code recommended).
Follow the steps below to set it up on your machine.

📥 1. Clone the Repository
git clone <YOUR_GIT_URL>


Then navigate into the project folder:

cd <YOUR_PROJECT_NAME>

📦 2. Install Dependencies

Make sure Node.js and npm are installed.

Then run:

npm install


This installs all required packages.

▶️ 3. Start the Development Server

Launch the project locally with:

npm run dev


This will start a fast development server with live reload, allowing you to preview changes instantly in your browser.

✏️ Editing the Code

You can modify any file in the project using your preferred editor.

Update components in the src folder

Modify styles using Tailwind CSS

Add or customize UI using shadcn components

🌐 Deployment

You can deploy this project easily using any static site hosting service such as:

Vercel

Netlify

GitHub Pages

Cloudflare Pages

Just build the project:

npm run build


Then deploy the dist/ folder.

🔗 Optional: Custom Domain

If you deploy to a hosting service that supports domains, you can connect your custom domain in their settings panel.


Segmentation ✂️
Images are segmented using the HSV (Hue, Saturation, Value) color space to isolate the relevant plant regions, removing unnecessary background.
<img width="3975" height="1987" alt="image" src="https://github.com/user-attachments/assets/814c5ff2-6d8b-494b-8e80-90df7f584b2d" />


ImgSeg
2. Gray Scale Conversion ⚫
The segmented images are then converted to grayscale to simplify further processing while preserving essential details.


GrayScale
3. Sobel Filter 📐
A Sobel Filter is applied to highlight the edges in the images, making them more suitable for feature extraction.

Sobel

