import PageHeader from "@/components/admin/PageHeader";
import CouponForm from "@/components/admin/CouponForm";

export default function NewCouponPage() {
  return (
    <div>
      <PageHeader title="New Coupon" description="Create a discount or referral code." />
      <CouponForm />
    </div>
  );
}
