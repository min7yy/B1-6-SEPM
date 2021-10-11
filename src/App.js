import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import * as siteData from "./data/TestingSiteData.json";
import VerticalCarousel from "./VerticalCarousel";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: -37.7799973,
  lng: 145.0016577,
};


export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBT5BjqQdoLQwCM45USRSZl8YQHoMulOdI",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {

  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    siteData.sites.map(site => {
      setMarkers((current) => [
        ...current,
        {
          lat: parseFloat(site.Latitude),
          lng: parseFloat(site.Longitude),
          name: site.Site_Name,
          phone: site.Phone,
          opening: site.Service_Availability,
          suburb: site.Suburb,
          address: site.Address,
          type: site.ServiceFormat,
          agelimit: site.AgeLimit,
          moStart: site.Mo_Start,
          moEnd: site.Mo_End,
          tuStart: site.Tu_Start,
          tuEnd: site.Tu_End,
          weStart: site.We_Start,
          weEnd: site.We_End,
          thStart: site.Th_Start,
          thEnd: site.Th_End,
          frStart: site.Fr_Start,
          frEnd: site.Fr_End,
          saStart: site.Sa_Start,
          saEnd: site.Sa_End,
          suStart: site.Su_Start,
          suEnd: site.Su_End,


          time: new Date(),

        },
      ]);

    })

  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div data-testid="app-1">
      <h1>
        COVID Testing Sites{" "}

      </h1>

      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: `/mapMarker.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2> {selected.name} </h2>
              <p> Site Phone: {selected.phone} </p>
              <p> Site Address: {selected.address} </p>
              <p> Site Type: {selected.type} </p>
              <p> Site Age Limit: {selected.agelimit} </p>
                  <h3 align={"right"}> Opening hours </h3>
               <ol align={"right"}> Mon: {selected.moStart} - {selected.moEnd} </ol>
                <ol align={"right"}> Tue: {selected.tuStart} - {selected.tuEnd} </ol>
                <ol align={"right"}> Wed: {selected.weStart} - {selected.weEnd} </ol>
                <ol align={"right"}> Thu: {selected.thStart} - {selected.thEnd} </ol>
                <ol align={"right"}> Fri: {selected.frStart} - {selected.frEnd} </ol>
                <ol align={"right"}> Sat: {selected.saStart} - {selected.saEnd} </ol>
               <ol align={"right"}> Sun: {selected.suStart} - {selected.suEnd} </ol>


            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
      <VerticalCarousel data={siteData.sites} leadingText="Site Name:" />
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 37.7799973, lng: () => 145.0016577 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
