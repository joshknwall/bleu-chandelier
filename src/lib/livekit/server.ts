import { RoomServiceClient, EgressClient } from "livekit-server-sdk";

function getLiveKitUrl(): string {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!url) throw new Error("NEXT_PUBLIC_LIVEKIT_URL is required");
  return url;
}

function getCredentials() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit API key and secret are required");
  }
  return { apiKey, apiSecret };
}

export function getRoomService() {
  const { apiKey, apiSecret } = getCredentials();
  return new RoomServiceClient(getLiveKitUrl(), apiKey, apiSecret);
}

export function getEgressClient() {
  const { apiKey, apiSecret } = getCredentials();
  return new EgressClient(getLiveKitUrl(), apiKey, apiSecret);
}
