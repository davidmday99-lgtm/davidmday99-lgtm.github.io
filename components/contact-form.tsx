'use client';

import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { type SyntheticEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';

const FORM_ENDPOINT =
  'https://formsubmit.co/ajax/penguininvestments.david@gmail.com';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function submitContactForm(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Silently accept bot-filled honeypots without forwarding the message.
    if (formData.get('_honey')) {
      setStatus('sent');
      form.reset();
      return;
    }

    setStatus('sending');

    const payload = Object.fromEntries(formData.entries());
    payload._subject = 'New Owner Only Cars contact message';
    payload._template = 'table';
    payload._url = 'https://owneronlycars.com/contact';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean | string;
      } | null;

      if (
        !response.ok ||
        (result?.success !== true && result?.success !== 'true')
      ) {
        throw new Error('The contact service did not accept the message.');
      }

      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form
      className="chunky-panel bg-white p-6 sm:p-8"
      onSubmit={(event) => void submitContactForm(event)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Your name" name="name">
          <Input
            autoComplete="name"
            className="h-12 rounded-none border-2 border-[#061C2B] px-4 text-base focus-visible:border-[#0B8F89] focus-visible:ring-[#16C7BE]/30"
            id="name"
            maxLength={80}
            name="name"
            placeholder="First and last name"
            required
          />
        </FormField>
        <FormField label="Email address" name="email">
          <Input
            autoComplete="email"
            className="h-12 rounded-none border-2 border-[#061C2B] px-4 text-base focus-visible:border-[#0B8F89] focus-visible:ring-[#16C7BE]/30"
            id="email"
            maxLength={120}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </FormField>
        <FormField label="Phone (optional)" name="phone">
          <Input
            autoComplete="tel"
            className="h-12 rounded-none border-2 border-[#061C2B] px-4 text-base focus-visible:border-[#0B8F89] focus-visible:ring-[#16C7BE]/30"
            id="phone"
            maxLength={30}
            name="phone"
            placeholder="(555) 555-1234"
            type="tel"
          />
        </FormField>
        <FormField label="What can we help with?" name="topic">
          <NativeSelect
            className="w-full [&_select]:h-12 [&_select]:rounded-none [&_select]:border-2 [&_select]:border-[#061C2B] [&_select]:px-4 [&_select]:text-base [&_select]:focus-visible:border-[#0B8F89] [&_select]:focus-visible:ring-[#16C7BE]/30"
            id="topic"
            name="topic"
            required
          >
            <NativeSelectOption value="">Choose a topic</NativeSelectOption>
            <NativeSelectOption value="Buying a vehicle">
              Buying a vehicle
            </NativeSelectOption>
            <NativeSelectOption value="Selling a vehicle">
              Selling a vehicle
            </NativeSelectOption>
            <NativeSelectOption value="Private seller auctions">
              Private seller auctions
            </NativeSelectOption>
            <NativeSelectOption value="Account or verification">
              Account or verification
            </NativeSelectOption>
            <NativeSelectOption value="Safety concern">
              Safety concern
            </NativeSelectOption>
            <NativeSelectOption value="Other">Other</NativeSelectOption>
          </NativeSelect>
        </FormField>
      </div>

      <div className="mt-5">
        <FormField label="Message" name="message">
          <Textarea
            className="min-h-44 rounded-none border-2 border-[#061C2B] px-4 py-3 text-base focus-visible:border-[#0B8F89] focus-visible:ring-[#16C7BE]/30"
            id="message"
            maxLength={3000}
            minLength={10}
            name="message"
            placeholder="Tell us what happened and how we can help."
            required
          />
        </FormField>
      </div>

      <div aria-hidden="true" className="hidden">
        <label htmlFor="company-website">Leave this field empty</label>
        <input
          autoComplete="off"
          id="company-website"
          name="_honey"
          tabIndex={-1}
          type="text"
        />
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-700">
        <input
          className="mt-1 size-4 accent-[#0B8F89]"
          name="privacy_acknowledgement"
          required
          type="checkbox"
          value="I understand"
        />
        <span>
          I understand this general contact form is not a secure document
          uploader, and I will not include an ID, title, registration, payment
          details, or other sensitive documents.
        </span>
      </label>

      {status === 'sent' ? (
        <output className="mt-6 flex gap-3 border-2 border-[#061C2B] bg-[#DDF8F4] p-4 text-[#061C2B]">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#0B8F89]" />
          <div>
            <p className="font-black uppercase">Message sent</p>
            <p className="mt-1 text-sm leading-6">
              Thanks for reaching out. We’ll reply to the email address you
              provided.
            </p>
          </div>
        </output>
      ) : null}

      {status === 'error' ? (
        <div
          className="mt-6 flex gap-3 border-2 border-red-700 bg-red-50 p-4 text-red-800"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-black uppercase">Message not sent</p>
            <p className="mt-1 text-sm leading-6">
              Please check your connection and try again in a moment.
            </p>
          </div>
        </div>
      ) : null}

      <Button
        className="mt-6 h-12 rounded-none border-2 border-[#061C2B] bg-[#16C7BE] px-7 font-black uppercase text-[#061C2B] shadow-[4px_4px_0_#061C2B] hover:bg-[#FFB81C]"
        disabled={status === 'sending'}
        type="submit"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <Send className="size-4" />
      </Button>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Messages are relayed to Owner Only Cars through FormSubmit. FormSubmit
        may retain submissions for up to 30 days to provide its delivery
        service. See our{' '}
        <a className="underline" href="/privacy">
          privacy page
        </a>{' '}
        for details.
      </p>
    </form>
  );
}

function FormField({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-black uppercase tracking-wide text-[#061C2B]"
        htmlFor={name}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
