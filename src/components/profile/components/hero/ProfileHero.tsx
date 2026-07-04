import {
  Mail,
  Phone,
//   Pencil,
} from "lucide-react";

import { Card } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";


import { ProfileAvatar } from "./ProfileAvatar";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";
import type { Profile } from "@/pages/Profile/types/profile.types";
import { EditNameDialog } from "./EditNameDialog";
import { AddressCard } from "../cards/AddressCard";

interface Props {
  profile: Profile;

  onEditName?: () => void ;
}

export function ProfileHero({
  profile,
//   onEditName,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-3xl border bg-background shadow-sm">

      <div className="h-32 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      <div className="px-8 pb-8">

        <div className="-mt-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <ProfileAvatar
              image={profile.personalInfo.profileImage}
              name={profile.personalInfo.name}
            />

            <div>

              <h2 className="text-3xl font-bold">
                {profile.personalInfo.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">

                <RoleBadge role={profile.role} />

                <StatusBadge status={profile.status} />

              </div>

              <div className="mt-5 flex flex-col gap-2 text-muted-foreground">

                <div className="flex items-center gap-2">

                  <Mail className="h-4 w-4" />

                  {profile.email}

                </div>

                <div className="flex items-center gap-2">

                  <Phone className="h-4 w-4" />

                  {profile.phoneNumber}

                </div>

              </div>

            </div>

          </div>

          {/* <Button
            onClick={onEditName}
            className="rounded-xl"
          >
            <Pencil className="mr-2 h-4 w-4" />

            Edit Name
            
          </Button> */}
          <div className="flex flex-col gap-4">
                  <AddressCard profile={profile} />
          
           <EditNameDialog
    defaultName={profile.personalInfo.name}
/>
</div>
        </div>
       

      </div>

    </Card>
  );
}