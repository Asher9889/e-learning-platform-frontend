import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  image?: string;
  name: string;
}

export function ProfileAvatar({ image, name }: ProfileAvatarProps) {
  return (
    <Avatar className="h-28 w-28 border-4 border-background shadow-md ring-1 ring-black/5">
      <AvatarImage src={image} />
      <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}