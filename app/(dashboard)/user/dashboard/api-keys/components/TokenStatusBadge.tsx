import React from "react";

interface TokenStatusBadgeProps {
  status: "active" | "expiring" | "expired";
}

export const TokenStatusBadge: React.FC<TokenStatusBadgeProps> = ({
  status,
}) => {
  let bgColor = "";
  let textColor = "";
  let label = "";

  switch (status) {
    case "active":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      label = "활성";
      break;
    case "expiring":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      label = "만료 예정";
      break;
    case "expired":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = "만료됨";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
};
