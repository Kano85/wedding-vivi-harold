'use client';

import React from 'react';
import styled from 'styled-components';
import type { SiteLanguage } from '../../lib/i18n';

interface InvitationSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const InvitationSection = ({ bgColor = 'white', language }: InvitationSectionProps) => {
  const message =
    language === 'es'
      ? 'Todo empezó con un "sí".\n\nHoy empieza nuestra nueva etapa\ny queremos que estés en el primer capítulo.'
      : 'Alles begann mit einem „Ja“.\n\nHeute beginnt unser neuer Lebensabschnitt\nund wir möchten, dass du Teil des ersten Kapitels bist.';
  const dressCodeTitle = language === 'es' ? 'Dresscode' : 'Dresscode';
  const dressCodeText =
    language === 'es'
      ? 'Boda de tarde al aire libre.\nVen arreglado, fresco y cómodo.\nLa corbata es opcional.\n\nY, sobre todo, ven con ganas de disfrutar, vivir una tarde preciosa y llevarte una experiencia especial.'
      : 'Abend-Hochzeit im Freien.\nKomm festlich gekleidet, aber locker und bequem.\nEine Krawatte ist optional.\n\nUnd vor allem: Komm mit Lust zu feiern, einen wunderschönen Nachmittag zu erleben und einen ganz besonderen Moment mit nach Hause zu nehmen.';

  return (
    <InvitationSectionContainer $bgColor={bgColor}>
      <InvitationMessage>{message}</InvitationMessage>
      <Separator />
      <SectionTitle>{dressCodeTitle}</SectionTitle>
      <InvitationMessage>{dressCodeText}</InvitationMessage>
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

export default InvitationSection;
