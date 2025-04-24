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

export const getArtWorksByArtistId = async (artistId: string) => {
  const artworks = await ArtWork.find({ artist: artistId }).populate("artist", {
    first_name: 1,
    last_name: 1,
    profile_picture_url: 1,
  });

  return artworks;
};
