import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { isValidPincode, isValidPhone } from "../utils/validate";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Profile = () => {
  useDocumentTitle("Your Profile");
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    address: {
      line1: user.address?.line1 || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      pincode: user.address?.pincode || "",
      phone: user.address?.phone || "",
    },
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errors = {};
    // both are optional here, but if the person typed something it should be a valid format
    if (form.address.pincode && !isValidPincode(form.address.pincode)) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }
    if (form.address.phone && !isValidPhone(form.address.phone)) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    if (!validate()) return;
    setSaving(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data.user);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container max-w-xl py-8">
      <h1 className="section-title mb-6">Your profile</h1>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input value={user.email} disabled className="input-field bg-paper text-slate" />
        </div>

        <div className="border-t border-line pt-4">
          <p className="mb-3 text-sm font-semibold text-ink">Saved address</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-ink">Address line</label>
              <input
                value={form.address.line1}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, line1: e.target.value } }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">City</label>
              <input
                value={form.address.city}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">State</label>
              <input
                value={form.address.state}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Pincode</label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={form.address.pincode}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    address: { ...f.address, pincode: e.target.value.replace(/\D/g, "") },
                  }))
                }
                className="input-field"
              />
              {fieldErrors.pincode && <p className="mt-1 text-xs text-maroon">{fieldErrors.pincode}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Phone</label>
              <input
                inputMode="numeric"
                maxLength={10}
                value={form.address.phone}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    address: { ...f.address, phone: e.target.value.replace(/\D/g, "") },
                  }))
                }
                className="input-field"
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-maroon">{fieldErrors.phone}</p>}
            </div>
          </div>
        </div>

        {saved && <p className="text-sm text-success">Profile updated.</p>}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;