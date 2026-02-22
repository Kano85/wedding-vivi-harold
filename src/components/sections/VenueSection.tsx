'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import MapTilerLightMap from '../MapTilerLightMap';
import type { SiteLanguage } from '../../lib/i18n';

// Convert \n to <br /> line breaks
const formatTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

interface VenueSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const VenueSection = ({ bgColor = 'white', language }: VenueSectionProps) => {
  const [isClient, setIsClient] = useState(false);

  const mapPopupHtml = `<strong>${weddingConfig.venue.name}</strong><br/>${weddingConfig.venue.address.replace(/\n/g, '<br/>')}`;
  const t = language === 'es'
    ? {
        title: 'Lugar',
        arrival: 'Llegada',
        publicTransport: 'Transporte público',
        subway: 'Tren',
        bus: 'Bus',
        localTitle: 'Llegada desde Barcelona / Catalunya',
        outsideTitle: 'Llegada desde fuera de Catalunya',
        nearestAirports: 'Los aeropuertos más cercanos son:',
        airportBarcelona: 'Barcelona (BCN)',
        airportGirona: 'Girona (GRO)',
        parking: 'Parking',
        subwayText:
          'Por favor, tomad el tren hasta Figueres.\nOrganizamos un shuttle desde Figueres hasta la finca.\nMás información cerca de la fecha del evento.',
        busText:
          'Por favor, llegad también hasta Figueres.\nDesde allí organizamos un shuttle hasta la finca.\nMás detalles cerca de la fecha del evento.',
        localDetails:
          'Por favor, tomad el tren hasta Figueres.\nEstá previsto un shuttle de Figueres hasta la finca.\nMás información cerca de la fecha del evento.',
        outsideDetails:
          'Desde allí, por favor, id en tren hasta Figueres.\nOrganizamos un shuttle desde Figueres hasta la finca.\nMás información cerca de la fecha del evento.',
        parkingText: 'Hay aparcamiento disponible en la finca.',
      }
    : {
        title: 'Ort',
        arrival: 'Anreise',
        publicTransport: 'Oeffentliche Verkehrsmittel',
        subway: 'Zug',
        bus: 'Bus',
        localTitle: 'Anreise innerhalb von Barcelona / Katalonien',
        outsideTitle: 'Anreise von außerhalb Kataloniens',
        nearestAirports: 'Die nächstgelegenen Flughäfen sind:',
        airportBarcelona: 'Barcelona (BCN)',
        airportGirona: 'Girona (GRO)',
        parking: 'Parken',
        subwayText:
          'Bitte nehmt den Zug nach Figueres.\nWir organisieren einen Shuttle von Figueres zur Location.\nWeitere Informationen teilen wir näher am Eventdatum.',
        busText:
          'Bitte reist ebenfalls bis Figueres an.\nVon dort organisieren wir einen Shuttle zur Location.\nWeitere Details folgen näher am Eventdatum.',
        localDetails:
          'Bitte nehmt den Zug nach Figueres.\nEin Shuttle von Figueres zur Location ist geplant.\nWeitere Informationen folgen näher am Eventdatum.',
        outsideDetails:
          'Von dort bitte mit dem Zug nach Figueres fahren.\nWir organisieren einen Shuttle von Figueres zur Location.\nWeitere Informationen teilen wir näher am Eventdatum.',
        parkingText: 'Parkplätze sind vor Ort verfügbar.',
      };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <VenueSectionContainer $bgColor={bgColor}>
        <SectionTitle>{t.title}</SectionTitle>
      </VenueSectionContainer>
    );
  }
  
  return (
    <VenueSectionContainer $bgColor={bgColor}>
      <SectionTitle>{t.title}</SectionTitle>
      
      <VenueInfo>
        <VenueName>{weddingConfig.venue.name}</VenueName>
        <VenueAddress>{formatTextWithLineBreaks(weddingConfig.venue.address)}</VenueAddress>
        <VenueWebsite
          href="https://lafarinerasantlluis.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          lafarinerasantlluis.com
        </VenueWebsite>
        <VenueTel href={`tel:${weddingConfig.venue.tel}`}>{weddingConfig.venue.tel}</VenueTel>
      </VenueInfo>
      
      <MapWrapper>
        <MapTilerLightMap
          lat={weddingConfig.venue.coordinates.latitude}
          lng={weddingConfig.venue.coordinates.longitude}
          zoom={weddingConfig.venue.mapZoom}
          mapId={weddingConfig.venue.mapId}
          popupHtml={mapPopupHtml}
        />
      </MapWrapper>
      
      <TransportCard>
        <CardTitle>{t.arrival}</CardTitle>
        <SubsectionTitle>{t.publicTransport}</SubsectionTitle>
        <TransportItem>
          <TransportLabel>{t.subway}</TransportLabel>
          <TransportText>{t.subwayText}</TransportText>
        </TransportItem>
        <TransportItem>
          <TransportLabel>{t.bus}</TransportLabel>
          <TransportText>{t.busText}</TransportText>
        </TransportItem>
      </TransportCard>

      <Card>
        <CardTitle>{t.localTitle}</CardTitle>
        <TransportText>{t.localDetails}</TransportText>
      </Card>

      <Card>
        <CardTitle>{t.outsideTitle}</CardTitle>
        <TransportText>{t.nearestAirports}</TransportText>
        <AirportList>
          <AirportItem>{t.airportBarcelona}</AirportItem>
          <AirportItem>{t.airportGirona}</AirportItem>
        </AirportList>
        <TransportText>{t.outsideDetails}</TransportText>
      </Card>

      <ParkingCard>
        <CardTitle>{t.parking}</CardTitle>
        <TransportText>{t.parkingText}</TransportText>
      </ParkingCard>
    </VenueSectionContainer>
  );
};

const VenueSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--secondary-color);
  }
`;

const VenueInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const VenueName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const VenueAddress = styled.p`
  margin-bottom: 0.5rem;
`;

const VenueWebsite = styled.a`
  display: block;
  margin-bottom: 0.5rem;
  color: #8b5e3c;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  font-weight: 600;

  &:hover {
    color: #6f4629;
  }
`;

const VenueTel = styled.a`
  display: block;
  color: var(--secondary-color);
  text-decoration: none;
`;

const MapWrapper = styled.div`
  height: 26rem;
  margin-bottom: 1rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  overflow: hidden;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
`;

const TransportCard = styled(Card)``;
const ParkingCard = styled(Card)``;

const CardTitle = styled.h4`
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const SubsectionTitle = styled.h5`
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const TransportItem = styled.div`
  margin-bottom: 1rem;
`;

const TransportLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

const TransportText = styled.p`
  font-size: 0.875rem;
  color: var(--text-medium);
  white-space: pre-line;
`;

const AirportList = styled.div`
  margin: 0.5rem 0 1rem 0;
`;

const AirportItem = styled.p`
  font-size: 0.875rem;
  color: var(--text-medium);
  margin-bottom: 0.25rem;
`;

export default VenueSection; 
