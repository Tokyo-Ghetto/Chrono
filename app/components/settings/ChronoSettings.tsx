import { UserProfile } from "@clerk/remix";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Settings } from "lucide-react";

const DEFAULT_VIEWS = [
  { label: "Overview", value: "/overview" },
  { label: "Portfolio", value: "/portfolio" },
  { label: "Calculator", value: "/compound" },
] as const;

export function ChronoSettings() {
  const pageProps = {
    url: "chrono",
    label: "Chrono",
    labelIcon: <Settings className="h-4 w-4" />,
  };

  return (
    <UserProfile.Page {...pageProps}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Chrono Preferences</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Customize your experience on Chrono
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="defaultView">Default View</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Choose which page to show after logging in
              </p>
            </div>
            <Select defaultValue="/overview">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_VIEWS.map((view) => (
                  <SelectItem key={view.value} value={view.value}>
                    {view.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="currency">Currency</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Select your preferred currency for displaying prices
              </p>
            </div>
            <Select defaultValue="USD">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Receive notifications about price alerts and portfolio updates
              </p>
            </div>
            <Switch
              className="data-[state=checked]:bg-primary !bg-white !text-black !border-zinc-800 border-spacing-1"
              id="notifications"
            />
          </div>
        </div>
      </div>
    </UserProfile.Page>
  );
}
