class MapController {
    view;

    constructor(mapId, data) {
        this.view = new MapView(mapId);

        this.view.mapIconsToType(
            {
                Treinstation: "train.png",
                Busstation: "bus.png",
            },
            "/images/"
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

    addTemplateMethods(templateMethods) {
        Object.entries(templateMethods).forEach(([name, method]) => {
            this.view.addTemplateMethod(name, method);
        });
    }
}
