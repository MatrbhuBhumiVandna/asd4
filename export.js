class Exporter {
    static async exportProject(projectData) {
        const JSZip = await this.loadJSZip();
        const zip = new JSZip();
        
        // Add files recursively
        this.addFolderToZip(zip, projectData.folders);
        
        // Generate zip file
        const content = await zip.generateAsync({ type: 'blob' });
        return content;
    }

    static addFolderToZip(zip, folders, path = '') {
        for (const folderId in folders) {
            const folder = folders[folderId];
            const folderPath = path ? `${path}/${folder.name}` : folder.name;
            
            // Add files in this folder
            for (const fileId in folder.files) {
                const file = folder.files[fileId];
                zip.file(`${folderPath}/${file.name}`, file.content);
            }
        }
    }

    static loadJSZip() {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    static downloadZip(content, projectName) {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
