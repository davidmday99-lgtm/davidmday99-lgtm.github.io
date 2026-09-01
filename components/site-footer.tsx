import { CarFront } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-navy px-5 py-14 text-slate-300 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 font-bold text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-teal-400 text-navy">
              <CarFront className="size-5" />
            </span>
            OwnerOnly Cars
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6">
            A private-owner marketplace built to make the signals around
            identity, ownership, and vehicle history easier to understand.
          </p>
        </div>
        <FooterGroup
          title="Marketplace"
          links={[
            ['Buy from owners', '/search'],
            ['Private seller auctions', '/private-seller-auctions'],
            ['Public auto auctions', '/public-auto-auctions'],
            ['Sell your car', '/sell'],
            ['How it works', '/how-it-works'],
          ]}
        />
        <FooterGroup
          title="Company"
          links={[
            ['About', '/about'],
            ['Trust & safety', '/trust-and-safety'],
            ['Help & FAQ', '/help'],
          ]}
        />
        <FooterGroup
          title="Legal"
          links={[
            ['Terms', '/terms'],
            ['Privacy', '/privacy'],
            ['Accessibility', '/help#accessibility'],
          ]}
        />
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:justify-between">
        <p>© 2026 OwnerOnly Cars. Demonstration marketplace.</p>
        <p>
          Verification reduces risk; it does not guarantee a safe transaction.
        </p>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <a className="hover:text-white" href={href}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
