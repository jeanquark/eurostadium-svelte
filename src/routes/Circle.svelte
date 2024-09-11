<script>
    function handleMouseover (e) {
        console.log('handleMouseover: ', e)
    }
</script>

<svg viewbox="0 0 200 200">
	<circle cx="100" cy="100" r="20" on:mouseover={handleMouseover} role="presentation" on:focus={() => {}}/>
</svg>