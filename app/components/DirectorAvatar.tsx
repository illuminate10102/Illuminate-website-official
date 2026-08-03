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
};

/** Headshot when we have one, otherwise a chalk-styled initials tile so a
 *  missing photo never breaks the grid — swap in a real file at `photo`'s
 *  path whenever one's available and this falls away automatically. */
export function DirectorAvatar({ name, photo, className = "" }: DirectorAvatarProps) {
  if (photo) {
    return <img src={photo} alt={name} className={className} />;
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
