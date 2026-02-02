'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const STORAGE_KEY = 'wedding_music_requests_v1';

type Submission = {
  id: string;
  name: string;
  message: string;
  spotifyUrl: string;
  createdAt: string;
};

const isSpotifyUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const isTrack = /\/track\//.test(parsed.pathname);
    const isPlaylist = /\/playlist\//.test(parsed.pathname);
    return parsed.hostname.endsWith('spotify.com') && (isTrack || isPlaylist);
  } catch {
    return false;
  }
};

const toEmbedUrl = (url: string) => {
  return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
};

const loadStored = (): Submission[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Submission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStored = (items: Submission[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

interface MusicSectionProps {
  bgColor?: 'white' | 'beige';
}

const MusicSection = ({ bgColor = 'white' }: MusicSectionProps) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState<Submission[]>([]);

  useEffect(() => {
    setItems(loadStored());
  }, []);

  const orderedItems = useMemo(() => {
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please add your name.');
      return;
    }

    const expectedPassword = process.env.NEXT_PUBLIC_MUSIC_SUBMIT_PASSWORD || '';
    if (!expectedPassword || password.trim() !== expectedPassword) {
      setError('Incorrect password.');
      return;
    }

    if (!spotifyUrl.trim() || !isSpotifyUrl(spotifyUrl.trim())) {
      setError('Please add a valid Spotify track or playlist link.');
      return;
    }

    const next: Submission = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      spotifyUrl: spotifyUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [next, ...items];
    setItems(updated);
    saveStored(updated);

    setName('');
    setMessage('');
    setSpotifyUrl('');
    setPassword('');
  };

  return (
    <SectionContainer $bgColor={bgColor}>
      <SectionTitle>Music Requests</SectionTitle>
      <SectionIntro>
        Share a Spotify track or playlist for the celebration. We will review and add favorites closer to the date.
      </SectionIntro>

      <FormCard>
        <Form onSubmit={onSubmit}>
          <Field>
            <Label htmlFor="music-name">Name</Label>
            <Input
              id="music-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>

          <Field>
            <Label htmlFor="music-message">Message (optional)</Label>
            <Input
              id="music-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why this song?"
            />
          </Field>

          <Field>
            <Label htmlFor="music-spotify">Spotify URL</Label>
            <Input
              id="music-spotify"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
            />
          </Field>

          <Field>
            <Label htmlFor="music-password">Password</Label>
            <Input
              id="music-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password required"
            />
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </FormCard>

      {orderedItems.length > 0 && (
        <List>
          {orderedItems.map((item) => (
            <ListItem key={item.id}>
              <ListHeader>
                <ListName>{item.name}</ListName>
                <ListDate>{new Date(item.createdAt).toLocaleDateString()}</ListDate>
              </ListHeader>
              {item.message && <ListMessage>{item.message}</ListMessage>}
              <Embed
                src={toEmbedUrl(item.spotifyUrl)}
                title={`${item.name} spotify request`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </ListItem>
          ))}
        </List>
      )}
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

const Input = styled.input`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  font-size: 0.95rem;
  font-family: inherit;
`;

const ErrorText = styled.p`
  color: #b91c1c;
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
`;

const List = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
`;

const ListItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ListName = styled.p`
  font-weight: 500;
  margin: 0;
`;

const ListDate = styled.p`
  margin: 0;
  color: var(--text-medium);
  font-size: 0.8rem;
`;

const ListMessage = styled.p`
  margin: 0 0 0.75rem;
  color: var(--text-medium);
  font-size: 0.9rem;
`;

const Embed = styled.iframe`
  width: 100%;
  height: 152px;
  border: none;
  border-radius: 12px;
`;

export default MusicSection;
