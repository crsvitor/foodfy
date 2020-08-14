const PhotosUpload = {
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    handleFileInput(event) {
        const { files: fileList } = event.target;

        if (PhotosUpload.hasLimit(event)) {
            return
        }

        Array.from(fileList).forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const div = PhotosUpload.getContainer(image);

                PhotosUpload.preview.appendChild(div);
            }

            reader.readAsDataURL(file);
        });
    },
    hasLimit(event) {
        const { uploadLimit } = PhotosUpload;
        const { files: fileList } = event.target;

        if (fileList > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`);
            event.preventDefault()
            return true
        }

        return false        
    },
    getContainer(image) {
        const div = document.createElement('div');

        div.classList.add('photo');

        div.onclick = () => alert("remover foto");

        div.appendChild(image);

        return div
    }
}