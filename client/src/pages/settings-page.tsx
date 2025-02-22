import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTheme } from "next-themes";

type UserSettings = {
  theme?: "light" | "dark";
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    if (user) {
      const newSettings: UserSettings = {
        ...(user.settings as UserSettings),
        theme: newTheme
      };

      apiRequest("PATCH", "/api/user/settings", {
        settings: newSettings
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the chat interface looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark mode</Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}