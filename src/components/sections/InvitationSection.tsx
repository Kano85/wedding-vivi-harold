'use client';

import React from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import type { SiteLanguage } from '../../lib/i18n';

interface InvitationSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const InvitationSection = ({ bgColor = 'white', language }: InvitationSectionProps) => {
  const { invitation } = weddingConfig;
  const message =
    language === 'es'
      ? 'Todo empezó con un "sí".\n\nHoy empieza nuestra nueva etapa\ny queremos que estés en el primer capítulo.'
      : 'Alles begann mit einem „Ja“.\n\nHeute beginnt unser neuer Lebensabschnitt\nund wir möchten, dass du Teil des ersten Kapitels bist.';
  const groomLabel = language === 'es' ? 'Novio' : 'Bräutigam';
  const brideLabel = language === 'es' ? 'Novia' : 'Braut';
  const dressCodeTitle = language === 'es' ? 'Dresscode' : 'Dresscode';
  const dressCodeText =
    language === 'es'
      ? 'Boda de tarde en la finca.\nVen arreglado, fresco y cómodo.\nLa corbata es opcional.\n\nY, sobre todo, ven con ganas de disfrutar, vivir una tarde preciosa y llevarte una experiencia especial.'
      : 'Nachmittags-Hochzeit auf dem Landgut.\nKomm festlich gekleidet, aber frisch und bequem.\nEine Krawatte ist optional.\n\nUnd vor allem: Komm mit Lust zu feiern, einen wunderschönen Nachmittag zu erleben und einen ganz besonderen Moment mit nach Hause zu nehmen.';
  const importantInfoTitle = language === 'es' ? 'Información importante' : 'Wichtige Informationen';
  const importantInfoText =
    language === 'es'
      ? 'La celebración tendrá lugar en:\n\n📍 La Farinera Sant Lluís'
      : 'Die Feier findet hier statt:\n\n📍 La Farinera Sant Lluís';
  const importantInfoTextAfterLink =
    language === 'es'
      ? 'La ceremonia comenzará a las 17:00.\n\nSi llegas el sábado, puedes venir durante el día.\nPodéis llegar cuando queráis y disfrutar del entorno con calma antes de que empiece la celebración.'
      : 'Die Zeremonie beginnt um 17:00 Uhr.\n\nFür alle, die bereits am Samstag anreisen: Ihr könnt tagsüber jederzeit kommen und die Umgebung in Ruhe genießen, bevor die Feier beginnt.';

  return (
    <InvitationSectionContainer $bgColor={bgColor}>
      <InvitationMessage>{message}</InvitationMessage>
      <Separator />

      <CoupleContainer>
        <CoupleInfo>
          <ParentsNames>
            <ParentLabel>{brideLabel}</ParentLabel>
          </ParentsNames>
          <CoupleName>{invitation.bride.name}</CoupleName>
        </CoupleInfo>

        <CoupleInfo>
          <ParentsNames>
            <ParentLabel>{groomLabel}</ParentLabel>
          </ParentsNames>
          <CoupleName>
            {language === 'es' ? 'Harold Cano Cárdenas' : 'Harold Cano Cárdenas'}
          </CoupleName>
        </CoupleInfo>
      </CoupleContainer>

      <Separator />
      <SectionTitle>{dressCodeTitle}</SectionTitle>
      <InvitationMessage>{dressCodeText}</InvitationMessage>
      <Separator />
      <SectionTitle>{importantInfoTitle}</SectionTitle>
      <InvitationMessage>{importantInfoText}</InvitationMessage>
      <VenueLink
        href="https://lafarinerasantlluis.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        lafarinerasantlluis.com
      </VenueLink>
      <InvitationMessage>{importantInfoTextAfterLink}</InvitationMessage>
    </InvitationSectionContainer>
  );
};

const InvitationSectionContainer = styled.section<{
  $bgColor: 'white' | 'beige';
}>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${(props) =>
    props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const InvitationMessage = styled.p`
  white-space: pre-line;
  line-height: 1.8;
  max-width: 36rem;
  margin: 0 auto 2rem auto;
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const VenueLink = styled.a`
  display: inline-block;
  margin: -1rem auto 2rem auto;
  color: #8b5e3c;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  font-weight: 600;

  &:hover {
    color: #6f4629;
  }
`;

const Separator = styled.hr`
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.18);
  width: min(36rem, calc(100% - 3rem));
  margin: 2rem auto;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 auto 1rem auto;
`;

const CoupleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 4rem;
  }
`;

const CoupleInfo = styled.div`
  text-align: center;
`;

const ParentsNames = styled.p`
  margin-bottom: 0.25rem;
`;

const ParentLabel = styled.span`
  font-size: 0.875rem;
  margin-left: 0.25rem;
`;

const CoupleName = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
`;

export default InvitationSection;
