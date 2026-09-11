import type { Registrant } from "../libs/Registrant";

export default function UserRegisterCard({
  registrant,
}: {
  registrant: Registrant;
}) {
  const genderLabel = registrant.gender === "male" ? "👨 Male" : "👩 Female";

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="mb-2">{registrant.fullName}</h5>
        <strong>{registrant.total.toLocaleString()} THB</strong>
      </div>
      <div className="text-secondary">
        {registrant.plan} · {genderLabel}
      </div>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {registrant.extraItem.map((item) => (
          <span className="badge text-bg-light border" key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
