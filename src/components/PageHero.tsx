export function PageHero({ title, subtitle, image, eyebrow = 'Top Cloud Rwenzori Adventures', article = false }: { title: string; subtitle: string; image: string; eyebrow?: string; article?: boolean }) {
  return (
    <section className="relative grid min-h-[420px] place-items-center overflow-hidden bg-black px-5 py-24 text-center text-white">
      <img className="absolute inset-0 h-full w-full object-cover opacity-62" src={image} alt="" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0_/_0.78),rgb(0_0_0_/_0.44))]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="section-eyebrow text-white/70">{eyebrow}</p>
        <h1 className={`mt-4 break-words font-black uppercase leading-tight ${article ? 'text-[clamp(1.6rem,3.2vw,2.5rem)] tracking-[0.04em]' : 'text-[clamp(2rem,4vw,3.25rem)] tracking-[0.1em]'}`}>{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72">{subtitle}</p>
      </div>
    </section>
  )
}
