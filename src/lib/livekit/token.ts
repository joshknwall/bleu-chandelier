import { AccessToken } from "livekit-server-sdk";

export async function generateToken(
  roomName: string,
  participantIdentity: string,
  participantName: string,
  metadata?: Record<string, string>
) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit API key and secret are required");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
}
