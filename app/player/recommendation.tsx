import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { MovieTypes, RecommendedMovieTypes } from "@/types/movie-by-id";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import useHoverSound from "@/hook/sound-hover-hook";
import { useSearchParams } from "next/navigation";
export default function Recommendations({
  recommendations,
}: {
  recommendations: RecommendedMovieTypes[];
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const isSearching = Boolean(query);
  const playHover = useHoverSound("/keyboard.wav");
  return (
    <div className="space-y-3">
      <Swiper
        spaceBetween={6}
        navigation={true}
        keyboard={{ enabled: true }}
        scrollbar={{
          el: ".swiper-scrollbar",
          hide: false,
        }}
        slidesPerGroup={10}
        data-vaul-no-drag
        slidesPerView={10}
        modules={[Navigation, Pagination, Keyboard, Scrollbar]}
        breakpoints={{
          0: {
            // phones
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          480: {
            // bigger phones
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          640: {
            // small tablets
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
          768: {
            // tablets
            slidesPerView: 6,
            slidesPerGroup: 6,
          },
          1024: {
            // laptops
            slidesPerView: 8,
            slidesPerGroup: 8,
          },
          1280: {
            // desktops
            slidesPerView: 10,
            slidesPerGroup: 10,
          },
        }}
      >
        {recommendations.map((movie) => (
          <SwiperSlide key={movie.id} className="p-1">
            <Link
              href={`/player/${movie.media_type}/${movie.id}${
                isSearching ? `?query=${query}` : ""
              }`}
            >
              <div className="group p-px rounded-sm bg-linear-to-b hover:to-red-800 from-transparent active:scale-98 active:from-red-800">
                <div
                  className="aspect-2/3   rounded-sm  transition cursor-pointer overflow-hidden relative "
                  onMouseEnter={playHover}
                >
                  {movie.poster_path && (
                    <img
                      src={`${IMAGE_BASE_URL}/w780${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/50 opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
              <div className="mt-3">
                <h1 className="text-sm font-light truncate">{movie.title}</h1>
                <p className="text-xs text-muted-foreground">
                  {new Date(movie.release_date).getFullYear()} •{" "}
                  {movie.vote_average.toFixed(1)} ★
                </p>
              </div>{" "}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
