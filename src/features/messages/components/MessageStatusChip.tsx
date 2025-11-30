import { BaseChip } from "@/components/MUI/DataDisplay/BaseChip";

export type MessageStatus = "sent" | "delivered" | "seen";

interface Props {
  status: MessageStatus;
}

const STATUS_CONFIG: Record<
  MessageStatus,
  { label: string; color: "default" | "primary" | "success" }
> = {
  sent: {
    label: "Sent",
    color: "default",
  },
  delivered: {
    label: "Delivered",
    color: "primary",
  },
  seen: {
    label: "Seen",
    color: "success",
  },
};

export function MessageStatusChip({ status }: Props) {
  const { label, color } = STATUS_CONFIG[status];

  return (
    <BaseChip
      size="small"
      variant="outlined"
      color={color}
      label={label}
      // optional: make it subtle
      sx={{ fontSize: "0.7rem", px: 0.75 }}
    />
  );
}
