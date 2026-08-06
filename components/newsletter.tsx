"use client";

import { useId, useState } from "react";
import { PillButton } from "@/components/ui";
import { CheckIcon, LeafIcon } from "@/components/icons";

/** Demo signup — nothing is sent anywhere and no address is stored. */
export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="glass anim-rise overflow-hidden rounded-3xl px-6 py-10 text-center md:px-12 md:py-14">
      <LeafIcon width={26} height={26} className="mx-auto text-gold-300" />
      <h2 className="text-display mt-4 text-2xl md:text-3xl">
        One plant, once a month
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-sage-300">
        A short note on what to water, what to move away from the window, and what
        we’ve just taken delivery of.
      </p>

      {done ? (
        <p
          role="status"
          className="anim-pop mt-7 flex items-center justify-center gap-2 text-sm text-gold-300"
        >
          <CheckIcon width={16} height={16} />
          Thanks — though this is a demo, so nothing was actually sent.
        </p>
      ) : (
        <form
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label htmlFor={id} className="sr-only">
            Email address
          </label>
          <input
            id={id}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="glass w-full rounded-full px-5 py-3 text-sm outline-none placeholder:text-sage-400 focus:border-gold-400/60"
          />
          <PillButton type="submit" variant="gold" className="shrink-0 py-3">
            Subscribe
          </PillButton>
        </form>
      )}

      <p className="mt-4 text-xs text-sage-400">
        No real emails are collected — this form goes nowhere.
      </p>
    </section>
  );
}
