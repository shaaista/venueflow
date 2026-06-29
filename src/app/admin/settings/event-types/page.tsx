import { Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "@/components/admin/settings/settings-ui";
import { EVENT_TYPES } from "@/lib/mock/venue";

export default function EventTypesSettings() {
  return (
    <SettingsSection
      title="Event types"
      description="The categories customers can choose when enquiring."
      footer={<Button size="sm"><Plus className="h-4 w-4" /> Add type</Button>}
    >
      <div className="space-y-2">
        {EVENT_TYPES.slice(0, 8).map((e) => (
          <div key={e.slug} className="flex items-center gap-3 rounded-xl border border-line p-3">
            <GripVertical className="h-4 w-4 cursor-grab text-cocoa-ghost" />
            <span className="flex-1 text-sm font-medium text-cocoa">{e.name}</span>
            <span className="text-xs text-cocoa-faint">{e.guests}</span>
            <button className="text-xs text-espresso-600 hover:underline">Edit</button>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
