import L, { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { Observable } from "rxjs";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface MyMapProps {
  mapPosition: Observable<LatLng>;
  markerPosition: Observable<LatLng | null>;
}
export function MyMapComponent(props: MyMapProps) {
  const map = useMap();
  let [marker, setMarker] = useState<LatLng | null>(null);
  useEffect(() => {
    let markerSubscription = props.markerPosition.subscribe((pos) => {
      if (pos == null) return;
      setMarker(pos);
      console.log("new marker pos", pos);
    });
    return () => {
      markerSubscription.unsubscribe();
    };
  });
  useEffect(() => {
    let mapPosSubscription = props.mapPosition.subscribe((pos) => {
      if (pos?.lat == null || pos?.lng == null) return;
      console.log("new map pos", pos);
      map.setView(pos);
    });

    return () => {
      mapPosSubscription.unsubscribe();
    };
  });
  return (
    <div>
      <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker != null ? (
        <Marker position={marker}>
          <Tooltip>
            Координаты: {marker.lat} {marker.lng}
          </Tooltip>
        </Marker>
      ) : (
        ""
      )}
    </div>
  );
}
