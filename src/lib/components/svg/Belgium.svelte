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
    let radius = $state(12);
    let stadiumObj = $state(null);
    let stadiumObjLargeDisc = $state(null);
    let panzoomRef = $state(null);
    let flag = $state(1);

    onMount(() => {
        console.log("[Belgium] onMount");
        if (hasSmallScreen()) {
            radius = 20;
        }
    });

    const initPanzoom = (node) => {
        node.addEventListener("panzoompan", (event) => {
            if (event.detail.x != 0 || event.detail.y != 0) {
                flag = 0;
            }
        });
        node.addEventListener("panzoomzoom", (event) => {
            const scale = event.detail ? event.detail.scale : 10;
            const stadiumElement = document.getElementById("stadiums");
            const stadiumElementLargeDisc =
                document.getElementById("stadiumsLargeDisc");
            if (!stadiumElement) {
                return;
            }
            const stadiums = stadiumElement.children;
            const stadiumsLargeDisc = stadiumElementLargeDisc.children;
            for (let i = 0; i < stadiums.length; i++) {
                stadiums[i].setAttribute("r", radius / (scale ^ (1 / 2)));
            }
            for (let i = 0; i < stadiumsLargeDisc.length; i++) {
                stadiumsLargeDisc[i].setAttribute(
                    "r",
                    (radius * 2) / (scale ^ (1 / 2)),
                );
            }
        });

        node.addEventListener("click", (event) => {
            if (event.target.classList.contains("rectangle")) {
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
        if (e.target.classList.contains("stadium")) {
            console.log("Click on stadium");
        }
        if (e.target.classList.contains("rectangle")) {
            console.log("Click on rectangle");
            panzoomRef.destroy();
            clickOutsideCountry();
        }
    };
    const handleMouseOverCircle = (e) => {
        if (e.target.classList.contains("stadium")) {
            console.log("Click on stadium");
        }
        const stadiumId = parseInt(
            e.target.getAttribute("data-api-football-stadium-id"),
        );
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
        if (!e.relatedTarget?.classList?.contains("tooltip")) {
            e.target.classList.remove("hover");
            stadiumLeave();
        }
    };
    const handleTouchStartCircle = (e) => {
        if (e.target.classList.contains("stadium")) {
            console.log("Touch on stadium");
        }
        const stadiumId = parseInt(
            e.target.getAttribute("data-api-football-stadium-id"),
        );
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
    const handleTouchEndCircle = (e) => {};
    const a = (node) => {
        stadiumObj = node;
        $effect(() => {
            return () => {};
        });
    };
    const b = (node) => {
        stadiumObjLargeDisc = node;
        $effect(() => {
            return () => {};
        });
    };

    const hasSmallScreen = () => {
        const minWidth = 1024;
        if (window.innerWidth < minWidth || screen.width < minWidth) {
            return true;
        }
        return false;
    };

    $effect(() => {
        addStadiumsToSvgMap(stadiumObj, stadiumsArray, countryObj.leagues);
        if (hasSmallScreen()) {
            addStadiumsToSvgMap(
                stadiumObjLargeDisc,
                stadiumsArray,
                countryObj.leagues,
            );
        }
    });
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    id="map-belgium"
    viewBox="0 0 1000 1000"
    width="100%"
    class=""
    use:initPanzoom
>
    <defs id="defs4">
        <style type="text/css" id="style2">
            .land {
                fill: #83c442;
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
            .test {
                border: 2px solid red;
            }
        </style>
        <!-- <amcharts:ammap projection="mercator" leftLongitude="2.543698" topLatitude="51.499939" rightLongitude="6.408540" bottomLatitude="49.497691"></amcharts:ammap> -->
        <!-- All areas are listed in the line below. You can use this list in your script. -->
        <!--{id:"BE-VAN"},{id:"BE-BWR"},{id:"BE-BRU"},{id:"BE-WHT"},{id:"BE-WLG"},{id:"BE-VLI"},{id:"BEW-LX"},{id:"BE-WNA"},{id:"BE-VOV"},{id:"BE-VBR"},{id:"BE-VWV"}-->
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
            d="m 579.65559,94.052261 14.7154,7.949239 1.72809,24.0471 -19.11538,3.13717 29.60358,-1.15652 8.29486,9.79698 28.12805,-37.858571 12.85437,6.167971 6.77944,16.2175 -8.42778,15.92505 16.27067,32.38184 27.33048,4.57281 -0.82416,17.89241 v 0 l -5.96859,16.80239 12.36254,28.6332 -64.53769,30.77338 -8.09545,16.5764 v 0 l -42.43137,9.63746 -6.72627,-11.39213 -24.43259,16.4036 -3.41632,-10.70087 -26.06762,13.89121 -48.55948,-1.80785 -3.82838,-14.30331 -36.30328,-2.83143 v 0 l -12.80118,-1.35588 -4.05438,-24.95102 35.94437,-10.23564 4.45316,-12.04349 -10.88701,-40.58363 8.29487,-12.32265 -21.80058,-28.47366 v 0 l -5.42356,-8.72025 55.67124,4.13413 -13.78488,-34.01687 24.51235,-12.96069 16.82898,-1.70153 -0.65136,24.2465 26.91839,0.15952 z"
            class="land"
            title="Antwerp"
            id="BE-VAN"
            style=""
        />
        <path
            d="m 402.73861,420.0905 14.19697,-9.7039 23.91416,16.82898 22.75768,-18.5305 9.87671,7.20482 31.18546,-15.96493 8.22841,11.32566 18.22474,-14.75525 10.06282,8.68035 2.16675,-23.03684 30.44106,-3.05741 42.65735,25.89484 14.6888,-10.96676 9.70392,8.06888 v 0 l -9.46465,44.13287 v 0 l -49.86217,21.3752 -32.83379,-6.58005 1.28942,16.32385 -17.62656,-1.16978 -5.9021,11.20601 v 0 l -28.75284,5.34381 0.79759,-12.37581 -14.94137,-2.63203 -20.65738,8.60059 -39.02835,-48.02772 -19.51418,11.96371 z"
            class="land"
            title="Walloon Brabant"
            id="BE-WBR"
            style=""
        />
        <path
            d="m 487.21584,341.70149 1.03686,0.77099 v 0 l 15.30027,42.5643 -27.2507,11.16614 -35.94437,-21.9468 13.67852,-26.34679 20.84348,-6.16797 v 0 0 0 l 11.51177,-1.8876 v 0 z"
            class="land"
            title="Brussels Capital Region"
            id="BE-BRU"
            style=""
        />
        <path
            d="m 237.1207,395.19265 44.11957,19.07549 12.25618,-20.9498 21.06946,-3.58912 4.26707,13.65194 31.31838,6.27431 v 0 l 4.13414,16.93533 48.45311,-6.51358 v 0 l 1.60845,30.14859 19.52747,-11.95043 39.01506,48.02772 20.65738,-8.60059 14.94137,2.64532 -0.79759,12.3758 28.75284,-5.35709 v 0 l -1.80787,40.6501 11.84411,6.80603 -6.04834,39.18788 -49.2108,6.22113 -29.84286,22.5184 29.19149,9.35829 -9.79696,25.69543 18.17157,90.88448 v 0 l -75.09234,-14.8749 4.67914,-27.60964 18.13169,-8.48094 -7.8163,-25.60238 -18.57036,-0.27917 20.68395,-55.84404 -11.95043,-6.89907 -6.38065,12.58849 -29.24468,-40.78302 -31.70388,12.93412 -39.97215,-9.78367 -10.23564,18.62353 -12.88095,-26.05433 0.41208,-35.08031 -13.46584,-15.96495 -27.92867,3.56253 4.70575,-14.71538 -11.40543,-3.89487 -25.52263,17.02839 -21.85375,-13.46584 -13.49242,-54.22228 5.5299,-17.74621 -21.49484,-22.23925 v 0 l 33.23259,0.23927 13.95769,18.66343 z m -154.39857,24.64529 -5.41027,-17.71961 30.79997,-9.62417 -6.12811,-8.08215 16.47007,-6.89909 4.81208,15.30028 v 0 l -20.55102,11.77763 -7.73655,20.93653 z"
            class="land"
            title="Hainaut"
            id="BE-WHT"
            style=""
        />
        <path
            d="m 814.78279,376.99449 -2.68521,21.86704 v 0 l 51.76308,19.88638 2.51238,-18.8761 v 0 l 33.17942,0.13292 5.06463,14.91479 19.96615,-1.43566 15.61931,39.06824 23.68819,-0.0399 -23.40904,34.20299 12.30935,18.98244 32.16915,2.6719 6.61993,21.3885 -9.10573,22.78426 17.06824,18.10511 -11.95043,12.60178 -13.95769,-6.02173 -7.032,20.83019 -26.75888,12.78789 3.74864,21.14923 -11.56493,2.93774 -1.67493,18.39756 -6.72629,-14.64893 -13.57219,5.26405 -9.41147,-12.14982 v 0 l -11.72443,-59.24707 -30.1752,-6.91238 -4.49304,26.81206 9.27853,0.61148 -19.00904,10.116 -21.64106,-2.858 -0.54501,-38.7226 -47.88151,-13.9577 -6.36735,-13.14681 -11.35225,7.12507 -12.28277,-8.98608 -6.95225,20.51114 v 0 l -24.8181,5.74259 -16.16433,-15.56613 -9.65074,-30.73351 -9.05255,4.21389 -5.66285,-17.83924 -27.38363,-8.30815 -13.3861,-44.43861 v 0 l 9.46465,-44.13287 v 0 l 20.84347,16.7891 v 0 l 16.77581,5.41027 2.37946,-11.60482 33.59148,3.13715 21.33534,-12.78789 7.96251,11.80421 15.20724,-1.95407 54.39509,-35.91779 v 0 z"
            class="land"
            title="Liege"
            id="BE-WLG"
            style=""
        />
        <path
            d="m 838.27158,394.58118 28.10146,5.30391 v 0 l -2.51238,18.86282 -51.76308,-19.88638 v 0 z m -64.33831,-208.62088 6.77946,22.86402 75.66395,32.04951 -34.57517,74.66697 9.46464,5.03806 -29.08516,32.10268 11.16613,24.25978 v 0 l -54.40837,35.91778 -15.20724,1.95407 -7.96251,-11.8175 -21.33534,12.78789 -33.59148,-3.11057 -2.37946,11.60482 -16.7891,-5.41027 v 0 l 21.99997,-79.25306 -24.4326,-2.20666 -12.53532,-13.7051 19.06219,-31.95646 10.7009,-1.47552 -10.42172,-10.50149 -15.48641,14.39634 -19.80661,-8.24167 v 0 l 8.09545,-16.57641 64.53769,-30.77338 -12.36254,-28.63319 5.96859,-16.8024 v 0 l 46.44585,-0.74442 17.73291,-15.71236 z"
            class="land"
            title="Limburg"
            id="BE-VLI"
            style=""
        />
        <path
            d="m 737.49709,553.14048 6.95225,-20.51114 12.28277,8.98608 11.35225,-7.12507 6.36735,13.14681 47.88151,13.9577 0.54501,38.7226 21.64106,2.858 19.00904,-10.116 -9.27853,-0.61148 4.49304,-26.81206 30.1752,6.91238 11.72443,59.24707 v 0 l -32.95342,28.64648 -20.16554,39.93228 4.50636,12.74801 -15.80543,8.06887 -10.44832,24.71175 12.6018,8.16192 -11.28579,17.12143 3.57583,18.06523 8.76011,-1.71479 9.75707,29.05857 15.22053,5.38367 -5.3172,12.94742 11.73775,5.06465 -17.94561,44.03982 -49.42349,0.5583 -9.92991,17.52022 -14.17036,-9.01267 -21.69424,12.74801 -11.16614,-38.98847 -20.81689,-13.89121 -9.05256,7.84289 4.53292,-17.04168 -14.35647,-15.34016 -28.39392,-0.31903 -18.66342,-27.71596 -32.46159,-15.4997 v 0 l 5.35709,-20.5776 33.84406,-27.78245 -37.92502,-42.41807 17.83925,-9.83684 6.18126,-27.8489 2.6586,11.97701 50.00839,-8.16191 -6.92565,-8.16193 9.98306,-10.34199 -19.03562,-22.83742 48.30689,-29.03199 -1.42238,-11.19273 -11.89725,0.53171 13.37279,-8.60058 z"
            class="land"
            title="Luxembourg"
            id="BE-WLX"
            style=""
        />
        <path
            d="m 526.44359,487.36654 5.9021,-11.20601 17.62656,1.16978 -1.28942,-16.32385 32.83379,6.58005 49.86217,-21.3752 v 0 l 13.3861,44.43861 27.38363,8.30815 5.66285,17.83925 9.05255,-4.21389 9.65074,30.73351 16.16433,15.56613 24.8181,-5.74259 v 0 l 0.13292,17.46705 -13.37279,8.60058 11.89725,-0.53171 1.42238,11.19273 -48.30689,29.03199 19.03562,22.83742 -9.98306,10.34199 6.92565,8.16193 -50.00839,8.16191 -2.6586,-11.97701 -6.18126,27.8489 -17.83925,9.83684 37.92502,42.41807 -33.84406,27.78245 -5.35709,20.5776 v 0 l -30.348,3.36315 -1.1432,-29.43077 10.63442,-17.12143 -25.52262,-23.72807 13.33291,-27.79574 -5.45015,-10.80723 19.70029,-28.81929 -17.97218,-12.76133 -34.41567,33.51174 -0.22599,35.81144 -66.93042,21.5613 v 0 l -18.17157,-90.88448 9.79696,-25.69542 -29.19149,-9.35831 29.84286,-22.5184 49.2108,-6.22113 6.04834,-39.18787 -11.84411,-6.79274 z"
            class="land"
            title="Namur"
            id="BE-WNA"
            style=""
        />
        <path
            d="m 438.13796,154.8546 21.80058,28.47368 -8.30815,12.32264 10.88698,40.58363 -4.43985,12.04349 -35.94437,10.23564 4.05438,24.95102 12.80118,1.3559 v 0 l -1.88761,14.59574 -22.75767,13.63866 4.75892,14.74197 -17.54681,-0.1728 -13.86464,38.50992 5.42356,19.96614 -29.21809,5.66281 0.7311,17.89243 h -14.48939 v 0 l -31.3051,-6.27431 -4.26707,-13.65194 -21.08275,3.58912 -12.25617,20.9498 -44.10629,-19.07549 v 0 l 16.0314,-15.63261 -17.81266,-25.34981 6.71298,-12.22959 -16.13774,-2.93776 11.53834,-15.75225 -12.04348,-5.68942 8.3746,-37.04768 -29.70992,-21.1758 20.49787,-25.28336 -13.10695,-12.86766 5.50333,-34.07003 v 0 l 12.16312,12.32263 25.52262,-0.49183 -3.00422,-16.97522 19.58064,-7.80299 48.21384,17.61325 3.52263,19.97944 24.87128,-3.54925 -0.11965,9.34501 45.01022,-17.98548 z"
            class="land"
            title="East Flanders"
            id="BE-VOV"
            style=""
        />
        <path
            d="m 630.75402,285.92392 19.80661,8.24167 15.48641,-14.39634 10.42172,10.50149 -10.7009,1.47552 -19.06219,31.95646 12.53532,13.7051 24.4326,2.20666 -21.99997,79.25306 v 0 l -20.84348,-16.7891 v 0 l -9.69062,-8.06888 -14.6888,10.96676 -42.67065,-25.89484 -30.44105,3.05741 -2.16676,23.03684 -10.06283,-8.68035 -18.22474,14.75525 -8.2284,-11.32566 -31.18545,15.97823 -9.87671,-7.20483 -22.75769,18.53049 -23.91417,-16.81568 -14.19696,9.69062 v 0 l -48.45309,6.51359 -4.13414,-16.93533 v 0 h 14.4761 l -0.71781,-17.89242 29.21809,-5.66284 -5.42356,-19.95284 13.86464,-38.50992 17.56009,0.15952 -4.75892,-14.74198 22.75769,-13.63865 1.88762,-14.59576 v 0 l 36.30327,2.83142 3.82838,14.30331 48.55946,1.80785 26.06763,-13.89121 3.41631,10.70089 24.43261,-16.40361 6.72627,11.39213 z m -144.36235,53.92984 v 0 l -27.90208,3.92145 -17.97217,30.95946 35.78485,21.46825 27.2507,-11.17944 -15.31356,-42.551 z"
            class="land"
            title="Flemish Brabant"
            id="BE-VBR"
            style=""
        />
        <path
            d="m 213.63191,148.66005 3.33656,38.49663 v 0 l -5.50333,34.07003 13.10695,12.86766 -20.49787,25.28336 29.70992,21.1758 -8.3746,37.04768 12.04348,5.68942 -11.53834,15.75225 16.13774,2.93776 -6.71298,12.22959 17.81266,25.34981 -16.0314,15.63261 v 0 l -25.84165,23.59514 -13.9577,-18.66343 -33.23258,-0.25255 v 0 l -7.03201,-13.81147 -33.79089,6.76615 v 0 l -4.81208,-15.30028 -16.47007,6.89909 6.12811,8.06886 -30.79997,9.62417 5.41027,17.71961 v 0 L 63.8726,411.94186 46.72459,377.76548 24.07326,376.91473 14.8346,361.72078 12.44186,333.07432 23.19592,321.73535 0.41166,263.60491 l 165.17923,-99.75093 0.67794,-13.50571 3.12387,14.13049 0.0798,-14.46282 7.70995,9.58427 z"
            class="land"
            title="West Flanders"
            id="BE-VWV"
            style=""
        />
        <!-- Triadic colors: -->
        <!-- https://www.color-hex.com/color/83c442 -->
        <g
            id="stadiumsLargeDisc"
            data-country="belgium"
            data-circle-radius={radius * 2}
            data-circle-colors="#ff00001A,#ff00001A"
            data-circle-stroke-color="none"
            data-circle-stroke-width="0"
            ontouchstart={handleTouchStartCircle}
            ontouchend={handleTouchEndCircle}
            onfocus={() => {}}
            role="presentation"
            onblur={() => {}}
            use:b
        ></g>
        <g
            id="stadiums"
            data-country="belgium"
            data-circle-radius={radius}
            data-circle-colors="#4283c4,#c44283"
            data-circle-stroke-color="#325bad"
            data-circle-stroke-width="1"
            onmouseover={handleMouseOverCircle}
            onmouseout={handleMouseOutCircle}
            onfocus={() => {}}
            role="presentation"
            onblur={() => {}}
            use:a
        /></g
    >
</svg>
