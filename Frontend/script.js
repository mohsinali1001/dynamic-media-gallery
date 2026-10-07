$(document).ready(function () {

    // ============================================
    // Configuration
    // ============================================

    const MEDIA_API_URL = `${CONFIG.API_BASE_URL}/api/media`;


    // ============================================
    // DOM Elements
    // ============================================

    const uploadForm = $('#uploadForm');
    const uploadBtn = $('#uploadBtn');
    const uploadMessage = $('#uploadMessage');

    const loadMediaBtn = $('#loadMediaBtn');
    const gallery = $('#gallery');

    const loadingState = $('#loadingState');
    const emptyState = $('#emptyState');
    const errorState = $('#errorState');
    const errorMessage = $('#errorMessage');

    const mediaCount = $('#mediaCount');


    // ============================================
    // Upload Media
    // ============================================

    uploadForm.on('submit', function (event) {

        event.preventDefault();

        const title = $('#title').val().trim();
        const description = $('#description').val().trim();
        const file = $('#media')[0].files[0];


        // Validate title

        if (!title) {
            showMessage(
                'error',
                'Please enter a media title.'
            );

            return;
        }


        // Validate file

        if (!file) {
            showMessage(
                'error',
                'Please select an image or GIF.'
            );

            return;
        }


        // Create FormData

        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('media', file);


        // Disable button

        uploadBtn
            .prop('disabled', true)
            .text('Uploading...');


        hideMessage();


        // ============================================
        // jQuery AJAX Upload
        // ============================================

        $.ajax({

            url: MEDIA_API_URL,

            method: 'POST',

            data: formData,

            processData: false,

            contentType: false,

            success: function (response) {

                console.log('Upload response:', response);


                showMessage(
                    'success',
                    response.message || 'Media uploaded successfully.'
                );


                // Reset form

                uploadForm[0].reset();


                // Reload gallery

                loadMedia();

            },

            error: function (xhr) {

                console.error('Upload error:', xhr);


                let message = 'Failed to upload media.';


                if (
                    xhr.responseJSON &&
                    xhr.responseJSON.message
                ) {
                    message = xhr.responseJSON.message;
                }


                showMessage(
                    'error',
                    message
                );

            },

            complete: function () {

                uploadBtn
                    .prop('disabled', false)
                    .text('Upload Media');

            }

        });

    });


    // ============================================
    // Load Media Button
    // ============================================

    loadMediaBtn.on('click', function () {

        loadMedia();

    });


    // ============================================
    // Get Media From Backend
    // ============================================

    function loadMedia() {

        showLoading();

        hideError();

        hideEmpty();


        $.ajax({

            url: MEDIA_API_URL,

            method: 'GET',

            dataType: 'json',

            success: function (response) {

                console.log('Media response:', response);


                hideLoading();


                if (
                    !response.success ||
                    !response.media ||
                    response.media.length === 0
                ) {

                    showEmpty();

                    updateMediaCount(0);

                    return;
                }


                updateMediaCount(response.media.length);

                renderGallery(response.media);

            },

            error: function (xhr) {

                console.error('Get media error:', xhr);


                hideLoading();


                let message = 'Unable to load media.';


                if (
                    xhr.responseJSON &&
                    xhr.responseJSON.message
                ) {
                    message = xhr.responseJSON.message;
                }


                showError(message);

            }

        });

    }


    // ============================================
    // Render Gallery
    // ============================================

    function renderGallery(mediaList) {

        gallery.empty();


        $.each(mediaList, function (index, media) {

            const card = createMediaCard(media);

            gallery.append(card);

        });

    }


    // ============================================
    // Create Media Card
    // ============================================

    function createMediaCard(media) {

        const description = media.description
            ? escapeHtml(media.description)
            : 'No description available.';


        const title = escapeHtml(media.title);

        const fileName = escapeHtml(media.file_name);


        const card = $(`
            <article class="media-card">

                <div class="media-image-wrapper">

                    <img
                        src="${media.url}"
                        alt="${title}"
                        class="media-image"
                    >

                    <span class="media-badge">
                        ${media.media_type.toUpperCase()}
                    </span>

                </div>

                <div class="media-content">

                    <h3>${title}</h3>

                    <p class="media-description">
                        ${description}
                    </p>

                    <div class="media-meta">

                        <span>
                            ${fileName}
                        </span>

                        <span>
                            ${formatFileSize(media.file_size)}
                        </span>

                    </div>

                </div>

            </article>
        `);


        return card;

    }


    // ============================================
    // Loading State
    // ============================================

    function showLoading() {

        loadingState.show();

        gallery.empty();

    }


    function hideLoading() {

        loadingState.hide();

    }


    // ============================================
    // Empty State
    // ============================================

    function showEmpty() {

        emptyState.show();

        gallery.empty();

    }


    function hideEmpty() {

        emptyState.hide();

    }


    // ============================================
    // Error State
    // ============================================

    function showError(message) {

        errorMessage.text(message);

        errorState.show();

        gallery.empty();

    }


    function hideError() {

        errorState.hide();

    }


    // ============================================
    // Upload Message
    // ============================================

    function showMessage(type, message) {

        uploadMessage
            .removeClass('success error')
            .addClass(type)
            .text(message)
            .show();

    }


    function hideMessage() {

        uploadMessage.hide();

    }


    // ============================================
    // Media Count
    // ============================================

    function updateMediaCount(count) {

        mediaCount.text(
            `${count} ${count === 1 ? 'item' : 'items'}`
        );

    }


    // ============================================
    // File Size Formatter
    // ============================================

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return '0 Bytes';
        }


        const units = [
            'Bytes',
            'KB',
            'MB',
            'GB'
        ];


        const index = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );


        return `${(
            bytes / Math.pow(1024, index)
        ).toFixed(2)} ${units[index]}`;

    }


    // ============================================
    // HTML Escape
    // ============================================

    function escapeHtml(value) {

        return $('<div>')
            .text(value)
            .html();

    }


    // ============================================
    // Initial Gallery Load
    // ============================================

    loadMedia();

});