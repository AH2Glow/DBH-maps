class MapView {
    _map;
    _mapEl;
    _infoEl;
    _data;
    _markers = [];
    _iconsMap = {};
    _clusters = [];
    _options = {
        markerInfoDelay: 0,
        makeClusters: false,
        iconSize: [25, 25],
    };
    _templates = {};
    _templateMethods = {};
    _domParser;

    constructor(id) {
        this._mapEl = document.getElementById(id);
        this._infoEl = document.querySelector(".marker-info");
        this._initiateMapOptions();
        this._initiateMarkerInfoOptions();
        this._initHandlerCloseInfoWindow();
        this._domParser = new DOMParser();
    }

    addTemplate(name, template, methods = {}) {
        if (this._templates[name]) {
            console.log(name + " template was already added...");
            return;
        }

        this._templates = {
            ...this._templates,
            [name]: {
                template,
                methods,
            },
        };
    }

    addTemplateMethod(name, method) {
        if (this._templateMethods[name]) {
            console.log(name + " template method was already added...");
            return;
        }

        this._templateMethods = {
            ...this._templateMethods,
            [name]: method,
        };
    }

    setOptions(options) {
        this._map.setOptions(options);
    }

    reOpenInfo(setInfo) {
        if (this._options.markerInfoDelay) {
            this.closeInfo();
            setTimeout(() => {
                this.openInfo(setInfo);
            }, this._options.markerInfoDelay);
        } else {
            setInfo();
        }
    }

    openInfo(setInfo) {
        const isOpen = this._infoEl.classList.contains("open");
        if (isOpen) {
            this.reOpenInfo(setInfo);
        } else {
            setInfo();
            this._infoEl.classList.add("open");
        }
    }

    closeInfo() {
        this._infoEl.classList.remove("open");
    }

    removeChildren(el) {
        while (el.firstChild) {
            el.removeChild(el.lastChild);
        }
    }

    getElementMethods(el) {
        const methodNames = el.dataset.fn;

        if (!methodNames) return;

        const fn = el.dataset.fn.split(",");

        const methods = fn
            .filter((name) => this._templateMethods[name])
            .map((name) => this._templateMethods[name]);
        return methods;
    }

    executeElementMethods(el, data) {
        const methods = this.getElementMethods(el);

        if (!methods) return;

        methods.forEach((m) => m(el, data));
    }

    createInfoElement(templateName, data) {
        const { template } = this._templates[templateName] || {};

        if (!template) return { targets };

        const html = this._domParser.parseFromString(template, "text/html");
        const parent = html.querySelector("li");

        const targets = html.querySelectorAll("li > .marker-info-target");

        targets.forEach((el) =>
            this.executeElementMethods.call(this, el, data)
        );

        return { parent, targets };
    }

    setInfoList(listEl, data) {
        this.removeChildren(listEl);

        if (!Array.isArray(data)) {
            console.error(
                "UL element does not accept data of type " + typeof data
            );

            return listEl.parentNode.removeChild(listEl);
        }

        data.forEach((d) => {
            const { parent, targets } = this.createInfoElement(
                listEl.dataset.listItem,
                d
            );

            if (!parent || !targets) return;

            targets.forEach((el) => {
                this.setInfoItem(el, d);
                parent.appendChild(el);
            });

            listEl.appendChild(parent);
        });
    }

    setInfoItem(el, markerInfo) {
        if (typeof markerInfo === "string") {
            el.innerText = markerInfo;
            return;
        }

        const info = markerInfo[el.dataset.key];

        if (!info) {
            el.innerText = "";
            return;
        }

        const tagName = el.tagName;

        if (tagName === "UL") {
            this.setInfoList(el, info);
            return;
        }

        el.innerText = info;
    }

    setInfo(markerInfo, el) {
        if (!el) {
            el = document;
        }

        const keyElements = el.querySelectorAll(
            ".marker-info > .marker-info-target"
        );

        keyElements.forEach((el) => {
            this.setInfoItem(el, markerInfo);
        });
    }

    setMarkers(data) {
        this._markers = data.map((m) => {
            const {
                id,
                type,
                coords: [lat, lng],
            } = m;

            const position = { lat, lng };

            const icon = {
                url: this._iconsMap[type],
                scaledSize: new google.maps.Size(...this._options.iconSize),

                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
            };

            const marker = new google.maps.Marker({
                position,
                map: this._map,
                id,
                icon,
            });

            marker.addListener("click", () => {
                this.openInfo(() => this.setInfo(m));
                this._map.panTo(position);
            });

            return marker;
        });
    }

    makeClusters(clusterName) {
        this._clusters.push({
            name: clusterName,
            cluster: new markerClusterer.MarkerClusterer({
                map: this._map,
                markers: this._markers,
                onClusterClick: (_, cluster, map) => {
                    map.fitBounds(cluster.bounds);
                    this.closeInfo();
                },
            }),
        });
    }

    mapIconsToType(map, folder) {
        this._iconsMap = Object.entries(map).reduce(
            (acc, [key, fileName]) => ({ ...acc, [key]: folder + fileName }),
            {}
        );
    }

    showMap() {
        this._map = new google.maps.Map(this._mapEl, this._getInitialOptions());

        if (this._data) {
            this.setMarkers(this._data);
        }

        if (this._options.makeClusters) {
            this.makeClusters("initial");
        }
    }

    initiateData(data) {
        this._data = data;
    }

    _getInitialOptions() {
        const { initLat, initLng, initZoom } = this._mapEl.dataset;

        return {
            zoom: +initZoom,
            center: { lat: +initLat, lng: +initLng },
            disableDefaultUI: true,
        };
    }

    _initiateMarkerInfoOptions() {
        const infoEl = this._infoEl;
        if (!infoEl) return;

        const { delay } = infoEl.dataset;

        if (+delay) {
            this._options.markerInfoDelay = +delay;
        }
    }

    _initiateMapOptions() {
        if (!this._mapEl) return;

        const { cluster, iconSize = "30, 30" } = this._mapEl.dataset;

        if (cluster === "true") {
            this._options.makeClusters = true;
        }

        const [width = 30, height = width] = iconSize
            .split(",")
            .map((num) => parseInt(num, 10) || undefined);

        this._options.iconSize = [width, height];
    }

    _initHandlerCloseInfoWindow() {
        const btn = this._infoEl.querySelector(".marker-info-close");
        if (!btn) return;

        btn.addEventListener("click", this.closeInfo.bind(this));
    }
}
