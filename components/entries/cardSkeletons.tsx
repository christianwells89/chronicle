import { EntryCardsContainer } from './cardsContainer';
import { EntryCardSkeleton } from './cardSkeleton';

export const EntryCardsSkeleton: React.FC<{ length: number }> = ({ length }) => (
  <EntryCardsContainer>
    {Array.from({ length }, (x, i) => i).map((i) => (
      <EntryCardSkeleton key={`skeleton-${i}`} />
    ))}
  </EntryCardsContainer>
);
