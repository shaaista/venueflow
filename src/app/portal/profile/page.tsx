import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/admin/settings/settings-ui";

const inputCls = "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-cocoa outline-none focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

export default function PortalProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">Profile &amp; Settings</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Manage your details and preferences.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden">
          <div className="border-b border-line p-5">
            <h2 className="font-display text-lg text-cocoa">Personal details</h2>
          </div>
          <div className="space-y-5 p-5">
            <div className="flex items-center gap-4">
              <Image src="https://i.pravatar.cc/120?img=5" alt="Eleanor Vance" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
              <Button variant="outline" size="sm"><Upload className="h-4 w-4" /> Change photo</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelCls}>First name</label><input className={inputCls} defaultValue="Eleanor" /></div>
              <div><label className={labelCls}>Last name</label><input className={inputCls} defaultValue="Vance" /></div>
              <div><label className={labelCls}>Email</label><input className={inputCls} defaultValue="eleanor@vancemail.com" /></div>
              <div><label className={labelCls}>Phone</label><input className={inputCls} defaultValue="+1 (555) 234-8901" /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} defaultValue="Portland, OR" /></div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-line bg-panel/40 px-5 py-3.5">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm">Save changes</Button>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-display text-lg text-cocoa">Notifications</h2>
          <div className="space-y-1">
            <Toggle label="Email updates" description="Event reminders and messages." defaultOn />
            <Toggle label="SMS reminders" description="Texts before key dates." defaultOn />
            <Toggle label="Payment receipts" description="Confirmation for each payment." defaultOn />
            <Toggle label="Marketing" description="Seasonal offers and news." />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <Link href="/login"><Button variant="outline" size="sm" className="w-full">Sign out</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
