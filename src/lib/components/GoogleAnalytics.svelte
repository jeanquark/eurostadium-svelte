<!-- src/lib/components/GoogleAnalytics.svelte -->
<script>
    import { browser } from '$app/environment'
    import { onMount } from 'svelte'

    // export let measurementId = ''

    let { measurementId } = $props();

    let isInitialized = false

    onMount(() => {
        // console.log('measurementId: ', measurementId);
        if (!browser || !measurementId || isInitialized) return

        // Load gtag script
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
        script.async = true
        document.head.appendChild(script)

        // Initialize gtag
        window.dataLayer = window.dataLayer || []
        function gtag() {
            dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', measurementId)

        isInitialized = true
    })
</script>

<!-- No DOM output needed -->
