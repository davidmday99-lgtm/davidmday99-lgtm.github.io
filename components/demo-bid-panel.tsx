'use client';

import { useState } from 'react';
import { Gavel, LockKeyhole, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/demo-data';
import {
  nextMinimumBid,
  type ReserveStatus,
  reserveLabel,
} from '@/lib/private-auction-data';

export function DemoBidPanel({
  currentBid: initialBid,
  bidCount: initialCount,
  minimumIncrement,
  reserveStatus,
}: {
  currentBid: number;
  bidCount: number;
  minimumIncrement: number;
  reserveStatus: ReserveStatus;
}) {
  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidCount, setBidCount] = useState(initialCount);
  const [maximumBid, setMaximumBid] = useState(
    String(nextMinimumBid(initialBid, minimumIncrement)),
  );
  const [message, setMessage] = useState('');
  const nextBid = nextMinimumBid(currentBid, minimumIncrement);

  function placeDemoBid(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(maximumBid);

    if (!Number.isFinite(amount) || amount < nextBid) {
      setMessage(`Enter at least ${formatPrice(nextBid)}.`);
      return;
    }

    setCurrentBid(nextBid);
    setBidCount((count) => count + 1);
    setMaximumBid(String(nextBid + minimumIncrement));
    setMessage(
      `Demo maximum noted at ${formatPrice(amount)}; the visible bid moved to ${formatPrice(nextBid)}. Nothing was submitted or saved.`,
    );
  }

  return (
    <aside className="border-[3px] border-[#061C2B] bg-white p-6 shadow-[8px_8px_0_#16C7BE] lg:sticky lg:top-28">
      <div className="flex items-start gap-3 border-2 border-[#FFB81C] bg-[#fff3cf] p-3 text-sm font-bold text-[#061C2B]">
        <TriangleAlert className="mt-0.5 size-5 shrink-0" />
        Demonstration only—this is not live bidding.
      </div>

      <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        Current demo bid
      </p>
      <p className="mt-1 text-5xl font-black tracking-[-0.05em] text-[#061C2B]">
        {formatPrice(currentBid)}
      </p>
      <div className="mt-4 flex items-center justify-between border-y border-slate-200 py-3 text-sm">
        <span>{bidCount} demo bids</span>
        <strong className="text-[#0B6F6A]">
          {reserveLabel(reserveStatus)}
        </strong>
      </div>

      <form className="mt-6" onSubmit={placeDemoBid}>
        <label
          className="text-sm font-black uppercase text-[#061C2B]"
          htmlFor="maximum-bid"
        >
          Your maximum bid
        </label>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Minimum {formatPrice(nextBid)} · {formatPrice(minimumIncrement)}{' '}
          increments
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Like proxy bidding, a live auction would keep your maximum private and
          increase the visible bid only as needed.
        </p>
        <div className="relative mt-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black">
            $
          </span>
          <Input
            className="h-12 rounded-none border-2 border-[#061C2B] pl-8 text-lg font-black"
            id="maximum-bid"
            inputMode="numeric"
            min={nextBid}
            onChange={(event) => setMaximumBid(event.target.value)}
            step={minimumIncrement}
            type="number"
            value={maximumBid}
          />
        </div>
        <Button
          className="mt-3 h-12 w-full rounded-none bg-[#FFB81C] font-black uppercase text-[#061C2B] hover:bg-[#16C7BE]"
          type="submit"
        >
          <Gavel /> Try demo bid
        </Button>
      </form>

      {message ? (
        <output className="mt-4 block border-l-4 border-[#16C7BE] bg-slate-50 p-3 text-sm font-bold">
          {message}
        </output>
      ) : null}

      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
        <LockKeyhole className="mt-0.5 size-4 shrink-0" />
        A live version will require sign-in, buyer verification, server-side bid
        validation, exact timestamps, and an audit trail.
      </p>
    </aside>
  );
}
