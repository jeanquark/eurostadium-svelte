<script>
    // Stores the selected file and image preview URL
    let selectedFile = null;
    let previewUrl = "";

    async function getImages(event) {
        try {
            const response = await fetch("https://ybfeookvrzkbcgobnzez.supabase.co/functions/v1/upload-image");
            console.log('response: ', response);
            const data = await response.json()
            console.log('data: ', data);
        } catch (error) {
            console.log('error: ', error);
        }
    }

    // Function to handle file selection
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            selectedFile = file;
            // Create a URL for the image preview
            previewUrl = URL.createObjectURL(file);
        }
    }

    // Function to submit the file (to be customized for your backend)
    async function handleSubmit(event) {
        event.preventDefault();

        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        

        try {
            const response = await fetch("https://ybfeookvrzkbcgobnzez.supabase.co/functions/v1/upload-image", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Image uploaded successfully!");
                // Clear the form or handle success as needed
                selectedFile = null;
                previewUrl = "";
            } else {
                alert("Image upload failed.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("An error occurred during upload.");
        }
    }
</script>

<svelte:head>
    <title>Upload image</title>
    <meta name="description" content="Upload an image" />
</svelte:head>

<div class="container">
    <h2 class="text-center">Upload image</h2>
    <form on:submit={handleSubmit}>
        <label>
            Select an image to upload:
            <input type="file" accept="image/*" on:change={handleFileChange} />
        </label>

        {#if previewUrl}
            <img src={previewUrl} alt="Image Preview" class="preview" />
        {/if}

        <button type="submit">Upload Image</button>
    </form>
    <br /><br />
    <button on:click={() => getImages()}>Get images</button>
</div>

<style>
    .preview {
        margin-top: 10px;
        max-width: 100%;
        height: auto;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
</style>
