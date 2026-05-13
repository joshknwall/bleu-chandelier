"use client";

import VideoTile from "./VideoTile";

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  isMuted?: boolean;
  isSelf?: boolean;
}

interface VideoGridProps {
  participants: Participant[];
}

export default function VideoGrid({ participants }: VideoGridProps) {
  const count = participants.length;

  const gridStyle: React.CSSProperties =
    count === 1
      ? { gridTemplateColumns: "1fr", maxWidth: 640, margin: "0 auto" }
      : count === 2
        ? { gridTemplateColumns: "1fr 1fr" }
        : count <= 4
          ? { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }
          : { gridTemplateColumns: "repeat(3, 1fr)" };

  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        overflowY: "auto",
        display: "grid",
        gap: 10,
        alignContent: "start",
        ...gridStyle,
      }}
    >
      {participants.map((p) => (
        <VideoTile
          key={p.id}
          name={p.name}
          avatarUrl={p.avatarUrl}
          isMuted={p.isMuted}
          isSelf={p.isSelf}
        />
      ))}
    </div>
  );
}
