<script>
    export let title = '';
    let isHovered = false;
    let x;
    let y;

    function mouseOver(e) {
        console.log('mouseOver: ', e)
        const path = e.target
        console.log('path: ', path)
        isHovered = true;
        x = e.pageX + 5;
        y = e.pageY + 5
    }
    function mouseMove(e) {
        console.log('mouseMove: ', e)
        x = e.pageX + 5;
        y = e.pageY + 5;
    }
    function mouseLeave() {
        console.log('mouseLeave')
        isHovered = false;
    }
</script>

<div on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove} role="tooltip" on:focus={() => {}}>
    <slot />
</div>

{#if isHovered}
<div style="top: {y}px; left: {x}px;" class="tooltip">
    {title}
</div>
{/if}

<style>
    .tooltip {
        border: 1px solid black;
        background: white;
        padding: 4px;
        position: absolute;
    }
</style>