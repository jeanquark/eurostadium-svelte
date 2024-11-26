<script>
    import { spring } from "svelte/motion";
    export let items; //required
    export let current = 0;
    export let cache = 1;
    export let show = 2;

    //Currently displayed item
    let i = spring(0, { precision: 0.001 });

    //Drag state
    let dragging = false;
    let i_start = null;
    let drag_start = null;

    //Container width
    let width = null;

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    //When current changes, and if not dragging, spring to it
    function calc_new(v, current) {
        v = Math.round(v);
        let diff = mod(current - v, items.length);
        if (diff < items.length / 2) {
            return v + diff;
        } else {
            return v + diff - items.length;
        }
    }
    $: {
        if (!dragging) {
            i.stiffness = 0.2;
            i.damping = 1;
            i.update((v) => calc_new(v, current), { soft: 0.3 });
        }
    }

    //On mousedown, capture mouse
    function mousedown(e) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        dragging = true;
        drag_start = [e.screenX, e.screenY];
        i_start = $i;
    }

    //On mousemove, force spring to move to new position (don't use {hard:true} or stiffness=1, otherwise we lose
    //velocity that we need for it moving nicely on release)
    function mousemove(e) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        if (!dragging) return;
        let drag_current = [e.screenX, e.screenY];
        i.stiffness = 0.999;
        i.set(i_start + (drag_start[0] - drag_current[0]) / (width / show));
    }

    //On mouseup, set new current (rounding up or down depending on drag direction)
    function mouseup(e) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        if (!dragging) return;
        dragging = false;
        let drag_current = [e.screenX, e.screenY];
        let diff = (drag_current[0] - drag_start[0]) / (width / show);
        if (diff > 0.1) {
            current = mod(Math.floor(current - diff), items.length);
        } else if (diff < -0.1) {
            current = mod(Math.ceil(current - diff), items.length);
        }
    }

    //Item is visible if it is at least partially on-screen
    function item_visible(diff, show) {
        diff = mod(diff, items.length);
        return diff < show + cache || diff > items.length - (1 + cache);
    }

    //Item position wraps around if needed
    function item_pos(diff) {
        diff = mod(diff, items.length);
        if (diff > items.length / 2) {
            diff -= items.length;
        }
        return diff;
    }

    function item_style(diff) {
        diff = mod(diff, items.length);
        if (diff > items.length / 2) {
            diff -= items.length;
        }

        return `transform:translateX(${100 * diff * show}%);width:${100 / show}%;`; //normal

        //let gap = 10;
        //return `transform:translateX(${(100+gap)*diff}%);width:${100/show}%;`; //normal, with gap

        //let margin = 10;
        //return `left:${margin}%;transform:translateX(${100*diff}%);width:${100-margin*2}%;`; //normal, with margin

        //return `transform:translateX(${100*diff*1}%) rotateY(${-diff*45}deg);width:${100/show}%;`; //cover flow

        //return `transform:translateX(${100*diff}%) scale(${1-Math.abs(diff)/2});width:${100/show}%;`; //normal, with zoom
    }
</script>

<div
    class="container"
    on:mousedown={mousedown}
    on:touchstart={mousedown}
    bind:clientWidth={width}
    role="button"
    tabindex="0"
>
    <!-- {#each items as item, i2}
        {#if item_visible(i2 - $i, show)}
            <div
                class="item"
                style={item_style(item_pos(i2 - $i) * (1 / show))}
            >
                <slot {item} selected={i == current}></slot>
            </div>
        {/if}
    {/each} -->
    {#each items as item, i2}
        <div class="item" style={item_style(item_pos(i2 - $i) * (1 / show))}>
            <slot {item} selected={i == current}></slot>
        </div>
    {/each}
</div>

<svelte:window
    on:mousemove={mousemove}
    on:touchmove={mousemove}
    on:mouseup={mouseup}
    on:touchend={mouseup}
/>

<style>
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;

        perspective: 500px;
    }
    .item {
        width: 100%;
        height: 100%;
        position: absolute;
        user-select: none;
    }
    :global(.item > *) {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
