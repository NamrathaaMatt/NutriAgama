"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from "@/backend/actions/addresses";
import styles from "./AddressesView.module.css";

type FormState = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export default function AddressesView({
  addresses,
  defaultName,
  defaultPhone,
}: {
  addresses: Address[];
  defaultName: string;
  defaultPhone: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(addresses.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const emptyForm: FormState = {
    fullName: defaultName,
    phone: defaultPhone,
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  };
  const [form, setForm] = useState<FormState>(emptyForm);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  // Optional helper: fills empty city/state once a 6-digit pincode is typed
  async function lookupPincode(pin: string) {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const json = await res.json();
      const office = json?.[0]?.PostOffice?.[0];
      if (office) {
        setForm((f) => ({
          ...f,
          city: f.city || office.District,
          state: f.state || office.State,
        }));
      }
    } catch {
      /* lookup is a convenience only, ignore failures */
    }
  }

  function handlePincode(raw: string) {
    const pin = raw.replace(/\D/g, "").slice(0, 6);
    update("pincode", pin);
    if (pin.length === 6) lookupPincode(pin);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await addAddress(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      setForm(emptyForm);
      setOpen(false);
      router.refresh();
    });
  }

  function makeDefault(id: string) {
    startTransition(async () => {
      const result = await setDefaultAddress(id);
      if (result.error) setError(result.error);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (result.error) setError(result.error);
      setConfirmId(null);
      router.refresh();
    });
  }

  return (
    <div className={styles.page}>
      <Link href="/profile" className={styles.back}>
        <i className="ti ti-arrow-left" aria-hidden="true" />
        Back to profile
      </Link>

      <div className={styles.head}>
        <h1 className={styles.title}>Saved addresses</h1>
        {!open && (
          <button
            type="button"
            className={styles.saveBtn}
            onClick={() => setOpen(true)}
          >
            Add new address
          </button>
        )}
      </div>

      {/* Saved address cards */}
      {addresses.length > 0 && (
        <ul className={styles.list}>
          {addresses.map((a) => (
            <li key={a.id} className={styles.addr}>
              <div className={styles.addrTop}>
                <strong className={styles.addrName}>{a.name}</strong>
                {a.is_default && <span className={styles.badge}>Default</span>}
              </div>
              <p className={styles.addrText}>
                {a.address_line}
                {a.landmark ? `, ${a.landmark}` : ""}
                <br />
                {a.city}, {a.state} {a.pincode}
              </p>
              <p className={styles.addrPhone}>{a.phone}</p>
              <div className={styles.addrActions}>
                {!a.is_default && (
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => makeDefault(a.id)}
                    disabled={pending}
                  >
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  className={confirmId === a.id ? styles.dangerBtn : styles.linkBtn}
                  onClick={() => remove(a.id)}
                  disabled={pending}
                >
                  {confirmId === a.id ? "Confirm delete" : "Delete"}
                </button>
                {confirmId === a.id && (
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => setConfirmId(null)}
                  >
                    Keep it
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add form */}
      {open && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.formTitle}>
            {addresses.length === 0 ? "Where should we deliver" : "New address"}
          </h2>

          <div className={styles.grid2}>
            <input
              className={styles.input}
              name="name"
              placeholder="Full name"
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              aria-label="Full name"
            />
            <input
              className={styles.input}
              name="tel"
              type="tel"
              placeholder="Mobile number"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-label="Mobile number"
            />
          </div>

          <input
            className={styles.input}
            name="address-line1"
            placeholder="Address line 1"
            autoComplete="address-line1"
            value={form.line1}
            onChange={(e) => update("line1", e.target.value)}
            aria-label="Address line 1"
          />
          <input
            className={styles.input}
            name="address-line2"
            placeholder="Landmark (optional)"
            autoComplete="address-line2"
            value={form.line2}
            onChange={(e) => update("line2", e.target.value)}
            aria-label="Landmark"
          />

          <div className={styles.grid3}>
            <input
              className={styles.input}
              name="city"
              placeholder="City"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              aria-label="City"
            />
            <input
              className={styles.input}
              name="state"
              placeholder="State"
              autoComplete="address-level1"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              aria-label="State"
            />
            <input
              className={styles.input}
              name="postal-code"
              placeholder="Pincode"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => handlePincode(e.target.value)}
              aria-label="Pincode"
            />
          </div>

          {addresses.length > 0 && (
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => update("isDefault", e.target.checked)}
              />
              Set as default address
            </label>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={pending}>
              {pending ? <span className={styles.spinner} /> : "Save address"}
            </button>
            {addresses.length > 0 && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
                disabled={pending}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
