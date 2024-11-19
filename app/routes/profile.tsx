import { UserProfile } from "@clerk/remix";
import { Settings } from "lucide-react";
import { ChronoSettings } from "~/components/settings/ChronoSettings";

export default function ProfilePage() {
  return (
    <div className="mt-8 mx-auto max-w-4xl">
      <UserProfile>
        <UserProfile.Page
          url="chrono"
          label="Chrono"
          labelIcon={<Settings className="h-4 w-4" />}
        >
          <ChronoSettings />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
}
