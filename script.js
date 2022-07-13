function initMap() {
    const mapController = new MapController("map", markerData);

    mapController.setStyle(sonderCityMapStyles);
    mapController.addTemplates([
        {
            name: "infoItem",
            template: `
            <li>
                <img class="marker-info-target" data-fn="setImgSrc" />
                <h3 class="marker-info-target" data-fn="testMeFn" data-key="title"></h3>
                <ul class="marker-info-target" data-key="lines" data-list-item="lineItem"></ul>
            </li>
        `,
            methods: {
                setImgSrc: (img, data) =>
                    img.setAttribute(
                        "src",
                        "assets/img/hub-info--" + data.type + ".png"
                    ),
                testMeFn: (el, data) => {
                    console.log(el);
                    console.log(data);
                },
            },
        },
        {
            name: "lineItem",
            template: `
            <li>
                <p class="marker-info-target"></p>
            </li>
        `,
        },
    ]);
}

const sonderCityMapStyles = [
    {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
            {
                saturation: 36,
            },
            {
                color: "#333333",
            },
            {
                lightness: 40,
            },
        ],
    },
    {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
            {
                visibility: "on",
            },
            {
                color: "#ffffff",
            },
            {
                lightness: 16,
            },
        ],
    },
    {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#fefefe",
            },
            {
                lightness: 20,
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#fefefe",
            },
            {
                lightness: 17,
            },
            {
                weight: 1.2,
            },
        ],
    },
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
            {
                color: "#edebe4",
            },
            {
                lightness: 20,
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
            {
                color: "#f5f5f5",
            },
            {
                lightness: 21,
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
            {
                color: "#dedede",
            },
            {
                lightness: 21,
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#d1ecc7",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                lightness: 17,
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                lightness: 29,
            },
            {
                weight: 0.2,
            },
        ],
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                lightness: 18,
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
            {
                color: "#ffffff",
            },
            {
                lightness: 16,
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
            {
                color: "#f2f2f2",
            },
            {
                lightness: 19,
            },
        ],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#bddddd",
            },
            {
                lightness: 17,
            },
        ],
    },
];

window.initMap = initMap;
