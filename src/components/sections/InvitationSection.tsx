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
      ? 'Nuestros pasos, mirandonos el uno al otro,\nahora se unen en un solo camino.\n\nCon amor y confianza,\nempezamos una nueva familia.\nQueremos celebrar este pequeno inicio contigo.'
      : 'Unsere Schritte, waehrend wir einander ansehen,\nvereinen sich nun zu einem gemeinsamen Weg.\n\nMit Liebe und Vertrauen,\nbeginnen wir unsere neue Familie.\nBitte feiert diesen kleinen Anfang mit uns.';
  const groomLabel = language === 'es' ? 'Novio' : 'Braeutigam';
  const brideLabel = language === 'es' ? 'Novia' : 'Braut';

  return (
    <InvitationSectionContainer $bgColor={bgColor}>
      <InvitationMessage>{message}</InvitationMessage>

      <CoupleContainer>
        <CoupleInfo>
          <ParentsNames>
            <ParentLabel>{groomLabel}</ParentLabel>
          </ParentsNames>
          <CoupleName>{invitation.groom.name}</CoupleName>
        </CoupleInfo>

        <CoupleInfo>
          <ParentsNames>
            <ParentLabel>{brideLabel}</ParentLabel>
          </ParentsNames>
          <CoupleName>{invitation.bride.name}</CoupleName>
        </CoupleInfo>
      </CoupleContainer>
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
