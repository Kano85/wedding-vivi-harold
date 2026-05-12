'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { type SiteLanguage } from '../../lib/i18n';

interface MusicSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const MAIN_PLAYLIST_URL = 'https://open.spotify.com/playlist/6GhaJJGssNFuMNQnYz7p9N';

const MusicSection = ({ bgColor = 'white', language }: MusicSectionProps) => {
  const [noSpotifyMessage, setNoSpotifyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const t = language === 'es'
    ? {
        title: 'Solicitudes de Musica',
        intro: 'Añade tus canciones favoritas a esta lista.',
        noSpotifyTitle: 'No tengo Spotify',
        noSpotifyMessage: 'Mensaje para enviar por correo',
        noSpotifyPlaceholder: 'Escribe aqui tu sugerencia musical...',
        sendEmail: 'Enviar mensaje por correo',
        sendingEmail: 'Enviando...',
        playlistLinksTitle: 'Listas de la fiesta',
        mainPlaylist: 'Wedding V&H 2026',
        addEmailMessage: 'Escribe un mensaje para enviar por correo.',
        emailSent: 'Mensaje enviado correctamente.',
        emailFailed: 'No se pudo enviar el mensaje. Intentalo de nuevo.',
      }
    : {
        title: 'Musikwünsche',
        intro: 'Füge deine Lieblingssongs in diese Liste hinzu.',
        noSpotifyTitle: 'Kein Spotify?',
        noSpotifyMessage: 'Nachricht per E-Mail senden',
        noSpotifyPlaceholder: 'Schreibe hier deinen Musikwunsch...',
        sendEmail: 'Per E-Mail senden',
        sendingEmail: 'Wird gesendet...',
        playlistLinksTitle: 'Playlists fuer die Feier',
        mainPlaylist: 'Wedding V&H 2026',
        addEmailMessage: 'Bitte schreibe eine Nachricht fuer die E-Mail.',
        emailSent: 'Nachricht wurde erfolgreich gesendet.',
        emailFailed: 'Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.',
      };

  const onSendEmail = async () => {
    setEmailError('');
    setEmailSuccess('');
    if (!noSpotifyMessage.trim()) {
      setEmailError(t.addEmailMessage);
      return;
    }
    setIsSending(true);

    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: noSpotifyMessage.trim(),
          language,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('send-failed');
      }

      setEmailSuccess(t.emailSent);
      setNoSpotifyMessage('');
    } catch (error) {
      console.error('Music email send error:', error);
      setEmailError(t.emailFailed);
    } finally {
      setIsSending(false);
    }
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

          <SubmitButton
            type="button"
            onClick={onSendEmail}
            disabled={isSending || !noSpotifyMessage.trim()}
          >
            {isSending ? t.sendingEmail : t.sendEmail}
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
