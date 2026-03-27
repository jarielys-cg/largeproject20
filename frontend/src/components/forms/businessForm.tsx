import { useState } from "react";

type Props = {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
};

export default function BusinessForm({ initial = {}, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial.name || "",
    ownerId: initial.ownerId || "",
    category: initial.category || "",
    description: initial.description || "",
    image: initial.image || "",
    address: initial.address || "",
    phone: initial.phone || "",
    websiteLink: initial.websiteLink || ""
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="ownerId" placeholder="Owner ID" value={form.ownerId} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="websiteLink" placeholder="Website" value={form.websiteLink} onChange={handleChange} />
      <div>
        <button type="submit">Save</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
