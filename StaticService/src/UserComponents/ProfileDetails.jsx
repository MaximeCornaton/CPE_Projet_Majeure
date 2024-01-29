import React, { useEffect, useState } from "react";
import {
  Segment,
  Header,
  Image,
  Grid,
  Progress,
  Statistic,
  Label,
} from "semantic-ui-react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ProfileDetails = ({ profileData }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (profileData && profileData.userLocation) {
      setPosition([
        profileData.userLocation.latitude,
        profileData.userLocation.longitude,
      ]);
    }
  }, [profileData]);

  const xpMax = (profileData?.userLevel + 1) * 10;

  return (
      <Segment style={{ background: "#f9f9f9", padding: "20px" }}>
        <Grid columns={2} stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header
                  as="h2"
                  dividing
                  style={{ color: "#333", marginBottom: "20px" }}
              >
                {profileData?.userLogin}
              </Header>
              <Statistic size="small" color="blue">
                <Statistic.Label>Level</Statistic.Label>
                <Statistic.Value>
                  <Label color="blue" size="large">
                    {profileData?.userLevel}
                  </Label>
                </Statistic.Value>
              </Statistic>
              <Progress
                  percent={(profileData?.userXp / xpMax) * 100}
                  indicating
                  progress
                  label={`XP: ${profileData?.userXp} / ${xpMax}`}
                  style={{ marginBottom: "20px", boxShadow: "none" }}
              />
              <Statistic size="small">
                <Statistic.Label>Attack</Statistic.Label>
                <Statistic.Value>{profileData?.userAttack}</Statistic.Value>
              </Statistic>
              <Statistic size="small">
                <Statistic.Label>HP</Statistic.Label>
                <Statistic.Value>{profileData?.userHp}</Statistic.Value>
              </Statistic>
              <Statistic size="small">
                <Statistic.Label>Endurance</Statistic.Label>
                <Statistic.Value>{profileData?.userEndurance}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header
                  as="h2"
                  dividing
                  style={{ color: "#333", marginBottom: "20px" }}
              >
                {profileData?.userEmail}
              </Header>
              <Image
                  src={profileData?.userImg}
                  alt="Profile"
                  size="medium"
                  rounded
                  bordered
                  style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
              />
            </Grid.Column>
          </Grid.Row>
          {position && (
              <Grid.Row>
                <Grid.Column width={16}>
                  <MapContainer
                      className="profile-map"
                      center={position}
                      zoom={13}
                      style={{ height: "300px", marginTop: "20px", borderRadius: "10px", overflow: "hidden" }}
                  >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    />
                    <CircleMarker
                        center={position}
                        radius={10} // Taille du cercle
                        color="#ffffff" // Couleur de la bordure (blanc)
                        fillColor="#0074cc" // Couleur de remplissage (bleu)
                        fillOpacity={0.8} // Opacité de remplissage
                    >
                      {/* Contenu du Popup */}
                      <Popup>{`Latitude: ${position[0]}, Longitude: ${position[1]}`}</Popup>
                    </CircleMarker>
                  </MapContainer>
                </Grid.Column>
              </Grid.Row>
          )}
        </Grid>
      </Segment>
  );
};

export default ProfileDetails;
