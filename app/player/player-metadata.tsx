import { MovieTypes } from "@/types/movie-by-id";

export default function PlayerMetaData({
  metaData,
}: {
  metaData: MovieTypes | null;
}) {
  return (
    <div className="lg:max-w-[38%] max-w-[90%]">
      {metaData?.genres && (
        <div className="inline-block px-4 py-1 bg-red-500/20  tracking-wide uppercase  rounded-full text-xs text-red-600 mb-6">
          {metaData?.genres[0].name}
        </div>
      )}

      <h1 className="lg:text-6xl text-3xl font-bold mb-6 leading-none">
        {metaData?.title || metaData?.name}
      </h1>
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="lg:text-3xl text-2xl lg:font-bold font-medium text-red-500">
            {metaData?.vote_average.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">/ 10</div>
        </div>
        <div className="h-8 w-px bg-white/10"></div>
        <div className="text-muted-foreground">
          {metaData?.release_date ||
            (metaData?.first_air_date &&
              new Date(
                metaData?.release_date || metaData?.first_air_date
              ).getFullYear())}
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-10 line-clamp-4 lg:text-base text-sm">
        {metaData?.overview}
      </p>
    </div>
  );
}
