function initMap() {
    const mapController = new MapController("map", markerData);

    mapController.setStyle(sonderCityMapStyles);
    mapController.addTemplates(dynamicTemplates);
    mapController.addTemplateMethods(templateMethods);
}

window.initMap = initMap;
