import React from 'react';

const FileUpload = ({ onFileUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onFileUpload(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="file-upload-container">
            <div className="upload-card">
                <h2>Upload Quiz</h2>
                <p>Select a markdown file (e.g., quiz.md) to start.</p>
                <input
                    type="file"
                    accept=".md"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>
        </div>
    );
};

export default FileUpload;
