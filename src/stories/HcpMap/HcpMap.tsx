import React, { useState, useRef, useEffect } from 'react';
// import { Map, TileLayer, View, Marker } from 'react-openlayers';
import Map from "ol/Map";
import 'ol/ol.css';
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Icon, Style } from "ol/style.js";
import Feature from "ol/Feature.js";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import Point from "ol/geom/Point.js";
import pin from "@app/stories/assets/pin.png";
import styled from "styled-components";

const MapWrapper = styled.figure`
  margin: 0px;
  border: 1px solid #efefef;
  border-radius: 8px;
  overflow: hidden;
`

export interface HcpMapPros {
  coordinates?: [number, number];
}
export const HcpMap = ({coordinates}: HcpMapPros) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState<Map>(null);
  const [vector, setVecotr] = useState<VectorSource>(null);

  useEffect(() => {
    if (mapRef.current) {
      const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
      });

      const vectorSource = new VectorSource({
        features: [],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const map = new Map({
        target: mapRef.current,
        layers: [osmLayer, vectorLayer],
        view: new View({
          center: [0, 0],
          zoom: 3,
        }),
      });

      setMap(map);
      setVecotr(vectorSource);
    }
  }, []);

  useEffect(() => {
    if (map && coordinates) {
      const coord = coordinates.map(c => c * 100000);
      map.getView().setCenter(coord);
      map.getView().setZoom(3);

      vector.clear();
    
      const iconFeature = new Feature({
        geometry: new Point(coord)
      })

      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: pin,
        }),
      })

      iconFeature.setStyle(iconStyle);

      vector.addFeature(iconFeature);
    }
  }, [map, vector, coordinates])

  return (
    <MapWrapper>
      <div ref={mapRef} style={{width: "100%", height: "150px"}}></div>
    </MapWrapper>
  );
};

export default HcpMap;