"use client"
import { useGeolocated } from "react-geolocated"
import { FaUserCircle } from 'react-icons/fa';
import { Marker, Popup } from "react-leaflet";
import ReactDOMServer from 'react-dom/server';
import { divIcon } from 'leaflet';

const iconMarkup = ReactDOMServer.renderToStaticMarkup(<FaUserCircle size={32} className="text-blue-400" />);
const customIcon = divIcon({
  html: iconMarkup,
  className: 'custom-marker',
  iconSize: [30, 30],
});

const UserMarker = () => {
  const {coords, isGeolocationAvailable, isGeolocationEnabled} = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    watchPosition: true
  });

  if (isGeolocationAvailable && isGeolocationEnabled && coords){
    return (
      <Marker position={[coords.latitude, coords.longitude]} icon={customIcon}>
        <Popup>Your current location</Popup>
      </Marker>
    );
  }
  return (null);
}

export default UserMarker;