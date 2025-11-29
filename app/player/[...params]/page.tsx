"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useMovieById from "@/hook/api-hook/get-movie-by-id";
import ZXCPlayer from "../player";
import { useLibreSubsTV } from "@/hook/api-hook/subtitle-hooks";
import useSource from "@/hook/api-hook/source";

export default function WatchMode() {
  const router = useRouter();
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const [open, setOpen] = useState(true);
  const dataQuery = useMovieById({ media_type, id });

  const metaData = dataQuery.data;

  const subtitleQuery = useLibreSubsTV({
    imdbId: metaData?.external_ids?.imdb_id ?? "",
    season: media_type === "tv" ? season : undefined,
    episode: media_type === "tv" ? episode : undefined,
  });
  const sourceQuery = useSource({
    media_type,
    id,
    season,
    episode,
    imdbId: metaData?.external_ids.imdb_id ?? "",
  });
  const sourceData = sourceQuery.data;
  const sourceLoading = sourceQuery.isLoading;

  return (
    <ZXCPlayer
      subtitleQuery={subtitleQuery.data ?? []}
      metaData={metaData ?? null}
      sourceData={sourceData ?? null}
      sourceLoading={sourceLoading}
    />
  );
}
