import { MapPin } from "lucide-react";

// import { Card } from "@/components/ui/card";
import type { Profile } from "@/pages/Profile/types/profile.types";


interface Props {
  profile: Profile;
}

export function AddressCard({
  profile,
}: Props) {
  const address = profile.personalInfo.address;

  return (
    <div className="rounded-3xl">

      <div className="flex items-center gap-2">

        <MapPin className="h-5 w-5 text-primary"/>

        <h3 className="font-semibold">
          Address
        </h3>

      </div>

      <div className="mt-3 space-y-2">

        <p className="font-medium">

          {address.line1}

        </p>

        <p className="text-muted-foreground">

          {address.city},{" "}
          {address.state}

        </p>

        <p className="text-muted-foreground">

          {address.country} • {address.zipCode}

        </p>

      </div>

    </div>
  );
}