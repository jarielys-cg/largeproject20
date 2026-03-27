import { useEffect, useState } from "react";
import BusinessForm from "../components/forms/businessForm";
import { addBusiness, editBusiness, removeBusiness, getBusinesses } from "../services/businessService";

export default function OwnerDashboard() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [ownerId, setOwnerId] = useState("");

  async function load() {
    const data = await getBusinesses();
    setList(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(data: any) {
    await addBusiness(data);
    setEditing(null);
    load();
  }

  async function handleEdit(id: string, data: any) {
    await editBusiness(id, data);
    setEditing(null);
    load();
  }

  async function handleRemove(id: string) {
    await removeBusiness(id);
    load();
  }

  const visible = ownerId ? list.filter(b => String(b.ownerId) === ownerId) : list;

  return (
    <div>
      <h2>Owner Dashboard</h2>
      <input placeholder="Owner ID to filter" value={ownerId} onChange={e => setOwnerId(e.target.value)} />
      <button onClick={() => setEditing({})}>Add Business</button>
      {editing && (
        <BusinessForm
          initial={editing}
          onSubmit={(data) => {
            if (editing && editing._id) handleEdit(editing._id, data); else handleAdd(data);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
      <ul>
        {visible.map(b => (
          <li key={b._id}>
            <div>{b.name} - {b.category}</div>
            <button onClick={() => setEditing(b)}>Edit</button>
            <button onClick={() => handleRemove(b._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
