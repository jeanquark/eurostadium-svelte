<script>
    export let data
    // export let left
    // export let top
    let isHovered = false
    let x
    let y

    function mouseOver(e) {
        console.log('mouseOver: ', e)
        const path = e.target
        console.log('path: ', path)
        isHovered = true
        x = e.pageX + 5
        y = e.pageY + 5
    }
    function mouseMove(e) {
        console.log('mouseMove: ', e)
        x = e.pageX + 5
        y = e.pageY + 5
    }
    function mouseLeave() {
        console.log('mouseLeave')
        isHovered = false
    }
    // const clientX = e.clientX
    // const offsetWidth = document.getElementById('svgWrapper').offsetWidth
    // const rect = e.target.getBoundingClientRect()
    // const tooltip = document.getElementById('tooltip')
    // const tooltipRect = tooltip.getBoundingClientRect()
    
    // tooltip.style.top = '50%'
    // tooltip.style.transform = 'translateY(-50%)'
</script>

<!-- <div on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove} role="tooltip" on:focus={() => {}}>
    <slot />
</div>

{#if isHovered}
<div style="top: {y}px; left: {x}px;" class="tooltip">
    {title}
</div>
{/if} -->

<div class="tooltip" style="top: 50%; transform: translateY(50%); left: 0px;">
    {data[0]?.venue?.name}, {data[0]?.venue?.city}
</div>

<style>
    .tooltip {
        width: 200px;
        height: 100px;
        border: 1px solid green;
        background: white;
        padding: 4px;
        position: absolute;
    }
</style>
