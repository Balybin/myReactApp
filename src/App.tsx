import { LatLng } from "leaflet";
import "./App.css";
import { SearchStr } from "./SearchStr";
import { useState } from "react";
import { MyMapComponent } from "./MyMap";
import { BehaviorSubject } from "rxjs";
import { MapContainer } from "react-leaflet";
function App() {
  let [mapPosition, setMapPosition] = useState(
    new BehaviorSubject<LatLng>(
      new LatLng(54.988936910720994, 82.91288650421464)
    )
  );
  let [markerPosition, setMarkerPosition] = useState<
    BehaviorSubject<LatLng | null>
  >(new BehaviorSubject<LatLng | null>(null));

  let coordChange = function markerOnMap(position: LatLng) {
    // обработка новой позиции маркера
    markerPosition.next(position);
    mapPosition.next(position);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <header className="navbar navbar-dark bg-dark">
        <a className="navbar-brand px-3">MapApp</a>
      </header>
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <nav
            id="sidebar"
            className="px-0 col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
          >
            <SearchStr coordChange={coordChange}></SearchStr>
          </nav>
          <main className="px-0 col-md-9 ms-sm-auto col-lg-10 d-flex flex-column h-100">
            <MapContainer
              className="flex-grow-1"
              zoom={15}
              minZoom={1}
              maxZoom={17}
              zoomAnimation={true}
            >
              <MyMapComponent
                markerPosition={markerPosition}
                mapPosition={mapPosition}
              ></MyMapComponent>
            </MapContainer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
