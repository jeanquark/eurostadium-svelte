<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    // Stores the selected file and image preview URL
    let selectedFile = null;
    let previewUrl = "";

    async function getImages(event) {
        try {
            const response = await fetch(
                "https://ybfeookvrzkbcgobnzez.supabase.co/functions/v1/upload-image2",
            );
            console.log("response: ", response);
            const data = await response.json();
            console.log("data: ", data);
        } catch (error) {
            console.log("error: ", error);
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
        console.log('formData.get(image): ', formData.get('image'));
        const fileName = `${Date.now()}-${selectedFile.name}`;
        // return
        const image = formData.get('image')

        const { data: { session } } = await supabase.auth.getSession()
        // console.log('session: ', session);
        const accessToken = session?.access_token
        // console.log('accessToken: ', accessToken);
        // return

        try {
            // 1) Upload image directly from browser

            // const { data: data1, error: error1 } = await supabase.storage
            //     .from("image_uploads")
            //     .upload(fileName, image, {
            //         cacheControl: "3600",
            //         contentType: image.type,
            //         upsert: false,
            //     });
            // if (error1) throw error1;

            // return;

            // 2) Upload image through Edge function
            const response = await fetch(
                "https://ybfeookvrzkbcgobnzez.supabase.co/functions/v1/upload-image2",
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData,
                },
            );

            if (response.ok) {
                alert("Image uploaded successfully!");
                console.log('response: ', response);
                // Clear the form or handle success as needed
                selectedFile = null;
                previewUrl = "";
            } else {
                console.log("response: ", response);
                alert("Image upload failed.");
            }
        } catch (error) {
            console.error(error);
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
    <div class="text-center my-4">
        <a href="{base}/">&larr;Home</a>
    </div>
    <form on:submit={handleSubmit}>
        <label>
            Select an image to upload:
            <input type="file" accept="image/*" on:change={handleFileChange} />
        </label>

        {#if previewUrl}
            <img src={previewUrl} alt="Preview" class="preview" />
        {/if}

        <button type="submit">Upload Image</button>
    </form>
    <br /><br />
    <button on:click={() => getImages()}>Get images</button>
</div>

<style>
    .preview {
        margin-top: 10px;
        /* max-width: 100%; */
        width: 200px;
        height: auto;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
</style>
