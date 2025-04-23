import { ArtWork } from "@/lib/db/models/artwork.model";

export const createArtwork = async ({
  title,
  description,
  image_urls,
  tags,
  artistId,
}: {
  title: string;
  description: string;
  image_urls: string[];
  tags: string[];
  artistId: string;
}) => {
  const newArtWork = await ArtWork.create({
    title,
    description,
    image_urls,
    tags,
    artist: artistId,
  });

  return {
    message: "Artwork created successfully",
    artworkId: newArtWork._id,
  };
};
