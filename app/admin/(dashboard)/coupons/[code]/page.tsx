import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import CouponForm from "@/components/admin/CouponForm";
import { getCouponByCode } from "@/lib/admin/data/coupons";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const coupon = await getCouponByCode(decodeURIComponent(code));
  if (!coupon) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${coupon.code}`} description="Update this discount code." />
      <CouponForm existingCoupon={coupon} />
    </div>
  );
}
