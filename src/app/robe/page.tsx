import WizardRobeViewer from "@/components/robe/WizardRobe";

export default function WizardRobePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Material Preview
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900">
            Wizard Robe — Velvet Sheen
          </h1>
          <p className="max-w-2xl text-sm text-neutral-600">
            Programmatic MeshPhysicalMaterial override applied to every mesh for
            a velvet-like finish.
          </p>
        </header>
        <WizardRobeViewer />
      </div>
    </main>
  );
}
