"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/backend/actions/updateProfile";
import { logOut } from "@/backend/actions/auth";
import Navbar from "@/frontend/components/navbar/Navbar";
import styles from "./ProfileView.module.css";

type ProfileUser = {
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  createdAt: string; // ISO date string
};

type Counts = {
  orders: number;
  wishlist: number;
  addresses: number;
};

type TabId = "details" | "addresses" | "wishlist" | "orders";

const TABS: { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "addresses", label: "Addresses" },
  { id: "wishlist", label: "Wishlist" },
  { id: "orders", label: "Orders" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/* ---------- One editable row (name, phone) ---------- */

type EditableRowProps = {
  label: string;
  value: string;
  emptyText?: string;
  inputType?: "text" | "tel";
  inputPlaceholder?: string;
  required?: boolean;
  onSave: (next: string) => Promise<string | null>; // returns error message or null
};

function EditableRow({
  label,
  value,
  emptyText,
  inputType = "text",
  inputPlaceholder,
  required = false,
  onSave,
}: EditableRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function open() {
    setDraft(value);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = draft.trim();

    if (required && !next) {
      setError(`Enter your ${label.toLowerCase()}.`);
      return;
    }

    startTransition(async () => {
      const err = await onSave(next);
      if (err) {
        setError(err);
        return;
      }
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className={styles.row}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={value ? styles.rowValue : styles.rowEmpty}>
          {value || emptyText}
        </span>
        <button type="button" className={styles.linkBtn} onClick={open}>
          {value ? "Change" : "Add"}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.row} onSubmit={handleSubmit} noValidate>
      <label htmlFor={`field-${label}`} className={styles.rowLabel}>
        {label}
      </label>

      <div className={styles.rowInputWrap}>
        <input
          id={`field-${label}`}
          type={inputType}
          value={draft}
          placeholder={inputPlaceholder}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Escape" && cancel()}
          className={styles.input}
          autoFocus
        />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      <div className={styles.rowActions}>
        <button type="submit" className={styles.saveBtn} disabled={pending}>
          {pending ? <span className={styles.spinner} /> : "Save"}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={cancel}
          disabled={pending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------- Empty state used by the three placeholder tabs ---------- */

function EmptyState({
  icon,
  title,
  text,
  href,
  cta,
}: {
  icon: string;
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className={styles.empty}>
      <i className={`ti ${icon} ${styles.emptyIcon}`} aria-hidden="true" />
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyText}>{text}</p>
      <Link href={href} className={styles.saveBtn}>
        {cta}
      </Link>
    </div>
  );
}

/* ---------- Main component ---------- */

export default function ProfileView({
  user,
  counts,
}: {
  user: ProfileUser;
  counts: Counts;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("details");
  const [loggingOut, startLogout] = useTransition();

  async function save(patch: {
    fullName?: string;
    phone?: string;
  }): Promise<string | null> {
    const result = await updateProfile(patch);
    if (result.error) return result.error;
    router.refresh(); // re-fetch the server component so new values show up
    return null;
  }

  const stats = [
    { id: "orders" as TabId, label: "Orders", value: counts.orders, icon: "ti-package" },
    { id: "wishlist" as TabId, label: "Wishlist", value: counts.wishlist, icon: "ti-heart" },
    { id: "addresses" as TabId, label: "Addresses", value: counts.addresses, icon: "ti-map-pin" },
  ];

  return (
    <div className={styles.page}>
      <Navbar textTone="black" iconTone="black" fixed={true} opaque={true} />
      <div className={styles.card}>
        {/* Banner */}
        <div className={styles.banner}>
          <button
            type="button"
            className={styles.logout}
            onClick={() =>
              startLogout(async () => {
                await logOut();
              })
            }
            disabled={loggingOut}
          >
            <i className="ti ti-logout" aria-hidden="true" />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
          <span className={styles.greeting}>Namaste</span>
        </div>

        {/* Identity */}
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">
            {getInitials(user.fullName)}
          </div>
          <div className={styles.identityText}>
            <h1 className={styles.name}>{user.fullName}</h1>
            <p className={styles.since}>
              Member since {formatMemberSince(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Stat shortcuts */}
        <div className={styles.stats}>
          {stats.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.stat}
              onClick={() => setTab(s.id)}
            >
              <i className={`ti ${s.icon} ${styles.statIcon}`} aria-hidden="true" />
              <span>
                <strong className={styles.statValue}>{s.value}</strong>
                <span className={styles.statLabel}>{s.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Profile sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div
          className={styles.panel}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {tab === "details" && (
            <>
              <EditableRow
                label="Full name"
                value={user.fullName}
                required
                onSave={(v) => save({ fullName: v })}
              />

              <div className={styles.row}>
                <span className={styles.rowLabel}>Email</span>
                <span className={styles.rowValue}>{user.email}</span>
                <span className={styles.locked}>
                  <i className="ti ti-lock" aria-hidden="true" />
                  {user.emailVerified ? "Verified" : "Not verified"}
                </span>
              </div>

              <EditableRow
                label="Phone"
                value={user.phone ?? ""}
                emptyText="Add a number for delivery updates"
                inputType="tel"
                inputPlaceholder="+91 98765 43210"
                onSave={(v) => save({ phone: v })}
              />

              <div className={styles.row}>
                <span className={styles.rowLabel}>Password</span>
                <span className={styles.rowValue}>••••••••••</span>
                <Link href="/forgot-password" className={styles.linkBtn}>
                  Update
                </Link>
              </div>
            </>
          )}

          {tab === "addresses" && (
            <EmptyState
              icon="ti-map-pin"
              title="Where should we deliver"
              text="Save an address for faster checkout."
              href="/profile/addresses"
              cta="Add address"
            />
          )}

          {tab === "wishlist" && (
            <EmptyState
              icon="ti-heart"
              title="Your wishlist is empty"
              text="Tap the heart on any product to save it here."
              href="/shop"
              cta="Browse the shop"
            />
          )}

          {tab === "orders" && (
            <EmptyState
              icon="ti-package"
              title="Start your second innings"
              text="Your orders will show up here once you place one."
              href="/shop"
              cta="Shop healthy"
            />
          )}
        </div>
      </div>
    </div>
  );
}