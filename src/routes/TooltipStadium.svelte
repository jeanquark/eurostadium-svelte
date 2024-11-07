<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { base } from "$app/paths";
    import { browser } from "$app/environment";
    import Carousel from "./components/Carousel.svelte";
    import SvelteCarousel from "svelte-carousel";
    import { stadiumStore } from "../store/stadium";

    // export let data;
    // export let countrySlug;
    // export let left;
    // export let top;
    // export let tooltipWidth;
    let { data, countrySlug, left, top, tooltipWidth = $bindable() } = $props();

    const dispatch = createEventDispatcher();

    onMount(async () => {
        try {
            console.log("[TooltipStadium] onMount");
            // items = data[0]['images']
            console.log("data: ", data);
            // for (let i = 0; i < data[0]['images'].length; i++) {
            //     items2.push(data[0]['images'][i])
            // }
            // console.log('items: ', items);
            // await stadiumStore.fetchStadiumsByCountrySlug(countrySlug)
        } catch (error) {
            console.log("error: ", error);
        }
    });

    // export let left
    // export let top
    let isHovered = false;
    let x;
    let y;
    // let tooltipWidth;
    let imageIndex = 0;
    let items = [
        { label: "one", color: "red", img: "https://placekitten.com/400/400" },
        {
            label: "two",
            color: "green",
            img: "https://placekitten.com/200/200",
        },
        {
            label: "three",
            color: "blue",
            img: "/images/stadiums/germany/20732.jpg",
        },
        {
            label: "four",
            color: "orange",
            img: "/images/stadiums/germany/20732_1.jpg",
        },
        { label: "five", color: "yellow" },
        { label: "six", color: "pink" },
        { label: "seven", color: "white" },
        { label: "eight", color: "purple" },
    ];
    let items2 = [];
    let current = 0;
    let show = 1;
    let carousel;
    // let carousel = $state(null);
    let loaded = $state([0, 1]);
    // let loaded = [0, 1];
    let images = [
        {
            id: 1,
            src: "/images/switzerland/1530_001.jpg",
        },
        {
            id: 2,
            src: "/images/switzerland/1533_001.jpg",
        },
        {
            id: 3,
            src: "/images/switzerland/1535_001.jpg",
        },
        {
            id: 4,
            src: "/images/switzerland/1538_001.jpg",
        },
        {
            id: 5,
            src: "/images/switzerland/1541_011.jpg",
        },
    ];

    // Methods
    function mouseOver(e) {
        console.log("mouseOver: ", e);
        const path = e.target;
        console.log("path: ", path);
        isHovered = true;
        x = e.pageX + 5;
        y = e.pageY + 5;
    }
    function mouseMove(e) {
        console.log("mouseMove: ", e);
        x = e.pageX + 5;
        y = e.pageY + 5;
    }
    function mouseLeave() {
        console.log("mouseLeave");
        isHovered = false;
    }
    const formatNumber = (number) => {
        if (number) {
            return number
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }
        return;
    };
    const handleMouseOverTooltip = () => {
        // console.log('[TooltipStadium] handleMouseOver');
        // dispatch('tooltipHover')
    };
    const handleMouseOutTooltip = (e) => {
        return;
        console.log(
            "[TooltipStadium] handleMouseOutTooltip e.target: ",
            e.target,
        );
        console.log(
            "[TooltipStadium] handleMouseOutTooltip e.relatedTarget: ",
            e.relatedTarget,
        );
    };
    const handleMouseEnter = () => {
        console.log("[TooltipStadium] handleMouseEnter");
    };
    const handleMouseLeave = (e) => {
        console.log("[TooltipStadium] handleMouseLeave e.target:", e.target);

        dispatch("tooltipLeave");
    };
    const handleTooltipClose = () => {
        console.log("handleTooltipClose");
        dispatch("tooltipClose");
    };
    const handleOpenModal = () => {
        console.log("handleOpenModal");
        // dispatch('modalOpen')
    };
    const handlePreviousClick = () => {
        carousel.goToPrev();
    };
    const handleNextClick = () => {
        console.log("handleNextClick");
        console.log("carousel: ", carousel);
        carousel.goToNext();
    };

    const onPageChange = (event) => {
        console.log("onPageChange event: ", event);
        if (!loaded.includes(event.detail + 1)) {
            loaded.push(event.detail + 1);
            // console.log('loaded: ', loaded);
        }
    };
    // const clientX = e.clientX
    // const offsetWidth = document.getElementById('svgWrapper').offsetWidth
    // const rect = e.target.getBoundingClientRect()
    // const tooltip = document.getElementById('tooltip')
    // const tooltipRect = tooltip.getBoundingClientRect()

    // tooltip.style.top = '50%'
    // tooltip.style.transform = 'translateY(-50%)'
</script>

<div
    class="text-center tooltip"
    style="left: {left}px; top: {top}px; z-index: 1000;"
    bind:clientWidth={tooltipWidth}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:focus={() => {}}
    role="presentation"
    on:mouseover={handleMouseOverTooltip}
    on:mouseout={handleMouseOutTooltip}
    on:blur={() => {}}
>
    <div class="row align-center">
        <div class="col-12 text-center relative">
            <h2>
                <span class="text-primary"><b>{data?.stadium?.name}</b></span>,
                <span class="text-muted">{data?.stadium?.city}</span>
            </h2>
            <h3 class="">
                {formatNumber(data?.stadium?.capacity)}
            </h3>
            <button
                type="button"
                on:click={handleTooltipClose}
                class="tooltip-close-btn"
            >
                <img
                    src="{base}/images/icons/close.svg"
                    width="20"
                    class="text-right"
                    alt="close button"
                    style=""
                />
            </button>
        </div>
    </div>
    <div class="row align-center">
        <!-- <div class="col-1 text-center border-1" style="overflow: hidden;">
            <img
                src="{base}/images/angle-left-solid.svg"
                width="100%"
                alt="left"
            />
        </div> -->
        <div class="col-12 text-center">
            <!-- data[0][images].length: {data[0]['images'].length}<br /> -->
            <!-- data[0][images]: {data[0]["images"][0]["name"]}<br /> -->
            imageIndex: {imageIndex}<br />
            items.length: {items.length}<br />
            current: {current}<br />
            countrySlug: {countrySlug}<br />
            data: {data}<br />
            tooltipWidth: {tooltipWidth}<br />
            top: {top}<br />
            left: {left}<br />
            data.images.length: {data?.images?.length}<br />
            loaded: {loaded}<br />
            <!-- {#each data.images.sort((a, b) => b.name - a.name) as img, i}
                i: {i}<br />
                img.name: {img.name}<br />
            {/each} -->
            <!-- stadium: {stadium}<br /> -->
            <div style="width:100%; height: 300px; border: 2px dashed red;">
                <!-- <Carousel bind:current {items} let:item bind:show>
                    <div
                        class="item"
                        style="background-color:{item.color};background-image:{item.img
                            ? `url(${item.img})`
                            : ''}; background-size: cover;"
                    >
                        {item.label}
                    </div>
                </Carousel> -->
                <!-- <Carousel items={data.images} let:item bind:current bind:show>
                    <div
                        class="item"
                        style="background-image: url({base}/images/stadiums/{countrySlug}/{item.name}); background-size: contain; background-repeat: no-repeat; background-position: center center;"
                    >
                        {item.name}
                    </div>
                </Carousel> -->
                <!-- <Carousel items={data.images} let:item bind:current bind:show>
                    <div
                        class="item"
                        style="background-image: url({item.url}); background-size: contain; background-repeat: no-repeat; background-position: center center;"
                    >
                        {item.name}
                    </div>
                </Carousel> -->
                {#if browser}
                    <SvelteCarousel
                        autoplay
                        autoplayDuration={1000}
                        pauseOnFocus={true}
                        bind:this={carousel}
                        on:pageChange={onPageChange}
                    >
                        {#each data.images as image, imageIndex}
                            <div class="img-container">
                                {#if loaded.includes(imageIndex)}
                                    {image.name}<br />
                                    <!-- {image.url}<br /> -->
                                    <!-- <img
                                        src={image.url}
                                        alt="stadium"
                                        width="100%"
                                        height="100%"
                                        style=""
                                    /> -->
                                    <img
                                        src={image.url}
                                        alt="stadium"
                                        width="100%"
                                        height="100%"
                                        style=""
                                    />
                                {/if}
                            </div>
                        {/each}
                    </SvelteCarousel>
                {/if}
            </div>
            <div class="d-flex justify-center">
                {#each data.images as image, i}
                    <!-- <span
                        role="button"
                        tabindex="0"
                        on:keydown={() => {}}
                        class="carousel-navigation-item"
                        on:click={() => (current = i)}
                    >
                        <svg
                            viewBox="0 0 512 512"
                            width="12"
                            version="1.1"
                            id="ring"
                        >
                            <ellipse
                                style="fill:#325bad;"
                                id="outerRing"
                                cx="256"
                                cy="256"
                                rx="256"
                                ry="256"
                            />
                            <ellipse
                                style="fill:#fff;"
                                class={current == i && "active-item"}
                                id="innerRing"
                                cx="256"
                                cy="256"
                                rx="202"
                                ry="202"
                            />
                        </svg>
                    </span> -->
                {/each}
            </div>
        </div>
        <!-- <div class="col-1 border-2" style="overflow: hidden;">
            <button type="button" on:click={() => (imageIndex += 1)}
                ><img
                    src="{base}/images/angle-right-solid.svg"
                    alt="right"
                /></button
            >
        </div> -->
    </div>
    <div class="row align-center">
        <div class="col-4 text-center" style="">
            <!-- <h3 class="text-center">{data.stadium?.name}</h3> -->
            <!-- <img
                src="{base}/images/teams/{countrySlug}/{data[0]['team'][
                    'api_football_id'
                ]}.png"
                width="40%"
                alt="Team logo"
            /> -->
        </div>
        <!-- {#if data[1]}
            <div class="col-4 text-center border-1" style="">
                <h3 class="text-center">{data[1].team?.name}</h3>
                <img
                    src="{base}/images/teams/{countrySlug}/{data[1]['team'][
                        'api_football_id'
                    ]}.png"
                    width="50%"
                    alt="Team logo"
                />
            </div>
        {/if} -->
        <div class="col-4 text-center" style="">
            <!-- <a href={base / data[0]["venue"]["url"]} target="_blank">
                Wiki
                <img
                    src="{base}/images/icons/external-link.svg"
                    width="10"
                    alt="Wikipedia icon"
                />
            </a> -->
        </div>
    </div>
</div>

<style>
    .img-container {
        border: 2px dashed blue;
        height: 300px;
        /* height: 100%; */
        /* vertical-align: bottom; */
    }
    .tooltip {
        width: 400px;
        /* height: 100px; */
        border: 2px solid green;
        border-radius: 6px;
        background: white;
        padding: 10px;
        position: absolute;
        /* left: 0px; */
        /* top: 400px; */
        top: 50%;
        transform: translateY(-50%);
    }

    .tooltip-close-btn {
        position: absolute;
        top: 0;
        right: 0;
    }
    .tooltip-close-btn:hover {
        color: orange;
        cursor: pointer;
    }
    .tooltip .image:hover {
        cursor: pointer;
    }
    .carousel-navigation-item {
        display: inline;
    }
    .carousel-navigation-item:hover {
        cursor: pointer;
    }
    /* .carousel-navigation-item:hover #ring #innerRing{
        fill: #325bad;
    } */
    .active-item {
        fill: #325bad !important;
    }
</style>
