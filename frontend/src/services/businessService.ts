const base = "/api/business";

export async function addBusiness(data: any) {
  const res = await fetch(`${base}/addBusiness`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function editBusiness(id: string, data: any) {
  const res = await fetch(`${base}/editBusiness/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function removeBusiness(id: string) {
  const res = await fetch(`${base}/removeBusiness/${id}`, {
    method: "DELETE"
  });
  return res.json();
}

export async function getBusinesses() {
  const res = await fetch(`${base}/getBusinesses`);
  return res.json();
}

export async function getBusiness(id: string) {
  const res = await fetch(`${base}/getBusiness/${id}`);
  return res.json();
}
