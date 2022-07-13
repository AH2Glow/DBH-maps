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
}
