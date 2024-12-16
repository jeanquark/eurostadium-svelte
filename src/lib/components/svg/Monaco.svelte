<script>
    import { onMount } from "svelte";
    import panzoom from "@panzoom/panzoom";
    import addStadiumsToSvgMap from "@utils/addStadiumsToSvgMap";
    let {
        clickOutsideCountry,
        stadiumHover,
        stadiumLeave,
        countryObj,
        stadiumsArray,
    } = $props();
    let radius = $state(10);
    let stadiumObj = $state(null);
    let panzoomRef = $state(null);
    let flag = $state(1);

    onMount(() => {
        console.log("[Albania] onMount");
    });

    const initPanzoom = (node) => {
        node.addEventListener("panzoompan", (event) => {
            console.log("panzoompan: ", event.detail);
            if (event.detail.x != 0 || event.detail.y != 0) {
                flag = 0;
            }
        });
        node.addEventListener("panzoomzoom", (event) => {
            // console.log('panzoomzoom scale: ', event.detail?.scale)
            const scale = event.detail ? event.detail.scale : 10;
            const stadiumElement = document.getElementById("stadiums");
            if (!stadiumElement) {
                return;
            }
            const stadiums = stadiumElement.children;
            for (let i = 0; i < stadiums.length; i++) {
                stadiums[i].setAttribute("r", radius / scale);
            }
        });

        node.addEventListener("click", (event) => {
            if (flag == 1) {
                handleClick(event);
            } else {
                console.log("no click");
            }
            flag = 1;
        });
        panzoomRef = panzoom(node, {
            isSvg: true,
            cursor: "normal",
            disableZoom: false,
            maxScale: 8,
            minScale: 1,
            touchAction: "none",
            contain: "outside",
            panOnlyWhenZoomed: false,
            handleStartEvent: (event) => {
                event.preventDefault();
                event.stopPropagation();
            },
        });
        const zoom = (e) => {
            panzoomRef.zoomWithWheel(e);
        };
        node.addEventListener("wheel", zoom);
    };

    const handleClick = (e) => {
        console.log("[Monaco] handleClick");
        // console.log('e.target: ', e.target);
        if (e.target.classList.contains("stadium")) {
            console.log("Click on stadium");
        }
        if (e.target.classList.contains("rectangle")) {
            console.log("Click on rectangle");
            panzoomRef.destroy();
            // dispatch("clickOutsideCountry");
            clickOutsideCountry();
        }
    };
    const handleMouseOverCircle = (e) => {
        console.log("[Albania] handleMouseOverCircle e.target: ", e.target);
        if (e.target.classList.contains("stadium")) {
            console.log("Click on stadium");
        }
        const stadiumId = parseInt(
            e.target.getAttribute("data-api-football-stadium-id"),
        );
        // console.log('stadiumId: ', stadiumId)
        const data = {
            stadiumId: stadiumId,
            clientX: e.clientX,
            clientY: e.clientY,
            rect: e.target.getBoundingClientRect(),
        };
        document.querySelectorAll(".stadium").forEach((element) => {
            element.classList.remove("hover");
        });
        e.target.classList.add("hover");
        stadiumHover(data);
    };
    const handleMouseOutCircle = (e) => {
        console.log("[Albania] handleMouseOutCircle e.target: ", e.target);
        if (!e.relatedTarget?.classList?.contains("tooltip")) {
            e.target.classList.remove("hover");
            stadiumLeave();
        }
    };
    const a = (node) => {
        stadiumObj = node;
        $effect(() => {
            return () => {};
        });
    };
    $effect(() => {
        addStadiumsToSvgMap(stadiumObj, stadiumsArray, countryObj.leagues);
    });
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    id="map-albania"
    viewBox="0 0 1000 1000"
    width="100%"
    class=""
    use:initPanzoom
>
    <defs id="defs4">
        <style type="text/css" id="style2">
            .land {
                fill: #f7b7b7;
                fill-opacity: 1;
                stroke: white;
                stroke-opacity: 1;
                stroke-width: 0.5;
            }
            .rectangle:hover {
                fill: #bdbdbd;
                cursor: pointer;
            }
            #stadiums:focus {
                outline: none;
            }
            .hover {
                fill: #ffffff !important;
            }
            .test {
                border: 2px solid red;
            }
        </style>
        <!-- https://www.amcharts.com/svg-maps/ -->
        <!-- <amcharts:ammap
       projection="mercator"
       leftLongitude="7.3991049"
       topLatitude="43.7519029"
       rightLongitude="7.4398113"
       bottomLatitude="43.7247427" /> -->
        <!-- All areas are listed in the line below. You can use this list in your script. -->
        <!--{id:"MC"}-->
    </defs>
    <rect
        id="background"
        class="rectangle"
        stroke-width="0"
        stroke="#000"
        width="1000"
        height="1000"
        x="0"
        y="0"
        fill="#d3d3d3"
    />
    <g>
        <path
            d="m 831.35958,0.9989743 18.20307,26.6548517 -42.93427,44.63281 -108.09284,41.368744 -33.67413,-5.77096 -49.18614,90.21721 -19.40022,96.51001 -57.92443,76.08656 -36.53914,37.29632 -40.65248,-31.10585 -19.90161,10.77449 -42.22825,63.15307 -211.74493,184.68078 6.53838,109.59698 -62.70286,21.49783 -40.294357,56.15425 252.213227,177.12941 144.90826,-117.79294 -42.19754,15.60409 -22.59268,-48.07083 -59.20344,6.93742 -1.26879,-16.23848 -16.22826,0.94137 -2.43526,-34.46202 14.41716,-4.86028 -41.92128,-5.90398 30.77842,-23.47265 44.1212,38.92326 34.9634,-10.35498 30.99329,62.53913 -0.64463,-34.78944 38.07398,-0.30696 91.06648,-66.86735 15.7678,-57.88351 101.58517,-132.29196 -81.11056,84.47694 -46.08577,-31.23886 10.48799,49.26799 -82.13377,23.85124 -1.3302,-28.23061 -13.90554,2.40456 12.88232,26.47067 -20.03463,5.71979 -31.02398,-46.65878 -1.82135,-17.63006 10.19126,17.74262 9.12712,-21.42621 7.57182,19.57418 -9.19873,-48.12199 -0.43998,20.99646 -15.87013,-16.49429 -3.57104,20.33136 -10.52891,-60.12435 76.85396,-22.51081 18.71468,1.39157 4.34868,21.89689 -3.55057,-26.02046 28.37385,-3.74498 17.09799,51.47814 -7.16253,-49.50333 52.94135,-15.00038 25.76464,40.34552 -17.88586,-43.73238 30.66587,-66.31481 -1.146,-56.28727 79.2176,-143.62924 -17.91656,1.33018 5.23888,-33.44903 24.63912,-12.207 9.26012,11.78749 -9.12711,-14.19205 24.83353,-26.1944 22.6336,0.78787 -6.24165,16.76034 11.57262,-0.63441 16.26917,-46.68947 35.64895,49.92285 51.08932,-10.27312 -13.37347,-91.2302 -25.92836,-17.783541 6.17,-66.12041 z"
            class="land"
            title="Monaco"
            id="MC"
            style=""
        />
    </g>
    <!-- Triadic colors: -->
    <!-- https://www.color-hex.com/color/f7b7b7 -->
    <g
        id="stadiums"
        data-country="monaco"
        data-circle-radius={radius}
        data-circle-colors="#b7b7f7,#b7f7b7"
        onmouseover={handleMouseOverCircle}
        onmouseout={handleMouseOutCircle}
        onfocus={() => {}}
        role="presentation"
        onblur={() => {}}
        use:a
    ></g>
    >
</svg>
