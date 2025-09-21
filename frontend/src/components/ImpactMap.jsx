import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useContext } from "react";
import { dataContext } from "@/context";

const ImpactMap = () => {
  const { impactLocation } = useContext(dataContext);
  return (
    <div className="bg-white p-4 rounded-2xl shadow h-96">
      <h2 className="text-xl font-bold mb-3">🌐 Impact Location Simulation</h2>
      <MapContainer
        center={impactLocation}
        zoom={3}
        className="h-80 w-full rounded-2xl"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={impactLocation}>
          <Popup>Potential Impact Zone 🌍</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ImpactMap;
