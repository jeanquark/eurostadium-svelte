<script>
    import { onMount } from 'svelte'
    import panzoom from '@panzoom/panzoom'
    import addStadiumsToSvgMap from '@utils/addStadiumsToSvgMap'
    let { clickOutsideCountry, stadiumHover, stadiumLeave, countryObj, stadiumsArray } = $props()
    let radius = $state(10)
    let stadiumObj = $state(null)
    let panzoomRef = $state(null)
    let flag = $state(1)

    onMount(() => {
        console.log('[Albania] onMount')
    })

    const initPanzoom = (node) => {
        node.addEventListener('panzoompan', (event) => {
            console.log('panzoompan: ', event.detail)
            if (event.detail.x != 0 || event.detail.y != 0) {
                flag = 0
            }
        })
        node.addEventListener('panzoomzoom', (event) => {
            // console.log('panzoomzoom scale: ', event.detail?.scale)
            const scale = event.detail ? event.detail.scale : 10
            const stadiumElement = document.getElementById('stadiums')
            if (!stadiumElement) {
                return
            }
            const stadiums = stadiumElement.children
            for (let i = 0; i < stadiums.length; i++) {
                stadiums[i].setAttribute('r', radius / scale)
            }
        })

        node.addEventListener('click', (event) => {
            if (flag == 1) {
                handleClick(event)
            } else {
                console.log('no click')
            }
            flag = 1
        })
        panzoomRef = panzoom(node, {
            isSvg: true,
            cursor: 'normal',
            disableZoom: false,
            maxScale: 8,
            minScale: 1,
            touchAction: 'none',
            contain: 'outside',
            panOnlyWhenZoomed: false,
            handleStartEvent: (event) => {
                event.preventDefault()
                event.stopPropagation()
            }
        })
        const zoom = (e) => {
            panzoomRef.zoomWithWheel(e)
        }
        node.addEventListener('wheel', zoom)
    }

    const handleClick = (e) => {
        console.log('[Albania] handleClick')
        // console.log('e.target: ', e.target);
        if (e.target.classList.contains('stadium')) {
            console.log('Click on stadium')
        }
        if (e.target.classList.contains('rectangle')) {
            console.log('Click on rectangle')
            panzoomRef.destroy()
            // dispatch("clickOutsideCountry");
            clickOutsideCountry()
        }
    }
    const handleMouseOverCircle = (e) => {
        console.log('[Albania] handleMouseOverCircle e.target: ', e.target)
        if (e.target.classList.contains('stadium')) {
            console.log('Click on stadium')
        }
        const stadiumId = parseInt(e.target.getAttribute('data-api-football-stadium-id'))
        // console.log('stadiumId: ', stadiumId)
        const data = {
            stadiumId: stadiumId,
            clientX: e.clientX,
            clientY: e.clientY,
            rect: e.target.getBoundingClientRect(),
        }
        document.querySelectorAll('.stadium').forEach((element) => {
            element.classList.remove('hover')
        })
        e.target.classList.add('hover')
        stadiumHover(data)
    }
    const handleMouseOutCircle = (e) => {
        console.log('[Albania] handleMouseOutCircle e.target: ', e.target)
        if (!e.relatedTarget?.classList?.contains('tooltip')) {
            e.target.classList.remove('hover')
            stadiumLeave()
        }
    }
    const a = (node) => {
        stadiumObj = node
		$effect(() => {
			return () => {
			};
		});
	}
    $effect(() => {
        addStadiumsToSvgMap(stadiumObj, stadiumsArray, countryObj.leagues)
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
        <!-- <amcharts:ammap projection="mercator" leftLongitude="12.445606" topLatitude="41.907551" rightLongitude="12.458452" bottomLatitude="41.900111"></amcharts:ammap> -->

		<!-- All areas are listed in the line below. You can use this list in your script. -->
		<!--{id:"VA"}-->
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
        <path id="VA" title="Vatican City  (Holy See)" class="land" d="M473.758,317.509L486.073,391.484L578.644,421.415L578.099,480.789L575.735,515.828L573.327,572.038L573.872,588.098L583.461,593.693L591.868,602.697L601.457,614.133L605.684,621.92L610.455,639.683L612,659.392L611.728,665.231L611.546,670.827L609.592,681.777L602.32,697.106L587.551,713.652L573.872,721.195L566.237,723.871L553.922,724.602L539.471,721.195L527.064,715.599L521.384,709.759L515.612,704.649L500.025,709.272L480.983,716.572L448.536,728.981L417.452,736.037L406.092,740.417L402.683,745.526L403.047,752.583L403.683,767.182L409.908,773.508L410.408,781.294L407.455,788.837L402.683,792L393.186,785.674L347.014,767.912L346.56,778.618L340.379,778.131L266.94,767.182L241.219,762.802L235.993,752.583L223.541,747.474L200.683,744.797L191.685,740.417L179.733,737.983L165.963,736.037L150.194,736.523L150.785,748.203L126.335,753.313L109.249,755.016L104.931,750.637L98.75,743.094L103.931,737.983L109.703,732.874L94.479,718.762L78.21,705.379L66.803,697.106L48.625,681.777L40.582,692.727L17.224,679.101L0,672.287L55.351,638.952L75.574,625.326L79.709,622.406L86.344,610.97L91.525,593.693L95.433,584.204L102.522,575.201L112.521,566.928L124.018,554.762L134.47,546.488L140.741,536.998L144.877,524.102L149.648,494.902L154.011,471.299L161.146,466.188L171.598,461.809L184.095,455.969L199.274,441.368L212.089,422.875L221.224,398.541L227.858,380.047L273.575,374.208L298.343,375.667L305.932,374.208L339.788,361.554L353.694,357.173L360.783,369.097L390.322,360.337L388.913,345.493L409,339.166z"/></g>
        <!-- Triadic colors: -->
        <!-- https://www.color-hex.com/color/f7b7b7 -->
        <g
            id="stadiums"
            data-country="vatican"
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
