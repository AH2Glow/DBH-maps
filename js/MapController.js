class MapController {
    view;

    constructor(mapId, data) {
        this.view = new MapView(mapId);

        this.view.mapIconsToType(
            {
                Treinstation: "train.png",
                Busstation: "bus.png",
            },
            "assets/img/"
        );

        this.view.initiateData(data);
        this.view.showMap();
    }

    setStyle(styleArray) {
        this.view.setOptions({ styles: styleArray });
    }

    addTemplates(templates) {
        templates.forEach(({ name, template, methods }) => {
            this.view.addTemplate(name, template, methods);
        });
    }
}
