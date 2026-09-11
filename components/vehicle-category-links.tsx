import { ArrowRight } from 'lucide-react';

import { vehicleTypes } from '@/lib/vehicle-types';

export function VehicleCategoryLinks({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`grid gap-3 ${compact ? 'sm:grid-cols-3 lg:grid-cols-6' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
    >
      {vehicleTypes.map((type, index) => (
        <a
          className="group flex min-h-24 items-end justify-between border-2 border-navy bg-white p-4 text-navy shadow-[4px_4px_0_rgba(7,28,44,.16)] transition hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-[5px_5px_0_#16b9ad]"
          href={`/search?type=${type.value}`}
          key={type.value}
        >
          <span>
            <span className="block text-[10px] font-black tracking-[0.2em] text-teal-700">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-2 block font-black uppercase leading-tight">
              {type.label}
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 transition group-hover:translate-x-1" />
        </a>
      ))}
    </div>
  );
}
