// Maps domain status strings to the Badge component's visual tone, so every
// module renders status consistently instead of each page picking its own colors.

export function paymentStatusTone(status: string) {
  switch (status) {
    case "paid":
    case "succeeded":
      return "success" as const;
    case "partial":
    case "pending":
      return "pending" as const;
    case "refunded":
    case "failed":
      return "error" as const;
    default:
      return "neutral" as const;
  }
}

export function bookingStatusTone(status: string) {
  switch (status) {
    case "confirmed":
    case "completed":
      return "success" as const;
    case "pending":
      return "pending" as const;
    case "cancelled":
      return "error" as const;
    default:
      return "neutral" as const;
  }
}

export function inquiryStatusTone(status: string) {
  switch (status) {
    case "converted":
      return "success" as const;
    case "new":
      return "info" as const;
    case "in_progress":
    case "quoted":
      return "pending" as const;
    case "closed":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

export function contentStatusTone(status: string) {
  switch (status) {
    case "published":
      return "success" as const;
    case "scheduled":
      return "info" as const;
    case "draft":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}
