function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type DirectorAvatarProps = {
  name: string;
  photo: string | null;
  className?: string;
  /** Extra classes applied to the <img> itself (e.g. a scale transform to
   *  zoom the photo in) without affecting the frame size/shape set by
   *  `className` — the frame clips whatever the image renders. */
  imageClassName?: string;
};

/** Headshot when we have one, otherwise a chalk-styled initials tile so a
 *  missing photo never breaks the grid — swap in a real file at `photo`'s
 *  path whenever one's available and this falls away automatically. */
export function DirectorAvatar({ name, photo, className = "", imageClassName = "" }: DirectorAvatarProps) {
  if (photo) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={photo} alt={name} className={`w-full h-full object-cover ${imageClassName}`} />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-chalkboard text-chalk font-display font-black text-4xl sm:text-5xl ${className}`}
      role="img"
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
