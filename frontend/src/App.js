import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function TripPlanner() {
  const [route, setRoute] = useState([]);
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const newMarker = { lat, lng };

    setMarkers([...markers, newMarker]);

    // If we have at least two markers, calculate route
    if (markers.length > 0) {
      calculateRoute(markers[markers.length - 1], newMarker);
    }
  };

  const calculateRoute = async (start, end) => {
    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end }),
      });

      const routeData = await response.json();
      setRoute(routeData.route);
    } catch (error) {
      console.error('Route calculation error:', error);
    }
  };

  return (
    <div className="trip-planner">
      <h1>Trip Planner</h1>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="http://localhost:8080/tile/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>Stop {index + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="route-details">
        <h2>Route Stops</h2>
        {markers.map((marker, index) => (
          <div key={index}>
            Stop {index + 1}: Lat {marker.lat}, Lng {marker.lng}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripPlanner;
