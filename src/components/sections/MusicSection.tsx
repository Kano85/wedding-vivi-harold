'use client';

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { type SiteLanguage } from '../../lib/i18n';

interface MusicSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const MAIN_PLAYLIST_URL = 'https://open.spotify.com/playlist/6GhaJJGssNFuMNQnYz7p9N?si=QYGiFNqZQtiDeegBO3r3FA&pt=0e69056afa0572b5b14d2ca133d8009b&pi=Hwrctb9MRTSb4';

const MusicSection = ({ bgColor = 'white', language }: MusicSectionProps) => {
  const [noSpotifyMessage, setNoSpotifyMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const musicContactEmail = process.env.NEXT_PUBLIC_MUSIC_CONTACT_EMAIL || 'Strube.cano@gmail.com';
  const t = language === 'es'
    ? {
        title: 'Solicitudes de Musica',
        intro: 'Añade tus canciones favoritas a esta lista.',
        noSpotifyTitle: 'No tengo Spotify',
        noSpotifyMessage: 'Mensaje para enviar por correo',
        noSpotifyPlaceholder: 'Escribe aqui tu sugerencia musical...',
        sendEmail: 'Enviar mensaje por correo',
        playlistLinksTitle: 'Listas de la fiesta',
        mainPlaylist: 'Wedding V&H 2026',
        configureEmail: 'Configura NEXT_PUBLIC_MUSIC_CONTACT_EMAIL para habilitar este envio.',
        addEmailMessage: 'Escribe un mensaje para enviar por correo.',
        emailSent: 'Mensaje preparado en tu correo. Revisa y envia para completar.',
      }
    : {
        title: 'Musikwünsche',
        intro: 'Füge deine Lieblingssongs in diese Liste hinzu.',
        noSpotifyTitle: 'Kein Spotify?',
        noSpotifyMessage: 'Nachricht per E-Mail senden',
        noSpotifyPlaceholder: 'Schreibe hier deinen Musikwunsch...',
        sendEmail: 'Per E-Mail senden',
        playlistLinksTitle: 'Playlists fuer die Feier',
        mainPlaylist: 'Wedding V&H 2026',
        configureEmail: 'Bitte NEXT_PUBLIC_MUSIC_CONTACT_EMAIL konfigurieren, um E-Mails zu senden.',
        addEmailMessage: 'Bitte schreibe eine Nachricht fuer die E-Mail.',
        emailSent: 'Nachricht ist in deiner E-Mail-App vorbereitet. Bitte sende sie dort ab.',
      };

  const emailHref = useMemo(() => {
    if (!musicContactEmail || !noSpotifyMessage.trim()) {
      return '';
    }
    const subject = language === 'es'
      ? 'Sugerencia musical para la boda'
      : 'Musikwunsch fuer die Hochzeit';
    const body = noSpotifyMessage.trim();
    return `mailto:${musicContactEmail.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [musicContactEmail, noSpotifyMessage, language]);

  const onSendEmail = () => {
    setEmailError('');
    setEmailSuccess('');
    if (!musicContactEmail) {
      setEmailError(t.configureEmail);
      return;
    }
    if (!noSpotifyMessage.trim()) {
      setEmailError(t.addEmailMessage);
      return;
    }
    setEmailSuccess(t.emailSent);
    setTimeout(() => {
      window.location.href = emailHref;
    }, 150);
  };

  return (
    <SectionContainer $bgColor={bgColor}>
      <SectionTitle>{t.title}</SectionTitle>
      <SectionIntro>{t.intro}</SectionIntro>
      <PlaylistLinks aria-label={t.playlistLinksTitle}>
        <PlaylistLink href={MAIN_PLAYLIST_URL} target="_blank" rel="noreferrer">
          {t.mainPlaylist}
        </PlaylistLink>
      </PlaylistLinks>

      <FormCard>
        <NoSpotifyTitle>{t.noSpotifyTitle}</NoSpotifyTitle>
        <Form>
          <Field>
            <Label htmlFor="music-no-spotify-message">{t.noSpotifyMessage}</Label>
            <TextArea
              id="music-no-spotify-message"
              value={noSpotifyMessage}
              onChange={(e) => setNoSpotifyMessage(e.target.value)}
              placeholder={t.noSpotifyPlaceholder}
            />
          </Field>

          {emailError && <ErrorText>{emailError}</ErrorText>}
          {emailSuccess && <SuccessText>{emailSuccess}</SuccessText>}
          {!musicContactEmail && <HelpText>{t.configureEmail}</HelpText>}

          <SubmitButton
            type="button"
            onClick={onSendEmail}
            disabled={!musicContactEmail}
          >
            {t.sendEmail}
          </SubmitButton>
        </Form>
      </FormCard>
    </SectionContainer>
  );
};

const SectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
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

const SectionIntro = styled.p`
  max-width: 36rem;
  margin: 0 auto 2rem;
  color: var(--text-medium);
`;

const PlaylistLinks = styled.div`
  max-width: 36rem;
  margin: 0 auto 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PlaylistLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.62rem 1.05rem;
  border-radius: 999px;
  background: #f97316;
  border: 2px solid #ea580c;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.35);
  transition: transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &:hover {
    background: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(239, 68, 68, 0.4);
  }
`;

const FormCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin: 0 auto 2rem;
  max-width: 36rem;
  text-align: left;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Field = styled.div`
  display: grid;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  font-size: 0.95rem;
  font-family: inherit;
  min-height: 7rem;
  resize: vertical;
`;

const NoSpotifyTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
`;

const HelpText = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-medium);
`;

const ErrorText = styled.p`
  color: #b91c1c;
  font-size: 0.85rem;
  margin: 0;
`;

const SuccessText = styled.p`
  color: #166534;
  font-size: 0.85rem;
  margin: 0;
`;

const SubmitButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c4a986;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default MusicSection;
