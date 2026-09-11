import { useState } from "react";
import { useOutletContext } from "react-router";
import type { MainLayoutContext } from "../layout/MainLayout";

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
  extraItem: string[];
};

//---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];
// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

export default function ModalRegister() {
  const { addRegistrant } = useOutletContext<MainLayoutContext>();

  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
    extraItem: [],
  });

  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
  });

  const updateForm = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const computeTotalPayment = () => {
    let total = 0;
    const selectedPlan = plans.find((p) => p.id === form.plan);
    if (selectedPlan) total += selectedPlan.price;

    const selectedExtra = extraItems.filter((e) =>
      form.extraItem.includes(e.id),
    );

    const extraTotal = selectedExtra.reduce((sum, e) => sum + e.price, 0);

    total += extraTotal;

    const isAllExtraSelected = form.extraItem.length === extraItems.length;
    if (isAllExtraSelected) total = total * 0.8;

    return total;
  };

  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname === "",
      lname: form.lname === "",
      plan: form.plan === "",
      gender: form.gender === "",
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((isError) => isError);
    if (hasError) return;

    const total = computeTotalPayment();

    const selectedPlan = plans.find((p) => p.id === form.plan);
    const selectedExtraLabels = extraItems
      .filter((e) => form.extraItem.includes(e.id))
      .map((e) => e.label);

    addRegistrant({
      id: Date.now(),
      fullName: `${form.fname} ${form.lname}`,
      gender: form.gender,
      plan: selectedPlan?.label ?? "",
      extraItem: selectedExtraLabels,
      total,
    });
    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );

    setForm({
      fname: "",
      lname: "",
      plan: "",
      gender: "",
      extraItem: [],
    });
    setAgree(false);
  };

  const toggleExtraItem = (id: string, isChecked: boolean) => {
    setForm((prev) => ({
      ...prev,
      extraItem: isChecked
        ? [...prev.extraItem, id]
        : prev.extraItem.filter((item) => item !== id),
    }));
  };

  return (
    <div
      className="modal fade"
      id="modalregister"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalregisterLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex gap-2">
              <div>
                <label className="form-label">First name</label>
                <input
                  className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                  value={form.fname}
                  onChange={(e) => updateForm("fname", e.target.value)}
                />
                <div className="invalid-feedback">Invalid first name</div>
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                  value={form.lname}
                  onChange={(e) => updateForm("lname", e.target.value)}
                />
                <div className="invalid-feedback">Invalid last name</div>
              </div>
            </div>
            <div className="mt-2">
              <label className="form-label">Plan</label>
              <select
                className={"form-select" + (errors.plan ? " is-invalid" : "")}
                onChange={(e) => updateForm("plan", e.target.value)}
                value={form.plan}
              >
                <option value="">Please select...</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.price.toLocaleString()} THB)
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">Please select a Plan</div>
            </div>
            <div className="mt-2">
              <label className="form-label">Gender</label>
              <div>
                <input
                  className="me-2 form-check-input"
                  type="radio"
                  checked={form.gender === "male"}
                  onChange={() => updateForm("gender", "male")}
                />
                Male 👨
                <input
                  className="mx-2 form-check-input"
                  type="radio"
                  checked={form.gender === "female"}
                  onChange={() => updateForm("gender", "female")}
                />
                Female 👩
              </div>
              {errors.gender && (
                <div className="text-danger">Please select gender</div>
              )}
            </div>
            {/* Extra Items */}
            <div>
              <label className="form-label">Extra Item(s)</label>
              {extraItems.map((item) => (
                <div key={item.id}>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={form.extraItem.includes(item.id)}
                    onChange={(e) => toggleExtraItem(item.id, e.target.checked)}
                  />
                  <label className="form-check-label">
                    {item.label} ({item.price.toLocaleString()} THB)
                  </label>
                </div>
              ))}
              {/* conditional เมื่อเลือกสินค้าเสริมทั้งหมด ให้แสดง discount*/}
              <span className="text-success d-block">(20% Discounted)</span>
            </div>

            <div className="alert alert-primary mt-3" role="alert">
              Promotion📢 Buy all items to get 20% Discount
            </div>

            <div className="mt-3">
              Total Payment : {computeTotalPayment().toLocaleString()} THB
            </div>
          </div>

          <div className="modal-footer">
            <div>
              <input
                className="me-2 form-check-input"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I agree to the terms and conditions
            </div>
            <button
              className="btn btn-success my-2"
              onClick={registerBtnOnClick}
              disabled={!agree}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
