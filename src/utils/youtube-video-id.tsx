export function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*\?v=)|youtu\.be\/)([\w-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : null;
}
