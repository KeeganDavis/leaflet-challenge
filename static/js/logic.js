const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


d3.json(url).then(data =>{
    let features = data.features;
    let geoJSONLayer = L.geoJSON(features, {
       pointToLayer: (feature, latlng) => {
            let depthColor = colorForDepth(feature.geometry.coordinates[2]); 
            console.log(depthColor);
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor: depthColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p>`)
        }
    });
    createMap(geoJSONLayer);
});

function colorForDepth(depth) {
    if (depth > 90) return '#ff5f65';
    if (depth > 70) return '#fca35d';
    if (depth > 50) return '#fdb72a';
    if (depth > 30) return '#f7db11';
    if (depth > 10) return '#dcf400';
    return '#a3f600';
};

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    let overlayMaps = {
        'Earthquakes': earthquakes
    };

    let myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
      });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
};