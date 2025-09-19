
import AddautomationButton from "@/custom-component/automation/add-automation-button"

export default function AutomationPage() {
  return (
    <section className="px-6 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border flex justify-between border-white/10 bg-white/5 p-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Automation</h1>
          <p className="mt-2 text-white/70">Select a media, configure replies/DMs, and save.</p>
          </div>
          <AddautomationButton />
          {/* <AddAutomation/> */}
        </div>
      </div>
    </section>
  )
}


