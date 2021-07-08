import L, { LatLng } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./App.css";
import { SearchStr, SearchStrProps } from "./SearchStr";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

function App() {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;
  let position = new LatLng(54.988936910720994, 82.91288650421464);
  let coordChange = function markerOnMap(position: LatLng) {
    // обработка новой позиции маркера
  };

  return (
    <div>
      <SearchStr coordChange={coordChange}></SearchStr>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: 800 }}
        minZoom={1}
        maxZoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
