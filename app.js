class FruitClassifier {
    constructor() {
        this.currentImage = null;
        this.stream = null;
        this.config = {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            cameraConstraints: { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0]));

        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', (e) => { e.preventDefault(); uploadArea.classList.remove('dragover'); });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files[0]);
        });

        document.getElementById('camera-btn').addEventListener('click', () => this.startCamera());
        document.getElementById('capture-btn').addEventListener('click', () => this.capturePhoto());
        document.getElementById('stop-camera-btn').addEventListener('click', () => this.stopCamera());
        document.getElementById('classify-btn').addEventListener('click', () => this.classifyImage());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('classify-another-btn').addEventListener('click', () => this.reset());
        document.getElementById('try-again-btn').addEventListener('click', () => this.reset());
    }

    validateFile(file) {
        if (!file) return { valid: false, error: 'No file selected.' };
        if (!file.type.startsWith('image/')) return { valid: false, error: 'Please select an image file.' };
        if (file.size > this.config.maxFileSize) return { valid: false, error: 'File too large (max 10MB).' };
        return { valid: true };
    }

    handleFileUpload(file) {
        const validation = this.validateFile(file);
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.showImagePreview(this.currentImage);
        };
        reader.onerror = () => this.showError('Error reading file.');
        reader.readAsDataURL(file);
    }

    async startCamera() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera not supported in this browser.');
            }
            this.stream = await navigator.mediaDevices.getUserMedia(this.config.cameraConstraints);
            const video = document.getElementById('camera-video');
            video.srcObject = this.stream;
            video.onloadedmetadata = () => {
                video.play().catch(err => this.showError(`Camera playback error: ${err.message}`));
            };
            this.showSection('camera-section');
        } catch (error) {
            this.handleCameraError(error);
        }
    }

    handleCameraError(error) {
        let message = 'Could not access the camera.';
        if (error.name === 'NotAllowedError') message = 'Camera permission denied. Please allow camera access in your browser settings.';
        else if (error.name === 'NotFoundError') message = 'No camera found on this device.';
        this.showError(message);
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.stream = null;
        const video = document.getElementById('camera-video');
        video.srcObject = null;
        this.showSection('upload-section');
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        if (video.videoWidth && video.videoHeight) {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.currentImage = canvas.toDataURL('image/jpeg');
            this.stopCamera();
            this.showImagePreview(this.currentImage);
        } else {
            this.showError('Could not capture photo. Camera not ready.');
        }
    }

    showImagePreview(imageSrc) {
        document.getElementById('preview-image').src = imageSrc;
        this.showSection('image-preview');
    }

    async classifyImage() {
        if (!this.currentImage) {
            this.showError('No image to identify.');
            return;
        }
        this.showSection('loading-section');
        
        // ===================================================================
        // IMPORTANT: PASTE YOUR GOOGLE AI API KEY HERE
        // You can get a key from https://aistudio.google.com/
        // ===================================================================
        const apiKey = 'AIzaSyDVE8QRzZugasTiYPsp1tQmMl4_dPuJ4ZE';// <-- PASTE YOUR KEY HERE

        if (apiKey === "") {
            this.showError("Please add your Google AI API key to the script section of this file to enable fruit classification.");
            return;
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const base64ImageData = this.currentImage.split(',')[1];

        const payload = {
            contents: [{
                parts: [
                    { text: "What fruit is in this image? Respond with the name of the fruit only." },
                    { inlineData: { mimeType: "image/jpeg", data: base64ImageData } }
                ]
            }]
        };

        try {
            const response = await this.fetchWithBackoff(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                this.displayResult(text.trim());
            } else {
                throw new Error("Could not identify the fruit in the image.");
            }
        } catch (error) {
            console.error('API Error:', error);
            this.showError(`AI analysis failed: ${error.message}`);
        }
    }

    async fetchWithBackoff(url, options, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.status !== 429) { 
                    return response;
                }
            } catch (error) {
                if (i === retries - 1) throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
        throw new Error("API request failed after multiple retries.");
    }

    displayResult(fruitName) {
        document.getElementById('result-name').textContent = fruitName;
        this.showSection('results-section');
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        this.showSection('error-section');
    }

    hideAllSections() {
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => section.classList.add('hidden'));
    }
    
    showSection(sectionId) {
        this.hideAllSections();
        document.getElementById(sectionId).classList.remove('hidden');
    }

    reset() {
        this.currentImage = null;
        if (this.stream) this.stopCamera();
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        this.showSection('upload-section');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FruitClassifier();
});